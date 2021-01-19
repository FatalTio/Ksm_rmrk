import {Interaction} from "../Interaction.js";
import {Blockchain} from "../../Blockchains/Blockchain.js";
import {Collection} from "../../Collection.js";
import {Transaction} from "../../Transaction.js";

export class Mint extends Interaction
{

    myCollection: Collection;

    constructor(rmrk: string, chain: Blockchain, transaction: Transaction){
        super(rmrk, Mint.name, chain, null, transaction);
        //@ts-ignore
        const myCollection = new Collection(this.rmrk, this.chain, null, this.transaction);
        this.myCollection = myCollection.createCollectionFromInteraction();
        return this;
    }


    public toJson(){
        const json = this.myCollection.toJson(false);
        // @ts-ignore
        json['interaction'] = this.interaction;
        return JSON.stringify(json);
    }
}