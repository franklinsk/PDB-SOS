require.config({
    paths: {
        jQuery: "kendo/js/jquery.min",
        kendo: "kendo/js/kendo.mobile.min",
        text: 'kendo/js/text'	
    },
    shim: {
        jQuery: {
            exports: "jQuery"
        },
        kendo: {
            deps: ["jQuery"],
            exports: "kendo"
        }
    }
});

var app;
 
require(['jquery', 'scripts/newApp'],
	function($, application) {
		app = application;

		$(document).ready(function(){
			function onDeviceReady(){
				app.init();
			}

			if (!window.device || window.tinyHippos){
				onDeviceReady();
			} else {
				document.addEventListener('deviceready', onDeviceReady);
			}
		});
	}
);