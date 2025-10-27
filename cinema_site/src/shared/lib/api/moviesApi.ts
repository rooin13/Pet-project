import { IMovie } from "@/entities/movie/model/types";
import axios from "axios";
import { BASE_URL } from "./apiClient";

export const getRandomMovie = async (): Promise<IMovie> => {
    try {
        const response = await axios.get(`${BASE_URL}movie/random`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch random movie:', error);
        throw error;
    }
};

export async function getTopMovies(): Promise<IMovie[]> {
    try {
        const response = await axios.get(`${BASE_URL}movie/top10`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch top movies:', error);
        throw error;
    }
}

// get curated top movies by search (for portfolio - quality movies!)
export async function getCuratedTopMovies(): Promise<IMovie[]> {
    const topMovieTitles = [
        "Interstellar",
        "The Dark Knight",
        "Inception",
        "The Shawshank Redemption",
        "Pulp Fiction",
        "Fight Club",
        "The Matrix",
        "Forrest Gump",
        "Requiem for a Dream",
        "The Godfather",
        "Schindler's List",
        "The Lord of the Rings",
        "Goodfellas",
        "Se7en",
        "The Silence of the Lambs",
        "Saving Private Ryan",
        "Parasite",
        "Whiplash",
        "The Prestige",
        "Memento",
        "The Departed",
        "Gladiator",
        "American Beauty",
        "Gone Girl",
        "Shutter Island",
        "Django Unchained",
        "The Green Mile",
        "A Beautiful Mind",
        "The Pianist",
        "Braveheart",
        "No Country for Old Men",
        "Casino",
        "The Truman Show",
        "Leon",
        "Oldboy",
        "Heat",
    ];

    try {
        const moviePromises = topMovieTitles.map(async (title) => {
            try {
                const response = await axios.get(`${BASE_URL}movie`, {
                    params: { title, count: 1 }
                });
                return response.data?.[0] || null;
            } catch (error) {
                console.error(`Failed to fetch ${title}:`, error);
                return null;
            }
        });

        const movies = await Promise.all(moviePromises);
        return movies.filter((movie): movie is IMovie => movie !== null);
    } catch (error) {
        console.error('Failed to fetch curated top movies:', error);
        throw error;
    }
}

export async function getMovieBySlug(slug: string): Promise<IMovie> {
    try {
        const decoded = decodeURIComponent(slug);
        const response = await axios.get(`${BASE_URL}movie`, {
            params: { title: decoded }
        });

        const movie = response.data[0];

        if (!movie) {
            throw new Error(`Movie not found: ${decoded}`);
        }

        return movie;
    } catch (error) {
        console.error('Failed to fetch movie by slug:', error);
        throw error;
    }
}

export async function getMovieByTitle(title: string): Promise<IMovie[]> {
    try {
        const response = await axios.get(`${BASE_URL}movie`, {
            params: {
                title,
                count: 5
            }
        });

        return response.data || [];
    } catch (error) {
        console.error('Failed to search movies by title:', error);
        throw error;
    }
}

