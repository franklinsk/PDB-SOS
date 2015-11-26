define([  'jquery', 'kendo', 'text!./drawer.html'], 
function($, kendo, drawerHtml) {
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