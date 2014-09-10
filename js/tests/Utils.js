define(['../app/Utils.js'], function(utils) {
    module("Utils");

    test("Array.range", function() {
        deepEqual(Array.range(5, 8, 1), [5, 6, 7, 8], "Range of 5..8");
        deepEqual(Array.range(2, 10, 3), [2, 5, 8], "Range of 2..10 step 3");
    });

    test("String.endsWith", function() {
       ok( "handful-quirky".endsWith('rky') );
       ok( !"jinrikisha-hernias".endsWith('cannonball-builders') );
    });
});
