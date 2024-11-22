import type { Config } from "tailwindcss";

const config = {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "fixtures/**/*.{js,ts,jsx,tsx}"],
} satisfies Config;

export default config;
