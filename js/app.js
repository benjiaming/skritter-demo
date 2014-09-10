//
//  Skritter HTML5
//  (C) Benjamin Blazke (benjiaming)
//
var system_includes = ["kinetic", "receiptverifier", "./install-button"];
var includes = [
    "Utils", "Clock", "Stroke", "Catalog", "Brush",
    "Recognizer", "Grading", "Messenger", "Dispatcher",
    "Speaker", "Score", "Scheduler", "Definition",
    "StrokeImages", "Toner", "Skritter"
].map(function(lib) { return "./app/" + lib; });

require (system_includes.concat(includes), function(r) {
   if (!window.debugEnabled) {
       $(".column-left").hide();
       return;
   }
   try {
       $("#skritter").Skritter({
           container: 'skritter',
           clock: $("#clock")[0],
           pos: $("#pos")[0],
           word_play_button: $('#word_play_button'),
           word_rdng_value: $("#word_rdng_value")[0],
           simp: $("#simp"),
           english:  $("#english")[0],
           buttons: $("#buttons")
       }).getApp().scheduler.nextQuestion();
   } catch(e) {
       alert("Skritter App Error: " + e);
       console.debug(e);
   }
});
