"use client";

import React, { useState, useEffect, useRef } from "react";
import { CldImage } from "next-cloudinary";
import axios from "axios";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Info } from "lucide-react";

const socialFormats = {
  "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
  "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
  "Instagram Story / Reel (9:16)": {
    width: 1080,
    height: 1920,
    aspectRatio: "9:16",
  },

  "Facebook Post (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
  "Facebook Landscape (16:9)": {
    width: 1200,
    height: 630,
    aspectRatio: "16:9",
  },
  "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78" },
  "Facebook Story (9:16)": { width: 1080, height: 1920, aspectRatio: "9:16" },

  "Twitter Post Landscape (16:9)": {
    width: 1200,
    height: 675,
    aspectRatio: "16:9",
  },
  "Twitter Post Square (1:1)": {
    width: 1080,
    height: 1080,
    aspectRatio: "1:1",
  },
  "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },

  "LinkedIn Post Square (1:1)": {
    width: 1080,
    height: 1080,
    aspectRatio: "1:1",
  },
  "LinkedIn Post Landscape (1.91:1)": {
    width: 1200,
    height: 627,
    aspectRatio: "2:1",
  },
  "LinkedIn Banner (4:1)": { width: 1584, height: 396, aspectRatio: "4:1" },

  "YouTube Thumbnail (16:9)": { width: 1280, height: 720, aspectRatio: "16:9" },
  "YouTube Channel Banner": { width: 2560, height: 1440, aspectRatio: "16:9" },

  "Pinterest Pin (2:3)": { width: 1000, height: 1500, aspectRatio: "2:3" },
  "Pinterest Long Pin (1:2.1)": {
    width: 1000,
    height: 2100,
    aspectRatio: "1:2",
  },

  "Snapchat Story (9:16)": { width: 1080, height: 1920, aspectRatio: "9:16" },

  "WhatsApp Status (9:16)": { width: 1080, height: 1920, aspectRatio: "9:16" },
  "WhatsApp Square Image (1:1)": {
    width: 1080,
    height: 1080,
    aspectRatio: "1:1",
  },
};

const socialPlatform = [
  "Instagram",
  "Facebook",
  "Twitter",
  "YouTube",
  "LinkedIn",
  "Pinterest",
  "Snapchat",
  "WhatsApp",
];

type SocialPlatform =
  | "Instagram"
  | "Facebook"
  | "Twitter"
  | "YouTube"
  | "LinkedIn"
  | "Pinterest"
  | "Snapchat"
  | "WhatsApp";

type SocialFormat = keyof typeof socialFormats;

export default function SocialSharePage() {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();

  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] =
    useState<SocialPlatform>("Instagram");
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>(
    "Instagram Square (1:1)",
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const userId = user?.id;
  const tPoint = Number(user?.publicMetadata.tPoint);
  const maxTPoint = Number(user?.publicMetadata.maxTPoint);

  useEffect(() => {
    if (!q) return;
    setUploadedImage(atob(q));
  }, [q]);

  useEffect(() => {
    if (uploadedImage) {
      setIsTransforming(true);
    }
  }, [selectedFormat, uploadedImage]);


  const handleTransformation = async () => {
    if (!isSignedIn) {
      toast.error("Sign in to use this feature");
      router.push("/home");
      return;
    }
    if (!isLoaded) {
      toast.error("Unable to get user");
      router.refresh();
      return;
    }
    if (tPoint >= maxTPoint) {
      toast.error("Your Transformation point exhausted");
      return;
    }
    await axios.patch("/api/metadata-update/transform", {
      userId,
    });
    await user.reload();
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (tPoint >= maxTPoint) {
      toast.error("Your Transformation point exhausted");
      return;
    }
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("/api/image-upload", formData);
      setUploadedImage(res.data.publicId);
      handleTransformation();
    } catch (error: any) {
      console.log(error);
      if (error.response) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Failed to upload image");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    if (!imageRef.current) return;
    setIsDownloading(true);

    fetch(imageRef.current.src)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${selectedFormat
          .replace(/\s+/g, "_")
          .toLowerCase()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        setIsDownloading(false);
        toast.success("Image Downloaded Successfully");
      });
  };

  return (
    <div className="min-h-screen bg-base-100 container mx-auto p-4 max-w-full">
      <h1 className="text-3xl text-base-content font-bold mb-6 text-center">
        Social Media Image Resizer
      </h1>

      <div className="card">
        <div className="card-body">
          <h2 className="card-title mb-4 text-base-content">Upload an Image</h2>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-base-content">
                Choose an image file
              </span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="file-input file-input-bordered file-input-primary w-full focus:outline-0 text-base-content"
            />
          </div>

          {isUploading && (
            <div className="mt-4">
              <progress className="progress progress-primary w-full"></progress>
            </div>
          )}

          {uploadedImage && (
            <div className="mt-6">
              <h2 className="card-title mb-4 text-base-content">
                Select Social Media Platform
              </h2>
              <div className="form-control">
                <select
                  className="select select-bordered w-full text-base-content focus:ring-0 outline-0 bg-base-300"
                  value={selectedPlatform}
                  onChange={(e) => {
                    handleTransformation();
                    setSelectedPlatform(e.target.value as SocialPlatform);
                  }}
                  disabled={tPoint >= maxTPoint}
                >
                  {socialPlatform.map((format) => (
                    <option key={format} value={format}>
                      {format}
                    </option>
                  ))}
                </select>
              </div>
              <h2 className="card-title my-4 text-base-content">
                Select Social Media Format
              </h2>
              <div className="form-control">
                <select
                  className="select select-bordered w-full text-base-content focus:ring-0 outline-0 bg-base-300"
                  value={selectedFormat}
                  onChange={(e) => {
                    handleTransformation();
                    setSelectedFormat(e.target.value as SocialFormat);
                  }}
                  disabled={tPoint >= maxTPoint}
                >
                  {Object.keys(socialFormats)
                    .filter((format) => format.includes(selectedPlatform))
                    .map((format) => (
                      <option key={format} value={format}>
                        {format}
                      </option>
                    ))}
                </select>
              </div>

              <div className="mt-6 relative">
                <h3 className="text-lg font-semibold mb-2 text-base-content">
                  Preview:
                </h3>
                <div className="flex justify-center">
                  {isTransforming && (
                    <div className="absolute inset-0 flex items-center justify-center bg-base-100 bg-opacity-50 z-10">
                      <span className="loading loading-infinity loading-xl text-base-content"></span>
                    </div>
                  )}

                  <CldImage
                    width={socialFormats[selectedFormat].width}
                    height={socialFormats[selectedFormat].height}
                    src={uploadedImage}
                    sizes="100vw"
                    alt="transformed image"
                    crop="fill"
                    aspectRatio={socialFormats[selectedFormat].aspectRatio}
                    gravity="auto"
                    ref={imageRef}
                    onLoad={() => setIsTransforming(false)}
                  />
                </div>
              </div>

              <div className="card-actions justify-end mt-6">
                {!isDownloading && (
                  <button className="btn btn-primary" onClick={handleDownload}>
                    Download for {selectedFormat}
                  </button>
                )}
                {isDownloading && (
                  <button
                    className="btn btn-primary"
                    onClick={handleDownload}
                    disabled={true}
                  >
                    Downloading for {selectedFormat} ...
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
