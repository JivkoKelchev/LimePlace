import {clearScreen, combineArt, getImage, padArt} from "../utils/view-utils";
import {convertIpfsToHttps, getFileFromIpfs, Metadata} from "../services/ipfs";
import chalk from "chalk";
import {ListingService} from "../services/listingService";
import ListingModel from "../models/Listing";
import {Api} from "../services/api";
import {getNoImageFilePath} from "../utils/fs-utils";

export const renderListingDetails = async (metadata: Metadata | null, listing: ListingModel, prevPrice?: number) => {
    await clearScreen()
    let imagePath;
    let image;
    (!metadata) ? imagePath = getNoImageFilePath() : imagePath = await getFileFromIpfs(metadata.image);
    try{
        image = await getImage(imagePath);    
    } catch (err) {
        image = await getImage(getNoImageFilePath());
    }
    
    const imageUrl = metadata ? convertIpfsToHttps(metadata.image) : chalk.redBright('Invalid metadata');
    const name = metadata ? metadata.name : chalk.red('Invalid metadata');
    const description = metadata ? metadata.description :chalk.red('Invalid metadata');
    const collection = await Api.getCollection(listing.collection);
    if(!collection) {
        throw new Error('COLLECTION NOT FOUND! ' + listing.collection)
    }
    
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
    details += `    Collection  : ${collection.name} (${collection.symbol})\n\n`;
    details += `    Price       : ${currentPriceFormatted} ${arrow} ${chalk.grey(prevPriceFormatted)}\n\n`;
    details += `    Expiration  : ${expirationFormatted}\n\n`;
    details += `    Status      : ${status}\n\n`;
    details += `    Seller      : ${listing.owner}\n\n`;
    details += `    Token ID    : ${listing.tokenId}\n\n`;
    details += `    Listing UID : ${listing.listingUid}\n\n`;
    details += `    Image URL   : ${imageUrl}`;
    const paddedDetails = padArt(details, 20);
    console.log(combineArt(image, paddedDetails))
    console.log('')

}