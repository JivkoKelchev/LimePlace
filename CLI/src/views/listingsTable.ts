import ListingModel from "../models/Listing";
import {clearScreen} from "../utils/view-utils";
import {
    Column,
    HeaderIndicator, ListingsFilter,
    ListingsQueryState, ListingsSort,
    Table
} from "../utils/table-utils";
export const renderActiveListingsTable = async (
    data: ListingModel[],
    page: number, 
    count: number, 
    queryState: ListingsQueryState
) => {
    let collectionIndicator: HeaderIndicator = {};
    let ownerHeaderIndicator: HeaderIndicator = {};
    let priceHeaderIndicator: HeaderIndicator = {};
    if(queryState){
        //check for filter query
        if(queryState.fileter.length > 0) {
            queryState.fileter.forEach((filter:ListingsFilter) => {
                if(filter.owner) {
                    ownerHeaderIndicator.filterIndicator = true;
                }
                if(filter.price) {
                    priceHeaderIndicator.filterIndicator = true;
                }
                if(filter.collection) {
                    collectionIndicator.filterIndicator = true;
                }
            })
        }
        //check for sort query
        if(queryState.sort.length > 0) {
            queryState.sort.forEach((sort:ListingsSort) => {
                if(sort.price) {
                    priceHeaderIndicator.sortIndicator = sort.price;
                }
            })
        }
    }
    
    
    
    await clearScreen();
    const listingsTable = new Table();
    listingsTable.addColumn(new Column('ID', 'TXT', 5, 'LEFT',  'id'));
    listingsTable.addColumn(new Column('Listing UID', 'TXT', 15, 'LEFT',  'listingUid'));
    listingsTable.addColumn(new Column('Collection address', 'TXT', 44, 'LEFT', 'collection', collectionIndicator));
    listingsTable.addColumn(new Column('Token ID', 'TXT', 8, 'LEFT',  'tokenId'));
    listingsTable.addColumn(new Column('Seller', 'TXT', 44, 'LEFT', 'owner', ownerHeaderIndicator));
    listingsTable.addColumn(new Column('Price', 'ETH', 10, "RIGHT", 'price', priceHeaderIndicator));
    listingsTable.addData(data);
    listingsTable.print(page, count);
    console.log('\n');
} 