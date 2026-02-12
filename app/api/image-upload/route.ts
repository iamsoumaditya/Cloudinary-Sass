import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { currentUser,clerkClient } from "@clerk/nextjs/server";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface cloudinaryUploadResult {
  public_id: string;
  [key: string]: any;
}

export async function POST(request: NextRequest) {
  const user = await currentUser();
  const client = await clerkClient();

  if (!(await auth()).isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const tPoint = Number(user?.publicMetadata.tPoint);
  const maxTPoint = Number(user?.publicMetadata.maxTPoint);
  if (tPoint>=maxTPoint) {
    return NextResponse.json({ error: "Your Transformation point exhausted" }, { status: 400 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 400 });
    }
    const storage = Number(user?.publicMetadata.storage)
    const fileSize = (file.size/1024**2)
    const maxStorage = Number(user?.publicMetadata.maxStorage);
    if ((storage+fileSize )>= maxStorage) {
      return NextResponse.json({ error: "Storage full delete asset to upload more" }, { status: 400 });
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<cloudinaryUploadResult>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `cloudinary-saas/image/user/${userId}`,
            transformation: [{ quality: "auto" }],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as cloudinaryUploadResult);
          },
        );
        uploadStream.end(buffer);
      },
    );

    client.users.updateUserMetadata(userId, {
      publicMetadata: {
        storage: storage + (result.bytes/1024**2),
        tPoint: tPoint + 1,
      },
    });
    const image = await prisma.image.create({
      data: {
        title: file.name,
        type: file.type,
        size: (result.bytes/1024**2),
        publicId: result.public_id,
        authorId: userId,
      },
    });
    return NextResponse.json({ publicId: result.public_id }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Upload image failed" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
