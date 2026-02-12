import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { clerkClient } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";

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

export async function GET(req: NextRequest) {
  const client = await clerkClient();
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  if (req.headers.get("x-vercel-cron") !== "1") {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    console.log("Custom cron started…");

    let hasMore = true;
    let offset = 0;
    const limit = 100;

    while (hasMore) {
      const users = await client.users.getUserList({
        limit,
        offset,
      });

      for (const user of users.data) {
        const meta = user.publicMetadata as {
          storage?: number;
          deleteAfterDays?: number;
          lastResetAt?: string;
        };

        const deleteAfterDays = meta?.deleteAfterDays;

        if (!deleteAfterDays || deleteAfterDays >= 7) continue;

        const lastResetAt = meta?.lastResetAt;

        const lastResetDate = lastResetAt
          ? new Date(lastResetAt)
          : new Date(user.createdAt);

        const expiryDate = new Date(lastResetDate);
        expiryDate.setDate(expiryDate.getDate() + deleteAfterDays);

        const now = new Date();

        if (now >= expiryDate) {
          await prisma.image.deleteMany({
            where: { authorId: user.id },
          });
          await prisma.video.deleteMany({
            where: { authorId: user.id },
          });
          await cloudinary.api.delete_resources_by_prefix(
            `cloudinary-saas/image/user/${user.id}`,
            {
              invalidate: true,
            },
          );
          await cloudinary.api.delete_resources_by_prefix(
            `cloudinary-saas/video/user/${user.id}`,
            {
              resource_type: "video",
              invalidate: true,
            },
          );
          await client.users.updateUserMetadata(user.id, {
            publicMetadata: {
              storage: 0,
              lastResetAt: now.toISOString(),
            },
          });
        }
      }

      hasMore = users.data.length === limit;
      offset += limit;
    }

    console.log("Custom cron run completed ✅");
    return NextResponse.json({
      success: true,
      message: "Cron executed",
    });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
