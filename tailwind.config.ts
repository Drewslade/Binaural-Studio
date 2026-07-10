import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#161E15",
        charcoal: "#1F2921",
        paper: "#D0DECE",
        sage: "#8A9186",
        // Single accent. `deep` is the same gold darkened for AA contrast
        // on Paper surfaces — it is not a second accent color.
        gold: {
          DEFAULT: "#B99457",
          deep: "#7D6234",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-plex-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-body": "#161E15",
            "--tw-prose-headings": "#161E15",
            "--tw-prose-lead": "#161E15",
            "--tw-prose-links": "#7D6234",
            "--tw-prose-bold": "#161E15",
            "--tw-prose-counters": "#8A9186",
            "--tw-prose-bullets": "#8A9186",
            "--tw-prose-hr": "#8A9186",
            "--tw-prose-quotes": "#161E15",
            "--tw-prose-quote-borders": "#B99457",
            "--tw-prose-captions": "#8A9186",
            "--tw-prose-code": "#161E15",
            "--tw-prose-th-borders": "#8A9186",
            "--tw-prose-td-borders": "#8A9186",
            h1: { fontFamily: "var(--font-fraunces)", fontWeight: "500" },
            h2: { fontFamily: "var(--font-fraunces)", fontWeight: "500" },
            h3: { fontFamily: "var(--font-fraunces)", fontWeight: "500" },
            a: { textDecorationColor: "#B99457" },
          },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
