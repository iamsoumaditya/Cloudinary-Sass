import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { auth } from "@clerk/nextjs/server";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});
export async function POST(request: NextRequest) {
  try {
    const { name, email, description, type } = await request.json();
    const { userId } = await auth();
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const userAgent = request.headers.get("user-agent") || "unknown";

    const country = request.headers.get("x-vercel-ip-country") || "unknown";

    const city = request.headers.get("x-vercel-ip-city") || "unknown";

    await prisma.contact.create({
      data: {
        name,
        email,
        description,
        type,
        authorId: userId ?? undefined,
        userAgent,
        country,
        city,
        ipAddress,
      },
    });
    return NextResponse.json(
      {
        success: true,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error while submitting form account" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
