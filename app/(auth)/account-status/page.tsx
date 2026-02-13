"use client";
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AccountStatusPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const router = useRouter();
  const steps = [
    "Request for Deletion",
    "Request Approved",
    "Removing Content",
    "Permanently Deleting All Data",
  ];
  if (!isSignedIn) {
    return;
  }
  if (!isLoaded) {
    return;
  }
  const cancelDeletion = async () => {
    if (!isSignedIn) {
      toast.error("Unable to cancel deletion request");
      return;
    }
    if (!isLoaded) {
      toast.error("Unable to cancel deletion request");
      return;
    }
    setIsCancelling(true);
    const userId = user.id;
    const toastId = toast.loading("Cancelling deletion request");
    try {
      await axios.patch("/api/account", { data: { userId } });
      toast.success("Your account deletion request has been cancelled");
      await user.reload();
      router.push("/home");
    } catch (error: any) {
      console.log(error);
      if (error.response) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Unable to cancel deletion request");
      }
    } finally {
      toast.dismiss(toastId);
      setIsCancelling(false);
    }
  };
  if (!user) {
    return;
  }
  return (
    <div className="min-h-screen bg-base-100 text-base-content flex items-center justify-center px-4">
      <div className="max-w-3xl w-full text-center space-y-10">
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold">
            Account Deletion in Progress
          </h1>

          <p className="opacity-70 text-lg">
            Your deletion request is under processing. You can track the progress
            below.
          </p>
        </div>
        <form action={cancelDeletion}>
          <div className="card bg-base-100">
            <div className="card-body space-y-8">
              <div className="text-lg opacity-80">
                Current Status:{" "}
                <span className="font-semibold text-primary">
                  {steps[Number(user?.publicMetadata.accountDeletionStep) - 1]}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              className="btn btn-error btn-wide"
              onClick={cancelDeletion}
              disabled={isCancelling}
            >
              {!isCancelling
                ? "Cancel Deletion Request"
                : "Cancelling Deletion Request"}
            </button>

            <p className="text-sm opacity-60">
              You can cancel the deletion request before the final step is
              completed.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
