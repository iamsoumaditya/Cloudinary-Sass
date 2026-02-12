"use client";
import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";

export default function VideoUploadPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();
  //max file size of 70 mb

  const MAX_FILE_SIZE = 70 * 1024 * 1024;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size too large");
      return;
    }
    if (!isSignedIn) {
      toast.error("Sign in to upload video");
      router.push("/home");
      return;
    }
    if (!isLoaded) {
      toast.error("Unable to get user data");
      router.refresh();
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("originalSize", file.size.toString());

    try {
      const response = await axios.post("/api/video-upload", formData);
      if (response.status === 200) {
        await user.reload();
        router.push("/");
      } else toast.error("Looks like something went wrong!!");
    } catch (error: any) {
      console.log(error);
      if (error.response) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Video upload failed");
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 container mx-auto p-4 max-w-full">
      <h1 className="text-2xl font-bold mb-4 text-base-content">
        Upload Video
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">
            <div className="dropdown dropdown-hover dropdown-right">
              <span className="label-text text-base-content">
                Title
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-circle btn-ghost btn-xs text-red-600 text-2xl"
                >
                  {" "}
                  *
                </div>
              </span>
              <div
                tabIndex={0}
                className="card card-sm dropdown-content bg-base-300 rounded-box z-1 w-64 shadow-sm"
              >
                <div tabIndex={0} className="card-body">
                  <h2 className="card-title text-base-content">
                    This is a required field
                  </h2>
                  <p className="text-base-content">
                    You must fill this to submit the form!
                  </p>
                </div>
              </div>
            </div>
          </label>
          <input
            type="text"
            value={title}
            placeholder="Write Video Title"
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered w-full focus:outline-0 text-base-content"
            required
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text text-base-content">Description</span>
          </label>
          <textarea
            value={description}
            placeholder="Write video description"
            onChange={(e) => setDescription(e.target.value)}
            className="textarea textarea-bordered w-full focus:outline-0 text-base-content"
          />
        </div>
        <div>
          <label className="label">
            <div className="dropdown dropdown-hover dropdown-right">
              <span className="label-text text-base-content">
                Video File
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-circle btn-ghost btn-xs text-red-600 text-2xl"
                >
                  {" "}
                  *
                </div>
              </span>
              <div
                tabIndex={0}
                className="card card-sm dropdown-content bg-base-300 rounded-box z-1 w-64 shadow-sm"
              >
                <div tabIndex={0} className="card-body">
                  <h2 className="card-title text-base-content">
                    This is a required field
                  </h2>
                  <p className="text-base-content">
                    You must fill this to submit the form!
                  </p>
                </div>
              </div>
            </div>
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="file-input file-input-bordered w-full text-base-content focus:outline-0"
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload Video"}
        </button>
      </form>
    </div>
  );
}
