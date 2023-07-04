export class ListingService {
    public static formatExpirationDate(updatedAt: number) : string {
        const expiration = new Date(Number(updatedAt) * 1000);
        expiration.setDate(expiration.getDate() + 30);
        let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(expiration);
        let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(expiration);
        let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(expiration);
        return `${day} ${month} ${year}`;
    }
    
    public static isListingExpired(updatedAt: number): boolean {
        const today = new Date();
        const expiration = new Date(Number(updatedAt) * 1000);
        expiration.setDate(expiration.getDate() + 30);
        return today > expiration;
    }

    public static getPaginationData = (listingCount: number, currentPage : number) => {
        let hasPrev = true;
        let hasNext = true;
        currentPage = currentPage??1;
        const pageCount = Math.ceil(listingCount / 10);
        if(pageCount === 0) {
            currentPage = 0;
        }
        if(currentPage === pageCount) {
            hasNext = false;
        }
        if(currentPage === 1 || currentPage === 0) {
            hasPrev = false;
        }

        return {currentPage, hasNext, hasPrev};
    }
}