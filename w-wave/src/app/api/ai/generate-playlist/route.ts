import { NextRequest, NextResponse } from "next/server";
import { generateAiPlaylist } from "@/features/ai-playlist";
import { aiPlaylistRequestSchema } from "@/features/ai-playlist/model/types";
import { handleApiError } from "@/shared/lib/errors";
import { validateRequestBody, optionalAuth } from "@/shared/lib/middleware";

export async function POST(request: NextRequest) {
	try {
		const body = await validateRequestBody(request, aiPlaylistRequestSchema);
		const { user, supabase } = await optionalAuth();

		const { reasoning, tracks } = await generateAiPlaylist({
			prompt: body.prompt,
			useLikedTracks: body.useMyLikes,
			userId: user?.id,
			supabase,
		});

		return NextResponse.json({
			success: true,
			reasoning,
			tracks,
		});
	} catch (error) {
		const { status, body } = handleApiError(error);
		return NextResponse.json(body, { status });
	}
}

