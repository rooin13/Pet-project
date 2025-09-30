import axios from 'axios';
import { getBaseUrl } from './getBaseUrl';
export const instance = axios.create({

    baseURL: `${getBaseUrl()}/api`,
    headers: {

        'Content-Type': 'application/json',
    },
})

