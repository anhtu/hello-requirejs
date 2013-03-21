/*
 * this is the initial code using the module pattern
 *
 * then the code is splits into different files
 * order, person .... and we use requirejs for loading code and
 * dependencies management
 *
 * */


/**
 * order module is defined before person module because of dependency from
 * person to order
 *
 * TODO: introduce couchdb into the application - got problem because of
 * tough installation of couchdb
 * TODO: introduce requirejs
 * TODO: introduce MVC
 * TODO: introduce twitter bootstrap for better design
 * TODO: introduce nodejs
 * TODO: introduce LESS for css
 *
 */
var order = (function () {

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

        this.isEqualTo = function (obj) {
            if (!(obj instanceof Order)) { return false; }
            return (_id === obj.withId());
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

})();



/**
 * now we wrap definition of Person inside the module person
 *
 * module 'person' will have dependency on module 'order'
 *
 * to have a 'beautiful' code, we use method chaining
 *
 */
var person = (function (order) {

    /**
     * represents a customer domain object - ENTITY
     * customer has one or more orders
     */
    var Person = function () {
  
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

        /* now we just identify by name */
        this.isEqualTo = function (obj) {
            if (!(obj instanceof Person)) { return false; }
            return (_name === obj.withName());
        }

        return this;
    };

    return {
        Person : Person
    };

})(order);



/* the entry point to app - main module */
(function (person, order) {

    var Person = person.Person;
    var Order  = order.Order;

    /* create a new Person */
    var john = new Person();

    john.name("john")
        .address("40 giang vo street")
        .newOrder("12345")
            .line(3, "Apple Mac Book")
            .line(5, "Samsung Galaxy Note 2")
        .newOrder("12346")
            .line(10, "Apple Mac Book")
            .line(2, "Google Nexus 7");
    console.log("name: " + john.withName() + " - address: " + john.withAddress());

    var order12345 = john.withOrder("12345");
    console.log("line mac book : " + order12345.withLine("Apple Mac Book").withProduct());

    var order12346 = john.withOrder("12346");
    console.log("line mac book : " + order12346.withLine("Google Nexus 7").withProduct());

    console.log(order12345.isEqualTo(order12346));


})(person, order);