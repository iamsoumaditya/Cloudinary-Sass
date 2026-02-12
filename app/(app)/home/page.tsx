"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import VideoCard from "@/components/VideoCard";
import { Video, Image } from "@/types";
import toast from "react-hot-toast";
import { CldImage } from "next-cloudinary";
import { Download, Edit2, EditIcon, MoreVertical, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSearch } from "@/context/searchContext";
import { useAuth } from "@clerk/nextjs";
import { slugify } from "@/utils/slugify";

export default function HomePage() {
  const router = useRouter();
  const { query } = useSearch();
  const { userId } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [loadingImages, setLoadingImages] = useState(true);
  const [isImagedownloading, setIsImageDownloading] = useState(false);
  const imageRefs = useRef<Record<string, HTMLImageElement | null>>({});
  const [videosPage, setVideosPage] = useState<number>(1);
  const [videosTotalPage, setVideosTotalPage] = useState<number>();
  const [imagesPage, setImagesPage] = useState<number>(1);
  const [imagesTotalPage, setImagesTotalPage] = useState<number>();


  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    router.replace(`/home?${params.toString()}`);
  }, [query]);

  useEffect(() => {
    if (!userId) return;
    const loadVideo = localStorage.getItem("loadVideo")??"null";
    const fetchVideos = async () => {
      try {
        const response = await axios.get("/api/videos", {
          params: {
            page: query ? 1 : videosPage,
            query,
            userId,
            loadVideo
          },
        });
        localStorage.setItem("loadVideo", "null");
        if (Array.isArray(response.data.videos)) {
          setVideos(response.data.videos);
          query
            ? setVideosTotalPage(1)
            : setVideosTotalPage(response.data.totalVideos);
        } else {
          toast.error("Unexpected Response format");
          throw new Error(" Unexpected response format");
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch videos");
      } finally {
        setLoadingVideos(false);
      }
    };
    fetchVideos();
  }, [videosPage, query, userId]);

  useEffect(() => {
    if (!userId) return;
    const loadImage = localStorage.getItem("loadImage")??"null";
    const fetchImages = async () => {
      try {
        const response = await axios.get("/api/images", {
          params: { page: query ? 1 : imagesPage, query, userId, loadImage },
        });
        localStorage.setItem("loadImage","null");
        if (Array.isArray(response.data.images)) {
          setImages(response.data.images);
          query
            ? setImagesTotalPage(1)
            : setImagesTotalPage(response.data.totalImages);
        } else {
          toast.error("Unexpected Response format");
          throw new Error(" Unexpected response format");
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch images");
      } finally {
        setLoadingImages(false);
      }
    };
    fetchImages();
  }, [imagesPage, query, userId]);

  const handleDownload = (url: string, title: string) => {
    const parts = url.split("/upload/");
    if (parts.length !== 2) {
      throw new Error("Downloading failed");
    }
    const attachment = title ? `fl_attachment:${title}` : "fl_attachment";
    url = `${parts[0]}/upload/${attachment}/${parts[1]}`;
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${title}.mp4`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImageDownload = async (
    id: string,
    title: string,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    setIsImageDownloading(true);
    const imgEl = imageRefs.current[id];
    if (!imgEl) return;
    
    const res = await fetch(imgEl.src);
    const blob = await res.blob();

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url
    link.download = `${title}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    setIsImageDownloading(false);
    toast.success("Image Downloaded Successfully");
  };

  const handleVideosPageChange = (mode: "prev" | "next") => {
    if (mode === "prev") {
      setVideosPage((prev) => Math.max(1, prev - 1));
    } else {
      setVideosPage((prev) => Math.min(videosTotalPage!, prev + 1));
    }
  };

  return (
    <div className="min-h-screen bg-base-100 container mx-auto p-4 max-w-screen">
      <div className="flex w-full flex-col lg:flex-row">
        {loadingVideos && (
          <div className=" flex flex-1 h-screen items-center justify-center text-base-content">
            <span className="loading loading-bars loading-xl"></span>
          </div>
        )}
        {!loadingVideos && (
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-4 text-base-content">
              Videos
            </h1>
            {videos.length === 0 ? (
              <div className="text-center text-lg text-base-content">
                No videos available
              </div>
            ) : (
              <>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
                  {videos.map((video) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      onDownload={handleDownload}
                    />
                  ))}
                </div>
                {videosTotalPage && videosTotalPage > 1 && (
                  <div className="join grid grid-cols-2 text-base-content m-6">
                    <button
                      className={`join-item btn btn-outline ${videosPage === 1 ? "btn-disabled" : ""}`}
                      onClick={() => handleVideosPageChange("prev")}
                      disabled={videosPage === 1}
                    >
                      Previous page
                    </button>
                    <button
                      className={`join-item btn btn-outline ${videosPage === videosTotalPage ? "btn-disabled" : ""}`}
                      onClick={() => handleVideosPageChange("next")}
                      disabled={videosPage === videosTotalPage}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
        <div className="divider lg:divider-horizontal text-base-content">
          OR
        </div>
        {loadingImages && (
          <div className=" flex flex-1 h-screen items-center justify-center text-base-content">
            <span className="loading loading-bars loading-xl"></span>
          </div>
        )}
        {!loadingImages && (
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-4 text-base-content">
              Photos
            </h1>
            {images.length === 0 ? (
              <div className="text-center text-lg text-base-content">
                No photos available
              </div>
            ) : (
              <>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
                  {images.map((image) => (
                    <div key={image.id} className="hover-3d relative w-60">
                      <figure className="w-60 aspect-square rounded-2xl overflow-hidden">
                        <CldImage
                          ref={(el) => {
                            imageRefs.current[image.id] = el;
                          }}
                          src={image.publicId}
                          alt={image.title}
                          quality="auto"
                          format="auto"
                          width="960"
                          height="600"
                          className="w-full h-full object-cover"
                          loading="eager"
                        />
                      </figure>
                      {/* 8 empty divs needed for the 3D effect */}
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div className="fab fab-flower absolute bottom-2 right-2 shadow-xl z-50 m-1">
                        <div
                          tabIndex={0}
                          role="button"
                          className="btn btn-md btn-circle btn-primary"
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                        >
                          <MoreVertical size={16} />
                        </div>

                        <button className="fab-main-action btn btn-circle btn-md btn-primary">
                          <Edit2 size={16} />
                        </button>
                        <div
                          className="tooltip tooltip-left"
                          data-tip="Download"
                        >
                          <button
                            className={`btn btn-primary btn-sm btn-circle ${isImagedownloading ? "disabled" : ""}`}
                            disabled={isImagedownloading}
                            onClick={(e) => {
                              e.preventDefault();
                              handleImageDownload(image.id, image.title, e);
                            }}
                          >
                            <Download size={16} />
                          </button>
                        </div>
                        <div
                          className="tooltip tooltip-left"
                          data-tip="Social-Share"
                        >
                          <button
                            className="btn btn-neutral btn-sm btn-circle"
                            onClick={(e) => {
                              e.preventDefault();
                              router.push(
                                `/social-share/${slugify(image.title)}?q=${btoa(image.publicId)}`,
                              );
                            }}
                          >
                            <Share2 size={16} />
                          </button>
                        </div>
                        <div
                          className="tooltip tooltip-top"
                          data-tip="Open in studio"
                        >
                          <button
                            className="btn btn-neutral btn-sm btn-circle"
                            onClick={(e) => {
                              e.preventDefault();
                              router.push(`/studio/${slugify(image.title)}?q=${btoa(image.publicId)}`);
                            }}
                          >
                            <EditIcon size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {imagesTotalPage && imagesTotalPage > 1 && (
                  <div className="join mt-38 flex flex-wrap justify-center text-base-content">
                    {Array.from({ length: imagesTotalPage }).map((_, i) => (
                      <button
                        key={i}
                        className={`join-item btn btn-md ${imagesPage === i + 1 ? "active" : "btn-outline"}`}
                        onClick={() => setImagesPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
