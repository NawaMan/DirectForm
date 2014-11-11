/**
 * Javascript utilities needed for the demo.
 */
var demo = (function($) {
	
	var initModule, log;
	var $log;
	
	initModule = function($log_element) {
		$log = $log_element || $(".log");
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
	};
	
	return {
		initModule : initModule,
		log        : log
	};
})(jQuery);
