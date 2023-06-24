import fs from 'fs'
import {NFTStorage, File} from "nft.storage";
import mime from "mime";
import {getFileNameFromPath} from "../utils/fs-utils";
import ConfigurationError from "../Errors/ConfigurationError";

export const uploadToIpfs = async (filePath: string, tokenName: string, tokenDescription: string) : Promise<string> => {
    if(process.env.NFT_STORAGE_KEY) {
        let nftStorageKey: string = process.env.NFT_STORAGE_KEY;
        // load the file from disk
        const image = await fileFromPath(filePath)
        // create a new NFTStorage client using API key
        const nftstorage = new NFTStorage({ token: nftStorageKey })

        const token = await nftstorage.store({
            image,
            name: tokenName,
            description: tokenDescription,
        })
        return token.url;
    } else {
        throw new ConfigurationError('NFT_STORAGE_KEY is not set in .env file')
    }
    
}

const fileFromPath = async (filePath: string) => {
    const content = await fs.promises.readFile(filePath);
    const type = mime.getType(filePath) ?? '';
    const fileName = getFileNameFromPath(filePath);
    return new File([content], fileName, { type: type })
}

export const convertUrlToHttp = (ipfsUrl: string) => {
    let cid = ipfsUrl.replace('ipfs://', '');
    const i = cid.lastIndexOf('/');
    const fileName = cid.substring(i + 1)
    cid = cid.replace('/' + fileName, '');
    // console.log( 'cid ',cid)
    // console.log( 'filename ', fileName)
    // console.log( 'https://' + cid + '.ipfs.dweb.link' + '/' + fileName)
    return 'https://' + cid + '.ipfs.dweb.link' + '/' + fileName
}