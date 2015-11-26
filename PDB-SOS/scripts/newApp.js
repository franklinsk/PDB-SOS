/*define(function(require) {
	var kendoApp,
	$ = require('jquery'),
	kendo = require('kendo'),
	kendoLayouts = {
		service: require('../scripts/service')
	},
	kendoViews = {
		drawer: require('../scripts/drawer'),
		home: require('../scripts/home')
	};

	// Loop through all kendo layouts and views and spit their HTML into the BODY
	function onBeforeInit() {
		var i, item, objects = [kendoLayouts, kendoViews], htmlBuffer = [];

		for (i=0; i<objects.length; i++){
			for (item in objects[i]) {
				if (objects[i].hasOwnProperty(item) && objects[i][item].hasOwnProperty('html')) {
					htmlBuffer.push(objects[i][item].html);
				}
			}
		}

		$(document.body).prepend(htmlBuffer.join(''));
	}

	return {
		init: function() {
			onBeforeInit();

			kendoApp = new kendo.mobile.Application(document.body, {
				initial: 'home-view',
				transition: 'slide'
			});

			// Body initially hidden to prevent flash of unstyled content
			$(document.body).show();
		},
		layouts: kendoLayouts,
		views: kendoViews
	};
});*/