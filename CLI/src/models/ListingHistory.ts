export default interface HistoryModel {
    id: number
    listingUid: string
    tokenId: number
    active: true
    historyEvent: 'CREATE' | 'EDIT' | 'SOLD' | 'CANCEL'
    owner: string
    price: number
    updated_at: number
}