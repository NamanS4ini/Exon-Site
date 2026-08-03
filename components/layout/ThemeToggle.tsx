"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // On first mount, read saved preference
  useEffect(() => {
    const saved = localStorage.getItem("exon-theme") as "dark" | "light" | null;
    const initial =
      saved ??
      (window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark");
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("exon-theme", next);
  }

  return (
    <button
      id="theme-toggle"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="btn btn-ghost btn-sm"
      style={{ padding: "0.4rem", borderRadius: "var(--radius-sm)" }}
    >
      {theme === "dark" ? (
        <Sun size={17} strokeWidth={1.7} />
      ) : (
        <Moon size={17} strokeWidth={1.7} />
      )}
    </button>
  );
}
