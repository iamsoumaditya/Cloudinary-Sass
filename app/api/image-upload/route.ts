import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface cloudinaryUploadResult {
  public_id: string;
  [key: string]: any;
}

export async function POST(request: NextRequest) {
  if (!(await auth()).isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<cloudinaryUploadResult>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "cloudinary-saas-image",
            transformation: [
              {quality:"auto"}
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as cloudinaryUploadResult);
          },
        );
        uploadStream.end(buffer);
      },
    );

    const image = await prisma.image.create({
      data: {
        title: file.name,
        type: file.type,
        size: file.size,
        publicId: result.public_id,
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
