/**
 * User: tuna
 * Date: 3/21/13
 * Time: 5:49 PM
 */

/* the entry point to app - main module
 *
 * init the models
 *
 * invoke the views to display models
 * TODO: introduce couchdb into the application - got problem because of
 * tough installation of couchdb
 * [OK]: introduce requirejs - seems ok at the moment
 * TODO: introduce MVC
 * TODO: introduce twitter bootstrap for better design
 * [OK]: introduce nodejs
 * TODO: introduce LESS for css
 *
 * TODO: introduce unit testing - jsmockito
 * TODO: introduce logging - consul.js of berry
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

    require(['person', 'order', 'jquery', 'view', 'test'],

    function (person, order, $, view, test) {

    /*=== run the test first ===*/
    //test.test_orderline_toString();

    /*===== init the model =====*/
    var Person    = person.Person;
    var Order     = order.Order;
    var OrderLine = order.OrderLine;

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
    view.renderListPerson(personList, $("#personView"));


    /**
     * think about what model to update the data
     * when the data changes then the model notifies the view
     * or when the controller changes the data, the controller notifies the view
     *
     */
    /*===== controlling action in page  =====*/
    /* click on #addPersonButton */
    $("#addPersonButton").click(
        function () {

            /* calls the model */
            var personName = $(this).siblings("#addPersonInput")[0].value;
            console.log(personName);
            var newPerson = new Person;
            newPerson.name(personName);

            /* call to update the view */
            view.renderPerson(newPerson, $("#personView"));
        }
    );

    });

})();
