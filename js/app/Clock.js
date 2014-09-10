//
//  Skritter HTML5 Client 
//  (C) Benjamin Blazke (benjiaming)
//

function Clock (skritter, clock) {
    this.skritter = skritter;
    this.clock = clock;
    this.mySeconds = this.myMinutes = this.myHours = 0;
};

Clock.prototype.prettifyNumber = function(number) {
    if (number < 10) {
        return "0" + number;
    }
    return number;
};

Clock.prototype.clockTick = function() {
    this.mySeconds++;
    if (this.mySeconds >= 60) {
      this.mySeconds = 0;
      this.myMinutes++;
    }
    if (this.myMinutes >= 60) {
      this.myMinutes = 0;
    }
    if (this.myHours) {
      this.clock.innerHTML = this.myHours + ":" + 
        this.prettifyNumber(this.myMinutes) + ":" + 
        this.prettifyNumber(this.mySeconds);
    } else {
      this.clock.innerHTML = this.myMinutes + ":" + 
      this.prettifyNumber(this.mySeconds);
    }
    if (this.myMinutes === 5 && this.mySeconds === 0) {
      this.skritter.writeMessage("Five minutes!");
    }
    this.elapsed++;
    if (this.elapsed === 30) {
       this.pauseTicking();
    }
};

Clock.prototype.startTicking = function() {
    if (this.clockId) {
        this.pauseTicking();
    }
    var self = this;
    this.elapsed = 0;
    this.clockId = setInterval(function() {self.clockTick(); }, 1000);
 };

Clock.prototype.pauseTicking = function() {
    clearInterval(this.clockId);
    this.clockId = null;
};

