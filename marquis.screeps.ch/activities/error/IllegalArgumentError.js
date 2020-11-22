"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Thrown when a required argument is invalid from a function/constructor call.
 *
 * @augments Error
 * @memberof module:error
 */
var IllegalArgumentError = /** @class */ (function (_super) {
    __extends(IllegalArgumentError, _super);
    /**
     * @param {Error} error - A message.
     */
    function IllegalArgumentError(error) {
        var _this = _super.call(this, error.message) || this;
        _this.stack = error.stack;
        _this.name = 'IllegalArgumentError';
        return _this;
    }
    return IllegalArgumentError;
}(Error));
module.exports = IllegalArgumentError;
