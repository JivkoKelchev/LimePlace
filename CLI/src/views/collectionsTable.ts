import {clearScreen} from "../utils/view-utils";
import CollectionStatisticsModel from "../models/CollectionStatistics";
import {
    CollectionsQueryState,
    CollectionsFilter,
    CollectionsSort,
    Column,
    HeaderIndicator,
    Table
} from "../utils/table-utils";


export const renderCollectionsTable = async (
    data: CollectionStatisticsModel[],
    page: number, 
    totalCount: number,
    query?: CollectionsQueryState
) => {
    await clearScreen();
    
    let ownerHeaderIndicator: HeaderIndicator = {};
    let floorHeaderIndicator: HeaderIndicator = {};
    let volumeHeaderIndicator: HeaderIndicator = {};
    let listingsHeaderIndicator: HeaderIndicator = {};
    
    if(query){
        //check for search query
        query.search != null ? console.log('COLLECTIONS: "' + query.search +'"') : console.log('COLLECTIONS:');
        //check for filter query
        if(query.fileter.length > 0) {
            query.fileter.forEach((filter:CollectionsFilter) => {
                if(filter.owner) {
                    ownerHeaderIndicator.filterIndicator = true;
                }
                if(filter.floor) {
                    floorHeaderIndicator.filterIndicator = true;
                }
                if(filter.volume) {
                    volumeHeaderIndicator.filterIndicator = true;
                }
            })
        }
        //check for sort query
        if(query.sort.length > 0) {
            query.sort.forEach((sort:CollectionsSort) => {
                if(sort.floor) {
                    floorHeaderIndicator.sortIndicator = sort.floor;
                }
                if(sort.volume) {
                    volumeHeaderIndicator.sortIndicator = sort.volume;
                }
                if(sort.listings) {
                    listingsHeaderIndicator.sortIndicator = sort.listings
                }
            })
        }
    }
    
    
    const collectionTable = new Table();
    collectionTable.addColumn( new Column('Name', 'TXT',  15, 'LEFT', 'name'));
    collectionTable.addColumn( 
        new Column('Floor', 'ETH', 10, 'RIGHT', 'floor', floorHeaderIndicator)
    );
    collectionTable.addColumn( 
        new Column('Volume', 'ETH', 10, 'RIGHT', 'volume', volumeHeaderIndicator)
    );
    collectionTable.addColumn(
        new Column('Listings', 'TXT', 10, 'LEFT', 'listings', listingsHeaderIndicator
        )
    );
    collectionTable.addColumn( 
        new Column('Owners', 'TXT',  44, 'LEFT', 'owner', ownerHeaderIndicator)
    );
    collectionTable.addData(data);
    collectionTable.print(page, totalCount);
    console.log('\n');
} 