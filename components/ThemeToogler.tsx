"use client";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggler({ theme }: { theme: "light" | "dark" }) {
  const isDark = theme === "dark";

  function toggleTheme() {
    const next = isDark ? "light" : "dark";
    document.cookie = `theme=${next}; path=/; max-age=31536000`;
    location.reload();
  }

  return (
    <label htmlFor="theme change" className="toggle cursor-pointer mt-2">
      <input type="checkbox" checked={isDark} onChange={toggleTheme} />
      <Moon size={18} className="bg-black rounded-2xl" />
      <Sun size={18} />
    </label>
  );
}
