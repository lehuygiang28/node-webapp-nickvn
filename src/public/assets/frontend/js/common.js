$('.price').mask('000,000,000,000,000', {reverse: true});
$('.number').mask('#',true);

// $('ul li:has(ul.sub)').addClass('has_sub');

$(".loading").click(function() {
    var $btn = $(this);
    $btn.button({loadingText: '<i class=\'fa fa-spinner fa-spin \'></i> Äang xá»­ lĂ½'});
    $btn.button('loading');
    // Then whatever you actually want to do i.e. submit form
    // After that has finished, reset the button state using
    // setTimeout(function () {
    //     $btn.button('reset');
    // }, 1000);
});


(function($){




    $.fn.extend({
        donetyping: function(callback,timeout){
            timeout = timeout || 1e3; // 1 second default timeout
            var timeoutReference,
                doneTyping = function(el){
                    if (!timeoutReference) return;
                    timeoutReference = null;
                    callback.call(el);
                };
            return this.each(function(i,el){
                var $el = $(el);
                // Chrome Fix (Use keyup over keypress to detect backspace)
                // thank you @palerdot
                $el.is(':input') && $el.on('keyup keypress paste',function(e){
                    // This catches the backspace button in chrome, but also prevents
                    // the event from triggering too preemptively. Without this line,
                    // using tab/shift+tab will make the focused element fire the callback.
                    if (e.type=='keyup' && e.keyCode!=8) return;

                    // Check if timeout has been set. If it has, "reset" the clock and
                    // start over again.
                    if (timeoutReference) clearTimeout(timeoutReference);
                    timeoutReference = setTimeout(function(){
                        // if we made it here, our timeout has elapsed. Fire the
                        // callback
                        doneTyping(el);
                    }, timeout);
                }).on('blur',function(){
                    // If we can, fire the event since we're leaving the field
                    doneTyping(el);
                });
            });
        }
    });
})(jQuery);