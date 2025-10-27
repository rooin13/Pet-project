import axios from "axios";
import { BASE_URL } from "../common/api";


export async function getFavorites() {

    const response = await axios.get(`${BASE_URL}favorites`, {
    });

    return response.data;
}



export async function postFavorites(id: number) {
    const response = await axios.post(
        `${BASE_URL}favorites`,
        `id=${id}`,
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            withCredentials: true,
        }
    );

    return response.data;
}



export async function deleteFavorites(id: number) {

    const response = await axios.delete(
        `${BASE_URL}favorites/${id}`,
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            withCredentials: true,
        }
    );

    return response.data;
}

