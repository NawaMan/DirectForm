/**
 * Simple tools for making collapsible component.
 */
var collapsible = (function($) {
    var initModule, apply;
    
    initModule = function (){
        
    };
    
    apply = function ($target) {
        $($target).each(function() {
            var $this   = $(this);
            var $show   = $this.children(".show-link");
            var $hide   = $this.children(".hide-link");
            var $detail = $this.children(".detail");
            $this.children(".show-link").click(function() {
            	$detail.show();
                $show.hide();
                $hide.show();
            });
            $this.children(".hide-link").click(function() {
            	$detail.hide();
                $show.show();
                $hide.hide();
            });
            
            $detail.hide();
            $hide.hide();
            $show.show();
        });
    };
    
    return {
        initModule : initModule,
        apply      : apply,
    };
})(jQuery);