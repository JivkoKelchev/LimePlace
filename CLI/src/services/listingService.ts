
export const getPaginationData = (listingCount: number, currentPage : number) => {
    let hasPrev = true;
    let hasNext = true;
    currentPage = currentPage??1;
    const pageCount = Math.ceil(listingCount / 5);
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