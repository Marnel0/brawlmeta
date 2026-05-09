"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function PlayerSearchBar({ size = "lg" }: { size?: "sm" | "lg" }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const tag = value.trim().replace(/^#/, "").toUpperCase();
    if (!tag) { setError("Enter a player tag"); return; }
    if (!/^[0-9A-Z]{3,12}$/.test(tag)) { setError("Invalid tag — use letters and numbers only"); return; }
    router.push(`/player/${tag}`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={cn("flex gap-3", size === "sm" && "gap-2")}>
        <div className="relative flex-1">
          <span className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 font-display text-brand-ink/30 pointer-events-none",
            size === "lg" ? "text-2xl" : "text-lg"
          )}>#</span>
          <input
            type="text"
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(""); }}
            placeholder="2PP00"
            className={cn(
              "w-full bg-brand-cream border-2 border-brand-ink rounded-2xl font-heading text-brand-ink placeholder:text-brand-ink/30 focus:outline-none focus:border-brand-yellow transition-colors shadow-cartoon",
              size === "lg" ? "pl-10 pr-4 py-4 text-lg" : "pl-9 pr-3 py-2.5 text-base"
            )}
          />
        </div>
        <button
          type="submit"
          className={cn(
            "bg-brand-yellow border-2 border-brand-ink rounded-2xl font-heading font-bold text-brand-ink shadow-cartoon hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-cartoon-pressed transition-all flex items-center gap-2",
            size === "lg" ? "px-6 py-4 text-lg" : "px-4 py-2.5 text-sm"
          )}
        >
          <Search size={size === "lg" ? 20 : 16} />
          {size === "lg" && <span>Search</span>}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-500 text-left">{error}</p>}
    </form>
  );
}
