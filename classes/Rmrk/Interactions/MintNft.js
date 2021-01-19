"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MintNft = void 0;
const Interaction_js_1 = require("../Interaction.js");
const Asset_js_1 = require("../../Asset.js");
class MintNft extends Interaction_js_1.Interaction {
    constructor(rmrk, chain, transaction) {
        super(rmrk, MintNft.name, chain, null, transaction);
        // @ts-ignore
        const myNft = new Asset_js_1.Asset(this.rmrk, this.chain, null, this.signer.address);
        this.myNft = myNft.createNftFromInteraction();
    }
    // public createMintNft(){
    //
    //     // @ts-ignore
    //     const myNft = new Asset(this.rmrk, this.chain, null, this.signer.address);
    //     this.myNft = myNft.createNftFromInteraction();
    //
    //     return this;
    // }
    toJson() {
        const json = this.myNft.toJson(false, true);
        // @ts-ignore
        json['interaction'] = this.interaction;
        return JSON.stringify(json);
    }
}
exports.MintNft = MintNft;
//# sourceMappingURL=MintNft.js.map