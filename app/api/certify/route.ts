import { NextRequest, NextResponse } from "next/server";
import CertificateCompletionEmail from "@/utils/certificatecompletion";
import { render } from "@react-email/render";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const id = formData.get("id") as string;
  const subject = formData.get("subject") as string;
  const certificate = formData.get("certificate") as Blob;

  if (!name || !email || !id || !certificate) {
    return NextResponse.json(
      { error: "Required details missing" },
      { status: 500 },
    );
  }

  try {
    const emailHtml = await render(
      CertificateCompletionEmail({
        username: name,
        certificateId: id,
      }),
    );

    const emailTextual = await render(
      CertificateCompletionEmail({
        username: name,
        certificateId: id,
      }),
      { plainText: true },
    );
    const arrayBuffer = await certificate.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

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
      subject: subject,
      text: emailTextual,
      html: emailHtml,
      attachments: [
        {
          filename: `certificate-${id}.png`,
          content: buffer,
          contentType: "image/png",
        },
      ],
    };
    await transporter.sendMail(mail);

    return NextResponse.json(
      {
        success: true,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { error: "Error while sending email" },
      { status: 500 },
    );
  }
}
