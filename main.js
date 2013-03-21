/**
 * Created with JetBrains WebStorm.
 * User: tuna
 * Date: 3/21/13
 * Time: 5:49 PM
 * To change this template use File | Settings | File Templates.
 */
/* the entry point to app - main module */

(function() {

require(['person', 'order'],

function (person, order) {

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


});

})();
