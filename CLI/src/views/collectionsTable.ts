import CollectionModel from "../models/Collection";
import {clearScreen} from "../utils/view-utils";
import {getSdk} from "../controllers/connectionsController";
import {ethers} from "ethers";
import CollectionStatisticsModel from "../models/CollectionStatistics";

export const renderCollectionsTable = async (data: CollectionStatisticsModel[],page: number, count: number) => {
    await clearScreen();
    const sdk = await getSdk();
    const signerAddress = await sdk.getSignerAddress();
    console.log('Collection name               Floor price              7D change                7D Volume                   Owners')
    console.log('--------------------------------------------------------------------------------------------------------------------')
    data.map((collection: CollectionStatisticsModel) => {
        //todo implement proper pading function for tables
        console.log(
            collection.name + '                  ',
            collection.floor+ '                ',
            'change'+ '               ',
            collection.volume+ '                    ',
            collection.owner
        )
    })
    console.log('--------------------------------------------------------------------------------------------------------------------')
    const totalPages = Math.ceil(count/5);
    console.log(`Page ${page}/${totalPages}`)
    console.log('\n');
} 