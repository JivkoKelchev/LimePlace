import ListingModel from "../models/Listing";
import {getSdk} from "../controllers/connectionController";
import {clearScreen} from "../utils/view-utils";
import chalk from "chalk";
export const renderActiveListingsTable = async (data: ListingModel[],page: number, count: number) => {
    await clearScreen();
    const sdk = await getSdk();
    const signerAddress = await sdk.getSignerAddress();
    console.log('Listing ID                                                         Seller address                             Price')
    console.log('-------------------------------------------------------------------------------------------------------------------')
    data.map((listing: ListingModel) => {
        console.log(
            listing.listingUid, 
            listing.owner === signerAddress? "my listing                                " : listing.owner, 
            chalk.red.strikethrough(listing.price)
        )
    })
    console.log('--------------------------------------------------------------------------------------------------------------------')
    const totalPages = Math.ceil(count/5);
    console.log(`Page ${page}/${totalPages}`)
    console.log('\n');
} 