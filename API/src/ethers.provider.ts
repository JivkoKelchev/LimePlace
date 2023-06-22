import { ethers } from 'ethers';

export const getProvider = () => {
    //local provider 

    // //docker env
    // const providerUrl = 'http://host.docker.internal:8545';
    // return new ethers.JsonRpcProvider(providerUrl);

    //local env
    const providerUrl = 'http://127.0.0.1:8545';
    return  new ethers.JsonRpcProvider(providerUrl);
    
};
