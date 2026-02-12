import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

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
    await client.users.updateUserMetadata(userId, {
      publicMetadata: { isAccountDeleted: true, accountDeletionStep:1 },
    });
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
