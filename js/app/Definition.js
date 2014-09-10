//
//  Skritter HTML5 Client
//  (C) Benjamin Blazke (benjiaming)
//
function Definiton(skritter, layer) {
    this.skritter = skritter;
    this.app = skritter.getApp();
    this.active = false;
    this.layer = layer;
    this.context = this.layer.getContext();
    this.h = this.skritter.canvasHeight();
    this.w = this.skritter.canvasWidth();
}

Definiton.prototype.ask = function() {
    this.skritter.clearLayers();
    this.paintChar();
    this.paintHint();
    this.layer.draw();
    this.skritter.hasAnswer = true;
};

Definiton.prototype.paintChar = function() {
    this.layer.add(new Kinetic.Text({
       x: 1,
       y: 110,
       width: this.w,
       textFill: "black",
       fontSize: 40,
       fontStyle: "bold",
       text: this.skritter.question.character.simp,
       align: "center", 
    }));
};

Definiton.prototype.paintHint = function() {
    this.layer.add(new Kinetic.Text({
        x: 1,
        y: 170,
        width: this.w,
        textFill: "black",
        fontSize: 12,
        text: "(tap show button)",
        align: "center",
    }))
    this.app.messenger.writeMessage("Do you know the definition?");
};

Definiton.prototype.paintPinyin = function() {
    var tone = 'tone' + this.skritter.question.character.tone;
    var dom = $('<span>').addClass(tone);
    this.layer.add(new Kinetic.Text({
        x: 1,
        y: 160,
        width: this.w,
        textFill: dom.css('color'),
        fontSize: 20,
        text: this.skritter.question.character.pinyin,
        align: "center",
    }))
};

Definiton.prototype.paintEnglish = function() {
    this.layer.add(new Kinetic.Text({
        x: 1,
        y: 200,
        width: this.w,
        textFill: 'blue',
        fontSize: 12,
        align: 'center',
        text: "answer:",
    }));
    this.layer.add(new Kinetic.Text({
        x: 1,
        y: 230,
        width: this.w,
        textFill: "black",
        fontSize: 20,
        text: this.skritter.question.character.english,
        align: "center",
    }))
};

Definiton.prototype.showAnswer = function() {
    this.skritter.clearLayers();
    this.layer.removeChildren();
    this.paintChar();
    this.paintPinyin();
    this.paintEnglish();
    this.app.grading.paint();
    this.active = true;
    this.layer.draw();
    this.skritter.showEnglish();
}; 
