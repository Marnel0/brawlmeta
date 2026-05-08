import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: "#FFCC00",
          red: "#E63946",
          blue: "#1D7FBC",
          green: "#2EB872",
          purple: "#7E5BEF",
          pink: "#EC4899",
          ink: "#0F0F14",
          cream: "#FFF8E7",
          paper: "#FFFFFF",
          sand: "#F5EFE0",
        },
        tier: {
          S: "#E63946",
          A: "#F97316",
          B: "#FFCC00",
          C: "#1D7FBC",
          D: "#94A3B8",
        },
        rarity: {
          starting: "#B9EAFF",
          rare: "#2EB872",
          superRare: "#1D7FBC",
          epic: "#7E5BEF",
          mythic: "#EC4899",
          legendary: "#FFCC00",
          ultraLegendary: "#E63946",
        },
        mode: {
          gemGrab: "#A855F7",
          brawlBall: "#22C55E",
          heist: "#EF4444",
          bounty: "#3B82F6",
          siege: "#F97316",
          soloShowdown: "#EC4899",
          duoShowdown: "#EC4899",
          knockout: "#EF4444",
          hotZone: "#F97316",
          wipeout: "#EF4444",
          duels: "#A855F7",
          trioShowdown: "#EC4899",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        cartoon: "4px 4px 0 0 #0F0F14",
        "cartoon-sm": "3px 3px 0 0 #0F0F14",
        "cartoon-xs": "2px 2px 0 0 #0F0F14",
        "cartoon-yellow": "4px 4px 0 0 #FFCC00",
        "cartoon-pressed": "1px 1px 0 0 #0F0F14",
      },
      borderRadius: {
        card: "16px",
        btn: "12px",
        pill: "9999px",
      },
      transitionTimingFunction: {
        snappy: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
