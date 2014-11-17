/**
 * Javascript utilities needed for the demo.
 */
var demo = (function($) {
    
    var initModule, param, log, error, assert, assertLog, addUnitTest, runUnitTests;
    var $log, $allPass, $allFail;
    var unitTests = [];
    
    function AssertException(message) {
        this.name = "AssertException";
        this.message = (message || "");
    };
    
    AssertException.prototype = new Error();
    AssertException.prototype.constructor = AssertException;
    
    var runTest = function(test, testFunc, $testBtn, $testPass, $testFail, $testErr) {
        $testPass.hide();
        $testFail.hide();
        $testErr.hide();
        
        try {
            testFunc.apply(test);
            $testPass.show();
            return true;
        } catch(exception) {
            if (exception instanceof AssertException) {
                error(
                    "A test assertion fail: " + test.name,
                    "  @" + exception.fileName + "#" + exception.lineNumber);
                $testFail.show();
            } else {
                error(
                    "A test results in exception: " + test.name,
                    "  @" + exception.fileName + "#" + exception.lineNumber,
                    "Message: ",
                    exception.message);
                    
                $testErr.show();
            }
            return false;
        }
    }
    
    initModule = function($log_element) {
        $log = $log_element || $(".log");
        
        // Prepare code.
        $("#disp-html-code pre").text($("#HTML").html());
        $("#disp-js-code   pre").text($("#JavaScript"  ).html());
        // TODO - Automatically generate unit test code.
        SyntaxHighlighter.all();
        
        // TODO - Refactor this.
        // Prepare unit test table
        var $testRow  = $("<thead />").addClass('test-row');
        var $testBtn  = $("<input type='button'/>").addClass('test-button');
        var $testName = $("<span></span>").addClass('test-name');
        var $testDesc = $("<span></span>").addClass('test-desc');
        var $testPass = $("<span>PASS</span>").addClass('test-pass');
        var $testFail = $("<span>FAIL</span>").addClass('test-fail');
        var $testErr  = $("<span>ERROR</span>").addClass('test-error');
        $testName.text("Name");
        $testDesc.text("Description");
        $testBtn.val("Test All");
        $testBtn.click(function() {
            runUnitTests();
        });
        $testPass.hide();
        $testFail.hide();
        $testErr.hide();
        
        $testRow.append($("<td />").append($testName));
        $testRow.append($("<td />").append($testDesc));
        $testRow.append($("<td />").append($testBtn));
        $testRow.append($("<td />").append($testPass).append($testFail).append($testErr));
        
        $("#unit-tests table").append($testRow);
        
        $allPass = $testPass;
        $allFail = $testFail;
    };
    
    param = function(name) {
        if (!name) {
            return "";
        }
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
    
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
        return assert(actual, expected_text);
    };
    
    assert = function(actual_value, expected_value) {
        if (actual_value != expected_value) {
            demo.error("ACTUAL: ", actual_value, "EXPECTED", expected_value);
            throw new AssertException("Fail");
        }
    };
    
    addUnitTest = function(name, desc, testFunc) {
        var $testRow  = $("<tr />").addClass('test-row');
        var $testBtn  = $("<input type='button'/>").addClass('test-button');
        var $testName = $("<span></span>").addClass('test-name');
        var $testShow = $("<span>+</span>").addClass('show-code');
        var $testHide = $("<span>-</span>").addClass('hide-code');
        var $testDesc = $("<span></span>").addClass('test-desc');
        var $testPass = $("<span>PASS</span>").addClass('test-pass');
        var $testFail = $("<span>FAIL</span>").addClass('test-fail');
        var $testErr  = $("<span>ERROR</span>").addClass('test-error');
        $testName.text(name);
        $testDesc.text(desc);
        $testBtn.val("Test");
        $testPass.hide();
        $testFail.hide();
        $testErr.hide();
        
        $testRow.append($("<td />").append($testShow).append($testHide).append($testName));
        $testRow.append($("<td />").append($testDesc));
        $testRow.append($("<td />").append($testBtn));
        $testRow.append($("<td />").append($testPass).append($testFail).append($testErr));
        
        var $testCodeRow = $("<tr />").addClass('test-code-row');
        var $testCodeCol = $("<td />").attr('colspan', '4');
        var $testCodePre = $("<pre />").addClass("brush:").addClass("js");
        $testCodePre.text($("#" + name).html());
        $testCodeCol.append($testCodePre).css("padding", "0px");
        $testCodeRow.append($testCodeCol);
        
        $testShow.click(function() {
            $testCodeRow.show();
            $testShow.hide();
            $testHide.show();
        });
        $testHide.click(function() {
            $testCodeRow.hide();
            $testShow.show();
            $testHide.hide();
        });
        $testCodeRow.hide();
        $testShow.show();
        $testHide.hide();
        
        var testVar;
        var test;
        
        test = function() {
            return runTest(testVar, testFunc, $testBtn, $testPass, $testFail, $testErr);
        };
        testVar = {
            'name': name,
            'desc': desc,
            'test': test,
        };
        $testBtn.click(test);
        unitTests.push(testVar);
        
        $("#unit-tests table")
            .append($testRow)
            .append($testCodeRow);
    }
    
    runUnitTests = function(handler) {
        var isPassAll = true;
        for (var i = 0; i < unitTests.length; i++) {
            var unitTest = unitTests[i];
            var isPass = unitTest.test.apply(unitTest);
            if (handler) {
                handler.apply(unitTest, isPass);
            }
            if (!isPass) {
                isPassAll = false;
            }
        }
        
        if (isPassAll) {
            $allPass.show();
            $allFail.hide();
        } else {
            $allPass.hide();
            $allFail.show();
        }
        return isPassAll;
    }
    
    return {
        initModule   : initModule,
        param        : param,
        log          : log,
        error        : error,
        assertLog    : assertLog,
        assert       : assert, 
        addUnitTest  : addUnitTest,
        runUnitTests : runUnitTests,
    };
})(jQuery);
