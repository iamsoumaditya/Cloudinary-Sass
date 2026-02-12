"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { Info } from "lucide-react";
import { EmailAddressResource } from "@clerk/shared/index-CxV4BKo8";

export default function AccountSettingsSection() {
  const { user, isSignedIn, isLoaded } = useUser();

  const [activeTab, setActiveTab] = useState("profile");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [emailAddress, setEmailAdress] = useState<EmailAddressResource>();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleProfileSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    const formData = new FormData(e.currentTarget);
    const file = formData.get("avatar") as File | null;
    const firstName = formData.get("firstName") as string | null;
    const lastName = formData.get("lastName") as string | null;

    if (file && file.size > 0) {
      user?.setProfileImage({ file });
    }
    try {
      await user?.update({
        firstName: firstName,
        lastName: lastName,
      });
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setUploading(false);
      e.target.reset();
    }
  };

  const handleUsernameSubmit = async (
    e: React.SubmitEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string | null;

    if (!username) {
      toast.error("Username is required");
      return;
    }

    setUploading(true);
    try {
      await user?.update({
        username: username,
      });
      toast.success("Username updated successfully");
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setUploading(false);
      e.target.reset();
    }
  };

  const handleEmailSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string | null;
    const code = formData.get("code") as string | null;
    if (!user?.passwordEnabled) {
      toast.error(
        "Email authentication is not enabled for this account. Please use your social login provider.",
      );
      return;
    }
    if (!email) {
      toast.error("Email fields can't be empty");
      return;
    }
    if (!code) {
      toast.error("Verification code must be filled");
      return;
    }
    setUploading(true);
    try {
      emailAddress?.prepareVerification({ strategy: "email_code" });
      const emailVerifyAttempt = await emailAddress?.attemptVerification({
        code,
      });
      if (emailVerifyAttempt?.verification.status === "verified") {
        await user.update({ primaryEmailAddressId: emailAddress?.id });
      } else {
        throw new Error("Email Verification failed");
      }
      toast.success("Primary email updated successfully");
    } catch (error: any) {
      console.log(error);
      toast.error(error.message || "Failed to update email");
    } finally {
      setUploading(false);
      e.target.reset();
      setIsVerificationSent(false);
      await user.reload();
    }
  };
  const handleSendOtp = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string | null;
    if (!user?.passwordEnabled) {
      toast.error(
        "Email authentication is not enabled for this account. Please use your social login provider.",
      );
      return;
    }
    if (!email) {
      toast.error("Email fields can't be empty");
      return;
    }
    setUploading(true);
    try {
      const res = await user?.createEmailAddress({ email });
      await user.reload();
      const emailAddress = user.emailAddresses.find((a) => a.id === res?.id);
      setEmailAdress(emailAddress);
      emailAddress?.prepareVerification({ strategy: "email_code" });
      setIsVerificationSent(true);
      toast.success("Verification code sent successfully");
    } catch (error: any) {
      console.log(error);
      toast.error(error.message || "Failed to sent verification code");
    } finally {
      setUploading(false);
    }
  };

  const handlePasswordSubmit = async (
    e: React.SubmitEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const oldPassword = formData.get("oldPassword") as string | null;
    const newPassword = formData.get("newPassword") as string | null;
    const signOutOfOtherSessions = Boolean(
      formData.get("SignOutOfOtherSessions"),
    );
    if (!user?.passwordEnabled) {
      toast.error(
        "Password authentication is not enabled for this account. Please use your social login provider.",
      );
      return;
    }
    if (!oldPassword || !newPassword) {
      toast.error("Password fields can't be empty");
      return;
    }
    setUploading(true);
    try {
      await user?.updatePassword({
        currentPassword: oldPassword,
        newPassword: newPassword,
        signOutOfOtherSessions,
      });
      toast.success("Password updated successfully");
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setUploading(false);
      e.target.reset();
    }
  };

  if (!isLoaded)
    return (
      <div className="h-80 w-full flex justify-center items-center text-3xl text-white">
        <span className="loading loading-dots loading-xl"></span>
      </div>
    );

  if (!isSignedIn)
    return (
      <div className="h-80 w-full flex justify-center items-center text-3xl text-amber-300">
        Sign in to view this page
      </div>
    );
  return (
    <div className="w-full mx-auto p-4">
      <div className="flex flex-wrap gap-4 mb-6">
        {[
          ["profile", "Profile"],
          ["username", "Username"],
          ["email", "Email"],
          ["password", "Password"],
        ].map(([value, label]) => (
          <label key={value} className="label cursor-pointer gap-2">
            <input
              type="radio"
              name="settings"
              className="radio radio-primary"
              checked={activeTab === value}
              onChange={() => setActiveTab(value)}
            />
            <span className="label-text">{label}</span>
          </label>
        ))}
      </div>

      {activeTab === "profile" && (
        <form
          onSubmit={handleProfileSubmit}
          className="card bg-base-200 p-6 space-y-4"
        >
          <h2 className="text-xl font-semibold">Update Profile</h2>

          <div className="flex flex-col items-center gap-3">
            <div className="avatar">
              <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  src={
                    imagePreview ||
                    (user?.unsafeMetadata?.avatar as string | undefined) ||
                    user?.imageUrl ||
                    "https://picsum.photos/200"
                  }
                  alt="avatar"
                />
              </div>
            </div>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Pick an image</legend>
              <input
                type="file"
                name="avatar"
                accept="image/*"
                className="file-input file-input-bordered w-full max-w-xs outline-0"
                onChange={handleImageChange}
              />
              <label className="label">Format 1:1 is recommended</label>
            </fieldset>
          </div>

          <input
            name="firstName"
            type="text"
            required
            placeholder="First Name"
            defaultValue={user?.firstName || ""}
            className="input input-bordered w-full outline-0"
          />

          <input
            name="lastName"
            type="text"
            required
            placeholder="Last Name"
            defaultValue={user?.lastName || ""}
            className="input input-bordered w-full outline-0"
          />

          <button
            type="submit"
            className="btn btn-primary"
            disabled={uploading}
          >
            {uploading ? "Updating..." : "Save Changes"}
          </button>
        </form>
      )}

      {activeTab === "username" && (
        <form
          onSubmit={handleUsernameSubmit}
          className="card bg-base-200 p-6 space-y-4"
        >
          <h2 className="text-xl font-semibold">Change Username</h2>

          <input
            name="username"
            type="text"
            className="input validator input-bordered w-full outline-0"
            required
            placeholder="New Username"
            pattern="[a-z][a-z0-9\-]*"
            minLength={4}
            maxLength={30}
            defaultValue={user?.username ?? ""}
            title="Only lowercase letters, numbers or dash"
          />
          <p className="validator-hint">
            Must be 3 to 30 characters
            <br />
            containing only lowercase letters, numbers or dash
          </p>

          <button className="btn btn-primary" disabled={uploading}>
            {!uploading ? "Update" : "Updating"} Username
          </button>
        </form>
      )}

      {activeTab === "email" && (
        <form
          onSubmit={isVerificationSent ? handleEmailSubmit : handleSendOtp}
          className="card bg-base-200 p-6 space-y-4"
        >
          <h2 className="text-xl font-semibold">Change Email</h2>
          {!user.passwordEnabled && (
            <div role="alert" className="alert alert-info text-lg">
              <Info />
              <span>
                You haven't enabled email & password for authentication session
                may be you have been used some provider Sign up like Google or
                Github You'r email is managed by your provider
              </span>
            </div>
          )}
          {user.passwordEnabled && (
            <>
              <input
                name="email"
                type="email"
                placeholder="New Email"
                defaultValue={user?.primaryEmailAddress?.emailAddress ?? ""}
                required
                className="input validator input-bordered w-full outline-0"
              />
              {isVerificationSent && (
                <input
                  name="code"
                  type="number"
                  placeholder="Verification Code"
                  required
                  className="input input-bordered w-full outline-0"
                />
              )}

              <div className="validator-hint">Enter valid email address</div>

              {isVerificationSent && (
                <button className="btn btn-primary" disabled={uploading}>
                  {!uploading ? "Change" : "Changing"} Email
                </button>
              )}
              {!isVerificationSent && (
                <button className="btn btn-primary" disabled={uploading}>
                  {!uploading ? "Send" : "Sending"} Verification Code
                </button>
              )}
            </>
          )}
        </form>
      )}

      {activeTab === "password" && (
        <form
          onSubmit={handlePasswordSubmit}
          className="card bg-base-200 p-6 space-y-4"
        >
          <h2 className="text-xl font-semibold">Change Password</h2>
          {!user.passwordEnabled && (
            <div role="alert" className="alert alert-info text-lg">
              <Info />
              <span>
                You haven't enabled password for authentication session may be
                you have been used some provider Sign up like Google or
                Github...
              </span>
            </div>
          )}
          {user.passwordEnabled && (
            <>
              <input
                name="oldPassword"
                type="password"
                placeholder="Current Password"
                className="input input-bordered w-full outline-0"
              />
              <input
                name="newPassword"
                type="password"
                placeholder="New Password"
                className="input validator input-bordered w-full outline-0"
                required
                minLength={8}
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
              />
              <p className="validator-hint">
                Must be more than 8 characters, including
                <br />
                At least one number
                <br />
                At least one lowercase letter
                <br />
                At least one uppercase letter
              </p>
              <label className="label">
                <input
                  name="SignOutOfOtherSessions"
                  type="checkbox"
                  defaultChecked
                  className="checkbox"
                />
                Sign out of other Sessions
              </label>
              <button className="btn btn-primary" disabled={uploading}>
                {!uploading ? "Update" : "Updating"} Password
              </button>
            </>
          )}
        </form>
      )}
    </div>
  );
}
