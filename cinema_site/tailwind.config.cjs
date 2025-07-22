module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./globals.scss"
  ],
  plugins: [
     require("tailwind-scrollbar-hide"),
  ],
};
