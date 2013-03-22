/**
 * Created with JetBrains WebStorm.
 * User: anhtu
 * Date: 3/21/13
 * Time: 10:25 PM
 * To change this template use File | Settings | File Templates.
 */
/* init the view to display john
 *
 * at this moment we need jquery to better manipulate the DOM
 *
 *
 * */
define('view', ['person', 'order'],
    function (person, order) {

    var Person    = person.Person;
    var Order     = order.Order;
    var OrderLine = order.OrderLine;

    var renderListPerson = function (listPerson, DOMelement) {

        var i,
            listPersonView = '<lu>List of people: ' + listPerson.length;
        for (i = 0; i < listPerson.length; i++) {
            listPersonView += '<li>' + renderPerson(listPerson[i], null) + '</li>';
        }

        listPersonView += '</lu>';
        if (DOMelement === null) { return listPersonView; }
        DOMelement.html(listPersonView);
    }

    var renderPerson = function (aPerson, DOMelement) {
        if ((aPerson === null) || (!(aPerson instanceof Person)) ) { return ; }

        var personView = '<div><h4>' + aPerson.withName() + '</h4>'
            + '<p>' + aPerson.withAddress() + '</p></div>';

        var i;
        for (i = 0; i < aPerson.numberOfOrder(); i++) {
            personView += renderOrder(aPerson.withOrderNo(i));
        }

        personView += '</div>';

        if (DOMelement === null) { return personView; }
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

    return {
        renderPerson : renderPerson,
        renderListPerson : renderListPerson
    };

    }
);