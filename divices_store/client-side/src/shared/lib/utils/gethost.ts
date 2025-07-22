import { NextRequest } from "next/server";

export const getHost = (req: NextRequest) => {
    const host = req.headers.get("host");
    const protocol = host?.includes("localhost") ? "http" : "https";
    return `${protocol}://${host}`;
};