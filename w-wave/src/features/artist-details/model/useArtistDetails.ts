"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Track } from "@/entities/track";

type ArtistDetails = {
	id: string;
	name: string;
	imageUrl: string | null;
	followers: number;
	genres: string[];
};

type SimilarArtist = {
	id: string;
	name: string;
	imageUrl: string | null;
};

type ArtistResponse = {
	artist: ArtistDetails;
	topTracks: Track[];
	similarArtists: SimilarArtist[];
};

type ArtistState = {
	artist: ArtistDetails | null;
	topTracks: Track[];
	similarArtists: ArtistResponse["similarArtists"];
	isLoading: boolean;
};

type ArtistHandlers = {
	refresh: () => Promise<void>;
};

export const useArtistDetails = (
	artistId: string,
	locale: string
): { state: ArtistState; handlers: ArtistHandlers } => {
	const [artist, setArtist] = useState<ArtistDetails | null>(null);
	const [topTracks, setTopTracks] = useState<Track[]>([]);
	const [similarArtists, setSimilarArtists] = useState<SimilarArtist[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchArtist = useCallback(async () => {
		if (!artistId) {
			setArtist(null);
			setTopTracks([]);
			setSimilarArtists([]);
			return;
		}

		try {
			setIsLoading(true);
			const response = await fetch(`/api/artist/${artistId}?locale=${locale}`, {
				cache: "no-store",
			});

			if (!response.ok) {
				throw new Error("failed to fetch artist");
			}

			const data = (await response.json()) as ArtistResponse;
			setArtist(data.artist ?? null);
			setTopTracks(data.topTracks ?? []);
			setSimilarArtists(data.similarArtists ?? []);
		} catch (error) {
			console.error("failed to load artist", error);
			setArtist(null);
			setTopTracks([]);
			setSimilarArtists([]);
		} finally {
			setIsLoading(false);
		}
	}, [artistId, locale]);

	useEffect(() => {
		void fetchArtist();
	}, [fetchArtist]);

	const state = useMemo<ArtistState>(() => {
		return {
			artist,
			topTracks,
			similarArtists,
			isLoading,
		};
	}, [artist, isLoading, similarArtists, topTracks]);

	return {
		state,
		handlers: {
			refresh: fetchArtist,
		},
	};
};



