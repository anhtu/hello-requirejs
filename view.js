/**
 * User: anhtu
 * Date: 3/21/13
 * Time: 10:25 PM
 */
/* init the view to display john
 *
 * at this moment we need jquery to better manipulate the DOM
 *
 * TODO: data-binding
 *
 * we need a solution kind of data binding because we can not have too much
 * dependency between view and model
 * if view change then model is dead
 * ==> JSON might be a great format for data interchange
 *
 * our architecture can be like
 *
 * the controller change the model then transform the model into JSON format
 * (another benefit of this kind of things is that this format is readable only)
 *
 * the view find the data binding matching of JSON and parse the data
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