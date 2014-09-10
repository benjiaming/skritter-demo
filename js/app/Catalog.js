//
//  Skritter HTML5 Client
//  (C) Benjamin Blazke (benjiaming)
//

function StrokeCatalog(skritter) {
    this.skritter = skritter;
    this.registerStrokes();
    this.registerTones();
}

StrokeCatalog.prototype.registerStrokes = function() {
    this.strokes = {
        'isHeng': 'heng',
        'isShu': 'shu',
        'isTi': 'ti',
        'isHZG': 'hengzhigou',
        'isSWG': 'shuwangou'
    };
};

StrokeCatalog.prototype.registerTones = function() {
    this.tones = {
        'isTone1': 'tone1',
        'isTone2': 'tone2',
        'isTone3': 'tone3',
        'isTone4': 'tone4',
        'isTone5': 'tone5'
    };
};

StrokeCatalog.prototype.identifyStroke_ = function(shouldBe, p, strokes) {
    this.points = p;
    if (p.startX !== null) {
        debug("startX: " + p.startX + "\t" + "startY: " + p.startY);
        debug("leftX: " + p.leftX + "\t" + "leftY: " + p.leftY);
        debug("rightX: " + p.rightX + "\t" + "rightY: " + p.rightY);
        debug("downX: " + p.downX + "\t" + "downY: " + p.downY);
        debug("upX: " + p.upX + "\t" + "upY: " + p.upY);
        debug("endX: " + p.endX + "\t" + "endY: " + p.endY + "\n");
    }
    var self = this;
    for (var fun in strokes) {
        if (self[fun].call(self, shouldBe)) {
            return strokes[fun];
        }
    }
    return "unknown";
};

StrokeCatalog.prototype.identifyStroke = function(shouldBe, p) {
    return this.identifyStroke_(shouldBe, p, this.strokes);
};

StrokeCatalog.prototype.identifyTone = function(shouldBe, p) {
    return this.identifyStroke_(shouldBe, p, this.tones);
};

StrokeCatalog.prototype.isHeng = function() {
    if (this.points.downY - this.points.upY > 30) {
        return false;
    }
    if (this.points.startX < this.points.endX && 
        this.points.rightX > this.points.startX) {
        return true;
    }
    return false;
};

StrokeCatalog.prototype.isShu = function() {
    if (this.points.rightX - this.points.leftX > 30) {
        return false;
    }
    if (this.points.startY < this.points.endY && 
        this.points.downY > this.points.startY) {
        return true;
    }
    return false;
};

StrokeCatalog.prototype.isTi = function() {
    if (this.points.startX >= this.points.endX || 
        this.points.startY <= this.points.endY || 
        this.points.endY - this.points.startY > 100 || 
        this.points.endX - this.points.startX > 100) {
        return false;
    }
    if (this.points.leftX === this.points.startX && 
        this.points.rightX === this.points.endX && 
        this.points.leftY === this.points.startY && 
        this.points.rightY === this.points.endY) {
        return true;
    }
    return false;
};

StrokeCatalog.prototype.isHZG = function(shouldBe) {
    if (this.points.leftX !== this.points.startX || 
        this.points.startY >= this.points.endY) {
        return false;
    }
    if (this.points.endX - this.points.startX < 50) {
        return false;
    }

    if (this.points.endX < this.points.upX) {
        if (this.points.endY === this.points.downY && 
            shouldBe.stroke === "hengzhigou") {
                var messenger = this.skritter.getApp().messenger;
                messenger.writeMessage("Should hook...");
        }
        return true;
    }
    return false;
};

StrokeCatalog.prototype.isSWG = function() {
    if (this.points.endX < this.points.startX || 
        this.points.endY < this.points.startY) {
        return false;
    }
    if (this.points.startX === this.points.upX && 
        this.points.startY === this.points.upY && 
        this.points.downY - this.points.endY > 30) {
        return true;
    }
    return false;
};

StrokeCatalog.prototype.isTone1 = function() {
    return this.isHeng();
};

StrokeCatalog.prototype.isTone2 = function() {
    return this.isTi();
};

StrokeCatalog.prototype.isTone3 = function() {
    return this.isSWG();
};

StrokeCatalog.prototype.isTone4 = function() {
    return this.isShu();
};

StrokeCatalog.prototype.isTone5 = function() {
    return this.isHZG();
};
