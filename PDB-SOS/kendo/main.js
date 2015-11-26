/*require.config({
    paths: {
        jQuery: "js/jquery.min",
        kendo: "js/kendo.mobile.min",
        text: 'js/text'	
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
 
require(['jquery', '../scripts/newApp'],
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
);*/