import axios, { AxiosResponse, AxiosError } from 'axios';
import ListingModel from "../models/Listing";

export const getListings = async (page? : number): Promise<{ data: ListingModel[], count: number }> => {
    const apiUrl = process.env.BACKEND_HOST+'/listings';
    const pagination = {page: page};
    pagination.page = page ?? 1;

    return axios.get(apiUrl, {params: pagination})
        .then((response: AxiosResponse) => {
            return response.data;
        })
        .catch((error: AxiosError) => {
            console.error('Error:', error.message);
        });
}


