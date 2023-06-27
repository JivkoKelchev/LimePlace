import {combineArt, getImage, padArt, printImage} from "../utils/view-utils";
import {Metadata} from "../services/ipfs";

export const renderListingDetails = async (imagePath: string, metadata: Metadata, listingInfo: any) => {
    //todo calculate expiration date from updated_at
    const date = new Date(Number(listingInfo[5]) * 1000);
    const image = await getImage(imagePath);
    let details  = `    Name         : ${metadata.name}\n\n`;
    details += `    Description  : ${metadata.description}\n\n`;
    details += `    Collection   : ${listingInfo[0]}\n\n`;
    details += `    Seller       : ${listingInfo[2]}\n\n`;
    details += `    Price        : ${listingInfo[3]}\n\n`;
    details += `    Expiration   : ${date.toLocaleString()}`;
    const paddedDetails = padArt(details, 20);
    console.log(combineArt(image, paddedDetails))
    console.log('')

}