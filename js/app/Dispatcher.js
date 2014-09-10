//
//  Skritter HTML5 Client
//  (C) Benjamin Blazke (benjiaming)
//

function Dispatcher(dom) {
    this.skritter = dom.Skritter;
    this.dom = dom;
    this.app = this.skritter.getApp();
}

Dispatcher.prototype.registerEvents = function() {
    var self = this;
    self.skritter.blank = true;
    var brush = self.app.brush;

    document.body.addEventListener('touchmove', function(e) {
        e.preventDefault();
    });
    var canvas = self.app.stage.getContainer();

    if (window.hasTouch) {
        canvas.addEventListener("touchstart", function(e) {
            self.touchStartEvent(e, self);
        }, true);
        canvas.addEventListener("touchmove", function(e) {
            self.touchMoveEvent(e, self);
        }, true);
        canvas.addEventListener("touchend", function(e) {
            self.touchEndEvent(e, self);
        }, true);
    } else {
        $(canvas).bind("mousedown", function(e) {
            self.mouseDownEvent(e, self);
        });
        $(canvas).bind("mousemove", function(e) {
            self.mouseMoveEvent(e, self);
        });
        $(canvas).bind("mouseup", function(e) {
            self.mouseUpEvent(e, self);
        });
    }
};

Dispatcher.prototype.touchStartEvent = function(e, self) {
    var o = self.dom.offset();
    var brush = self.app.brush;
    e.preventDefault();
    if (e.touches.length > 0) {
        self.mouseDownEvent(e.touches[0], self);
    }
};

Dispatcher.prototype.touchMoveEvent = function(e, self) {
    var o = self.dom.offset();
    var brush = self.app.brush;
    e.preventDefault();
    if (e.touches.length > 0 && brush.active) {
        self.mouseMoveEvent(e.touches[0], self);
    }
};

Dispatcher.prototype.touchEndEvent = function(e, self) {
    var type = self.skritter.question.type;
    var brush = self.app.brush;

    e.preventDefault();
    if (e.touches.length === 0) {
        self.mouseUpEvent(e.touches[0], self);
    }
};

Dispatcher.prototype.mouseDownEvent = function(e, self) {
    var o = self.dom.offset();
    var brush = self.app.brush;
    var type = self.skritter.question.type;

    if (type === C_WRIT) {
        brush.strokeBegin(e.pageX - o.left, e.pageY - o.top);
    } else if (type === C_DEF) {
    } else if (type === W_DEF) {
    } else if (type === C_TONE) {
        if (!self.skritter.hasAnswer) {
            brush.strokeBegin(e.pageX - o.left, e.pageY - o.top);
        }
    } else {
        debug("Unsupported type for mouseDown", type);
    }
};

Dispatcher.prototype.mouseMoveEvent = function(e, self) {
    var o = self.dom.offset();
    var brush = self.app.brush;
    if (brush.active) {
        brush.strokeMove(e.pageX - o.left, e.pageY - o.top);
    }
};

Dispatcher.prototype.mouseUpEvent = function(e, self) {
    var type = self.skritter.question.type;
    var brush = self.app.brush;

    if (type === C_WRIT) {
        self.skritter.blank = !brush.strokeEnd() && self.skritter.blank;
    } else if (type === C_DEF || type === W_DEF) {
        if (self.skritter.hasAnswer) {
            if (self.app.definition.active) {
                self.app.scheduler.nextQuestion();
                self.app.definition.active = false;
                self.skritter.hasAnswer = false;
            } else {
                self.app.clock.pauseTicking();
                self.app.definition.showAnswer();
            }
        }
        self.skritter.hasAnswer = true;
    } else if (type === C_TONE) {
        if (self.skritter.hasAnswer) {
            self.skritter.showPinyin();
            self.app.scheduler.nextQuestion();
        } else {
            self.skritter.blank = !brush.strokeEnd() && self.skritter.blank;
            if (self.skritter.blank) {
                self.app.clock.pauseTicking();
                self.app.toner.showAnswer();
             }
        }
    } else {
        throw("Unsupported event for mouseUp: ", type);
    }
};
