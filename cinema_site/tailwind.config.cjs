module.exports = {
	content: [
		"./src/app/**/*.{js,ts,jsx,tsx}",
		"./src/features/**/*.{js,ts,jsx,tsx}",
		"./src/providers/**/*.{js,ts,jsx,tsx}",
		"./src/store/**/*.{js,ts,jsx,tsx}",
		"./src/widgets/**/*.{js,ts,jsx,tsx}",
		"./src/entities/**/*.{js,ts,jsx,tsx}",
		"./src/shared/**/*.{js,ts,jsx,tsx}",
	],
	plugins: [require("tailwind-scrollbar-hide")],
};
