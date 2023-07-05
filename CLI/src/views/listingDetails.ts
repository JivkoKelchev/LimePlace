import {clearScreen, combineArt, getImage, padArt} from "../utils/view-utils";
import {convertUrlToHttp, Metadata} from "../services/ipfs";
import chalk from "chalk";
import {ethers} from "ethers";
import {ListingService} from "../services/listingService";
import CollectionModel from "../models/Collection";
import ListingModel from "../models/Listing";

export const renderListingDetails = async (
    imagePath: string, metadata: Metadata | null, listing: ListingModel, prevPrice?: number) => {
    await clearScreen();
    const image = await getImage(imagePath);
    const imageUrl = metadata ? convertUrlToHttp(metadata.image) : chalk.redBright('Invalid metadata');
    const name = metadata ? metadata.name : chalk.red('Invalid metadata');
    const description = metadata ? metadata.description :chalk.red('Invalid metadata');
    
    //check previous price
    const currentPrice = listing.price;
    let arrow = '';
    let prevPriceFormatted = '';
    if(prevPrice) {
        if(prevPrice && currentPrice > prevPrice) {
            arrow = '\u2191';
        }
        if(prevPrice && currentPrice < prevPrice) {
            arrow = '\u2193';
        }
        prevPriceFormatted = 'previous : ' + Number.parseFloat(prevPrice.toString()).toString() + ' ETH';
    }
    let updatedAt = listing.updated_at;
    let status = chalk.red('Inactive');
    if(ListingService.isListingExpired(updatedAt)) {
        status = chalk.red('Expired')
    } else if (listing.active) {
        status = chalk.greenBright('Active')
    }
    
    const expirationFormatted = ListingService.formatExpirationDate(updatedAt);
    const currentPriceFormatted = Number.parseFloat(currentPrice.toString()).toString() + ' ETH';
    let details  = `    Name        : ${name}\n\n`;
    details += `    Description : ${description}\n\n`;
    details += `    Collection  : ${listing.collection}\n\n`;
    details += `    Seller      : ${listing.owner}\n\n`;
    details += `    Price       : ${currentPriceFormatted} ${arrow} ${chalk.grey(prevPriceFormatted)}\n\n`;
    details += `    Expiration  : ${expirationFormatted}\n\n`;
    details += `    Status      : ${status}\n\n`;
    details += `    Listing UID : ${listing.listingUid}\n\n`;
    details += `    Image URL   : ${imageUrl}`;
    const paddedDetails = padArt(details, 20);
    console.log(combineArt(image, paddedDetails))
    console.log('')

}