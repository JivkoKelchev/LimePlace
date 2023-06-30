import ListingModel from "../models/Listing";
import {clearScreen} from "../utils/view-utils";
import {Column, Table} from "../utils/table-utils";
export const renderActiveListingsTable = async (data: ListingModel[],page: number, count: number) => {
    await clearScreen();
    const listingsTable = new Table();
    listingsTable.addColumn(new Column('Listing ID', 'TXT', 80, 'LEFT',  'listingUid'));
    listingsTable.addColumn(new Column('Seller', 'TXT', 40, 'LEFT', 'owner'));
    listingsTable.addColumn(new Column('Price', 'ETH', 20, "RIGHT", 'price'));
    listingsTable.addData(data);
    listingsTable.print(page, count);
    console.log('\n');
} 