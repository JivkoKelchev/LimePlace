import fs from 'fs'
import {File, NFTStorage} from "nft.storage";
import mime from "mime";
import {getFileNameFromPath, getNoImageFilePath} from "../utils/fs-utils";
import ConfigurationError from "../errors/ConfigurationError";
import axios from "axios";
import tmp from "tmp";
import chalk from "chalk";

export interface Metadata {
    name: string,
    description: string
    image: string
}

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

export const getFileFromIpfs = async (ipfsUrl: string) : Promise<string> => {
    const httpUrl = convertIpfsToHttps(ipfsUrl);
    if(httpUrl === ''){
        return getNoImageFilePath();
    }
    const response = await axios.get(httpUrl, { responseType: 'arraybuffer' });

    // Generate a temporary file name and create the temporary file
    const tempFile = tmp.fileSync();

    // Write the response data to the temporary file
    fs.writeFileSync(tempFile.name, response.data);

    return tempFile.name;
}

export const getMetaDataFromIpfs = async (ipfsUrl: string) : Promise<Metadata | null> => {
    const httpUrl = convertIpfsToHttps(ipfsUrl);
    try {
        const response = await axios.get(httpUrl, {responseType: 'json'});
        return response.data;
    } catch (err) {
        console.log(chalk.redBright('Unable to read metadata...'));
        return null;
    }
    
}

const fileFromPath = async (filePath: string) => {
    const content = await fs.promises.readFile(filePath);
    const type = mime.getType(filePath) ?? '';
    const fileName = getFileNameFromPath(filePath);
    return new File([content], fileName, { type: type })
}

export const convertIpfsToHttps = (ipfsUrl: string) => {
    //try to extract cid from url
    let cidArr = ipfsUrl.match(/(Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,})/)
    if( cidArr && cidArr.length > 0) {
        const cid = cidArr[0];
        const i = ipfsUrl.lastIndexOf('/');
        const fileNameArr = ipfsUrl.match(/([^/]+(\.json$)|[^/]+(\.png$)|[^/]+(\.jpg$)|[^/]+(\.gif$))/)
        
        let url = 'https://ipfs.io/ipfs/' + cid
        if(fileNameArr && fileNameArr.length > 0) {
            url += '/' + fileNameArr[0];
        }
        return url;
        //subdomain gateway
        //return 'https://' + cid + '.ipfs.dweb.link' + '/' + fileName
    }
    return '';
}