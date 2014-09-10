//
//  Skritter HTML5 Client
//  (C) Benjamin Blazke (benjiaming)
//
function Brush(brushSize, brushColor, skritter, layer) {
    this.brushSize = brushSize;
    this.brushColor = brushColor;
    this.drawn = false;
    this.active = false;
    this.hasAnswer = false;
    this.resetPoints();
    this.skritter = skritter;
    this.app = skritter.getApp();
    this.mistakes = 0;
    this.maxAllowedMistakes = 3;
    this.layer = layer;
    this.points = {};
    this.catalog = new StrokeCatalog(this.skritter);
    this.context = this.layer.getContext();
    this.stroke = new Stroke(this.skritter);
    this.stroke.preloadStrokes();
};

Brush.prototype.getPoints = function() {
    return this.points;
};

Brush.prototype.resetPoints = function() {
    this.points = {
        startX : null,
        startY : null,
        leftX : null,
        leftY : null,
        rightX : null,
        rightY : null,
        downX : null,
        downY : null,
        endX : null,
        endY : null,
        prevX : null,
        prevY : null
    };
};

Brush.prototype.updatePoints = function(x, y) {
    if (x < this.points.leftX) {
        this.points.leftX = x;
        this.points.leftY = y;
    }
    if (x > this.points.rightX) {
        this.points.rightX = x;
        this.points.rightY = y;
    }
    if (y < this.points.upY) {
        this.points.upX = x;
        this.points.upY = y;
    }
    if (y > this.points.downY) {
        this.points.downX = x;
        this.points.downY = y;
    }
    this.points.endX = x;
    this.points.endY = y;
    this.points.prevX = x;
    this.points.prevY = y;
};

Brush.prototype.strokeBegin = function(x, y) {
    this.skritter.canvasReset();
    if (this.hasAnswer) {
        this.skritter.markReset();
        this.skritter.clearCanvas();
        return;
    }
    this.active = true;
    var p = this.points;
    p.startX = p.leftX = p.rightX = p.downX = p.upX = x;
    p.startY = p.leftY = p.rightY = p.downY = p.upY = y;

    p.prevX = x;
    p.prevY = y;
    //        this.group = new Kinetic.Group();
    //        this.layer.add(this.group);
};

Brush.prototype.paintStroke = function(x, y) {
    var context = this.context;
    context.beginPath();
    context.moveTo(this.points.prevX, this.points.prevY);
    context.lineTo(x, y);
    context.strokeStyle = this.brushColor;
    context.lineCap = "round";
    context.lineWidth = this.brushSize;
    context.stroke();
};

Brush.prototype.slow_paintStroke = function(x, y) {
    this.group.add(new Kinetic.Line({
        points : [this.points.prevX, this.points.prevY, x, y],
        stroke : this.brushColor,
        strokeWidth : this.brushSize,
        lineCap : "round"
    }));
    this.layer.draw();
};

Brush.prototype.strokeMove = function(x, y) {
    if (this.hasAnswer) {
        return;
    }
    this.drawn = this.active;
    this.paintStroke(x, y);
    this.updatePoints(x, y);
};

Brush.prototype.fadeOutStroke = function(isCorrect) {
    var context = this.layer.getContext();
    context.closePath();
    this.layer.draw();
};

Brush.prototype.slow_fadeOutStroke = function(isCorrect) {
    if (isCorrect) {
        this.group.removeChildren();
        this.layer.draw();
        return;
    }
    var self = this;
    var shadowColor = "blue";
    if (!self.skritter.getSuccess()) {
        shadowColor = self.app.grading.getForgotColor();
    }
    this.readyToGlow = false;

    var kids = this.group.getChildren();
    $.each(kids, function(id) {
        var kid = kids[id];
        debug(kid.getPoints());
        kid.setShadow({
            color: shadowColor,
            blur: 10
        });
        kid.setAttrs({
            stroke: shadowColor
        });
        window.requestAnimFrame(function() {
            kid.transitionTo({
                opacity: 0,
                duration: 0.3,
                y: 30,
                callback: function() {
                    kid.remove();
                    if (id === kids.length - 1) {
                        this.readyToGlow = true;
                    }
                }
            });
        });
    });
};

Brush.prototype.strokeEnd = function() {
    if (this.hasAnswer) {
        this.skritter.canvasReset();
        this.app.scheduler.nextQuestion();
        this.hasAnswer = false;
        return;
    }
    var p = this.points;
    if (p.startX !== p.endY && p.endX !== p.endY) {
        var currentQ = this.skritter.question;
        var inputStroke, shouldBe, isLastStroke;
        if (currentQ.type === C_TONE) {
            var tone = currentQ.character.tone;
            shouldBe = this.stroke.normalizeStroke('tone' + tone);
            inputStroke = this.catalog.identifyTone(shouldBe, p);
            isLastStroke = true;
        } else {
            debug(currentQ.character.strokes[currentQ.position]);
            shouldBe = this.stroke.normalizeStroke(currentQ.character.strokes[currentQ.position]);
            inputStroke = this.catalog.identifyStroke(shouldBe, p);
            isLastStroke = (currentQ.position + 1 >= currentQ.character.strokes.length);
        }
        debug("should be: " + shouldBe.stroke + " var: " + shouldBe.variation);
        debug("got stroke: " + inputStroke);
        debug("isLast: " + isLastStroke);
        if (shouldBe.stroke === inputStroke) {
            this.fadeOutStroke(true);
            currentQ.position++;
            debug("got a match!!");
            var imgObj = this.stroke.getImg(shouldBe);
            if (imgObj) {
                this.paintImg(imgObj, true, this.points, isLastStroke);
            }
            if (isLastStroke) {
                this.skritter.showSimp();
                var toColorize;
                if (!this.isFailing()) {
                    this.skritter.markSuccess();
                    if (currentQ.type !== C_TONE) {
                        this.skritter.glowSuccess();
                    }
                } else {
                    if (currentQ.type !== C_TONE) {
                        this.skritter.glowFail();
                    }
                    this.skritter.markFail();
                }
                this.hasAnswer = true;
                this.app.grading.paint();
                this.resetMistakes();
                this.app.clock.pauseTicking();
            }
        } else {
            this.fadeOutStroke(false);
            this.mistakes++;
            if (this.mistakes === this.maxAllowedMistakes) {
                debug("mistake!!");
                this.skritter.markFail();
            }
        }
    } else {
        this.fadeOutStroke(true);
    }
    this.resetPoints();
    this.active = false;
    if (this.drawn) {
        this.drawn = false;
        return true;
    }
    return false;
};


Brush.prototype.paintImg = function(imgObj, animate, p, isLast) {
    var self = this;
    var img = new Image();
    var myX, myY, myWidth, myHeight;
    if (animate) {
        myX = p.startX;
        myY = p.startY;
        myWidth = Math.abs(p.endX - p.startX);
        myHeight = Math.abs(p.endY - p.startY);
    } else {
        myX = imgObj[1];
        myY = imgObj[2];
        myWidth = imgObj[3];
        myHeight = imgObj[4];
    }
    img.onload = function() {
        var stroke = new Kinetic.Image({
            x: myX,
            y: myY,
            image : img,
            width: myWidth,
            height: myHeight
        });
        self.layer.add(stroke);
        self.readyToGlow = false;
        if (animate) {
            var tween = new Kinetic.Tween({
                node: stroke,
                x: imgObj[1],
                y: imgObj[2],
                width: imgObj[3],
                height: imgObj[4],
                duration: 0.3,
                onFinish: function() {
                    if (!isLast) {
                        return;
                    }
                    
                    var newImg = new Image();
                    newImg.src = self.layer.toDataURL();
                    newImg.onload = function() {
                        var composite = new Kinetic.Image({
                            x: 0,
                            y: 0,
                            image: newImg,
                            width: self.app.settings.width,
                            height: self.app.settings.height
                        });
                        self.layer.removeChildren();
                        self.layer.add(composite);
                        self.layer.draw();
                        self.readyToGlow = true;
                    };
                }
            });
            tween.play();
/*            
            window.requestAnimFrame(function() {
                stroke.transitionTo({
                    x : imgObj[1],
                    y : imgObj[2],
                    width : imgObj[3],
                    height : imgObj[4],
                    duration : 0.3,
                    callback : function() {
                        if (!isLast) {
                            return;
                        }
                        var newImg = new Image();
                        newImg.src = self.layer.toDataURL();
                        newImg.onload = function() {
                            var composite = new Kinetic.Image({
                                x : 0,
                                y : 0,
                                image : newImg,
                                width : self.app.settings.width,
                                height : self.app.settings.height
                            });
                            self.layer.removeChildren();
                            self.layer.add(composite);
                            self.layer.draw();
                            self.readyToGlow = true;
                        };
                    }
                });
            });
*/                
        } else {
            self.layer.draw();
        }
    };
    img.src = "img/" + imgObj[0];
};

Brush.prototype.new_paintImg = function(coords, animate, points, isLast) {
    var self = this;
    var domImg = new Image();
    var myX, myY, myWidth, myHeight;
    if (animate) {
        myX = points.startX;
        myY = points.startY;
        myWidth = Math.abs(points.endX - points.startX);
        myHeight = Math.abs(points.endY - points.startY);
    } else {
        myX = coords[1];
        myY = coords[2];
        myWidth = coords[3];
        myHeight = coords[4];
    }
    domImg.onload = function() {
        var kinImg = new Kinetic.Image({
            x: myX,
            y: myY,
            image: img,
            width: myWidth,
            height: myHeight
        });
        self.layer.add(kinImg);
        self.readyToGlow = false;
        if (animate) {
            window.requestAnimFrame(function() {
                kinImg.transitionTo({
                    x: coords[1],
                    y: coords[2],
                    width: coords[3],
                    height: coords[4],
                    duration: 0.3,
                    callback: function() {
                        if (!isLast) {
                            return;
                        }
                        var newImg = new Image();
                        newImg.src = self.layer.toDataURL();
                        newImg.onload = function() {
                            var composite = new Kinetic.Image({
                                x: 0,
                                y: 0,
                                image: newImg,
                                width: self.app.settings.width,
                                height: self.app.settings.height
                            });
                            self.layer.removeChildren();
                            self.layer.add(composite);
                            self.layer.draw();
                            self.readyToGlow = true;
                        };
                    }
                });
            });
        } else {
            self.layer.draw();
        }
    };
    domImg.src = "img/" + coords[0];
};

Brush.prototype.isFailing = function() {
    return this.mistakes >= this.maxAllowedMistakes;
};

Brush.prototype.resetMistakes = function() {
    this.mistakes = 0;
};

Brush.prototype.doFail = function() {
    this.mistakes = this.maxAllowedMistakes + 1;
};

Brush.prototype.paintAnswer = function() {
    var self = this;
    var currentChar = this.skritter.question.character;
    $.each(currentChar.strokes, function(i, aStroke) {
        var img = self.stroke.getImg(self.stroke.normalizeStroke(aStroke));
        self.paintImg(img, false, this.points);
    });
    this.tintImg();
};

Brush.prototype.tintImg = function() {
    this.layer.setOpacity(.5);
};

Brush.prototype.showAnswer = function() {
    if (this.hasAnswer) {
        return;
    }
    this.paintAnswer();
    this.app.brush.doFail();
    this.app.brush.hasAnswer = true;
    this.skritter.markFail();
};

define("brush", [], function() { return Brush; });
