var app; // store a reference to the application object that will be created  later on so that we can use it if need be

(function () {
    
	var apiKey = "68s7rFRK3GauGzv2";
    var el = new Everlive(apiKey);

    window.APP = { // create an object to store the models for each view
        models: {
            home: {
                title: 'Bienvenido!!!'
            },
            tracking: {
                title: 'Seguimiento'
            },
            actions: {},
        }
    };
    
     // this function is called by Cordova when the application is loaded by the device
    document.addEventListener('deviceready', function () {
        navigator.splashscreen.hide(); // hide the splash screen as soon as the app is ready. otherwise  Cordova will wait 5 very long seconds to do it for you.

        app = new kendo.mobile.Application(document.body, {
            skin: 'flat', // comment out the following line to get a UI which matches the look  and feel of the operating system
            initial: 'views/home.html' // the application needs to know which view to load first
        });
    }, false);
    offlineDataSource.online(false);
}());