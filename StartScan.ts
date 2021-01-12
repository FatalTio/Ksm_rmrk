import {Kusama} from "./classes/Blockchains/Kusama";
import {Polkadot} from "./classes/Blockchains/Polkadot";
import {Unique} from "./classes/Blockchains/Unique";
import {ScanBlock} from "./Kusama/ScanBlock";
import {Option} from "commander";
import {Send} from "./classes/Rmrk/Interactions/Send";
import {Mint} from "./classes/Rmrk/Interactions/Mint";
import {SandraManager} from "./sandra/src/SandraManager";
import {KusamaBlockchain} from "./sandra/src/CSCannon/Kusama/KusamaBlockchain";
import {BlockchainAddress} from "./sandra/src/CSCannon/BlockchainAddress";
import {BlockchainContract} from "./sandra/src/CSCannon/BlockchainContract";
import {BlockchainEvent} from "./sandra/src/CSCannon/BlockchainEvent";
import {Gossiper} from "./sandra/src/Gossiper";
const fs = require('fs');
const path = require('path');



export const testScan = async (opts: Option) => {

    let blockchain;

    // @ts-ignore
    switch (opts.chain.toLowerCase()){

        case "polkadot":
            blockchain = new Polkadot();
            break;

        case "unique":
            blockchain = new Unique();
            break;

        case "kusama":
        default:
            blockchain = new Kusama();
            break;
    }


    const scan = new ScanBlock(blockchain);

    // @ts-ignore
    scan.getRmrks(opts.block).then(
        result => {
            result.forEach(value => {

                // console.log(value.nftId.contractId);

                if(value instanceof Send || Mint){

                    let sandra = new SandraManager();
                    let blockchain = new KusamaBlockchain(sandra);

                    // TODO Signer
                    const signer = '0x0000';
                    let address = new BlockchainAddress(blockchain.addressFactory, signer, sandra);

                    // @ts-ignore
                    const recipient = value.recipient.address;
                    let receiver = new BlockchainAddress(blockchain.addressFactory, recipient, sandra);

                    // @ts-ignore
                    const collName = (typeof value.nftId.contractId !== 'undefined') ? value.nftId.contractId : value.nftId.contract.collection;
                    let contract = new BlockchainContract(blockchain.contractFactory, collName, sandra);

                    const txId = '0xId';

                    let event = new BlockchainEvent(blockchain.eventFactory, address, receiver, contract, txId, '123456', '1', blockchain, sandra);

                    let gossiper = new Gossiper(blockchain.eventFactory, sandra.get(KusamaBlockchain.TXID_CONCEPT_NAME));
                    const json = JSON.stringify(gossiper.exposeGossip());

                    fs.writeFileSync(path.resolve(__dirname, "testJson.json"), json);

                    // let gossiper = new Gossiper(blockchainEventFactory,this.get(Blockchain.TXID_CONCEPT_NAME));
                    // JSON.stringify(gossiper.exposeGossip()),
                }

            })
        }
    );
}


