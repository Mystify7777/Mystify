import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        observatory: {
          surface: "#0b0d10",
          panel: "#11151a",
          elevated: "#171c22",
          ink: "#eaeaea",
          muted: "#8a939e",
          amber: "#c9924a",
          violet: "#9b7fd4",
          cyan: "#00d4ff",
          chaos: "#e8724a",
        },
      },
      borderRadius: {
        observatory: "16px",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      transitionTimingFunction: {
        observatory: "cubic-bezier(0, 0, 0.2, 1)",
      },
      transitionDuration: {
        observatory: "180ms",
      },
    },
  },
  plugins: [],
};

export default config;
