import {Option} from "commander";
import {Polkadot} from "./classes/Blockchains/Polkadot.js";
import {Unique} from "./classes/Blockchains/Unique.js";
import {Kusama} from "./classes/Blockchains/Kusama.js";
import {RmrkJetski} from "./Kusama/RmrkJetski.js";
import {KusamaBlockchain} from "./sandra/src/CSCannon/Substrate/Kusama/KusamaBlockchain.js";
import {BlockchainAddress} from "./sandra/src/CSCannon/BlockchainAddress.js";
import {BlockchainContract} from "./sandra/src/CSCannon/BlockchainContract.js";
import {BlockchainEvent} from "./sandra/src/CSCannon/BlockchainEvent.js";
import {Gossiper} from "./sandra/src/Gossiper.js";
import {RmrkContractStandard} from "./sandra/src/CSCannon/Interfaces/RmrkContractStandard.js";
import {CSCanonizeManager} from "./sandra/src/CSCannon/CSCanonizeManager.js";
import {Mint} from "./classes/Rmrk/Interactions/Mint.js";
import {MintNft} from "./classes/Rmrk/Interactions/MintNft.js";
import {Send} from "./classes/Rmrk/Interactions/Send.js";
import {Entity} from "./classes/Rmrk/Entity.js";
import {Remark} from "./classes/Rmrk/Remark.js";
import {Collection} from "./classes/Collection.js";
import {Asset} from "./classes/Asset.js";

// const fs = require('fs');
// const path = require('path');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


export const testScan = async (opts: Option) => {

    let blockchain;

    // @ts-ignore
    switch (opts.chain.toLowerCase()){

        case "polkadot":
            blockchain = new Polkadot();
            break;

        case "unique":
            // TODO remake Unique Blockchain
            //@ts-ignore
            blockchain = new Unique();
            break;

        case "kusama":
        default:
            blockchain = new Kusama();
            break;
    }



    const scan = new RmrkJetski(blockchain);

    // @ts-ignore
    scan.getRmrks(opts.block).then(
        result => {

            result.forEach(value => {


                let collName : string = "";
                let sn: string = "";

                if(value instanceof Send){

                    collName = value.nft.token.contractId;
                    sn = value.nft.token.sn

                    eventGossip(value, sn, collName);

                }else if (value instanceof MintNft){

                    collName = value.nft.token.contractId;
                    sn = value.nft.token.sn

                    const source = value.transaction.source;
                    value.transaction.source = '0x0';
                    value.transaction.destination.address = source;

                    entityGossip(value.nft);
                    eventGossip(value, sn, collName);

                }else if (value instanceof Mint){

                    // collName = value.collection.name;

                    entityGossip(value.collection);
                }

            })
        }
    );
}




export const forceScan = async (block:number) => {

    let blockchain;



            blockchain = new Kusama();



    const scan = new RmrkJetski(blockchain);


    scan.getRmrks(block).then(
        result => {

            result.forEach(value => {

                let collName : string = "";
                let sn: string = "";

                if(value instanceof Send || value instanceof MintNft){

                    collName = value.nft.token.contractId;
                    sn = value.nft.token.sn

                }else if (value instanceof Mint){

                    collName = value.collection.name;
                }

                eventGossip(value, sn, collName);
            })
        }
    );
}



const eventGossip = (value: Remark, sn: string, collName: string) => {

    const recipient = value.transaction.destination.address;


    let canonizeManager = new CSCanonizeManager();
    let sandra =  canonizeManager.getSandra();
    let blockchain = new KusamaBlockchain(sandra);


    const signer = value.transaction.source;

    let address = new BlockchainAddress(blockchain.addressFactory, signer, sandra);

    let receiver = new BlockchainAddress(blockchain.addressFactory, recipient, sandra);

    let contract = new BlockchainContract(blockchain.contractFactory, collName, sandra,new RmrkContractStandard(canonizeManager));

    const txId = value.transaction.txHash;
    const timestamp = value.transaction.timestamp;
    const blockId = value.transaction.blockId;


    const contractStandard = new RmrkContractStandard(canonizeManager, sn);

    let event = new BlockchainEvent(blockchain.eventFactory, address, receiver, contract, txId, timestamp, '1', blockchain, blockId, contractStandard, sandra);

    let gossiper = new Gossiper(blockchain.eventFactory, sandra.get(KusamaBlockchain.TXID_CONCEPT_NAME));
    const json = JSON.stringify(gossiper.exposeGossip());

    sendToGossip(json);

}



const entityGossip = async (rmrk: Entity) => {

    let canonizeManager = new CSCanonizeManager();
    let sandra = canonizeManager.getSandra();

    let kusama = new KusamaBlockchain(sandra);

    let collectionId : string = "";
    let nft: Asset;

    let result: any;

    let meta;

    let name: string = "";
    let image: string = "";
    let description: string = "";

    if(rmrk.metaDataContent != null){
        meta = rmrk.metaDataContent
        name = meta.name;
        image = meta.image.replace("ipfs://",'https://ipfs.io/');
        description = meta.description;
    }

    if(rmrk instanceof Asset){

        collectionId = rmrk.token.contractId;
        nft = rmrk ;

        let myContract = kusama.contractFactory.getOrCreate(collectionId);

        let myAsset = canonizeManager.createAsset({assetId: collectionId+'-'+name, imageUrl: image});
        let myCollection = canonizeManager.createCollection({id: collectionId, imageUrl: image, name: collectionId, description: description});


        myAsset.bindCollection(myCollection);
        myContract.bindToCollection(myCollection);

        let rmrkToken = new RmrkContractStandard(canonizeManager);
        rmrkToken.setSn(nft.token.sn);
        let tokenPath = rmrkToken.generateTokenPathEntity(canonizeManager);

        tokenPath.bindToAssetWithContract(myContract, myAsset);

        let gossiper = new Gossiper(canonizeManager.getTokenFactory());
        result = gossiper.exposeGossip();


    }else if (rmrk instanceof Collection){


        collectionId = rmrk.contract.id;

        let myContract = kusama.contractFactory.getOrCreate(collectionId);

        let myCollection = canonizeManager.createCollection({id: collectionId, imageUrl: image, name: rmrk.contract.collection, description: description});

        myContract.bindToCollection(myCollection);

        let gossiper = new Gossiper(canonizeManager.getAssetCollectionFactory());
        result = gossiper.exposeGossip();

    }

    let json = JSON.stringify(result,null,2); // pretty

    sendToGossip(json);

}


function sendToGossip(json: string){

    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "http://arkam.everdreamsoft.com/alex/gossipTest");
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(json);
    xmlhttp.addEventListener("load", ()=>{
        console.log("complete");
    });
}



// export const forceScan = async (block:number) => {
//
//     let blockchain;
//
//
//
//             blockchain = new Kusama();
//
//
//
//     const scan = new RmrkJetski(blockchain);
//
//
//     scan.getRmrks(block).then(
//         result => {
//
//             result.forEach(value => {
//
//
//                 const recipient = value.transaction.destination.address;
//
//                 const collName = value.nft.token.contractId;
//
//                 let canonizeManager = new CSCanonizeManager();
//                 let sandra =  canonizeManager.getSandra();
//                 let blockchain = new KusamaBlockchain(sandra);
//
//                 const signer = value.transaction.source;
//
//                 let address = new BlockchainAddress(blockchain.addressFactory, signer, sandra);
//
//                 let receiver = new BlockchainAddress(blockchain.addressFactory, recipient, sandra);
//
//                 let contract = new BlockchainContract(blockchain.contractFactory, collName, sandra,new RmrkContractStandard(canonizeManager));
//
//                 const txId = value.transaction.txHash;
//                 const timestamp = value.transaction.timestamp;
//                 const blockId = value.transaction.blockId;
//
//
//                 const contractStandard = new RmrkContractStandard(canonizeManager, value.nft.token.sn);
//
//                 let event = new BlockchainEvent(blockchain.eventFactory, address, receiver, contract, txId, timestamp, '1', blockchain, blockId, contractStandard, sandra);
//
//                 let gossiper = new Gossiper(blockchain.eventFactory, sandra.get(KusamaBlockchain.TXID_CONCEPT_NAME));
//                 const json = JSON.stringify(gossiper.exposeGossip());
//
//
//
//
//
//                 const xmlhttp = new XMLHttpRequest();
//                 xmlhttp.open("POST", "http://arkam.everdreamsoft.com/alex/gossipTest");
//                 xmlhttp.setRequestHeader("Content-Type", "application/json");
//                 xmlhttp.send(json);
//                 xmlhttp.addEventListener("load", ()=>{
//                     console.log("complete");
//                 });
//
//             })
//         }
//     );
// }