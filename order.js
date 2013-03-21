/**
 * Created with JetBrains WebStorm.
 * User: tuna
 * Date: 3/21/13
 * Time: 9:33 AM
 * To change this template use File | Settings | File Templates.
 */
/**
 * order is an ENTITY
 *
 * order module is defined before person module because of dependency from
 * person to order
 */

var order = (function () {

    var Order = function(id) {

        var
            _id = id,

        /* order is a collection of order lines */
            _lines = new Array();

        this.withId = function () {
            return _id;
        };

        this.line = function (quantity, productId) {

            var orderLine = new OrderLine(quantity, productId);
            _lines.push(orderLine);
        };

        return this;
    };


    var OrderLine = function (quantity, productId) {
        var _quantity = quantity;
        var _productId = productId;

        /* getter */
        this.withProduct = function () {
            return _productId;
        };

        this.withQuantity = function () {
            return _quantity;
        };

        return this;
    };

    return {
        Order     : Order,
        OrderLine : OrderLine
    };

})();
