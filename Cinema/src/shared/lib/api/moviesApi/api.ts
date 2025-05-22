import { IMovie } from "@/entities/movie/model/types";
import axios from "axios";
import { BASE_URL } from "../api";

export const getRandomMovie = async () => {
    try {
        const response = await axios.get(`${BASE_URL}movie/random`);
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении случайного фильма:', error);
        throw error;
    }
};




export async function getTopMovies(): Promise<IMovie[]> {
    const response = await axios.get(`${BASE_URL}movie/top10`);
    return response.data;
}

export async function getMovieBySlug(slug: string): Promise<IMovie> {

    const decoded = slug.replaceAll("%20", " ");
    const response = await axios.get(`${BASE_URL}movie`, {
        params: { title: decoded }
    });
    const movie = response.data[0]

    return movie;
}


export async function getMovieByTitle(title: string): Promise<IMovie> {

    const response = await axios.get(`${BASE_URL}movie`, {
        params: {
            title: title,
            count: 5
        }

    });
    const movies = response.data

    return movies;
}