//
//  Skritter HTML5 Client
//  (C) Benjamin Blazke (benjiaming)
//
function Toner(skritter, layer) {
    this.skritter = skritter;
    this.app = skritter.getApp();
    this.layer = layer;
}

Toner.prototype.ask = function() {
    this.app.messenger.writeMessage("Paint or type the tone");
    this.layer.setOpacity(0.5);
    this.app.brush.paintAnswer();
};

Toner.prototype.showAnswer = function() {
    this.layer.setOpacity(1);
    this.skritter.hasAnswer = true;
    debug("show Answer");
};