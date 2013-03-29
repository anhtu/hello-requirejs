/**
 * Created with JetBrains WebStorm.
 * User: anhtu
 * Date: 3/28/13
 * Time: 9:47 PM
 * To change this template use File | Settings | File Templates.
 */

var Person    = require('../domain/person.js').Person,
    Order     = require('../domain/order.js').Order,
    OrderLine = require('../domain/order.js').OrderLine,
    view      = require('../domain/view.js');

exports.handle = function (req, res) {
    console.log("handling req");

    /* create a new Person */
    var john  = new Person(),
        peter = new Person(),
        personList = new Array();

    john.name("john")
        .address("40 Giang vo street")
        .newOrder("12345")
        .line(3, "Apple Mac Book")
        .line(5, "Samsung Galaxy Note 2")
        .newOrder("12346")
        .line(10, "Apple Mac Book")
        .line(2, "Google Nexus 7")
        .newOrder("12347")
        .line(2, "Galaxy Nexus")
        .line(3, "Nokia i9000")
        .line(1, "Sony Xperia");
    personList.push(john);
    console.log("name: " + john.withName() + " - address: " + john.withAddress());

    peter.name("peter")
        .address("111 Giang Vo");
    personList.push(peter);

    //var order12345 = john.withOrder("12345");
    //console.log("line mac book : " + order12345.withLine("Apple Mac Book").withProduct());

    //var order12346 = john.withOrder("12346");
    //console.log("line mac book : " + order12346.withLine("Google Nexus 7").withProduct());

    //console.log(order12345.isEqualTo(order12346));

    /*===== view the person =====*/
    res.write(view.renderListPerson(personList));

};