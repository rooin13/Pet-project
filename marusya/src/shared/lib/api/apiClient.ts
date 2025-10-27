import axios from "axios";

export const BASE_URL = "https://cinemaguide.skillbox.cc/";

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

