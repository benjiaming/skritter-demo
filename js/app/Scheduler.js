//
//  Skritter HTML5 Client
//  (C) Benjamin Blazke (benjiaming)
//

var C_WRIT = 0;
var C_DEF = 1;
var C_TONE = 2;
var C_RDNG = 3;
var W_WRIT = 4;
var W_DEF = 5;
var W_TONE = 6;
var W_RDNG = 7;

function Scheduler(skritter) {
    this.skritter = skritter;
    this.app = skritter.getApp();
    this.charCnt = 0;
    this.itemCnt = -1;
}

Scheduler.prototype.nextItem = function() {
    var items = this.studyItems();
    var chars = this.charTable();
    if (this.itemCnt >= items.length - 1) {
        this.itemCnt = 0;
    } else {
        this.itemCnt++;
    }
    var item = items[this.itemCnt];
    var aChar = this.getCharByPos(chars, item);
    if (!aChar) {
        debug("BUG: cannot find definition for " + item.simp);
        return;
    }
    this.app.speaker.installSound(aChar.pinyin);
    this.app.speaker.playSound(aChar.pinyin);

    return [aChar, item.study];
};

Scheduler.prototype.nextQuestion = function() {
    this.skritter.clear();
    this.app.score.update(this.skritter.question);

    var nextThing = this.nextItem();
    var item = nextThing[0];
    var questionType = nextThing[1];
    var cssClass = "tone" + item.tone;
    this.skritter.question = {
        html: '<span id="simp" class="' + cssClass + '">' + 
            item.simp + '</span><span id="pinyin" class="' + 
            cssClass + '">' + item.pinyin + '</span>',
        character: item,
        position: 0,
        type: questionType
    };
    this.skritter.hasAnswer = false;
    
    this.app.settings.english.innerHTML = this.skritter.question.character.english;
    this.app.settings.word_rdng_value.innerHTML = this.skritter.question.html;

    if (questionType === C_WRIT) {
        this.app.messenger.writeMessage("Paint strokes here...");
        this.app.layers.mainLayer.draw();                      
        this.skritter.hideSimp();
    }
    if (questionType === C_DEF || questionType === W_DEF) {
        this.skritter.hideEnglish();
        this.app.definition.ask();
    }
    if (questionType === C_TONE) {
        this.skritter.hidePinyin();
        this.app.toner.ask();
    }
    this.app.clock.startTicking();
    this.updateQuote();
};

Scheduler.prototype.getCharByPos = function(chars, item) {
    for (var c in chars) {
        if (chars[c].simp === item.simp) {
            return chars[c];
        }
    }
    return null;
};

Scheduler.prototype.updateQuote = function() {
    $('#original_recipe').html(this.getRandomQuote());
};

Scheduler.prototype.getRandomQuote = function() {
    var quotes = [
        {"source": "Wizard People Dear Readers", "recipe": "Ta da! Ta da! Ta da forever!"},
        {"source": "benjiaming, November 2012", "recipe": "Look ma, no Flash!"},
        {"source": "Napoleon Dynamite", "recipe": "How was school today, Napoleon?<br> Worst day of my life, what do you think?"},
        {"source": "Monty Python's The Meaning of Life", "recipe": "Hello, Doctor, during the night, Ol' Perkins here <br>got his leg bitten sort of ... off."},
        {"source": "", "recipe": "Ice cream was served to new arrivals at Ellis Island, <br>but as most people had never encountered it before,<br> they just spread it on toast."},
        {"source": "George", "recipe": "You're part of a league of mastodons!"},
        {"source": "Futurama, Calculon", "recipe": "Nay, I respect and admire Harold Zoid too much<br> to beat him to death with his own Oscar."},
        {"source": "Marco, Sealab 2021", "recipe": "I have the strength of a bear <br>that has the strength of two bears."}
    ];
    var randomQuote = quotes[Math.floor((Math.random()*quotes.length))];    
    var html = 
        "<div id='original_recipe' title='" + randomQuote.source + "'>" + 
        randomQuote.recipe + "</div>";
    return html;
};

Scheduler.prototype.charTable = function() {
     return [
       {simp:"地",pinyin:"dì",tone:4,english:"earth",strokes:["heng-4","shu-2","ti","hengzhigou-1","shu-3","shuwangou-1"]},
       {simp:"一",pinyin:"yī",tone:1,english:"one",strokes:["heng"]},
       {simp:"二",pinyin:"èr",tone:4,english:"two",strokes:["heng-2a","heng-3"]},
       {simp:"三",pinyin:"sān",tone:1,english:"three",strokes:["heng-1","heng-2","heng-3"]},
       {simp:"十",pinyin:"shí",tone:2,english:"ten",strokes:["heng","shu"]},
       {simp:"也",pinyin:"yě",tone:3,english:"also",strokes:["hengzhigou","shu-1","shuwangou"]},
       {simp:"好",pinyin:"hǎo",tone:3,english:"good; well; proper",strokes:[]},
       {simp:"你",pinyin:"nǐ",tone:3,english:"you",strokes:[]},
       {simp:"你好",pinyin:"nǐ hǎo",tone:3,english:"hi; hello",strokes:[]},
       {simp:"中国",pinyin:"zhōng guó",tone:3,english:"China",strokes:[]}
     ];
};

Scheduler.prototype.studyItems = function() {
    return [
//       {simp:"十", study:C_TONE},
       {simp:"你好", study:W_DEF},    
       {simp:"一", study:C_WRIT},
       {simp:"二", study:C_WRIT},
       {simp:"三", study:C_DEF},
       {simp:"十", study:C_WRIT},
       {simp:"也", study:C_WRIT},
       {simp:"地", study:C_DEF},
//       {simp:"一", study:C_TONE},
       {simp:"三", study:C_WRIT},
       {simp:"一", study:C_DEF},
       {simp:"中国", study:W_DEF},
       {simp:"你", study:C_DEF},
       {simp:"好", study:C_DEF},
       {simp:"二", study:C_DEF},
       {simp:"也", study:C_DEF},
       {simp:"地", study:C_WRIT},
       {simp:"十", study:C_DEF}
    ];
};
