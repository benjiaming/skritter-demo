//
//  Skritter HTML5 Client
//  (C) Benjamin Blazke (benjiaming)
//
function Score(skritter) {
    this.skritter = skritter;
    this.app = skritter.getApp();
    this.initBoard_();
}

Score.prototype.initBoard_ = function() {
    this.board = {
        c_writ : [],
        c_defn : [],
        c_rdng : [],
        c_tone : [],
        w_writ : [],
        w_defn : [],
        w_rdng : [],
        w_tone : []
    };
};

Score.prototype.update = function(q) {
    if (!q) {
        return;
    }
    var arr, msg;
    if (q.type === C_WRIT) {
        arr = this.board.c_writ;
        msg = "Char Writing";
    } else if (q.type === C_DEF) {
        arr = this.board.c_rdng;
        msg = "Char Definition";
    } else if (q.type === W_DEF) {
        arr = this.board.w_rdng,
        msg = "Word Definition";
    } else if (q.type === C_TONE) {
        arr = this.board.c_tone;
        msg = "Char Tone";
    } else {
        debug("Unsupported type for score: " + q.type);
    }
    if (this.skritter.isSuccess) {
        if (arr.indexOf(q.character.simp) !== -1) {
            return;
        }
        arr.push(q.character.simp);
        this.app.messenger.plusOneMessage(
            'Learned +1 ' + msg + ' (' + arr.length + ')'
        );
    } else {
        this.board.c_writ = arr.filter(function(value) {
            return value !== q.character.simp;
        });
    }
};

Score.prototype.getRandomSuccessMsg = function() {
    var messages = [
        "Good!",
        "Yes.",
        "Correct.",
        "对.",
        "不错!",
        "That's right.",
        "Awesome job.",
        "Terrific.",
        "Well done!",
        "You're absolutely right.",
        "A masterful play.",
        "Most correct!",
        "Amazing performance!",
        "太棒了。",
        "Nobel prize!"
    ];
    return messages[Math.floor((Math.random() * messages.length))];
};


