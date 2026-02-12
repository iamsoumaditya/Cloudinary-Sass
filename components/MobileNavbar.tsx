"use client";
import { generateCertificate } from "@/utils/generateCertificate";
import { useUser } from "@clerk/nextjs";
import React, { useState, useEffect, useRef, SetStateAction } from "react";
import toast from "react-hot-toast";

const modules = [
  "Resize",
  "Quality",
  "Format",
  "Filter",
  "Blur",
  "Background",
  "Text / Watermark",
];

export default function MobileNavbar({
  activeModule,
  setActiveModule,
  completed,
}: {
  activeModule: number;
  setActiveModule: React.Dispatch<SetStateAction<number | undefined>>;
  completed: Array<number>;
}) {
  const { user, isLoaded, isSignedIn } = useUser();

  const [open, setOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleCertificateDownload = async () => {
    setIsDownloading(true);
    try {
      if (!isSignedIn) {
        throw new Error("Sign in to get certificate");
      }
      if (!isLoaded) {
        throw new Error("Unable to get user data");
      }
      await generateCertificate(
        user?.fullName ?? user.username ?? "A User",
        user?.id.replace("user_", ""),
      );
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <nav className="w-full bg-base-200 border-b border-base-300 px-4 py-3 flex items-center justify-between relative lg:hidden">
      <h1 className="text-lg md:text-xl font-bold">Studio Documentation</h1>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setOpen(!open)}
          className="btn btn-square btn-ghost"
        >
          {open ? "✕" : "☰"}
        </button>

        {open && (
          <div className="absolute right-0 mt-3 w-72 max-w-4xl bg-base-100 border border-base-300 rounded-2xl shadow-xl p-3 z-50 animate-in fade-in zoom-in-95">
            <ul className="space-y-2">
              {modules.map((module, i) => {
                const isActive = activeModule === i + 1;

                return (
                  <li key={module}>
                    <button
                      onClick={() => setActiveModule(i + 1)}
                      className={`w-full px-4 py-3 btn
                  ${
                    isActive
                      ? "btn-dash shadow-lg"
                      : "btn-ghost hover:bg-base-300"
                  }`}
                    >
                      Module {i + 1}
                      {completed.includes(i + 1) && (
                        <span className="badge badge-success badge-sm ml-2">
                          ✓
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
              {completed.length === modules.length && (
                <button
                  className=" btn btn-primary w-full"
                  onClick={handleCertificateDownload}
                  disabled={isDownloading}
                >
                  Claim Certificate
                </button>
              )}
            </ul>

            <div className="mt-4">
              <p className="text-xs opacity-70 mb-1">Progress</p>

              <progress
                className="progress progress-primary w-full"
                value={completed.length}
                max={modules.length}
              />

              <p className="text-xs opacity-70 mt-1">
                {completed.length} / {modules.length}
              </p>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
