//
//  Skritter HTML5 Client
//  (C) Benjamin Blazke (benjiaming)
//

function Grading(skritter, layer) {
    this.skritter = skritter;
    this.layer = layer;
    preloadImages(this.getButtons());
}

Grading.prototype.colorizeButton = function(button, color) {
    button.setOpacity(0.7);
    button.setFill(color);
};

Grading.prototype.resetButton = function(button, color) {
    if (!this.skritter.getSuccess() && color == this.getForgotColor()) {
        this.colorizeButton(button, this.getForgotColor());
    } else if (this.skritter.getSuccess() && color == this.getGotItColor()) {
        this.colorizeButton(button, this.getGotItColor());
    } else {
        button.setFill('white');
    }
};

Grading.prototype.getForgotColor = function() {
    return 'red';
};

Grading.prototype.getSoSoColor = function() {
    return 'yellow';
};

Grading.prototype.getGotItColor = function() {
    return "#33CC00";
};

Grading.prototype.getEasyColor = function() {
    return 'blue';
};

Grading.prototype.createButton = function(myX, src, color) {
    var self = this;
    var w = this.skritter.canvasWidth();
    var h = this.skritter.canvasHeight();
    var img = new Image();
    img.src = "img/" + src + ".png";
    img.onload = function() {
        var gradeImg = new Kinetic.Image({
            x : myX,
            y : h - 39,
            image : img,
            width : w * 0.25,
            height : 39,
            stroke : '#eeeeee',
        });
        gradeImg.on('mouseover touchstart', function() {
            self.colorizeButton(this, color);
            self.layer.draw();
        });
        gradeImg.on('mouseleave touchend', function() {
            this.setOpacity(1);
            self.resetButton(this, color);
            self.layer.draw();
        });
        gradeImg.on('mousedown touchstart', function() {
            if (color == self.getForgotColor() || color == self.getSoSoColor()) {
                self.skritter.markFail();
            }
        });
        self.resetButton(gradeImg, color);
        self.layer.add(gradeImg);
        self.layer.draw();
    };
};

Grading.prototype.getButtons = function() {
    return [
        'grade_forgot',
        'grade_soso',
        'grade_gotit',
        'grade_easy'
    ];
};

Grading.prototype.paint = function() {
    var w = this.skritter.canvasWidth();
    this.layer.removeChildren();
    var buttons = this.getButtons();
    this.createButton(w * 0, buttons[0], this.getForgotColor());
    this.createButton(w * 0.25, buttons[1], this.getSoSoColor());
    this.createButton(w * 0.51, buttons[2], this.getGotItColor());
    this.createButton(w * 0.75, buttons[3], this.getEasyColor());
};
