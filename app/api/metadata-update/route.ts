import { NextRequest } from "next/server";
import {clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const client = await clerkClient();
  try {
    const { userId,day } = await req.json();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User Id is required" },
        { status: 400 },
      );
    }
    const updatedUser = await client.users.updateUserMetadata(userId, {
      publicMetadata: { deleteAfterDays: day },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Metadata update error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update metadata" },
      { status: 500 },
    );
  }
}
