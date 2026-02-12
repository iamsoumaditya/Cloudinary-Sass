import type { Metadata } from "next";
import { Geist, Geist_Mono,Lato } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { SearchProvider } from "@/context/searchContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "Media Refine",
  description: "Crafted by Soumaditya Roy",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value ?? "dark";
  const daisyTheme = theme === "dark" ? "night" : "light";
  
  return (
    <ClerkProvider>
      <html lang="en" data-theme={daisyTheme}>
        <body
          className={`${lato.className} ${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <SearchProvider>
            <Header />
            <Toaster
              toastOptions={{
                style: {
                  background: theme === "dark" ? "#1a1a1a" : "#ffffff",
                  color: theme === "dark" ? "#fff" : "#000",
                },
              }}
            />
            {children}
            <Footer />
          </SearchProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
