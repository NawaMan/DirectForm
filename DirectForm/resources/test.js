/**
 * Javascript utilities for test.
 */
var test = (function($) {
    
    var isInitialized = false;
    var initModule, assert, success, fail, pass, complete;
    var error, onSuccess, onFail, onComplete;
    var stateMap = {
        complete: false,
        pass:     false,
    };
    var optionMap = {};
    
    function AssertException(message) {
        this.name = "AssertException";
        this.message = (message || "");
    };
    AssertException.prototype = new Error();
    AssertException.prototype.constructor = AssertException;
    
    error = function() {
        demo.error.apply(this, arguments);
    };
    onSuccess = function() {
    };
    onFail = function() {
    };
    onComplete = function(pass) {
        var $a = $('<a></a>')
            .attr('href', ("" + document.location).replace(/\?.+$/, ''))
            .attr('title', "Click to open: " + document.getElementsByTagName("title")[0].innerHTML);
        $('#test-result').append($a);
        
        if (pass) {
            demo.log("Test pass!");
            $('body').addClass('pass');
            $a.text('PASS');
            
        } else {
            demo.error("Test fail!");
            $('body').addClass('fail');
            $a.text('FAIL');
        }
    };
    
    function prepareTemplatedCode() {
        $("body").append($('<div class="log" ></div>'));
        $(".head > section > header").prepend($('<span id="test-result"></span>'));
        
        $.get('test.html-fragment', function(data) {
            var htmlFragment = $(data.activeElement).html();
            $(".head section").append($(htmlFragment));
            
            $("#disp-html-code pre").text($("#HTML"      ).html());
            $("#disp-js-code   pre").text($("#JavaScript").html());
            SyntaxHighlighter.all();
            
            collapsible.apply(".has-detail");
        });
    }
    
    function prepareDefaultOptionMap(option_map) {
        if (option_map) {
            optionMap = option_map;
        } else {
            optionMap = {};
        }
        if ('error' in optionMap) {
            error = optionMap.error; 
        }
        if ('onSuccess' in optionMap) {
            onSuccess = optionMap.onSuccess; 
        }
        if ('onFail' in optionMap) {
            onFail = optionMap.onFail; 
        }
        if ('onComplete' in optionMap) {
            onComplete = optionMap.onComplete; 
        }
    }
    
    function handleCompact() {
        if (demo.param("compact") != 'true') {
            return;
        }
        
        $('body').addClass('compact');
        $('#test-title').attr('title', $('#test-name').text() + ": " + $('#test-summary').text());
    }
    
    initModule = function(option_map) {
        if (isInitialized) {
            return;
        }
        
        prepareDefaultOptionMap(option_map);
        prepareTemplatedCode();
        handleCompact();
        
        isInitialized = true;
        
    };
    
    assert = function(actual_value, expected_value) {
        if (actual_value != expected_value) {
            fail("ACTUAL: ", actual_value, "", "EXPECTED: ", expected_value);
        }
    };
    
    success = function() {
        if (stateMap.complete) {
            return;
        }
        
        stateMap.pass     = true;
        stateMap.complete = true;
        
        onSuccess();
        onComplete(stateMap.pass);
    };
    
    fail = function() {
        if (stateMap.complete) {
            return;
        }
        
        stateMap.pass     = false;
        stateMap.complete = true;
        
        if (arguments.length == 0) {
            error("Test fail!");
        } else {
            error.apply(this, arguments);
        }
        
        onFail();
        onComplete(stateMap.pass);
        
        throw new AssertException("Fail");
    };
    
    pass = function() {
        return stateMap.pass;
    };
    
    complete = function() {
        return stateMap.complete;
    };
    
    return {
        initModule : initModule,
        assert     : assert, 
        success    : success,
        fail       : fail,
        pass       : pass,
        complete   : complete,
    };
    
})(jQuery);
