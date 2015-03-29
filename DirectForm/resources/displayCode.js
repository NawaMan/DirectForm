/**
 * Javascript utilities for displaying HTML and JavaScript code.
 */
var displayCode = (function($) {
    
    var isInitialized = false;
    var initModule;
    
    function prepareTemplatedCode() {
        $(".head > section > header").prepend($('<span id="test-result"></span>'));
        
        var codeArticle = $('<div></div>');
        var codeHeader  = $('<header></header>');
        codeArticle.attr('id', 'display-code');
        
        codeHeader.append($('<h3></h3>').text('Code'));
        
        var codeDiv = $('<div></div>');
        var htmlDiv = $('<div></div>');
        var jsDiv   = $('<div></div>');
        
        htmlDiv.addClass('has-detail');
        jsDiv  .addClass('has-detail');
        
        htmlDiv.append($('<span></span>').addClass('show-link').text('+'));
        jsDiv  .append($('<span></span>').addClass('show-link').text('+'));
        
        htmlDiv.append($('<span></span>').addClass('hide-link').text('-'));
        jsDiv  .append($('<span></span>').addClass('hide-link').text('-'));
        
        htmlDiv.append($('<h4></h4>').text('HTML'));
        jsDiv  .append($('<h4></h4>').text('JavaScript'));
        
        htmlDiv.append($('<div></div>').attr('id', 'disp-html-code').addClass('detail').append($('<pre></pre>').addClass('brush: xml')));
        jsDiv  .append($('<div></div>').attr('id', 'disp-js-code'  ).addClass('detail').append($('<pre></pre>').addClass('brush: js')));
        
        codeDiv.append(htmlDiv);
        codeDiv.append(jsDiv);
        
        codeArticle.append(codeHeader);
        codeArticle.append(codeDiv);
        
        $(".head section").append(codeArticle);
        
        $("#disp-html-code pre").text($("#HTML"      ).html());
        $("#disp-js-code   pre").text($("#JavaScript").html());
        SyntaxHighlighter.all();
        
        collapsible.apply(".has-detail");
    }
    
    initModule = function(option_map) {
        if (isInitialized) {
            return;
        }
        
        prepareTemplatedCode();
        
        isInitialized = true;
    };
    
    return {
        initModule : initModule,
    };
    
})(jQuery);
