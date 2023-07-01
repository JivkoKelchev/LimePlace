import axios, { AxiosResponse, AxiosError } from 'axios';
import ListingModel from "../models/Listing";
import CollectionStatisticsModel from "../models/CollectionStatistics";
import {CollectionsFilter, CollectionsQuery, CollectionsSort} from "../utils/table-utils";

interface QueryParams {
    page: number;
    user?: string,
    sort?: boolean
}

interface QueryPramsCollections {
    page: number,
    active?: boolean,
    name?: string,
    floor?: number,
    floorGt?: number,
    floorLt?: number,
    volume?: number,
    volumeGt?: number,
    volumeLt?: number,
    owner?: string,
    sortFloor?: string,
    sortVolume?: string
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

export const getCollections = async (query: CollectionsQuery): Promise<{data: CollectionStatisticsModel[], count: number}> => {
    const apiUrl = process.env.BACKEND_HOST+'/collections';
    //parse query state to query string
    let queryParams: QueryPramsCollections = { page: query.page };
    
    //check for search query
    if(query.search) {
        queryParams.name = query.search
    }
    //check for filter query
    if(query.fileter.length > 0) {
        query.fileter.forEach((filter:CollectionsFilter) => {
            if(filter.owner) {
                queryParams.owner = filter.owner;
            }
            if(filter.floor) {
                if(filter.floor.startsWith('<')) {
                    queryParams.floorLt = Number.parseFloat(filter.floor.substring(1, filter.floor.length))
                }
                if(filter.floor.startsWith('>')) {
                    queryParams.floorGt = Number.parseFloat(filter.floor.substring(1, filter.floor.length))
                }
                if(filter.floor.startsWith('=')) {
                    queryParams.floor = Number.parseFloat(filter.floor.substring(1, filter.floor.length))
                }
            }
            if(filter.volume) {
                if(filter.volume.startsWith('<')) {
                    queryParams.volumeLt = Number.parseFloat(filter.volume.substring(1, filter.volume.length))
                }
                if(filter.volume.startsWith('>')) {
                    queryParams.volumeGt = Number.parseFloat(filter.volume.substring(1, filter.volume.length))
                }
                if(filter.volume.startsWith('=')) {
                    queryParams.volume = Number.parseFloat(filter.volume.substring(1, filter.volume.length))
                }
            }
        })
    }
    //check for sort query
    if(query.sort.length > 0) {
        query.sort.forEach((sort:CollectionsSort) => {
            if(sort.floor) {
                queryParams.sortFloor = sort.floor;
            }
            if(sort.volume) {
                queryParams.sortVolume = sort.volume;
            }
        })
    }
    




    return axios.get(apiUrl, {params: queryParams})
        .then((response: AxiosResponse) => {
            return response.data;
        })
        .catch((error: AxiosError) => {
            console.error('Error:', error.message);
        });
}


