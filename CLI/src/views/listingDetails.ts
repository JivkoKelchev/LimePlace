import {clearScreen, combineArt, getImage, padArt, printImage} from "../utils/view-utils";
import {convertUrlToHttp, Metadata} from "../services/ipfs";
import chalk from "chalk";
import {ethers} from "ethers";

export const renderListingDetails = async (imagePath: string, metadata: Metadata, listingInfo: any, prevPrice?: number) => {
    await clearScreen();
    //todo calculate expiration date from updated_at and update status
    const date = new Date(Number(listingInfo[5]) * 1000);
    const image = await getImage(imagePath);
    const imageUrl = convertUrlToHttp(metadata.image);
    
    //check previous price
    const currentPrice = Number(ethers.formatEther(listingInfo[3]));
    let arrow = '';
    let prevPriceFormatted = '';
    if(prevPrice) {
        if(prevPrice && currentPrice > prevPrice) {
            arrow = '\u2191'; // up
        }
        if(prevPrice && currentPrice < prevPrice) {
            arrow = '\u2193';
        }
        prevPriceFormatted = 'previous : ' + Number.parseFloat(prevPrice.toString()).toString() + ' ETH';
    }
    
    // listingInfo[3] = BigInt('1000000000000000');
    // console.log('\u2191 \u2193 \u2192 \u2666 \u2611')
    const currentPriceFormatted = Number.parseFloat(currentPrice.toString()).toString() + ' ETH';
    let details  = `    Name        : ${metadata.name}\n\n`;
    details += `    Description : ${metadata.description}\n\n`;
    details += `    Collection  : ${listingInfo[0]}\n\n`;
    details += `    Seller      : ${listingInfo[2]}\n\n`;
    details += `    Price       : ${currentPriceFormatted} ${arrow} ${chalk.grey(prevPriceFormatted)}\n\n`;
    details += `    Expiration  : ${date.toLocaleString()}\n\n`;
    details += `    Status      : ${listingInfo[3] ? chalk.greenBright('Active') : chalk.red('Canceled')}\n\n`;
    details += `    Image URL   : ${imageUrl}`;
    const paddedDetails = padArt(details, 20);
    console.log(combineArt(image, paddedDetails))
    console.log('')

}