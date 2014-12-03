/**
 * Javascript utilities for unit tests.
 */
var directJsUnit = (function($) {
    
    var isInitialized = false;
    var initModule, assert, addUnitTest, runUnitTests;
    var $allPass, $allFail;
    var unitTests = [];
    var optionMap = {};
    
    function AssertException(message) {
        this.name = "AssertException";
        this.message = (message || "");
    };
    AssertException.prototype = new Error();
    AssertException.prototype.constructor = AssertException;
    
    function prepareDefaultOptionMap(option_map) {
        if (option_map) {
            optionMap = option_map;
        } else {
            optionMap = {};
        }
        if (!('error' in optionMap)) {
            optionMap.error = function() {
                var str = "";
                for (var i = 0; i < arguments.length; i++) {
                    var arg = arguments[i];
                    var text = "";
                    if (((typeof arg) === 'string')
                    || ((typeof arg) === 'number')) {
                        text = "" + arg;
                    } else {
                        text = JSON.stringify(arg, undefined, 2);
                    }
                    if (str != "") {
                        str += "\n";
                    }
                    str += text;
                }
                alert(str);
            };
        }
    }
    
    function prepareTestRow($testRow, name, desc, btnLabel) {
        var $testBtn  = $("<input type='button'/>").addClass('test-button');
        var $testName = $("<span></span>").addClass('test-name');
        var $testDesc = $("<span></span>").addClass('test-desc');
        var $testPass = $("<span>PASS</span>").addClass('test-pass');
        var $testFail = $("<span>FAIL</span>").addClass('test-fail');
        var $testErr  = $("<span>ERROR</span>").addClass('test-error');
        
        $testPass.hide();
        $testFail.hide();
        $testErr.hide();
        
        $testRow.append($("<td />").append($testName));
        $testRow.append($("<td />").append($testDesc));
        $testRow.append($("<td />").append($testBtn));
        $testRow.append($("<td />").append($testPass).append($testFail).append($testErr));
        
        $testName.text(name);
        $testDesc.text(desc);
        $testBtn.val(btnLabel);
        
        return {
            btn  : $testBtn,
            name : $testName,
            desc : $testDesc,
            pass : $testPass,
            fail : $testFail,
            err  : $testErr,
        };
    };
    
    function prepareTestCodeRow($test, $code) {
        var $testShow = $("<span>+</span>").addClass('show-test-code');
        var $testHide = $("<span>-</span>").addClass('hide-test-code');
        
        $testShow.insertBefore($test.name);
        $testHide.insertBefore($test.name);
        
        var $testCodeRow = $("<tr />").addClass('test-code-row');
        var $testCodeCol = $("<td />").attr('colspan', '4');
        var $testCodePre = $("<pre />").addClass("brush:").addClass("js");
        $testCodePre.text($code.html());
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
        
        return $testCodeRow;
    }
    
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
                optionMap.error(
                    "A test assertion fail: " + test.name,
                    "  @" + exception.fileName + "#" + exception.lineNumber);
                $testFail.show();
            } else {
                optionMap.error(
                    "A test results in exception: " + test.name,
                    "  @" + exception.fileName + "#" + exception.lineNumber,
                    "Message: ",
                    exception.message);
                    
                $testErr.show();
            }
            return false;
        }
    };
    
    initModule = function(option_map) {
        if (isInitialized) {
            return;
        }
        
        prepareDefaultOptionMap(option_map);
        
        var $testRow  = $("<thead />").addClass('test-row');
        var $test = prepareTestRow($testRow, "Name", "Description", "Test All");
        $test.btn.click(function() {
            runUnitTests();
        });
        
        $(".unit-tests table").append($testRow);
        
        $allPass = $test.pass;
        $allFail = $test.fail;
        
        isInitialized = true;
    };
    
    assert = function(actual_value, expected_value) {
        if (actual_value != expected_value) {
            demo.error("ACTUAL: ", actual_value, "EXPECTED", expected_value);
            throw new AssertException("Fail");
        }
    };
    
    addUnitTest = function(name, desc, testFunc) {
        var $testRow = $("<tr />").addClass('test-row');
        var $test    = prepareTestRow($testRow, name, desc, "Test");
        var $code    = $("#" + name);
        var $codeRow = prepareTestCodeRow($test, $code);
        
        var testVar;
        var test;
        
        test = function() {
            return runTest(testVar, testFunc, $test.btn, $test.pass, $test.fail, $test.err);
        };
        testVar = {
            'name': name,
            'desc': desc,
            'test': test,
        };
        $test.btn.click(test);
        unitTests.push(testVar);
        
        $(".unit-tests table")
            .append($testRow)
            .append($codeRow);
    };
    
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
        
        SyntaxHighlighter.all();
        return isPassAll;
    };
    
    return {
        initModule   : initModule,
        assert       : assert, 
        addUnitTest  : addUnitTest,
        runUnitTests : runUnitTests,
    };
    
})(jQuery);