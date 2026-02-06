import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

export async function GET(request:NextRequest) {
  const { searchParams } = new URL(request.url);

  const page = searchParams.get("page");
  const query = searchParams.get("query");
  const limit: number = 4;
  try {
    const [videos, totalVideos] = await Promise.all([
      await prisma.video.findMany({
        where: {
          OR: [
            { title: { contains:query?.toLowerCase()??"",mode:"insensitive"} },
            { description: { contains:query??"",mode:"insensitive"} }
          ]
        },
        skip: (Number(page) - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      Math.ceil((await prisma.video.count())/limit),
    ]);

    return NextResponse.json({videos,totalVideos});
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching videos" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
