//
//  Skritter HTML5 Client
//  (C) Benjamin Blazke (benjiaming)
//


function Stroke(skritter) {
    this.skritter = skritter;
}

Stroke.prototype.preloadStrokes = function() {
    var images = [];
    var strokes = this.recogParams();
    for (var stroke in strokes) {
        var arr = strokes[stroke];
        images.push(arr[0]);
    };
    preloadImages(images);
};

Stroke.prototype.getImg = function(strokeShouldBe) {
    var thisStroke = strokeShouldBe.stroke + strokeShouldBe.variation;
    var strokes = this.recogParams();
    for (var astroke in strokes) {
        if (astroke === thisStroke) {
            return strokes[astroke];
        }
    }
    return null;
};

Stroke.prototype.normalizeStroke = function(stroke) {
    var ar = stroke.split('-');
    return {
        stroke: ar[0],
        variation: ar[1] || '',
    };
};

Stroke.prototype.recogParams = function() {
    return {
        "heng" : ["0001.png", 35, 138, 280, 51],
        "heng1" : ["0004.png", 104, 60, 146, 28],
        "heng2" : ["0002.png", 115, 140, 132, 42],
        "heng3" : ["0000.png", 40, 225, 290, 46],
        "shu" : ["0018.png", 155, 25, 35, 301],
        "hengzhigou" : ["0275.png", 30, 105, 240, 116],
        "shu1" : ["0018.png", 143, 32, 32, 205],
        "shuwangou" : ["0284.png", 81, 120, 250, 195],
        "heng4" : ["0004.png", 40, 140, 98, 30],
        "shu2" : ["0021.png", 70, 54, 35, 189],
        "ti" : ["0089.png", 30, 212, 111, 66],
        "hengzhigou1" : ["0276.png", 114, 110, 182, 121],
        "shu3" : ["0018.png", 197, 31, 23, 206],
        "shuwangou1" : ["0284.png", 143, 105, 192, 185],
        "heng2a" : ["0002.png", 104, 78, 154, 45],
        "heng3a" : ["0000.png", 40, 200, 285, 50],
        "tone1" : ["0383.png", 65, 20, 275, 40],
        "tone2" : ["0384.png", 30, 20, 252, 126],
        "tone3" : ["0385.png", 30, 120, 275, 40],
        "tone4" : ["0386.png", 30, 120, 275, 40],
        "tone5" : ["0387.png", 30, 120, 275, 40],
    };
};
