(function () {

    QUnit.config.autostart = false;

    var testModules = [
        "Utils",
        "Skritter"
    ].map(function(lib) { return "js/tests/" + lib + ".js"; });

    QUnit.stop();
    require(testModules, QUnit.start);
}());
