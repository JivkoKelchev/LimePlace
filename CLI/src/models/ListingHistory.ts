export default interface HistoryModel {
    id: number
    listingUid: string
    tokenId: number
    active: true
    historyEvent: 'CREATE' | 'UPDATE' | 'SOLD'
    owner: string
    price: number
    updated_at: number
}