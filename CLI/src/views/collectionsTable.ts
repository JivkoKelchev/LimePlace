import {clearScreen} from "../utils/view-utils";
import {getSdk} from "../controllers/connectionController";
import CollectionStatisticsModel from "../models/CollectionStatistics";
import {Column, Table} from "../utils/table-utils";

export const renderCollectionsTable = async (data: CollectionStatisticsModel[],page: number, totalCount: number) => {
    await clearScreen();
    const collectionTable = new Table();
    collectionTable.addColumn( new Column('Collection name', 'TXT',  30, 'LEFT', 'name'));
    collectionTable.addColumn( new Column('Floor price', 'ETH', 20, 'RIGHT', 'floor'));
    collectionTable.addColumn( new Column('Volume', 'ETH', 20, 'RIGHT', 'volume'));
    collectionTable.addColumn( new Column('Owners', 'TXT',  40, 'LEFT', 'owner'));
    collectionTable.addData(data);
    collectionTable.print(page, totalCount);
    console.log('\n');
} 