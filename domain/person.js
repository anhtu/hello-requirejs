/**
 * User: anhtu
 * Date: 3/21/13
 * Time: 9:12 AM
 */

/**
 * now we wrap definition of Person inside the module person
 *
 * module 'person' will have dependency on module 'order'
 *
 * to have a 'beautiful' code, we use method chaining
 *
 */

var order = require('./order.js');

/**
 * represents a customer domain object - ENTITY
 * customer has one or more orders
 */
exports.Person = function () {

    /* contains customer order */
    var
        _orders = new Array(),

        _name,

        _address;

    /* assign a var to Order object to shorten the reference */
    var Order = order.Order;

    /* setter for name property */
    this.name = function (newName) {
        _name = newName;
        return this;
    };

    /* getter for name */
    this.withName = function() {
        return _name;
    };

    /* setter for address */
    this.address = function(newAddress) {
        _address = newAddress;
        return this;
    };

    this.withAddress = function(){
        return _address;
    };

    /* create a new order associated with customer */
    this.newOrder = function (orderId) {
        var order = new Order(orderId);
        _orders.push(order);
        return this;
    };

    /* add a line order to the last order */
    this.line = function(quantity, productId) {
        _orders[_orders.length -1].line(quantity, productId);
        return this;
    };

    /* getter for order */
    this.withOrder = function (orderId) {
            var i;
            for (i = 0; i < _orders.length; i++ ) {
                /* this is great because javascript can understand the object type
                 * automatically
                 * */
                if (_orders[i].withId() === orderId) {
                    return _orders[i];
                }
            }

        };

        this.withOrderNo = function (orderNo) {
            if (orderNo < _orders.length) { return _orders[orderNo]; }
        };

        this.numberOfOrder = function () {
            return _orders.length;
        };

        /* now we just identify by name */
        this.isEqualTo = function (obj) {
            if (!(obj instanceof Person)) { return false; }
            return (_name === obj.withName());
        };

        /**
         * returns a readable JSON representation of object
         **/
        this.toString = function () {
            return {
                name    : _name,
                address : _address
        };
    };

};
