"use client";
import React, { useEffect, useState } from "react";
import { Home, Share2, Video } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

type Tab = "home" | "video-upload" | "social-share";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter()
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState<Tab |null>();

  const handleTabChange = (tab: Tab) => {
    if (activeTab === tab) return
    setActiveTab(tab)
    if(tab === "social-share")
      router.push(`/${tab}/new/`)
    else
    router.push(`/${tab}`)
  };

  useEffect(() => {
    if (!pathname) return
    else if(pathname.includes("home")) setActiveTab("home")
    else if (pathname.includes("video-upload")) setActiveTab("video-upload");
    else if (pathname.includes("social-share")) setActiveTab("social-share");
    else setActiveTab(null)
  }, [pathname])
  
  return (
    <>
      {children}
      
      <div className="dock">
        <button
          className={`text-base-content ${activeTab === "home" ? "dock-active" : ""}`}
          onClick={() => handleTabChange("home")}
        >
          <Home size={24} className="stroke-current" />
          <span className="dock-label">Home</span>
        </button>

        <button
          className={`text-base-content ${activeTab === "social-share" ? "dock-active" : ""}`}
          onClick={() => handleTabChange("social-share")}
        >
          <Share2 size={24} className="stroke-current" />
          <span className="dock-label">Social Share</span>
        </button>

        <button
          className={`text-base-content ${activeTab === "video-upload" ? "dock-active" : ""}`}
          onClick={() => handleTabChange("video-upload")}
        >
          <Video size={24} className="stroke-current" />
          <span className="dock-label">Video Upload</span>
        </button>
      </div>
    </>
  );
}
