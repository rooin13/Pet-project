import animate from "tailwindcss-animate";

export default {
    content: [
        "./src/features/**/*.{js,ts,jsx,tsx}",
        "./src/providers/**/*.{js,ts,jsx,tsx}",
        "./src/store/**/*.{js,ts,jsx,tsx}",
        "./src/widgets/**/*.{js,ts,jsx,tsx}",
        "./src/shared/**/*.{js,ts,jsx,tsx}",
        "./src/app/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#91a5ff",
                secondary: "#B2C0FF",
            },
        },
    },
    plugins: [animate, require('@tailwindcss/line-clamp')],
};