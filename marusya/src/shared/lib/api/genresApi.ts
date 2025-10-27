import axios from "axios";
import { BASE_URL } from "./apiClient";
import { IMovie } from "@/entities/movie/model/types";

export const getGenres = async (): Promise<string[]> => {
    try {
        const response = await axios.get(`${BASE_URL}movie/genres`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch genres:', error);
        throw error;
    }
};

export async function getMovieByGenre(genre: string, page: number = 1): Promise<IMovie[]> {
    try {
        const response = await axios.get(`${BASE_URL}movie`, {
            params: {
                page,
                genre,
                count: 20
            }
        });
        return response.data || [];
    } catch (error) {
        console.error(`Failed to fetch movies by genre ${genre}:`, error);
        throw error;
    }
}

