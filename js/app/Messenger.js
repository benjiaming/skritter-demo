//
//  Skritter HTML5 Client
//  (C) Benjamin Blazke (benjiaming)
//

function Messenger(skritter, layer) {
    this.skritter = skritter;
    this.layer = layer;
    this.plusOneText = null;
    this.writeText = null;
    this.writeInterval = null;
    this.w = this.skritter.canvasWidth();
}
Messenger.prototype.writeMessage = function(message) {
    if (this.writeText) {
        console.log("removing");
        this.writeText.remove();
    }
    this.writeText = new Kinetic.Text({
        x: 0,
        y: this.w - 60,
        width: this.w,
        textFill: "rgba(100, 100, 100)",
        fontSize: 20,
        align: "center",
        text: message
    });
    this.writeText.setOffset({
        x: this.writeText.getWidth() / 2
    });
    this.layer.add(this.writeText);
    console.log("adding " + message);
    this.writeText.tween = new Kinetic.Tween({
        node: this.writeText,
        duration: 3,
        opacity: 0
    }).play();
    console.log("after play");
};

Messenger.prototype.plusOneMessage = function(message) {
    if (this.plusOneText) {
        this.plusOneText.remove();
    }
    this.plusOneText = new Kinetic.Text({
        x: 0,
        y: -20,
        width: this.w,
        textFill: 'red',
        fontSize: 12,
        align: 'center',
        text: message
    });
    this.layer.add(this.plusOneText);
    var tween = new Kinetic.Tween({
        node: this.plusOneText,
        y: 40,
        duration: 1
    });
    tween.play();
    /*
    window.requestAnimFrame(function() {
        self.plusOneText.transitionTo({
            y: 40,
            duration: 1,
            callback: function() {
                setTimeout(function() {
                  self.plusOneText.transitionTo({
                      y: -20,
                      duration: 1
                  });
                }, 2000);
            }
        });
    });
        */
};
