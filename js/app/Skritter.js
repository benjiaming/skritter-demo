//
//  Skritter HTML5 Client
//  (C) Benjamin Blazke (benjiaming)
//

(function($) {
    var app = {};
    app.settings = {
		width: 350,
		height: 350,
		backgroundColor: "#ffffff",
		brushSize: 15,
		brushColor: "rgb(0,0,0)",
		soundURL: "http://write-way.appspot.com/sounds?file="
	};
	var layers = {
	    mainLayer:          new Kinetic.Layer(),
	    paintLayer:         new Kinetic.Layer(),
	    messageLayer:       new Kinetic.Layer(),
	    gradingLayer:       new Kinetic.Layer()
	};

	$.fn.Skritter = function(options) {
        if (debugEnabled) {
            options.pos.style.display = "block";
        }
        this.Skritter.init_(options, this);
        return this.Skritter;
	};

	$.fn.Skritter.init_ = function(options, dom) {
        app.w = app.settings.width;
        app.h = app.settings.height;
        app.stage = new Kinetic.Stage({
            container: options.container,
            width: app.w,
            height: app.h
        });
        app.clock = new Clock(this, options.clock);
        app.grading = new Grading(this, layers.gradingLayer);
        app.messenger = new Messenger(this, layers.messageLayer);
        app.speaker = new Speaker(this);
        app.score = new Score(this);
        app.scheduler = new Scheduler(this);
        app.definition = new Definiton(this, layers.paintLayer);
        app.toner = new Toner(this, layers.paintLayer);
        app.brush = new Brush(app.settings.brushSize,
            app.settings.brushColor, this, layers.paintLayer
        );
        app.recognizer = new Recognizer(this);
        app.strokeImages = new StrokeImages(this);
        app.strokeImages.loadAll();
        app.layers = layers;
        $.extend(app.settings, options);
        $.extend(app, layers);

        this.isSuccess = true;

        $.each(layers, function(layer) {
            app.stage.add(layers[layer]);
        });
        this.paintGrid();

        var dispatcher = new Dispatcher(dom);
        dispatcher.registerEvents();
	};

	$.fn.Skritter.clearLayers = function() {
        $.each(app.layers, function(layer) {
            layers[layer].clear();
        });
        app.layers.paintLayer.removeChildren();
	};

    $.fn.Skritter.clearCanvas = function() {
        app.layers.paintLayer.clear();
        app.layers.paintLayer.removeChildren();
        app.layers.gradingLayer.clear();
        app.layers.gradingLayer.removeChildren();
        this.clearGlow();
    };

    $.fn.Skritter.paintGrid = function() {
        var rectPoints = [
            [0, 0, app.w, app.h],
            [app.w, 0, 0, app.h],
            [0, app.h/2, app.w, app.h/2],
            [app.w/2, 0, app.w/2, app.h]
        ];
        $.each(rectPoints, function(i, myPoints) {
            app.layers.mainLayer.add(new Kinetic.Line({
                points: myPoints,
                stroke: "#dddddd",
                strokeWidth: 1
            }));
        });
        this.addButtons();
    };

	$.fn.Skritter.clear = function() {
	    this.clearCanvas();
		this.blank = true;
		if (this.question) {
    	    this.question.position = 0;
    	}
        app.brush.hasAnswer = false;
	};

    $.fn.Skritter.showSimp = function() {
        $('#simp').show();
    };

    $.fn.Skritter.hideSimp = function() {
        $('#simp').hide();
    };

    $.fn.Skritter.showEnglish = function() {
        $('#english').show();
    };

    $.fn.Skritter.hideEnglish = function() {
        $('#english').hide();
    };

    $.fn.Skritter.showPinyin = function() {
        $('#pinyin').show();
    };

    $.fn.Skritter.hidePinyin = function() {
        $('#pinyin').hide();
    };

	$.fn.Skritter.css = function(option, value) {
	    $("#" + app.settings.container).css(option, value);
	};


    $.fn.Skritter.showAnswer = function() {
        var type = C_WRIT;
        if (this.question && this.question.type) {
            type = this.question.type;
        }
        if (this.question.type === C_WRIT) {
            app.brush.showAnswer();
        } else if (this.question.type === C_DEF || this.question.type === W_DEF) {
            app.definition.showAnswer();
        }
    };

    $.fn.Skritter.glow = function(layer, myColor) {
        var myBlur = 0;
        var goingUp = true;
        app.glowInterval = setInterval(function() {
            if (!app.brush.readyToGlow) {
                return;
            }
            if (goingUp) {
                myBlur++;
                if (myBlur >= 20) {
                    goingUp = false;
                }
            } else {
                myBlur--;
                if (myBlur <= 5) {
                    goingUp = true;
                }
            }
            for (var i = 0; i < layer.getChildren().length; i++){
                var kid = layer.getChildren()[i];
				kid.setShadowColor(myColor);
				kid.setShadowOffset(5);
				kid.setShadowOpacity(0.8);
				kid.setShadowBlur(myBlur);
				/*
                kid.setShadow({
                    color: myColor,
                    blur: myBlur,
                    offset: [5, 5],
                    opacity: 0.8
                });
                */
            }
            layer.draw();
        }, 100);
    };

    $.fn.Skritter.clearGlow = function() {
        clearInterval(app.glowInterval);
        var layer = app.layers.paintLayer;
        var ctx = layer.getContext();
        ctx.shadowBlur = 0;
        layer.draw();
    };

	$.fn.Skritter.markSuccess = function() {
        this.css("border-color", app.grading.getGotItColor());
        this.isSuccess = true;
        app.messenger.writeMessage(app.score.getRandomSuccessMsg());
    };

    $.fn.Skritter.glowSuccess = function() {
        this.glow(app.layers.paintLayer, app.grading.getGotItColor());
    };

    $.fn.Skritter.markFail = function() {
        this.css("border-color", app.grading.getForgotColor());
        this.isSuccess = false;
    };

    $.fn.Skritter.glowFail = function() {
        this.glow(app.layers.paintLayer, app.grading.getForgotColor());
    };

    $.fn.Skritter.markReset = function() {
        this.css("border-color", "black");
    };

    $.fn.Skritter.toggleCorrect = function() {
        this.clearGlow();
        if (app.brush.isFailing()) {
            app.brush.resetMistakes();
            this.markSuccess();
            if (app.brush.hasAnswer) {
                this.glowSuccess();
                app.grading.paint();
            }
            debug("success");
        } else {
            app.brush.doFail();
            this.markFail();
            if (app.brush.hasAnswer) {
                this.glowFail();
                app.grading.paint();
            }
            debug("fail");
        }
    };

    $.fn.Skritter.canvasReset = function() {
        app.layers.paintLayer.setOpacity(1);
    };

    $.fn.Skritter.addButtons = function() {
        var images = [
            { back_button: function() {} },
            { erase_button: function() {
                if (self.question.type === C_WRIT || self.question.type === W_WRIT) {
                    self.clear();
                }
            }},
            { show_button: function() { self.showAnswer(); } },
            { correct_button: function() { self.toggleCorrect(); } },
            { next_button: function() {
                app.scheduler.nextQuestion();
                self.markSuccess();
              }
            }
        ];
        var self = this;
        $(images).each(function() {
            $.each(this, function(name, fun) {
                var loc = 'img/' + name + '.png';
                var image = $('<img />').attr(
                    {'src': loc, 'class': 'imgbutton', 'id': name}
                );
                image.bind('dragstart', function(e) { e.preventDefault(); });
                image.click(fun);
                app.settings.buttons.append(image);
            });
        });
    };

    $.fn.Skritter.canvasWidth = function() {
        return app.settings.width;
    };

    $.fn.Skritter.canvasHeight = function() {
        return app.settings.height;
    };

    $.fn.Skritter.getSuccess = function() {
        return this.isSuccess;
    };

    $.fn.Skritter.getApp = function() {
        return app;
    };
})($);
