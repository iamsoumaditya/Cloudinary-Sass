import { cookies } from "next/headers";
import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default async function SignUpPage() {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value ?? "dark";

  const isDark = theme === "dark";

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100">
      <SignUp
        appearance={{
          baseTheme: isDark ? dark : undefined,
        }}
      />
    </div>
  );
}
