/**
 * Returns the full host URL with protocol based on NextRequest.
 * Uses "http" for localhost and "https" for other hosts.
 *
 * Example:
 * const url = getHost(req);
 * url => "https://example.com" or "http://localhost:3000"
 */


import { NextRequest } from "next/server";

export const getHost = (req: NextRequest) => {
    const host = req.headers.get("host");
    const protocol = host?.includes("localhost") ? "http" : "https";
    return `${protocol}://${host}`;
};