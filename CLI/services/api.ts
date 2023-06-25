import axios, { AxiosResponse, AxiosError } from 'axios';
import ListingModel from "../models/Listing";

interface QueryParams {
    page: number;
    user?: string,
    sort?: boolean
}

export const getListings = async (page : number, user?: string, sort?: boolean):  Promise<{ data: ListingModel[], count: number }> => {
    const apiUrl = process.env.BACKEND_HOST+'/listings';
    let queryParams: QueryParams = { page: page };
    if(user) {
        queryParams.user = user;
    }
    if(sort !== undefined){
        queryParams.sort = sort;
    } 

    return axios.get(apiUrl, {params: queryParams})
        .then((response: AxiosResponse) => {
            return response.data;
        })
        .catch((error: AxiosError) => {
            console.error('Error:', error.message);
        });
}


