//
//  Skritter HTML5 Client
//  (C) Benjamin Blazke (benjiaming)
//

function Speaker(skritter) {
    this.skritter = skritter;
    this.app = skritter.getApp();
}

Speaker.prototype.playSound = function(sound) {
    if (window.isInstalled) {
        return;
    }
    return;
    if (!sound.match(' ')) {
        sound = this.convertTones(sound);
        this.app.settings.word_play_button.html(
            "<embed src='" + this.app.settings.soundURL +
         sound + ".mp3' hidden=true autostart=true loop=false>"
        );
        return;
    };
    var sounds = sound.split(' ');
    var self = this;
    var sound = self.convertTones(sounds[0]);
    var html = "<embed src='" + self.app.settings.soundURL +
        sound + ".mp3' hidden=true autostart=true loop=false>";
    self.app.settings.word_play_button.html(html);
    var question = self.skritter.question;
    $.each(sounds, function(one_sound) {
        if (sounds[one_sound] !== sounds[0]) {
            sound = self.convertTones(sounds[one_sound]);
            html = "<embed src='" + self.app.settings.soundURL +
                sound + ".mp3' hidden=true autostart=true loop=false>";
            setTimeout(function() {
                if (question !== self.skritter.question) {
                    self.app.settings.word_play_button.html(html);
                }
            }, 1000);
        }
    });
};

Speaker.prototype.installSound = function(sound) {
    var self = this;
    self.app.settings.word_play_button.click(function() {
        self.playSound(sound);
    });
};

Speaker.prototype.convertTones = function(sound) {
    var table = {
        'ā': ['a', 1],
        'ǎ': ['a', 3],
        'à': ['a', 4],
        'ě': ['e', 3],
        'è': ['e', 4],
        'ī': ['i', 1],
        'í': ['i', 2],
        'ǐ': ['i', 3],
        'ì': ['i', 4],
        'ō': ['o', 1],
        'ó': ['o', 2]
    };
    for (var char in table) {
        if (sound.match(char)) {
            sound = sound.replace(char, table[char][0]);
            sound += table[char][1];
            break;
        }
    }
    return sound;
};
