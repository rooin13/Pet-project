export const BASE_URL = "https://cinemaguide.skillbox.cc/"

import axios from "axios";

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});