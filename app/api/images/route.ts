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
  const loadImage = searchParams.get("loadImage");
  const limit: number = 6;

  if (!userId) {
    return NextResponse.json(
      { error: "You need to provide userId" },
      { status: 403 },
    );
  }
  try {
    if (!user?.publicMetadata?.isImagesSeeded || loadImage === "on") {
      const defaultImage = await prisma.defaultImage.findMany();
      const res = await prisma.image.createMany({
        data: defaultImage.map((d) => ({
          authorId: userId,
          title: d.title,
          type: d.type,
          publicId: d.publicId,
          size: d.size,
        })),
        skipDuplicates: true,
      });
      if (res.count != 0) {
        await client.users.updateUserMetadata(userId, {
          publicMetadata: { isImagesSeeded: true },
        });
      }
    }
    const [images, totalImages] = await Promise.all([
      prisma.image.findMany({
        where: {
          authorId: userId,
          title: {
            contains: query?.toLowerCase() ?? "",
            mode: "insensitive",
          },
        },
        skip: (Number(page) - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      Math.ceil(
        (await prisma.image.count({
          where: {
            authorId: userId,
          },
        })) / limit,
      ),
    ]);

    return NextResponse.json({ images, totalImages });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching images" },
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
    await prisma.image.deleteMany({
      where: {
        authorId: userId,
      },
    });

    const videos = await prisma.video.findMany({
      where: { authorId: userId },
      select: { compressedSize: true },
    });

    const totalBytes = videos.reduce((sum, video) => {
      const sizeNum = Number(video.compressedSize) || 0; // fallback to 0 if invalid
      return sum + sizeNum;
    }, 0);

    const totalMB = totalBytes / (1024 * 1024);

    client.users.updateUserMetadata(userId, {
      publicMetadata: {
        storage: totalMB,
      },
    });

    await cloudinary.api.delete_resources_by_prefix(
      `cloudinary-saas/image/user/${userId}`,
      {
        invalidate: true,
      },
    );
    return NextResponse.json(
      { message: "Deleted images successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting images" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
