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
 *
 * use requiresjs to load module
 */
define('order', [], function () {

    /**
     * order is an ENTITY
     *
     * because Order is an entity, its instance has a way to compare itself with other
     * instances ==> isEqualTo
     */
    var Order = function(id) {

        var
            _id = id,

        /* order is a collection of order lines */
            _lines = new Array();

        /* getter for id */
        this.withId = function () {
            return _id;
        };

        /* setter for order line */
        this.line = function (quantity, productId) {
            var orderLine = new OrderLine(quantity, productId);
            _lines.push(orderLine);
        };

        /* getter for line */
        this.withLine = function (productId) {
            var i;
            for (i = 0; i < _lines.length; i++) {
                if (_lines[i].withProduct() === productId) {
                    return _lines[i];
                }
            }
        }

        this.withLineNo = function (lineNumber) {
            if (lineNumber < _lines.length) { return _lines[lineNumber]; }
        }

        this.isEqualTo = function (obj) {
            if (!(obj instanceof Order)) { return false; }
            return (_id === obj.withId());
        }

        this.length = function () {
            return _lines.length;
        }

        return this;
    };

    /**
     * OrderLine is a value object
     *
     * @param quantity
     * @param productId
     * @return {*}
     * @constructor
     */
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


});
