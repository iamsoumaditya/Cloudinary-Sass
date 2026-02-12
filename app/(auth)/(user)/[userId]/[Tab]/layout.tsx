import { currentUser } from "@clerk/nextjs/server";
import { Image, Video, Wand2, Server } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const tabs = [
  { id: "account-settings", label: "Account Settings", style: "" },
  { id: "prefs", label: "Preferences", style: "" },
  { id: "security", label: "Security", style: "" },
  { id: "danger-zone", label: "Danger Zone", style: "text-red-600" },
] as const;

export function indicatorText(value: number, limit: number): string {
  if ((value / limit) * 100 > 90) {
    //90%
    return "text-red-600";
  } else if ((value / limit) * 100 > 70) {
    //70%
    return "text-amber-400";
  } else {
    return "text-green-600";
  }
}

function StatCard({
  title,
  value,
  icon,
  maxValue,
}: {
  title: string;
    value: number;
    maxValue?: number;
    icon:React.ReactNode
  }) {
  return (
    <div className="stat bg-base-200 rounded-xl shadow">
      <div className="stat-figure text-primary">{icon}</div>
      <div className="stat-title">{title}</div>
      <div
        className={`stat-value ${title === "Storage" ? `${indicatorText(value, maxValue!)}` : title === "Transforms" ? `${indicatorText(value, maxValue!)}` : "text-primary"}`}
      >
          <span className="hidden xl:block">
          {value.toFixed(0)} {title === "Storage" ? " MB" : ""}
          {maxValue && ` / ${maxValue}`} {title === "Storage" ? " MB" : ""}
          </span>
          <span className="xl:hidden">
          {value.toFixed(0)} {title === "Storage" ? " MB" : ""}
          </span>
      </div>
    </div>
  );
}

export default async function ProfilePage({
  params,
  children,
}: {
  params: Promise<{ userId: string; Tab: string }>;
  children: ReactNode;
}) {
  const { userId, Tab } = await params;
  const user = await currentUser();

  const images = await prisma.image.count({
    where: {
      authorId: user?.id,
    },
  });
  const videos = await prisma.video.count({
    where: {
      authorId: user?.id,
    },
  });

  const storage = Number(user?.publicMetadata.storage??0);
  const maxStorage = Number(user?.publicMetadata.maxStorage??800);

  const transformationPoint = Number(user?.publicMetadata.tPoint??0);
  const maxTransformationPoint = Number(user?.publicMetadata.maxTPoint??800);

  if (user?.id !== userId) {
    redirect(`/${user?.id}/${Tab}`);
  }

  return (
    <div className="container mx-auto px-4 py-6 min-h-screen bg-base-100 text-base-content max-w-screen">
      <div className="card bg-base-200 shadow-lg p-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="avatar">
          <div className="w-24 rounded-full">
            <img src={user?.imageUrl} />
          </div>
        </div>

        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold">{user?.fullName}</h2>
          <p className="text-sm opacity-70">
            {user?.primaryEmailAddress?.emailAddress}
          </p>
          <p className="text-xs opacity-50 mt-1">
            Joined {new Date(user?.createdAt || "").toDateString()}
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <StatCard title="Images" value={images} icon={<Image />} />
        <StatCard title="Videos" value={videos} icon={<Video />} />
        <StatCard
          title="Transforms"
          value={transformationPoint}
          maxValue={maxTransformationPoint}
          icon={<Wand2 />}
        />
        <StatCard
          title="Storage"
          value={storage}
          maxValue={maxStorage}
          icon={<Server />}
        />
      </div>

      <div className="card bg-base-200 shadow-lg mt-6">
        <div className="card-body p-0">
          <div className="mockup-window bg-base-100 border border-base-300">
            <div role="tablist" className="tabs tabs-lift justify-between">
              {tabs.map((tab) => (
                <Link key={tab.id} href={`/${userId}/${tab.id}`}>
                  <button
                    role="tab"
                    className={`tab text-sm sm:text-md font-medium ${Tab === tab.id ? `tab-active ${tab.style}` : ""} `}
                    aria-selected={Tab === tab.id}
                  >
                    {tab.label}
                  </button>
                </Link>
              ))}
            </div>

            <div className="grid h-auto">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
