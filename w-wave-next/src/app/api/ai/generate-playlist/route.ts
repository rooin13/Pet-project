import { NextRequest, NextResponse } from "next/server";
import {
	generatePlaylistSuggestions,
	GeminiPlaylistResponse,
} from "@/shared/lib/api/gemini";
import {
	getSpotifyAccessToken,
	searchSpotifyTracks,
} from "@/shared/lib/api/spotify";
import { aiPlaylistRequestSchema } from "@/features/ai-playlist/model/types";
import {
	handleApiError,
	ExternalAPIError,
} from "@/shared/lib/errors";
import { validateRequestBody, optionalAuth } from "@/shared/lib/middleware";

export async function POST(request: NextRequest) {
	try {
		console.log("🤖 AI PLAYLIST: Request received");

		// validation
		const body = await validateRequestBody(request, aiPlaylistRequestSchema);
		console.log("✅ Validation passed:", body);

		// optional auth (не блокируем неавторизованных)
		const { user, supabase } = await optionalAuth();
		console.log("🔐 Auth status:", { userId: user?.id || "anonymous", hasSupabase: !!supabase });

		console.log("🤖 AI PLAYLIST GENERATION STARTED for user:", user?.id || "anonymous");

		// check API keys
		const hasGeminiKey = !!process.env.GEMINI_API_KEY;
		const hasSpotifyCredentials =
			!!process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID &&
			!!process.env.SPOTIFY_CLIENT_SECRET;

		if (!hasGeminiKey || !hasSpotifyCredentials) {
			throw new ExternalAPIError(
				"Configuration",
				"AI playlist generation requires API keys",
				500
			);
		}

		const { prompt, useMyLikes } = body;

		console.log("📝 User prompt:", prompt);
		console.log("💜 Use my likes:", useMyLikes);

		// get user's liked tracks from database
		type TrackMetadata = {
			title: string;
			artist: string;
			genre?: string;
		};

		let likedTracksData: TrackMetadata[] = [];

		if (useMyLikes && user) {
			console.log("🔍 Fetching user's liked tracks...");
			const { data: likedTracks } = await supabase
				.from("liked_spotify_tracks")
				.select("spotify_track_id, track_data")
				.eq("user_id", user.id)
				.limit(20);

			console.log("📊 Found liked tracks:", likedTracks?.length || 0);

			if (likedTracks && likedTracks.length > 0) {
				likedTracksData = likedTracks
					.filter((lt: { track_data?: { title?: string; artist?: string; genre?: string } | null }) => lt.track_data)
					.map((lt: { track_data: { title?: string; artist?: string; genre?: string } }) => ({
						title: lt.track_data.title || "Unknown",
						artist: lt.track_data.artist || "Unknown",
						genre: lt.track_data.genre || "Unknown",
					}));
			}
		}

		// fallback: use sample tracks if user has no liked tracks
		if (likedTracksData.length === 0) {
			likedTracksData = [
				{
					title: "Blinding Lights",
					artist: "The Weeknd",
					genre: "Pop",
				},
				{
					title: "Levitating",
					artist: "Dua Lipa",
					genre: "Pop",
				},
				{
					title: "Save Your Tears",
					artist: "The Weeknd",
					genre: "Pop",
				},
			];
		}

		// Use real AI + Spotify
		console.log("🤖 Using Gemini AI + Spotify API");
		console.log("💬 Sending to Gemini, liked tracks count:", likedTracksData.length);

		// Generate AI suggestions
		const aiResponse: GeminiPlaylistResponse =
			await generatePlaylistSuggestions(prompt, likedTracksData);

		console.log("✅ Gemini response received!");
		console.log("🎯 Reasoning:", aiResponse.reasoning);
		console.log("🎵 Suggested tracks count:", aiResponse.suggestedTracks.length);

		const reasoning = aiResponse.reasoning;

		// Get Spotify access token
		console.log("🔑 Getting Spotify access token...");
		const spotifyToken = await getSpotifyAccessToken();
		console.log("✅ Spotify token obtained");

		// Search for tracks on Spotify based on AI suggestions
		console.log("🔍 Searching for", aiResponse.suggestedTracks.length, "tracks on Spotify...");
		const searchPromises = aiResponse.suggestedTracks.map((suggestion) => {
			const query = `${suggestion.title} ${suggestion.artist}`;
			console.log("🔎 Searching:", query);
			return searchSpotifyTracks(query, spotifyToken, 1);
		});

		const searchResults = await Promise.all(searchPromises);
		console.log("✅ Search completed, found tracks:", searchResults.filter(r => r.length > 0).length);

		// Format tracks for response
		const tracks = searchResults
			.filter((results) => results.length > 0)
			.map((results) => {
				const track = results[0];
				return {
					id: track.id,
					title: track.name,
					artist: track.artists.map((a) => a.name).join(", "),
					album: track.album.name,
					coverUrl: track.album.images[0]?.url || "",
					previewUrl: track.preview_url,
					duration: track.duration_ms,
				};
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

