define(['../app/Skritter.js'], function(skritter) {
    QUnit.module("Skritter");

    //var $ = require('../lib/zepto');
    //require('../lib/kinetic');
    //require("Skritter");

    test( "init_", function() {
        var a = $.map([2, 3, 4], function(val, i) {
            return ++val;
        });
        deepEqual( a, [3, 4, 5] );
        console.log(skritter);
    });
});
