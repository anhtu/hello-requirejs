

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


/**
 * represents a customer domain object - ENTITY
 * customer has one or more orders
 */

/**
 * now we wrap definition of Person inside the module person
 *
 *
 */
var person = (function (order) {

    var Person = function () {
  
    /* contains customer order */
    var
        _orders = new Array(),

        _name,

        _address;

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
        this.with = function(quantity, productId) {
            //Order.line.call(_orders[_orders.length], quantity, productId);//_orders[_orders.length].line(quantity, productId);
            return this;
        };

        /* getter for order */
        this.withOrder = function (orderId) {
      
            var i;

            for (i; i < _orders.length; i++ ) {

      	        if (_orders[i].withId() === orderId) {
      		        return _orders[i];
        	    }
            }

        };

        return this;
    };

    return {
        Person : Person
    };

})(order);



/* the entry point to app - main module */
(function (person, order) {

    var john = new person.Person();

    john.name("john").address("40 giang vo street").newOrder("12345");
    console.log("name: " + john.withName() + " - address: " + john.withAddress());
    //console.log("order 12345: " + john.withOrder("12345"));

})(person, order);