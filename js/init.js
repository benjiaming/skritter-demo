require.config({
    baseUrl: 'js/lib',
});

require(["zepto"], function($) {
    requirejs(['../app']);
});
