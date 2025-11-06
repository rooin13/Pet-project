export type Track = {
    id: string;
    title: string;
    artist: string;
    album: string;
    coverUrl: string;
    previewUrl: string | null;
    duration: number;
};

export type SearchState = {
    query: string;
    results: Track[];
    isLoading: boolean;
    error: string | null;
};

