import { cookies } from "next/headers";
import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default async function SignInPage() {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value ?? "dark";

  const isDark = theme === "dark";

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100">
      <SignIn
        appearance={{
          baseTheme: isDark? dark:undefined,
        }}
      />
    </div>
  );
}
