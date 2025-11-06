import { z } from "zod";

// validation schema for ai playlist generation request
export const aiPlaylistRequestSchema = z.object({
    prompt: z
        .string()
        .min(3, "Prompt must be at least 3 characters")
        .max(500, "Prompt is too long"),
    useMyLikes: z.boolean().default(true),
});

export type AIPlaylistRequest = z.infer<typeof aiPlaylistRequestSchema>;

// ai playlist generation response
export type AIPlaylistResponse = {
    success: boolean;
    reasoning?: string;
    tracks: Array<{
        id: string;
        title: string;
        artist: string;
        album: string;
        coverUrl: string;
        previewUrl: string | null;
        duration: number;
    }>;
    error?: string;
};

// form data type
export type AIPlaylistFormData = {
    prompt: string;
    useMyLikes?: boolean;
};

