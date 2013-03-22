/**
 * Author: tuna
 * Date: 3/22/13
 * Time: 5:10 PM
 */
/**
 * TODO: have a method to init the data
 * - a method to run all the tests so that in main, we can just call test.runAll()
 */
define('test', ['order'],

    function (order) {

        var OrderLine = order.OrderLine,
            Order     = order.Order;

        var test_orderline_toString = function () {
            console.log("test_orderline_toString");

            var orderLine = new OrderLine(3, "Mac Book Pro");

            /*
             * TODO: from here we need some mechanism of checking
             * because we want to check equality of objects
             *
             * orderLine should be equal { quantity : 3, productId : "Mac Book Pro" }
             *
             * */
            //orderLine.toString();
        };

        return {
            test_orderline_toString : test_orderline_toString
        };
    }
);