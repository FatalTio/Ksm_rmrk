"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.Kusama = void 0;
var SubstrateChain_js_1 = require("./SubstrateChain.js");
var KusamaAddress_js_1 = require("../Addresses/KusamaAddress.js");
var KusamaContract_js_1 = require("../Contract/KusamaContract.js");
var Kusama = /** @class */ (function (_super) {
    __extends(Kusama, _super);
    function Kusama() {
        return _super.call(this, "Kusama", "KSM", "", true, 'wss://kusama-rpc.polkadot.io/') || this;
    }
    Kusama.getAddressClass = function () {
        return new KusamaAddress_js_1.KusamaAddress();
    };
    Kusama.prototype.toJson = function (needSubstrate) {
        if (needSubstrate === void 0) { needSubstrate = true; }
        var json = this.toJsonSerialize();
        if (this.isSubstrate && needSubstrate) {
            // @ts-ignore
            json['substrateOf'] = this.substrateOf;
        }
        return json;
    };
    Kusama.contractClass = new KusamaContract_js_1.KusamaContract();
    return Kusama;
}(SubstrateChain_js_1.SubstrateChain));
exports.Kusama = Kusama;
//# sourceMappingURL=Kusama.js.map