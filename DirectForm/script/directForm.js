/**
 * DirectForm.
 * 
 * DirectForm is a JavaScript utility for HTML form fields processing.
 */

var directForm = (function($) {
    
    var initModule, makeForm;
    var stateMap = {
        isModuleInitialized: false,
    };
    
    initModule = function() {
        if (stateMap.isModuleInitialized) {
            return false;
        }
        
        stateMap.isModuleInitialized = true;
        return true;
    };
    
    function extractParameterName($element) {
        var name = $element.attr("data-name");
		if (!name) {
			name = $element.attr("id");
		}
        return name;
    }
    
    function extractParameterValue($element) {
        return $element.val();
    }
    
    function extractParameters($target) {
        var fields = {};
        var values = {};
        
        $target.find("input").each(function() {
            var $This = $(this);
            if ($This.is("input[type=button]")) {
                return;
            }
            
            var name = extractParameterName($This);
            var value = extractParameterValue($This);
            values[name] = value;
            fields[name] = {
                'value': value,
                'element': $This
            };
        });
        return { 'fields': fields, 'values': values };
    }
    
    function trigEvent($element, name, data) {
        $element = $($element);
        var event = $.Event(name);
        $.each(data, function(prop, value) {
            event[prop] = data[prop];
        });
        $element.trigger(event);
    }
    
    makeForm = function ($target) {
        if (!$target) {event
            return;
        }
        $target = $($target);
        var widgetVar;
        
        $target.bind('callSubmit', function (e) {
            var $This = $(this);
            var result = extractParameters($This);
            var values = result.values;
            var fields = result.fields;
            
            trigEvent($This, 'submit', {
                values : result.values,
                fields : result.fields,
            });
        });
        
        widgetVar = {
            'submit': function() {
                var event = $.Event('callSubmit');
                $target.trigger(event);
            }
        };
        
        return widgetVar;
    };
    
    return {
        initModule : initModule,
        makeForm   : makeForm
    };
})(jQuery);