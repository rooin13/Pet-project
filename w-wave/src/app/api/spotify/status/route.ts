import { NextResponse } from "next/server";
import { createClient } from "@/shared/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Check if user has Spotify tokens
 * GET /api/spotify/status
 */
export async function GET() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ connected: false }, { status: 200 });
    }

    const { data: tokens, error } = await supabase
        .from("spotify_tokens")
        .select("access_token")
        .eq("user_id", user.id)
        .single();

    if (error || !tokens?.access_token) {
        return NextResponse.json({ connected: false }, { status: 200 });
    }

    return NextResponse.json({ connected: true }, { status: 200 });
}
