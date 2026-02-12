import { NextRequest } from "next/server";
import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const client = await clerkClient();
  const user = await currentUser();
  try {
    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User Id is required" },
        { status: 400 },
      );
    }
    const tPoint = Number(user?.publicMetadata.tPoint ?? 0);
    const updatedUser = await client.users.updateUserMetadata(userId, {
      publicMetadata: {tPoint:tPoint+1},
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
