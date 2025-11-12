"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import {
    generatePlaylistSuggestions,
    type GeminiPlaylistResponse,
} from "@/shared/lib/api/gemini";
import {
    getSpotifyAccessToken,
    searchSpotifyTracks,
} from "@/shared/lib/api/spotify";
import { aiPlaylistRequestSchema, type AIPlaylistResponse } from "./types";

type TrackSeed = {
    title: string;
    artist: string;
    genre?: string;
};

type GenerateAiPlaylistParams = {
    prompt: string;
    useLikedTracks: boolean;
    userId?: string;
    supabase?: SupabaseClient;
};

type GenerateAiPlaylistResult = Pick<
    GeminiPlaylistResponse,
    "reasoning" | "suggestedTracks"
>;

type GeneratedTrack = AIPlaylistResponse["tracks"][number];

const FALLBACK_TRACKS: TrackSeed[] = [
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

const GENRE_KEYWORD_FALLBACKS: Array<{
    keywords: string[];
    tracks: TrackSeed[];
}> = [
        {
            keywords: ["techno", "minimal techno", "hard techno", "rave", "warehouse"],
            tracks: [
                {
                    title: "Trans",
                    artist: "Charlotte de Witte",
                    genre: "Techno",
                },
                {
                    title: "Hidden Beauties",
                    artist: "Charlotte de Witte",
                    genre: "Techno",
                },
                {
                    title: "Timewarp",
                    artist: "Enrico Sangiuliano",
                    genre: "Techno",
                },
            ],
        },
        {
            keywords: ["house", "deep house", "club", "dance"],
            tracks: [
                {
                    title: "Look Right Through",
                    artist: "Storm Queen",
                    genre: "House",
                },
                {
                    title: "Turn Back Time",
                    artist: "Diplo",
                    genre: "House",
                },
                {
                    title: "Losing It",
                    artist: "FISHER",
                    genre: "Tech House",
                },
            ],
        },
        {
            keywords: ["metal", "heavy", "hardcore", "metalcore"],
            tracks: [
                {
                    title: "Painkiller",
                    artist: "Judas Priest",
                    genre: "Heavy Metal",
                },
                {
                    title: "Bleed",
                    artist: "Meshuggah",
                    genre: "Progressive Metal",
                },
                {
                    title: "Duality",
                    artist: "Slipknot",
                    genre: "Nu Metal",
                },
            ],
        },
        {
            keywords: ["rock", "indie rock", "alternative", "grunge", "punk"],
            tracks: [
                {
                    title: "Do I Wanna Know?",
                    artist: "Arctic Monkeys",
                    genre: "Indie Rock",
                },
                {
                    title: "Reptilia",
                    artist: "The Strokes",
                    genre: "Indie Rock",
                },
                {
                    title: "Everlong",
                    artist: "Foo Fighters",
                    genre: "Alternative Rock",
                },
            ],
        },
        {
            keywords: ["jazz", "swing", "bebop", "sax"],
            tracks: [
                {
                    title: "So What",
                    artist: "Miles Davis",
                    genre: "Jazz",
                },
                {
                    title: "Take Five",
                    artist: "The Dave Brubeck Quartet",
                    genre: "Jazz",
                },
                {
                    title: "My Favorite Things",
                    artist: "John Coltrane",
                    genre: "Jazz",
                },
            ],
        },
        {
            keywords: ["rap", "hip hop", "trap", "boom bap"],
            tracks: [
                {
                    title: "N.Y. State of Mind",
                    artist: "Nas",
                    genre: "Hip-Hop",
                },
                {
                    title: "DNA.",
                    artist: "Kendrick Lamar",
                    genre: "Hip-Hop",
                },
                {
                    title: "Mask Off",
                    artist: "Future",
                    genre: "Trap",
                },
            ],
        },
        {
            keywords: ["lofi", "study", "chill", "focus"],
            tracks: [
                {
                    title: "Luv(sic) pt3",
                    artist: "Nujabes",
                    genre: "Lo-Fi",
                },
                {
                    title: "Get You The Moon",
                    artist: "Kina",
                    genre: "Lo-Fi",
                },
                {
                    title: "Snowman",
                    artist: "WYS",
                    genre: "Lo-Fi",
                },
            ],
        },
        {
            keywords: ["drain", "drain gang", "дрейн", "bladee", "ecco2k", "thaiboy"],
            tracks: [
                {
                    title: "Be Nice To Me",
                    artist: "Bladee",
                    genre: "Drain",
                },
                {
                    title: "GTBT",
                    artist: "Ecco2k",
                    genre: "Drain",
                },
                {
                    title: "With Me",
                    artist: "Thaiboy Digital",
                    genre: "Drain",
                },
            ],
        },
    ];

const pickFallbackSeeds = (prompt: string): TrackSeed[] => {
    const normalized = prompt.toLowerCase();
    for (const entry of GENRE_KEYWORD_FALLBACKS) {
        if (entry.keywords.some((keyword) => normalized.includes(keyword))) {
            return entry.tracks;
        }
    }
    return FALLBACK_TRACKS;
};

const likedTracksQueryFields = ["spotify_track_id", "track_data"] as const;

const formatSeed = (seed?: {
    title?: string | null;
    artist?: string | null;
    genre?: string | null;
}): TrackSeed => ({
    title: seed?.title?.trim() || "Unknown",
    artist: seed?.artist?.trim() || "Unknown",
    genre: seed?.genre?.trim() || undefined,
});

const loadLikedTracks = async (
    supabase: SupabaseClient,
    userId: string
): Promise<TrackSeed[]> => {
    const { data, error } = await supabase
        .from("liked_spotify_tracks")
        .select(likedTracksQueryFields.join(","))
        .eq("user_id", userId)
        .limit(20);

    if (error) {
        console.error("failed to load liked tracks", error);
        return [];
    }

    if (!Array.isArray(data) || data.length === 0) {
        return [];
    }

    const seeds: TrackSeed[] = [];

    for (const row of data) {
        if (!row || typeof row !== "object" || !("track_data" in row)) {
            continue;
        }

        const record = row as { track_data?: unknown };
        const formatted = formatSeed(record.track_data as TrackSeed | undefined);
        if (formatted.title && formatted.artist) {
            seeds.push(formatted);
        }
    }

    return seeds;
};

const ensureConfiguration = () => {
    const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY);
    const hasSpotifyCredentials =
        Boolean(process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID) &&
        Boolean(process.env.SPOTIFY_CLIENT_SECRET);

    if (!hasGeminiKey || !hasSpotifyCredentials) {
        throw new Error("missing AI or Spotify credentials");
    }
};

const toTrackSeedList = async ({
    useLikedTracks,
    supabase,
    userId,
    prompt,
}: Pick<GenerateAiPlaylistParams, "useLikedTracks" | "supabase" | "userId" | "prompt">) => {
    if (!useLikedTracks || !userId || !supabase) {
        return pickFallbackSeeds(prompt);
    }

    const liked = await loadLikedTracks(supabase, userId);
    return liked.length > 0 ? liked : pickFallbackSeeds(prompt);
};

const sanitizePromptKeywords = (prompt: string): string[] => {
    return Array.from(
        new Set(
            prompt
                .toLowerCase()
                .replace(/[^a-z0-9а-яё\s]/gi, " ")
                .split(/\s+/)
                .filter((word) => word.length >= 4)
        )
    )
        .filter(Boolean)
        .slice(0, 6);
};

const resolveSeedToTrack = async (
    seed: TrackSeed,
    token: string
): Promise<GeneratedTrack | null> => {
    try {
        const results = await searchSpotifyTracks(
            `${seed.title} ${seed.artist}`,
            token,
            1
        );

        const candidate = results[0];
        if (!candidate) {
            return null;
        }

        return {
            id: candidate.id,
            title: candidate.name,
            artist: candidate.artists.map((artist) => artist.name).join(", "),
            album: candidate.album.name,
            coverUrl: candidate.album.images[0]?.url ?? "",
            previewUrl: candidate.preview_url,
            duration: candidate.duration_ms,
        };
    } catch (error) {
        console.error("spotify search failed", {
            seed,
            error,
        });
        return null;
    }
};

const ensurePromptCoverage = async (
    tracks: GeneratedTrack[],
    prompt: string,
    token: string
): Promise<GeneratedTrack[]> => {
    const requiredSeeds = pickFallbackSeeds(prompt);

    // default fallback is generic pop — no additional enforcement needed
    if (requiredSeeds === FALLBACK_TRACKS) {
        return tracks;
    }

    const normalizedArtists = tracks.map((track) =>
        track.artist.toLowerCase()
    );

    const hasRequiredArtist = requiredSeeds.some((seed) =>
        normalizedArtists.some((artist) =>
            artist.includes(seed.artist.toLowerCase())
        )
    );

    if (hasRequiredArtist) {
        return tracks;
    }

    const resolvedSeeds = await Promise.all(
        requiredSeeds.map((seed) => resolveSeedToTrack(seed, token))
    );

    const additionalTracks = resolvedSeeds.filter(
        (track): track is GeneratedTrack => Boolean(track)
    );

    if (additionalTracks.length === 0) {
        return tracks;
    }

    const combined = [...additionalTracks, ...tracks];
    const seen = new Set<string>();

    return combined.filter((track) => {
        const key =
            track.id ||
            `${track.title?.toLowerCase() ?? ""}-${track.artist?.toLowerCase() ?? ""
            }`;

        if (seen.has(key)) {
            return false;
        }

        seen.add(key);
        return true;
    });
};

const fetchSuggestedTracks = async (
    response: GenerateAiPlaylistResult,
    prompt: string
): Promise<GeneratedTrack[]> => {
    const token = await getSpotifyAccessToken();
    const promptKeywords = sanitizePromptKeywords(prompt).join(" ");

    const tracks = await Promise.all(
        response.suggestedTracks.map(async (suggestion) => {
            const baseQueries = [
                `${suggestion.title} ${suggestion.artist}`,
                `${suggestion.title} ${suggestion.artist} ${promptKeywords}`,
                `${suggestion.title} ${promptKeywords}`,
                `${suggestion.artist} ${promptKeywords}`,
            ]
                .map((query) => query.trim())
                .filter(Boolean);

            const targetArtists = suggestion.artist
                .toLowerCase()
                .split(/[,&]/)
                .map((name) => name.trim())
                .filter(Boolean);

            let fallbackTrack: GeneratedTrack | null = null;

            for (const query of baseQueries) {
                try {
                    const results = await searchSpotifyTracks(query, token, 5);
                    if (results.length === 0) {
                        continue;
                    }

                    const preferred = results.find((track) => {
                        const trackArtists = track.artists.map((artist) =>
                            artist.name.toLowerCase()
                        );

                        return (
                            targetArtists.length > 0 &&
                            targetArtists.some((target) =>
                                trackArtists.some((name) =>
                                    name.includes(target)
                                )
                            )
                        );
                    });

                    const candidate = preferred ?? results[0];

                    const mappedTrack: GeneratedTrack = {
                        id: candidate.id,
                        title: candidate.name,
                        artist: candidate.artists
                            .map((artist) => artist.name)
                            .join(", "),
                        album: candidate.album.name,
                        coverUrl: candidate.album.images[0]?.url ?? "",
                        previewUrl: candidate.preview_url,
                        duration: candidate.duration_ms,
                    };

                    if (!fallbackTrack) {
                        fallbackTrack = mappedTrack;
                    }

                    if (preferred) {
                        return mappedTrack;
                    }
                } catch (error) {
                    console.error("spotify search failed", {
                        query,
                        error,
                    });
                }
            }

            return fallbackTrack;
        })
    );

    const resolvedTracks = tracks.filter(
        (track): track is GeneratedTrack => Boolean(track)
    );

    return ensurePromptCoverage(resolvedTracks, prompt, token);
};

export const generateAiPlaylist = async ({
    prompt,
    useLikedTracks,
    userId,
    supabase,
}: GenerateAiPlaylistParams) => {
    const validation = aiPlaylistRequestSchema.safeParse({
        prompt,
        useMyLikes: useLikedTracks,
    });

    if (!validation.success) {
        throw new Error(validation.error.issues[0]?.message ?? "invalid request");
    }

    ensureConfiguration();

    const seeds = await toTrackSeedList({
        useLikedTracks,
        userId,
        supabase,
        prompt,
    });
    const aiResponse = await generatePlaylistSuggestions(prompt, seeds);

    const tracks = await fetchSuggestedTracks(aiResponse, prompt);

    const seen = new Set<string>();
    const uniqueTracks = tracks.filter((track) => {
        const key =
            track.id ||
            `${track.title?.toLowerCase() ?? ""}-${track.artist?.toLowerCase() ?? ""}`;
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });

    return {
        reasoning: aiResponse.reasoning,
        tracks: uniqueTracks,
    };
};
