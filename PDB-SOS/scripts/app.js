
(function () {

    var apiKey = "68s7rFRK3GauGzv2";
    var el = new Everlive(apiKey);
    
    // store a reference to the application object that will be created
    // later on so that we can use it if need be
    var app;

    // create an object to store the models for each view
    window.APP = {
      models: {
        home: {
          title: 'Inicio'
        },
        tracking: {
          title: 'Seguimiento'
        },
        contacts: {
          title: 'Contacts',
          ds: new kendo.data.DataSource({
            data: [{ id: 1, name: 'Bob' }, { id: 2, name: 'Mary' }, { id: 3, name: 'John' }]
          }),
          alert: function(e) {
            alert(e.data.name);
          }
        }
      }
    };

    window.APP.models.tracking = kendo.observable({
        title: 'Seguimiento',
        
        submit: function () {
                var childrenDataSource = new kendo.data.DataSource({
                type: "everlive",
                transport: {
                    typeName: "Child"
                },
                filter: {
                    filters:[
                        {
                        field: "FirstName",
                        operator: "contains",
                        value: this.firstName
                        },
                        {
                        field: "LastName",
                        operator: "contains",
                        value: this.lastName
                        },
                        {
                        field: "MotherLastName",
                        operator: "contains",
                        value: this.lastName2
                        }                  
                     ]   
                 }
            });
            
           $("#children-list").kendoMobileListView({
            dataSource: childrenDataSource,
            template: "#: LastName #, #: FirstName # <a href='views/AddTracking.html?id=#: id#'>Seguir</a>"
        });
            
        }
    });    
    
    // this function is called by Cordova when the application is loaded by the device
    document.addEventListener('deviceready', function () {  
      
      // hide the splash screen as soon as the app is ready. otherwise
      // Cordova will wait 5 very long seconds to do it for you.
      navigator.splashscreen.hide();

      app = new kendo.mobile.Application(document.body, {
        
        // comment out the following line to get a UI which matches the look
        // and feel of the operating system
        skin: 'flat',

        // the application needs to know which view to load first
        initial: 'views/tracking.html'
      });

    }, false);


}());