export const siteName = "Hex";
export const titleTemplate = (title: string) => `${title} | ${siteName}`;
export const description = "Hex is a platform for discovering and buying gaming devices and bundles.";
const domain = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadataBase = new URL(domain);