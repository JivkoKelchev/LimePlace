export default interface ListingModel {
    id: number
    listingUid: string
    tokenId: number
    collection: string
    owner: string
    active: boolean
    price: number
    updated_at: number
}