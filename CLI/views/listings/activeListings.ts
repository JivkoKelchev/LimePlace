import ListingModel from "../../models/Listing";
export const renderActiveListingsTable = (data: ListingModel[],page: number, count: number) => {
    console.log('--------------------------------------------------------')
    data.map((listing: ListingModel) => {
        console.log(listing.listingUid, listing.owner, listing.price)
    })
    console.log('--------------------------------------------------------')
    const totalPages = Math.ceil(count/5);
    console.log(`Page ${page}/${totalPages}`)
} 