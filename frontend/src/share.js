import axios from 'axios';
import config from './config';

const ax = axios.create({
    baseURL: config.API_URL,
    withCredentials: true,
});

export {
    ax as axios,
};