import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

export async function GET(request: NextRequest) {
  const user = await currentUser();
  const client = await clerkClient();
  const { searchParams } = new URL(request.url);

  const page = searchParams.get("page");
  const query = searchParams.get("query");
  const userId = searchParams.get("userId");
  const loadVideo = searchParams.get("loadVideo");
  const limit: number = 4;

  if (!userId) {
    return NextResponse.json(
      { error: "You need to provide userId" },
      { status: 403 },
    );
  }

  try {
    if (!user?.publicMetadata?.isVideoSeeded || loadVideo === "on") {
      const defaultVideo = await prisma.defaultVideo.findMany();
      const res = await prisma.video.createMany({
        data: defaultVideo.map((d) => ({
          authorId: userId,
          title: d.title,
          description: d.description,
          publicId: d.publicId,
          originalSize: d.originalSize,
          compressedSize: d.compressedSize,
          duration: d.duration,
          isDownloadAble: false,
        })),
        skipDuplicates: true,
      });
      if (res.count != 0) {
        await client.users.updateUserMetadata(userId, {
          publicMetadata: { isVideoSeeded: true },
        });
      }
    }
    const [videos, totalVideos] = await Promise.all([
      await prisma.video.findMany({
        where: {
          authorId: userId,
          OR: [
            {
              title: {
                contains: query?.toLowerCase() ?? "",
                mode: "insensitive",
              },
            },
            { description: { contains: query ?? "", mode: "insensitive" } },
          ],
        },
        skip: (Number(page) - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      Math.ceil(
        (await prisma.video.count({
          where: {
            authorId: userId,
          },
        })) / limit,
      ),
    ]);

    return NextResponse.json({ videos, totalVideos });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching videos" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(request: NextRequest) {
  const client = await clerkClient();
  const data = await request.json();
  const { userId } = data;
  if (!userId) {
    return NextResponse.json(
      { error: "You need to provide userId" },
      { status: 403 },
    );
  }

  try {
    await prisma.video.deleteMany({
      where: {
        authorId: userId,
      },
    });

    const result = await prisma.image.aggregate({
      where: { authorId:userId },
      _sum: { size: true },
    });

    const totalBytes = result._sum.size || 0;

    const totalMB = totalBytes / (1024 * 1024);


    client.users.updateUserMetadata(userId, {
      publicMetadata: {
        storage: totalMB,
      },
    });

    await cloudinary.api.delete_resources_by_prefix(
      `cloudinary-saas/video/user/${userId}`,
      {
        resource_type: "video",
        invalidate: true,
      },
    );
    return NextResponse.json(
      { message: "Deleted videos successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting videos" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
