// frontend/tailwind.config.ts
// Tailwind CSS v4 - Configuration is minimal because
// most settings are now in globals.css using @theme and @plugin

import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    // Note: In Tailwind v4, theme and plugins are configured in CSS
    // using @theme and @plugin directives in globals.css
};

export default config;