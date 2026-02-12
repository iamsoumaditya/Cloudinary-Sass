"use client";

import { useEffect, useMemo, useState } from "react";
import { ConfirmModal } from "./Modal";
import toast from "react-hot-toast";
import { useSession, useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

export function DangerZoneTab() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [asset, setAsset] = useState<"media" | "account">();

  const handleClick = (asset: "media" | "account") => {
    setAsset(asset);
    const modal = document.getElementById(
      "delete-media",
    ) as HTMLDialogElement | null;
    modal?.showModal();
  };
  const handleDelete = async (type: string) => {
    if (!isSignedIn) {
      toast.error(`Sign in to delete ${type}`);
      return;
    }
    if (!isLoaded) {
      toast.error(`Unable to delete ${type}`);
      return;
    }
    const userId = user.id;
    const toastId = toast.loading(`Deleting ${type}...`);
    if (type === "media") {
      try {
        await axios.delete(`/api/images`, { data: { userId } });
        toast.success(`All images has been deleted successfully`);
        await axios.delete(`/api/videos`, { data: { userId } });
        toast.success(`All videos has been deleted successfully`);
      } catch (error: any) {
        console.log(error);
        if (error.response) {
          toast.error(error.response.data.error);
        } else {
          toast.error(`Unable to delete ${type}`);
        }
      } finally {
        toast.dismiss(toastId);
      }
    } else if (type === "account") {
      try {
        await axios.delete(`/api/${type}`, { data: { userId } });
        toast.success(`Your account deletion request has been initiated`);
        await user.reload()
      } catch (error: any) {
        console.log(error);
        if (error.response) {
          toast.error(error.response.data.error);
        } else {
          toast.error(`Unable to delete ${type}`);
        }
      } finally {
        toast.dismiss(toastId);
      }
    }
  };
  return (
    <div className="w-full mx-auto">
      <div className="card bg-base-100 border border-red-600 shadow-xl">
        <div className="card-body space-y-6">
          <div>
            <h2 className="card-title text-red-600 text-xl">Danger Zone</h2>
            <p className="text-sm opacity-70">
              Actions here are irreversible. Please proceed carefully.
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 rounded-xl border border-base-300">
            <div>
              <h3 className="font-semibold">Delete All Media</h3>
              <p className="text-sm opacity-70">
                Permanently deletes all uploaded images & videos.
              </p>
            </div>

            <button
              type="submit"
              className="btn bg-red-900"
              onClick={() => handleClick("media")}
            >
              Delete Media
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 rounded-xl border border-red-600">
            <div>
              <h3 className="font-semibold text-red-600">Delete Account</h3>
              <p className="text-sm opacity-70">
                Your account will be immediately disabled upon deletion, and
                all associated assets will be permanently deleted within
                approximately 30 days or shortly thereafter. Once deleted, these
                assets cannot be recovered.
              </p>
            </div>

            <button
              type="submit"
              className="btn bg-red-600"
              onClick={() => handleClick("account")}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
      <ConfirmModal text={asset ?? ""} fn={handleDelete} id="media" />
    </div>
  );
}

export function PreferencesTab({ theme }: { theme: string }) {
  const { user, isLoaded, isSignedIn } = useUser();
  const [updating, setUpdating] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return;
  if (!isLoaded || !isSignedIn) {
    return;
  }
  const format = localStorage.getItem("format") ?? "auto";
  const interval = Number(user?.publicMetadata.deleteAfterDays);
  const loadImage = localStorage.getItem("loadImage") ?? "null";
  const loadVideo = localStorage.getItem("loadVideo") ?? "null";
  const handleSavePrefs = async (e: React.SubmitEvent<HTMLFormElement>) => {
    const userId = user.id;
    e.preventDefault();
    setUpdating(true);
    try {
      const formData = new FormData(e.currentTarget);
      const newTheme = formData.get("theme") as string;
      const newInterval = formData.get("interval") as string;
      const newFormat = formData.get("format") as string;
      const imageLoad = String(formData.get("loadImage")) as string;
      const videoLoad = String(formData.get("loadVideo")) as string;
      if (
        theme === newTheme &&
        interval === Number(newInterval) &&
        format === newFormat &&
        loadImage === imageLoad &&
        loadVideo === videoLoad
      ) {
        throw new Error("Change something to update");
      }
      await Promise.resolve().then(() => {
        document.cookie = `theme=${newTheme}; path=/; max-age=31536000`;
        localStorage.setItem("loadImage", imageLoad);
        localStorage.setItem("loadVideo", videoLoad);
        localStorage.setItem("format", newFormat);
        axios.patch("/api/metadata-update", {
          userId,
          day: Number(newInterval),
        });
        user.reload();
        if (theme != newTheme) location.reload();
      });

      toast.success("Preferences updated successfully");
    } catch (err: any) {
      if (err.response) {
        toast.error(err.response.data.message);
      } else {
        toast.error(err.message || "Failed to update preferences");
      }
    } finally {
      setUpdating(false);
    }
  };
  return (
    <div className="w-full mx-auto">
      <div className="card bg-base-100 shadow-lg border border-base-300">
        <form className="card-body space-y-6" onSubmit={handleSavePrefs}>
          <h2 className="card-title text-xl">Preferences</h2>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">Preferred Theme</span>
            </label>

            <select
              name="theme"
              className="select select-bordered w-full outline-0"
              defaultValue={theme}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">
                Preferred Image Format
              </span>
            </label>

            <select
              name="format"
              className="select select-bordered w-full outline-0"
              defaultValue={format}
            >
              <option value="png">PNG</option>
              <option value="jpg">JPG</option>
              <option value="auto">AUTO</option>
              <option value="webp">WebP</option>
              <option value="avif">AVIF</option>
            </select>
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">
                Auto Delete Assets After
              </span>
            </label>

            <select
              name="interval"
              className="select select-bordered w-full outline-0"
              defaultValue={interval}
            >
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <option key={day} value={day}>
                  {day} Day{day > 1 && "s"}
                </option>
              ))}
            </select>
          </div>

          {user?.publicMetadata && (
            <div className="form-control w-full sm:flex sm:justify-start">
              <label className="label mr-6">
                <input
                  name="loadImage"
                  type="checkbox"
                  defaultChecked={loadImage === "on"}
                  className="checkbox"
                />
                Load Default Image
              </label>

              <label className="label">
                <input
                  name="loadVideo"
                  type="checkbox"
                  defaultChecked={loadVideo === "on"}
                  className="checkbox"
                />
                Load Default Video
              </label>
            </div>
          )}

          <div className="card-actions justify-end">
            <button
              className="btn btn-primary"
              type="submit"
              disabled={updating}
            >
              {!updating ? "Save" : "Saving"} Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function SecurityTab() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { session } = useSession();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let alive = true;
    setLoading(true);
    user
      .getSessions()
      .then((items) => {
        if (alive) setSessions(items || []);
      })
      .catch(() => {
        if (alive) setSessions([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [user]);

  const sortedSessions = useMemo(() => {
    return [...sessions].sort((a, b) => {
      const aTime = a?.lastActiveAt ? new Date(a.lastActiveAt).getTime() : 0;
      const bTime = b?.lastActiveAt ? new Date(b.lastActiveAt).getTime() : 0;
      return bTime - aTime;
    });
  }, [sessions]);

  const formatDate = (value?: Date | string | null) => {
    if (!value) return "Unknown";
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return "Unknown";
    return date.toLocaleString();
  };

  const getDeviceLabel = (activity: any) => {
    const device =
      activity?.deviceType ||
      (activity?.isMobile ? "Mobile" : activity ? "Desktop" : "Unknown");
    const browser = [activity?.browserName, activity?.browserVersion]
      .filter(Boolean)
      .join(" ");
    return [device, browser].filter(Boolean).join(" · ");
  };

  const getLocation = (activity: any) => {
    const location = [activity?.city, activity?.country]
      .filter(Boolean)
      .join(", ");
    return location || "Unknown";
  };

  const handleRevoke = async (target: any) => {
    if (!target?.revoke || !target?.id) return;
    setRevokingId(target.id);
    try {
      const revoked = await target.revoke();
      setSessions((prev) =>
        prev.map((item) => (item?.id === revoked?.id ? revoked : item)),
      );
      toast.success("Session revoked.");
    } catch (err) {
      toast.error("Failed to revoke session.");
    } finally {
      setRevokingId(null);
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
    <div className="w-full mx-auto space-y-6">
      <div className="card bg-base-100 shadow-lg border border-base-300">
        <div className="card-body space-y-4">
          <div>
            <h2 className="card-title text-xl">Devices</h2>
            <p className="text-sm opacity-70">
              All active and recent sessions connected to your account.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center gap-3">
              <span className="loading loading-spinner loading-md"></span>
              <span className="text-sm opacity-70">Loading devices…</span>
            </div>
          ) : sortedSessions.length === 0 ? (
            <div className="text-sm opacity-70">No device sessions found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Device</th>
                    <th>Location</th>
                    <th>IP</th>
                    <th>Status</th>
                    <th>Last Active</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedSessions.map((s) => {
                    const activity = s?.latestActivity;
                    const isCurrent = session?.id && session.id === s?.id;
                    return (
                      <tr key={s?.id || Math.random()}>
                        <td className="font-medium">
                          <div className="flex flex-col">
                            <span>{getDeviceLabel(activity)}</span>
                            {isCurrent && (
                              <span className="badge badge-success badge-sm mt-1">
                                Current
                              </span>
                            )}
                          </div>
                        </td>
                        <td>{getLocation(activity)}</td>
                        <td>{activity?.ipAddress || "Unknown"}</td>
                        <td className="capitalize">{s?.status || "Unknown"}</td>
                        <td>{formatDate(s?.lastActiveAt)}</td>
                        <td>
                          {isCurrent ? (
                            <span className="text-xs opacity-60">Active</span>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-xs btn-outline btn-error"
                              disabled={revokingId === s?.id}
                              onClick={() => handleRevoke(s)}
                            >
                              {revokingId === s?.id ? "Revoking..." : "Revoke"}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function DefaultTabRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    const basePath = pathname.split("/").slice(0, -1).join("/") || "";
    const target = `${basePath}/account-settings`;
    const timeout = setTimeout(() => {
      router.replace(target);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [router, pathname]);

  return (
    <div className="card bg-base-100 border border-base-300 shadow-lg w-full">
      <div className="card-body items-center text-center">
        <h2 className="card-title">No Such Tab Exists</h2>
        <p className="text-sm opacity-70">
          This tab doesn&apos;t exist. Redirecting to Account Settings...
        </p>
        <span className="loading loading-dots loading-md mt-2"></span>
      </div>
    </div>
  );
}
