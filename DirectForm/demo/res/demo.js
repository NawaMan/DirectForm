/**
 * Javascript utilities needed for the demo.
 */
var demo = (function($) {
    
    var initModule, param, log, error, assertLog, addUnitTest, runUnitTests;
    var $log, $allPass, $allFail;
    var unitTests = [];
    
    var runTest = function(test, $testBtn, $testPass, $testFail) {
        var isPass = test.apply($testBtn);
        if (isPass) {
            $testPass.show();
            $testFail.hide();
        } else {
            $testPass.hide();
            $testFail.show();
        }
        return isPass;
    }
    
    initModule = function($log_element) {
        $log = $log_element || $(".log");
        
        // Prepare code.
        $("#disp-code .show-link").click(function() {
            $("#disp-code .code").show();
            $("#disp-code .show-link").hide();
            $("#disp-code .hide-link").show();
        });
        $("#disp-code .hide-link").click(function() {
            $("#disp-code .code").hide();
            $("#disp-code .show-link").show();
            $("#disp-code .hide-link").hide();
        });
        $("#disp-html-code pre").text($("#demo-html").html());
        $("#disp-js-code   pre").text($("#demo-js"  ).html());
        // TODO - Automatically generate unit test code.
        SyntaxHighlighter.all();
        
        $(".code").hide();
        $(".hide-link").hide();
        $(".show-link").show();
        
        // TODO - Refactor this.
        // Prepare unit test table
        var $testRow  = $("<thead />").addClass('test-row');
        var $testBtn  = $("<input type='button'/>").addClass('test-button');
        var $testName = $("<span></span>").addClass('test-name');
        var $testDesc = $("<span></span>").addClass('test-desc');
        var $testPass = $("<span>PASS</span>").addClass('test-pass');
        var $testFail = $("<span>FAIL</span>").addClass('test-fail');
        $testName.text("Name");
        $testDesc.text("Description");
        $testBtn.val("Test All");
        $testBtn.click(function() {
            runUnitTests();
        });
        $testPass.hide();
        $testFail.hide();
        
        $testRow.append($("<td />").append($testName));
        $testRow.append($("<td />").append($testDesc));
        $testRow.append($("<td />").append($testBtn));
        $testRow.append($("<td />").append($testPass).append($testFail));
        
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
        if (actual != expected_text) {
            demo.error("ACTUAL: ", actual, "EXPECTED", expected_text);
            return false;
        }
        return true;
    };
    
    addUnitTest = function(name, desc, test) {
        var $testRow  = $("<tr />").addClass('test-row');
        var $testBtn  = $("<input type='button'/>").addClass('test-button');
        var $testName = $("<span></span>").addClass('test-name');
        var $testDesc = $("<span></span>").addClass('test-desc');
        var $testPass = $("<span>PASS</span>").addClass('test-pass');
        var $testFail = $("<span>FAIL</span>").addClass('test-fail');
        $testName.text(name);
        $testDesc.text(desc);
        $testBtn.val("Test");
        $testBtn.click(function() {
            return runTest(test, $testBtn, $testPass, $testFail);
        });
        $testPass.hide();
        $testFail.hide();
        
        $testRow.append($("<td />").append($testName));
        $testRow.append($("<td />").append($testDesc));
        $testRow.append($("<td />").append($testBtn));
        $testRow.append($("<td />").append($testPass).append($testFail));
        
        unitTests.push({
            'name': name,
            'desc': desc,
            'test': function() {
                return runTest(test, $testBtn, $testPass, $testFail);
            },
        });
        
        $("#unit-tests table").append($testRow);
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
        addUnitTest  : addUnitTest,
        runUnitTests : runUnitTests,
    };
})(jQuery);
