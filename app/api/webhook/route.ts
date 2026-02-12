import { verifyWebhook } from "@clerk/backend/webhooks";
import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const client = await clerkClient()
  try {
    const evt = await verifyWebhook(req);
    if (evt.type === "user.created") {
      const { id } = evt.data;
      // Set public metadata
     const res = await client.users.updateUserMetadata(id, {
       publicMetadata: {
         isImagesSeeded: false,
         isVideoSeeded: false,
         isAccountDeleted:false,
         accountDeletionStep:0,
         storage: 0,
         maxStorage: 800,
         tPoint: 0,
         maxTPoint: 800,
         deleteAfterDays: 7,
         lastResetAt: new Date().toISOString()
       },
     });
      // console.log(`User ${id} created with metadata`);
    }

    return new Response("Webhook processed", { status: 200 });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Invalid webhook", { status: 400 });
  }
}
