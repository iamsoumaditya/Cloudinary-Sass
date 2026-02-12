import React from "react";
import AccountSettingsSection from "@/components/AccountSetting";
import { cookies } from "next/headers";
import {
  DangerZoneTab,
  PreferencesTab,
  SecurityTab,
  DefaultTabRedirect,
} from "@/components/ProfileTabs";

export default async function Tabpage({
  params,
}: {
  params: Promise<{ Tab: string }>;
}) {
  const { Tab } = await params;
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value??"dark";
  switch (Tab) {
    case "account-settings":
      return <AccountSettingsSection />;
      break;
    case "prefs":
      return <PreferencesTab theme={String(theme)} />;
      break;
    case "security":
      return <SecurityTab />;
      break;
    case "danger-zone":
      return <DangerZoneTab />;

    default:
      return <DefaultTab />;
      break;
  }
}

export function DefaultTab() {
  return <DefaultTabRedirect />;
}
