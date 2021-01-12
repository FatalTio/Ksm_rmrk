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
exports.BlockchainEventFactory = void 0;
var BlockchainEvent_js_1 = require("./BlockchainEvent.js");
var EntityFactory_js_1 = require("../EntityFactory.js");
var BlockchainEventFactory = /** @class */ (function (_super) {
    __extends(BlockchainEventFactory, _super);
    function BlockchainEventFactory(blockchain, sandra) {
        var _this = _super.call(this, 'blockchainEvent', 'blockchainEventFile', sandra) || this;
        _this.joinFactory(blockchain.addressFactory, BlockchainEvent_js_1.BlockchainEvent.EVENT_SOURCE_ADDRESS, sandra.get('address'));
        _this.joinFactory(blockchain.addressFactory, BlockchainEvent_js_1.BlockchainEvent.EVENT_DESTINATION_VERB, sandra.get('address'));
        _this.joinFactory(blockchain.contractFactory, BlockchainEvent_js_1.BlockchainEvent.EVENT_SOURCE_CONTRACT, sandra.get('id'));
        return _this;
    }
    return BlockchainEventFactory;
}(EntityFactory_js_1.EntityFactory));
exports.BlockchainEventFactory = BlockchainEventFactory;
//# sourceMappingURL=BlockchainEventFactory.js.map