define(['jquery', 'kendo', 'text!./home.html'], 
function($, kendo, homeHtml) {
    return {
        init: function (initEvt) {
            alert("a");
            // ... init event code ...
        },
 
        beforeShow: function (beforeShowEvt) {
            // ... before show event code ...
        },
 
        show: function (showEvt) {
            // ... show event code ...
        }
    }
});

