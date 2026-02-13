import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import nodemailer from "nodemailer";
import NewsletterSubscribeEmail from "@/utils/NewsletterSubscribe";
import { render } from "@react-email/render";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

export async function POST(req: NextRequest) {
  const user = await currentUser();
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 },
      );
    }

    const { userId } = await auth(); // null if not logged in

    const ipAddress =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const userAgent = req.headers.get("user-agent") || "unknown";

    const country = req.headers.get("x-vercel-ip-country") || "unknown";

    const city = req.headers.get("x-vercel-ip-city") || "unknown";

    const existing = await prisma.subscribe.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already subscribed",
        },
        { status: 409 },
      );
    }

    const subscription = await prisma.subscribe.create({
      data: {
        email,
        authorId: userId ?? undefined,
        ipAddress,
        userAgent,
        country,
        city,
      },
    });

    const emailHtml = await render(
      NewsletterSubscribeEmail({
        username: user?.fullName,
      }),
    );
    const emailTextual = await render(
      NewsletterSubscribeEmail({
        username: user?.fullName,
      }),
      { plainText: true },
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const mail = {
      from: `MediaRefine <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Welcome to Media Refine Newsletter",
      text: emailTextual,
      html: emailHtml,
    };

    await transporter.sendMail(mail);

    return NextResponse.json({
      success: true,
      data: subscription,
    });
  } catch (error: any) {
    console.error("Subscribe error:", error);

    // Prisma unique error fallback
    if (error.code === "P2002") {
      return NextResponse.json(
        {
          success: false,
          message: "Email already subscribed",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
