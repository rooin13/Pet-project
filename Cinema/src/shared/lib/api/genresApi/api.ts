import axios from "axios"
import { BASE_URL } from "../api"
import { IMovie } from "@/entities/movie/model/types"

export const getGenres = async (): Promise<string[]> => {
    const response = await axios.get(`${BASE_URL}movie/genres`)
    return response.data
}


export async function getMovieByGenre(genre: string, page: number): Promise<IMovie[]> {

    const response = await axios.get(`${BASE_URL}movie`, {
        params: {
            page: page,
            genre: genre,
            count: 60
        }

    });
    const movies = response.data

    return movies;
}