require.config({
    baseUrl: 'js/lib',
});

require(["zepto"], function ($) {
    ["skritter", "english", "clock", "pinyin"].forEach(function(val) {
        $("#" + val).hide();
    });
    requirejs(['../app']);
    requirejs(['../app_test']);
});
    