import { Injectable } from '@nestjs/common';
import { ethers, BigNumberish } from 'ethers';
import { getProvider } from '../ethers.provider';

@Injectable()
export class IndexerService {
    private readonly provider: ethers.JsonRpcProvider;
    private readonly contractAddress: string;
    private readonly contractABI: any;

    constructor() {
        console.log('Make sure hardhat local node is started!')
        this.provider = getProvider();
        //todo use real contract address
        this.contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
        //todo don't forget to update the abi
        this.contractABI =
            '[{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"_bookId","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"_copies","type":"uint256"}],"name":"LogBookAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"_bookId","type":"bytes32"},{"indexed":false,"internalType":"address","name":"_user","type":"address"}],"name":"LogBookBorrowed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"_bookId","type":"bytes32"},{"indexed":false,"internalType":"address","name":"_user","type":"address"}],"name":"LogBookReturned","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[{"internalType":"string","name":"_title","type":"string"},{"internalType":"string","name":"_author","type":"string"},{"internalType":"uint8","name":"_copies","type":"uint8"}],"name":"addBook","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"books","outputs":[{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"author","type":"string"},{"internalType":"uint256","name":"copies","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"booksCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_bookId","type":"bytes32"}],"name":"borrowBook","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_bookId","type":"bytes32"}],"name":"returnBook","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"showAvailableBooks","outputs":[{"internalType":"bytes32[]","name":"","type":"bytes32[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_bookId","type":"bytes32"}],"name":"showBookHistory","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"showBookHistoryByUser","outputs":[{"internalType":"bytes32[]","name":"","type":"bytes32[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_bookId","type":"bytes32"},{"internalType":"address","name":"_user","type":"address"}],"name":"showBookLog","outputs":[{"components":[{"internalType":"uint256","name":"borrowedTimestamp","type":"uint256"},{"internalType":"uint256","name":"returnedTimestamp","type":"uint256"}],"internalType":"struct Library.HistoryItem[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"showUserCurrentBooks","outputs":[{"internalType":"bytes32[]","name":"","type":"bytes32[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]';
    }

    async listenToEvents() {
        const contract = new ethers.Contract(
            this.contractAddress,
            this.contractABI,
            this.provider,
        );
        //log old events
        const LogBookAddedFilter = contract.filters.LogBookAdded();
        const events = await contract.queryFilter(LogBookAddedFilter);
        const iface = new ethers.Interface(this.contractABI);

        events.map((eventLog) => {
            const decodedArgs = iface.decodeEventLog(
                'LogBookAdded',
                eventLog.data,
            );
            console.log(decodedArgs);
        });

        contract.on(
            'LogBookAdded',
            async (bookId: string, copies: BigNumberish) => {
                console.log(
                    `LogBookAdded emitted \n Book id: ${bookId} \n Copies: ${copies}`,
                );
            },
        );
        
        //todo add all events!
    }
}
