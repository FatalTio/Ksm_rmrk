import {Remark} from "./Remark.js";
import {Blockchain} from "../Blockchains/Blockchain.js";
import {PublicEntity, EntityInterface, MetaDataInputs} from "../Interfaces.js";
import {Transaction} from "../Transaction.js";
import {Metadata} from "../Metadata.js";

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


export abstract class Entity extends Remark implements PublicEntity
{

    public standard: string;
    public metaDataContent : Metadata|null;


    protected constructor(rmrk: string, standard: string, chain: Blockchain, version: string|null, transaction:Transaction, meta: Metadata|null) {
        super(version, rmrk, chain, transaction);
        this.standard = standard;
        this.metaDataContent = meta

    }


    toJsonSerialize = () : PublicEntity => ({
        version: this.version,
        rmrk: this.rmrk,
        chain: this.chain,
        standard: this.standard
    })


    public static dataTreatment(splitted: Array <string>, obj: EntityInterface): EntityInterface{

        splitted.forEach((index) => {

            const splittedDatas = index.split(',');

            for(let i = 0; i < splittedDatas.length; i ++){
                splittedDatas[i] = splittedDatas[i].replace(/[&\/\\"']/g, '');
            }

            splittedDatas.forEach((split) => {

                const datas = split.split(':');

                if(datas[0] === "metadata"){

                    const protocol = datas[2].slice(0, 4);

                    if(datas[1] === "ipfs") {

                        const url = datas[2].slice(4);

                        datas[2] = (protocol === "ipfs") ? protocol + '/' + url : protocol + url;
                    }

                    datas[1] = datas[2];
                }
                // @ts-ignore
                obj[datas[0]] = datas[1];
            })
        })

        return obj;

    }





    public static async getMetaDataContent(urlIpfs: string): Promise<Metadata>{

        return new Promise((resolve, reject) => {

            let urlToCall : string = "";

            urlIpfs = urlIpfs.replace('ipfs/','');

            urlToCall = "https://ipfs.io/ipfs/" + urlIpfs;

            const get = new XMLHttpRequest();

            let response: MetaDataInputs;
            let metaData : Metadata;

            get.open("GET", urlToCall);
            get.send();

            get.onreadystatechange = function () {

                if (this.readyState == 4 && this.status == 200) {
                    response = JSON.parse(this.responseText);
                    metaData = new Metadata(urlToCall, response);
                    resolve (metaData);
                }else if(this.readyState == 4 && this.status == 404){
                    reject ('Bad request :' + this.status);
                }
            }

        });

    }


}