import animate from "tailwindcss-animate";

export default {
    content: ["./src/features/**/*.{js,ts,jsx,tsx}",
        "./src/providers/**/*.{js,ts,jsx,tsx}",
        "./src/store/**/*.{js,ts,jsx,tsx}",
        "./src/widgets/**/*.{js,ts,jsx,tsx}",],
    plugins: [animate],
};