define([  'jquery', 'kendo', 'text!./service.html'], 
function($, kendo, serviceHtml) {
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