import { ethers } from 'ethers';
import {ConfigService} from "@nestjs/config";

export const getProvider = (configService: ConfigService) => {
    //local provider
    const providerUrl = configService.get<string>('NETWORK_URL') + configService.get<string>('INFURA_KEY');
    return  new ethers.JsonRpcProvider(providerUrl);
    
};
