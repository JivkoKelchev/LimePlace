import { ethers } from 'ethers';
import {ConfigService} from "@nestjs/config";

export const getProvider = (configService: ConfigService) => {
    //local provider
    const providerUrl = configService.get<string>('NETWORK_URL');
    return  new ethers.JsonRpcProvider(providerUrl);
    
};
