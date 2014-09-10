//
//  Skritter HTML5 Client
//  (C) Benjamin Blazke (benjiaming)
//

function StrokeImages(skritter) {
    this.skritter = skritter;
    this.init_();
};

StrokeImages.prototype.init_ = function() {
    this.cachedStrokes = new Array(Recognizer.N_STROKES);
};

StrokeImages.prototype.imgLocation = function(strokeNum) {
    var numStr = '' + strokeNum;
    while (numStr.length < 4) {
        numStr = '0' + numStr;
    }
    return 'img/strokes/' + numStr + '.png';
};

StrokeImages.prototype.load = function(i) {
    this.cachedStrokes[i] = new Image();
    this.cachedStrokes[i].src = this.imgLocation(i);
};

StrokeImages.prototype.loadAll = function() {
    for (var i = 0; i < Recognizer.N_STROKES; i++) {
        this.load(i);
    }
};

StrokeImages.prototype.get = function(i) {
    return this.cachedStr[i];
};

StrokeImages.prototype.loadChar = function() {

};
