/**
 * Javascript utilities needed for the demo.
 */
var demo = (function($) {
    
    var isInitialized = false;
    
    var initModule, param, log, error, assertLog, randomInt, format;
    var $log;
    
    initModule = function() {
        if (isInitialized) {
            return;
        }
        
        $log = $('<div class="log" ></div>');
        $("body").append($log);
        
        // Prepare code.
        $("#disp-html-code pre").text($("#HTML"      ).html());
        $("#disp-js-code   pre").text($("#JavaScript").html());
        SyntaxHighlighter.all();
        
        isInitialized = true;
    };
    
    param = function(name) {
        if (!name) {
            return "";
        }
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };
    
    log = function() {
        var $div = $("<div />");
        $div.append($("<div />").text(new Date()));
        for (var i = 0; i < arguments.length; i++) {
            var arg = arguments[i];
            var text = "";
            if (((typeof arg) === 'string')
             || ((typeof arg) === 'number')) {
                text = "" + arg;
            } else {
                text = JSON.stringify(arg, undefined, 2)
            }
            $div.append($("<div />").text(text))
        }
        $log.prepend($div);
        return $div;
    };
    
    error = function() {
        var $div = log.apply(this, arguments);
        $div.addClass("error-log");
    };
    
    assertLog = function(expected_text) {
        var actual = $(".log div:first-child div:nth-child(2)").text();
        return directJsUnit.assert(actual, expected_text);
    };
    
    format = function() {
        var str = arguments[0], i = 0;
        while (/%s/.test(str)) {
            str = str.replace("%s", arguments[1 + i++]);
        }
        return str;
    };
    
    randomInt = function(max) {
        return Math.floor(Math.random()*(max + 1));
    };
    
    return {
        initModule : initModule,
        param      : param,
        log        : log,
        error      : error,
        assertLog  : assertLog,
        randomInt  : randomInt,
        format     : format,
    };
})(jQuery);
