//
//  Skritter HTML5 Client
//  (C) Benjamin Blazke (benjiaming)
//

var debugEnabled = 1;

var debug = function(msg) {
    if (debugEnabled) {
        console.log(msg);
    }
};

window.isInstalled = (function() {
    return window.locationbar && !window.locationbar.visible;
})();

if (window.isInstalled) {
    debugEnabled = 0;
}

window.hasTouch = (function() {
    return 'ontouchstart' in window || 'onmsgesturechange' in window;
})();

window.requestAnimFrame = (function(callback) {
  return window.requestAnimationFrame ||
     window.webkitRequestAnimationFrame ||
     window.mozRequestAnimationFrame ||
     window.oRequestAnimationFrame ||
     window.msRequestAnimationFrame ||
     function(callback) {
       window.setTimeout(callback, 1000/60);
     };
})();

window.preloadImages = (function(images) {
    images.forEach(function(img) {
        if (!img.endsWith('.png')) {
            img += '.png';
        }
        var image = $('<img />').attr({
            'src' : 'img/' + img
        });
        $('#img').append(image);
    });
});

// implemented in JavaScript 1.8.6
String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

Array.range = function(a, b, step) {
    var A = [];
    if (typeof a === 'number') {
        A[0] = a;
        step = step || 1;
        while (a + step <= b) {
            A[A.length] = a += step;
        }
    } else {
        var s = 'abcdefghijklmnopqrstuvwxyz';
        if (a === a.toUpperCase()) {
            b = b.toUpperCase();
            s = s.toUpperCase();
        }
        s = s.substring(s.indexOf(a), s.indexOf(b)+ 1);
        A = s.split('');
    }
    return A;
};

