import axios, { AxiosResponse, AxiosError } from 'axios';
import ListingModel from "../models/Listing";
import CollectionStatisticsModel from "../models/CollectionStatistics";
import {
    CollectionsFilter,
    CollectionsQueryState,
    CollectionsSort,
    ListingsFilter,
    ListingsQueryState, ListingsSort
} from "../utils/table-utils";
import CollectionModel from "../models/Collection";
import HistoryModel from "../models/ListingHistory";
import {ListingHistory} from "../../../API/src/listingsHistory/listingHistory.entity";

interface QueryParamsListings {
    page: number;
    active?: boolean;
    price?: number;
    priceGt?: number;
    priceLt?: number;
    owner?: string;
    sortPrice?: string;
    collection?: string;
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
    sortVolume?: string,
    sortListings?: string
}

export const getListings = async (query: ListingsQueryState):  Promise<{ data: ListingModel[], count: number }> => {
    const apiUrl = process.env.BACKEND_HOST+'/listings';
    //parse query state to query string
    let queryParams: QueryParamsListings = { page: query.page };
    
    //check for filter query
    if(query.fileter.length > 0) {
        query.fileter.forEach((filter:ListingsFilter) => {
            if(filter.owner) {
                queryParams.owner = filter.owner;
            }
            if(filter.collection) {
                queryParams.collection = filter.collection;
            }
            if(filter.price) {
                if(filter.price.startsWith('<')) {
                    queryParams.priceLt = Number.parseFloat(filter.price.substring(1, filter.price.length))
                }
                if(filter.price.startsWith('>')) {
                    queryParams.priceGt = Number.parseFloat(filter.price.substring(1, filter.price.length))
                }
                if(filter.price.startsWith('=')) {
                    queryParams.price = Number.parseFloat(filter.price.substring(1, filter.price.length))
                }
            }
        })
    }
    //check for sort query
    if(query.sort.length > 0) {
        query.sort.forEach((sort:ListingsSort) => {
            if(sort.price) {
                queryParams.sortPrice = sort.price;
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

export const getCollections = async (query: CollectionsQueryState): Promise<{data: CollectionStatisticsModel[], count: number}> => {
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
            if(sort.listings) {
                queryParams.sortListings = sort.listings;
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

export const getCollection = async (collectionAddress: string) => {
    const apiUrl = process.env.BACKEND_HOST+'/collections/' + collectionAddress;
    return axios.get<CollectionModel>(apiUrl)
        .then((response: AxiosResponse) => {
            return response.data;
        })
        .catch((error: AxiosError) => {
            console.error('Error:', error.message);
        });
}

export const getListingHistory = async (listingId: string, historyEvent?: 'CREATE' | 'EDIT' | 'SOLD') 
    : Promise<{ data: HistoryModel[], count: number }>  => 
{
    const apiUrl = process.env.BACKEND_HOST+'/listings-history/' + listingId;
    let response: Promise<AxiosResponse>;
    if(historyEvent) {
        response = axios.get<HistoryModel>(apiUrl, { params : {event: historyEvent}} );
    } else {
        response = axios.get<HistoryModel>(apiUrl)
    }
    return response.then((response: AxiosResponse) => {
        return response.data;
    })
    .catch((error: AxiosError) => {
        console.error('Error:', error.message);
    });
}
