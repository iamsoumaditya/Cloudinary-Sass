import { NextRequest,NextResponse } from "next/server";
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
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface cloudinaryUploadResult{
    public_id: string;
    bytes: number;
    duration?: number;
    [key:string]:any
}

export async function POST(request: NextRequest) {
    
    if (!(await auth()).isAuthenticated) {
        return NextResponse.json({error:"Unauthorized"},{status:401})
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const originalSize = formData.get("originalSize") as string;


        if (!file) {
            return NextResponse.json({ error: "File not found" },{status:400})
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const result = await new Promise<cloudinaryUploadResult>(
            (resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream({
                   resource_type:"video",
                    folder: "cloudinary-saas-video",
                    transformation: [
                        {quality:"auto",fetch_format:"mp4"}
                    ]
                }, (error, result) => {
                    if (error) reject(error)
                    else resolve(result as cloudinaryUploadResult)
               })
                uploadStream.end(buffer)
            }
        )

        const video = await prisma.video.create({
            data: {
                title,
                description,
                publicId: result.public_id,
                originalSize,
                compressedSize: String(result.bytes),
                duration: result.duration ||0,
            }
        })
        return NextResponse.json(video)
    } catch (error) {
        console.log(error)
        return NextResponse.json({error:"Upload Video failed"},{status:500})
    } finally {
        await prisma.$disconnect()
    }
}
