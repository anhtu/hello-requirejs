/**
 * Created with JetBrains WebStorm.
 * User: tuna
 * Date: 3/21/13
 * Time: 5:49 PM
 * To change this template use File | Settings | File Templates.
 */
/* the entry point to app - main module
 *
 * init the models
 *
 * invoke the views to display models
 *
 * */

(function() {

    requirejs.config(
        {
            paths: {
                jquery : 'lib/jquery-1.8.2.min'
            }
        }
    );

    require(['person', 'order', 'jquery'],

    function (person, order, $) {

    /* init the model */
    var Person    = person.Person;
    var Order     = order.Order;
    var OrderLine = order.OrderLine;

    /* create a new Person */
    var john = new Person();

    john.name("john")
        .address("40 Giang vo street")
        .newOrder("12345")
            .line(3, "Apple Mac Book")
            .line(5, "Samsung Galaxy Note 2")
        .newOrder("12346")
            .line(10, "Apple Mac Book")
            .line(2, "Google Nexus 7");
    console.log("name: " + john.withName() + " - address: " + john.withAddress());

    //var order12345 = john.withOrder("12345");
    //console.log("line mac book : " + order12345.withLine("Apple Mac Book").withProduct());

    //var order12346 = john.withOrder("12346");
    //console.log("line mac book : " + order12346.withLine("Google Nexus 7").withProduct());

    //console.log(order12345.isEqualTo(order12346));

    /* init the view to display john
     *
     * at this moment we need jquery to better manipulate the DOM
     *
     *
     * */
      var renderPerson = function (aPerson, DOMelement) {
        if ((aPerson === null) || (!(aPerson instanceof Person)) ) { return ; }

        var personView = '<div><h4>' + aPerson.withName() + '</h4>'
            + '<p>' + aPerson.withAddress() + '</p></div>';

        var i;
        for (i = 0; i < aPerson.numberOfOrder(); i++) {
            personView += renderOrder(aPerson.withOrderNo(i));
        }

        personView += '</div>';

        /* we use append since html will override the whole element
         * we might have to add more people in the same div
         *
         * */
        DOMelement.append(personView);
    };

    var renderOrder = function (anOrder) {
        if ((anOrder === null) || (!(anOrder instanceof  Order)) ) { return; }

        var orderView = '<div><h4>' + anOrder.withId() + '<h4><lu>';

        var i;
        for (i = 0; i < anOrder.length(); i++) {
            console.log(renderOrderLine(anOrder.withLineNo(i)));
            orderView = orderView + renderOrderLine(anOrder.withLineNo(i));
        }
        orderView += '</lu></div>';
        return orderView;
    };

    var renderOrderLine = function (orderLine) {
        if ((orderLine === null) || (!(orderLine instanceof  OrderLine)) ) { return; }

        var orderLineView = '<li>' + orderLine.withProduct() + ' - ' + orderLine.withQuantity() + '</li>';
        return orderLineView;
    };

    renderPerson(john, $("#personView"));
    renderOrder(john.withOrder("12345"), $("#orderView"));
    });

})();
