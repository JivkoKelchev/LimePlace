import {selectImagePrompt } from "../views/menu/listings/selectImagePrompt";
import {homeAction} from "./homeController";
import {getSdk} from "./connectionController";
import {printImage} from "../utils/view-utils";
import {confirmPrompt} from "../views/genericUI/confirmationPrompt";
import {convertIpfsToHttps, getFileFromIpfs, getMetaDataFromIpfs, uploadToIpfs} from "../services/ipfs";
import Spinner from "../views/genericUI/spinner";
import {infoMsg} from "../views/genericUI/infoMsg";
import {Api} from "../services/api";
import {renderActiveListingsTable} from "../views/listingsTable";
import {activeListingsMenu} from "../views/menu/listings/listingsTableMenu";
import {openListingPrompt} from "../views/menu/listings/openListingPrompt";
import {listingPageMenu} from "../views/menu/listings/listingPageMenu";
import {renderListingDetails} from "../views/listingDetails";
import {editListingPrompt} from "../views/menu/listings/editListingPricePrompt";
import {ListingService} from "../services/listingService";
import {ethers} from "ethers";
import {
    ADD_LISTING_MENU_ITEM,
    BACK_MENU_ITEM,
    BUY_NFT_MENU_ITEM,
    CANCEL_LISTING_MENU_ITEM,
    CLEAR_QUERY_MENU_ITEM,
    CREATE_NEW_COLLECTION_MENU_ITEM,
    EDIT_PRICE_MENU_ITEM,
    FILTER_BY_COLLECTION_MENU_ITEM,
    FILTER_BY_PRICE_MENU_ITEM,
    FILTER_BY_SELLER_MENU_ITEM,
    LIST_EXISTING_TOKEN_MENU_ITEM,
    MAIN_MENU_ITEM,
    MY_LISTINGS_MENU_ITEM,
    NEXT_PAGE_MENU_ITEM,
    PREV_PAGE_MENU_ITEM, REFRESH_MENU_ITEM,
    SEARCH_MENU_ITEM,
    SORT_BY_PRICE_MENU_ITEM,
    USE_EXISTING_COLLECTION_MENU_ITEM,
    VIEW_LISTING_MENU_ITEM
} from "../views/menu/menuItemsConstants";
import {createNewMenu} from "../views/menu/createNewMenu";
import {collectionNamePrompt, collectionSymbolPrompt} from "../views/menu/collections/collectionNamePrompt";
import {useCollectionPrompt} from "../views/menu/collections/useCollectionPrompt";
import {listingsQueryMenu} from "../views/menu/listings/listingsQueryMenu";
import { ListingsQueryState} from "../utils/table-utils";
import {filterPrompt} from "../views/menu/query/filterPrompt";
import {sortPrompt} from "../views/menu/query/sortPrompt";
import {useTokenPrompt} from "../views/menu/listings/useTokenPrompt";
import {listingPricePrompt} from "../views/menu/listings/listingPricePrompt";
import ListingModel from "../models/Listing";
import {listingNamePrompt} from "../views/menu/listings/listingNamePrompt";
import {listingDescriptionPrompt} from "../views/menu/listings/listingDescriptioinPrompt";
import {transactionWarning} from "../utils/common-utils";
import {collectionsAction} from "./collectionsController";
import chalk from "chalk";

let queryState: ListingsQueryState = {
    page: 1,
    search: null,
    sort: [],
    fileter: []
}

export const listingsAction = async () => {

    //render page
    const data = await Api.getListings(queryState); //get active listings from API
    await renderActiveListingsTable(data.data, queryState.page, data.count, queryState)
    let {currentPage, hasNext, hasPrev} = ListingService.getPaginationData(data.count, queryState.page??1)
    const actionInput = await activeListingsMenu(hasNext, hasPrev);
    
    //redirect to actions
    switch (actionInput.menu) {
        case REFRESH_MENU_ITEM: {
            //refresh users balance
            const sdk = await getSdk();
            await sdk.getBalance(true);
            await listingsAction();
            break;
        }
        case NEXT_PAGE_MENU_ITEM: {
            queryState.page = currentPage + 1;
            await listingsAction();
            break;
        }
        case PREV_PAGE_MENU_ITEM: {
            queryState.page = currentPage - 1;
            await listingsAction();
            break;
        }
        case VIEW_LISTING_MENU_ITEM: {
            await loadViewListingPrompt();
            break;
        }
        case MY_LISTINGS_MENU_ITEM: {
            const sdk = await getSdk();
            const signerAddress = await sdk.getSignerAddress();
            queryState.fileter.push({owner: signerAddress})
            await listingsAction();
            break;
        }
        case SEARCH_MENU_ITEM: {
            await listingsQueryAction();
            break;
        }
        case ADD_LISTING_MENU_ITEM: {
            await createNewAction();
            break;
        }
        case MAIN_MENU_ITEM: 
        default:
        {
            await homeAction();
            break;
        }
    }
}

const listingsQueryAction = async () => {
    const query = await listingsQueryMenu();
    switch (query.menu) {
        case FILTER_BY_PRICE_MENU_ITEM: {
            await filterPriceAction();
            break;
        }
        case FILTER_BY_SELLER_MENU_ITEM: {
            await filterOwnerAction();
            break;
        }
        case FILTER_BY_COLLECTION_MENU_ITEM: {
            await filterCollectionActions();
            break;
        }
        case SORT_BY_PRICE_MENU_ITEM: {
            await sortPriceActions();
            break;
        }
        case CLEAR_QUERY_MENU_ITEM: {
            await clearQueryAction();
            break;
        }
        case BACK_MENU_ITEM: 
        default: {
            await listingsAction();
            break;
        }

    }
} 

export const loadViewListingPrompt = async () => {
    const listingIdInput = await openListingPrompt();
    if(listingIdInput.id === '<') {
        await listingsAction();
    }
    //check if listing exist 
    const listing = await Api.getListing(Number(listingIdInput.id));
    if(listing) {
        await viewListingAction(listing);
    } else {
        await infoMsg(chalk.yellow(`Listing with id: ${listingIdInput.id} is not found`), true);
        await listingsAction();
    }
}

export const viewListingAction = async (listing: ListingModel) => {
    //render page
    const listingUID = listing.listingUid;
    const sdk = await getSdk();
    const tokenUri = await sdk.getLimePlaceNFTTokenUri(listing.collection,BigInt(listing.tokenId));
    //get previous price
    let previousPrice;
    const priceEdits = await Api.getListingHistory(listingUID, 'EDIT');
    if(priceEdits.data.length === 1) {
        const createEvent = await Api.getListingHistory(listingUID, 'CREATE')
        previousPrice = createEvent.data[0].price;
    } else if(priceEdits.data.length > 1) {
        previousPrice = priceEdits.data[1].price;
    }
    const metadata = await getMetaDataFromIpfs(tokenUri);
    await renderListingDetails(metadata, listing, previousPrice);
    const signerAddress = await sdk.getSignerAddress();
    const actionInput = await listingPageMenu(listing, signerAddress);
    
    // redirect to actions
    switch (actionInput.menu) {
        case EDIT_PRICE_MENU_ITEM: {
            await transactionWarning();
            const newPriceInput = await editListingPrompt();
            if(newPriceInput.price === '<') {
                await viewListingAction(listing);
            }
            const spinner = new Spinner('Changing price')
            const newPrice = ethers.parseEther(newPriceInput.price.toString());
            await sdk.editListing(listingUID, newPrice)
            await sdk.getBalance(true);
            spinner.stopSpinner();

            await infoMsg('The price is changed. Updates will be available soon...', true);
            await viewListingAction(listing);
            break;
        }
        case CANCEL_LISTING_MENU_ITEM: {
            await transactionWarning();
            const confirm = await confirmPrompt('Do you want to cancel listing?');
            if(confirm) {
                const spinner = new Spinner('Cancel listing')
                await sdk.cancelListing(listingUID);
                await sdk.getBalance(true)
                spinner.stopSpinner();
                await infoMsg('Your listing is canceled. Updates will be available soon...', true);
            }
            await viewListingAction(listing);
            break;
        }
        case BUY_NFT_MENU_ITEM: {
            await transactionWarning();
            const confirm = await confirmPrompt('Do you want to buy?');
            if(confirm) {
                const spinner = new Spinner('Transfer NFT')
                await sdk.buy(listingUID);
                await sdk.getBalance();
                spinner.stopSpinner();
            }

            await infoMsg('Token has been transferred. Updates will be available soon...', true);
            await listingsAction();
            break;
        }
        case BACK_MENU_ITEM:
        default: {
            await listingsAction();
        }
    }
}

export const createNewAction = async () => {
    const collectionSelectionInput = await createNewMenu();
    switch (collectionSelectionInput.menu) {
        case CREATE_NEW_COLLECTION_MENU_ITEM: {
            const collectionName = await collectionNamePrompt();
            if(collectionName.name === '<' ) {
                await homeAction();
            }
            const collectionSymbol = await collectionSymbolPrompt();
            if(collectionSymbol.symbol === '<') {
                await homeAction();
            }
            await newCollectionAction(collectionName.name, collectionSymbol.symbol);
            break;
        }
        case USE_EXISTING_COLLECTION_MENU_ITEM: {
            const collectionAddress = await useCollectionPrompt();
            if(collectionAddress.address === '<') {
                await collectionsAction();
            }
            //check if collection exist
            collectionAddress.address = collectionAddress.address.trim();
            const collectionData = await Api.getCollection(collectionAddress.address);
            if(!collectionData) {
                await infoMsg(chalk.yellow(`Collection with address: ${collectionAddress.address} is not found`), true);
                await collectionsAction();
            }
            
            await mintAndListInExistingCollectionAction(collectionAddress.address);
            break;
        }
        case LIST_EXISTING_TOKEN_MENU_ITEM: {
            const collectionAddress = await useCollectionPrompt();
            if(collectionAddress.address === '<') {
                await homeAction();
            }
            const tokenId = await useTokenPrompt();
            if(tokenId.id === '<') {
                await homeAction();
            }
            const price = await listingPricePrompt();
            if(price.price === '<') {
                await homeAction();
            }
            await listExistingTokenAction(
                collectionAddress.address, 
                BigInt(tokenId.id), 
                parseFloat(Number(price.price).toString())
            );
            break;
        }
        case BACK_MENU_ITEM: {
            await homeAction();
            break;
        }
        default: {
            return;
        }
    }
}

const mintAndListInExistingCollectionAction = async (tokenAddress: string) => {
    const sdk = await getSdk();
    //prompt for a image 
    const imagePathInput = await selectImagePrompt();
    if(imagePathInput.filePath === '<') {
        await homeAction();
    }
    await printImage(imagePathInput.filePath)
    let confirm = await confirmPrompt('Do you want to proceed?');
    if(!confirm) {
        await homeAction();
    }
    
    const nameInput = await listingNamePrompt();
    if(nameInput.name === '<') {
        return await homeAction(); 
    }
    const descriptionInput = await listingDescriptionPrompt();
    if(descriptionInput.description === '<') {
        return await homeAction();
    }
    const priceInput = await listingPricePrompt();
    if(priceInput.price === '<') {
        return await homeAction();
    }
    const price = Number(priceInput.price);

    //upload image to ipfs
    let spinner = new Spinner('Image is uploading...');
    //test url
    //const url = 'ipfs://bafyreihkp6fmltozum33pjhohawd6chpevovxpbkuc7ftbvygvhyixtwfu/metadata.json'
    const url = await uploadToIpfs(imagePathInput.filePath, nameInput.name, descriptionInput.description);
    spinner.stopSpinner();
    await infoMsg(`Metadata url: ${convertIpfsToHttps(url)}`);

    await transactionWarning();
    confirm = await confirmPrompt('Do you want to continue?')
    if (!confirm) {
        await collectionsAction();
    }
    //mint
    spinner = new Spinner('Minting');
    const tokenId = await sdk.mintNft(tokenAddress, url);
    spinner.stopSpinner();
    
    //approve
    spinner = new Spinner('Approve');
    await sdk.approve(tokenAddress);
    spinner.stopSpinner();

    //list
    spinner = new Spinner('Listing')
    await sdk.list(tokenAddress, tokenId, ethers.parseEther(price.toString()) )
    await sdk.getBalance(true);
    spinner.stopSpinner();
    
    await infoMsg('Token is listed. Your listing should be available soon...', true);
    await listingsAction();
}

export const listExistingTokenAction = async (tokenAddress: string, tokenId: BigInt, price:number) => {
    const spinner = new Spinner('Listing')
    const sdk = await getSdk();
    await sdk.approve(tokenAddress);
    await sdk.list(tokenAddress, tokenId, ethers.parseEther(price.toString()))
    spinner.stopSpinner();
    
    await infoMsg('Token is listed. Your listing should be available soon...', true);
    await listingsAction();
}

const newCollectionAction = async (collectionName: string, collectionsSymbol: string) => {
    await transactionWarning();
    const confirm = await confirmPrompt('Do you want to continue?')
    if(!confirm) {
        await homeAction();
    }
    const sdk = await getSdk();
    const spinner = new Spinner('Creating collection')
    const tokenAddress = await sdk.createERC721Collection(collectionName, collectionsSymbol);
    await sdk.getBalance(true);
    spinner.stopSpinner();

    await infoMsg('New collection is created! Adr: ' + tokenAddress, true);
    //render view listing view --- or home menu
    await collectionsAction();
}


const filterPriceAction = async () => {
    const name = await filterPrompt();
    if(name.query === '<') {
        await listingsAction();
    }

    queryState.fileter.push({price: name.query})
    await listingsAction();
}

const filterOwnerAction = async () => {
    const name = await filterPrompt();
    if(name.query === '<') {
        await listingsAction();
    }

    queryState.fileter.push({owner: name.query})
    await listingsAction();
}

const filterCollectionActions = async () => {
    const name = await filterPrompt();
    if(name.query === '<') {
        await listingsAction();
    }

    queryState.fileter.push({collection: name.query})
    await listingsAction();
}

const sortPriceActions = async () => {
    const name = await sortPrompt();
    if(name.query === '<') {
        await listingsAction();
    }
    if(name.query.toUpperCase() === 'DESC' ) {
        queryState.sort.push({ price: 'DESC' })
    }

    if(name.query.toUpperCase() === 'ASC' ) {
        queryState.sort.push({ price: 'ASC' })
    }
    
    await listingsAction();
}

const clearQueryAction = async () => {
    const confirm = await confirmPrompt('Clear all filters, sorts and searches?')

    if(confirm) {
        queryState = {
            page: 1,
            search: null,
            sort: [],
            fileter: []
        }
    }

    await listingsAction();
}

