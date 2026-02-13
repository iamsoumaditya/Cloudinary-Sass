import { NextRequest, NextResponse } from "next/server";
import { clerkClient,currentUser } from "@clerk/nextjs/server";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import AccountDeletionEmail from "@/utils/AccountDeletion";

export async function DELETE(request: NextRequest) {
  const user = await currentUser();
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
    await client.users.updateUserMetadata(userId, {
      publicMetadata: { isAccountDeleted: true, accountDeletionStep:1 },
    });

    const emailHtml = await render(
      AccountDeletionEmail({
        username: user?.fullName,
      }),
    );
    const emailTextual = await render(
      AccountDeletionEmail({
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
      to: user?.primaryEmailAddress?.emailAddress,
      subject: "Your Media Refine Account Deletion Request",
      text: emailTextual,
      html: emailHtml,
    };

    await transporter.sendMail(mail);

    return NextResponse.json(
      {
        message:
          "Your account deletion request has been initiated. Please visit the status page to track progress and receive further updates.",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting account" },
      { status: 500 },
    );
  }
}
export async function PATCH(request: NextRequest) {
  const client = await clerkClient();
  const data = await request.json();
  const {userId}=data.data
  if (!userId) {
    return NextResponse.json(
      { error: "You need to provide userId" },
      { status: 403 },
    );
  }
  try {
    await client.users.updateUserMetadata(userId, {
      publicMetadata: { isAccountDeleted: false, accountDeletionStep:0 },
    });
    return NextResponse.json(
      {
        message:
          "Your account deletion request has been cancelled.",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error while updating deleting account" },
      { status: 500 },
    );
  }
}
