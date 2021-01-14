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
exports.Polkadot = void 0;
var Blockchain_js_1 = require("./Blockchain.js");
var PolkadotContract_js_1 = require("../Contract/PolkadotContract.js");
var Polkadot = /** @class */ (function (_super) {
    __extends(Polkadot, _super);
    function Polkadot() {
        return _super.call(this, "Polkadot", "DOT", "", false, 'wss://rpc.polkadot.io') || this;
    }
    Polkadot.prototype.toJson = function () {
        return this.toJsonSerialize();
    };
    Polkadot.contractClass = PolkadotContract_js_1.PolkadotContract;
    return Polkadot;
}(Blockchain_js_1.Blockchain));
exports.Polkadot = Polkadot;
//# sourceMappingURL=Polkadot.js.map