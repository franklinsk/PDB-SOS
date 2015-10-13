(function () {

    var apiKey = "68s7rFRK3GauGzv2";
    var el = new Everlive(apiKey);

    var trackingDataSource = new kendo.data.DataSource({
                   offlineStorage: "tracking-offline",
        type: "everlive",
        transport: {
            typeName: "ChildTracking"
        },
                    schema: {
                        model: {
                            id: "Id"
                        }
                    }
    });

    var app; // store a reference to the application object that will be created  later on so that we can use it if need be

    window.APP = { // create an object to store the models for each view
        models: {
            home: {
                title: 'Inicio'
            },
            tracking: {
                title: 'Seguimiento'
            },
            actions: {},
            contacts: {
                title: 'Contacts',
                ds: new kendo.data.DataSource({
                    data: [{
                        id: 1,
                        name: 'Bob'
                    }, {
                        id: 2,
                        name: 'Mary'
                    }, {
                        id: 3,
                        name: 'John'
                    }]
                }),
                alert: function (e) {
                    alert(e.data.name);
                }
            }
        }
    };

    window.APP.models.actions = kendo.observable({
        //reasonsForExit: "3",
        addTrackingSubmit: function () {

           if (navigator.onLine) {                               
   	                trackingDataSource.online(true);
            }   
            else
            {                
                trackingDataSource.online(false);                                              
            }
            

            trackingDataSource.add({
                SOSChildID: $('[name="childID"]').val(),
                StartDate: $('[name="startDate"]').val(),
                EndDate: $('[name="endDate"]').val(),
                Phone: $('[name="phone"]').val(),
                EmailAddress: $('[name="email"]').val(),
                AgeWhenFirstChild: $('[name="ageWhenHasFirstChild"]').val(),
                ChildrenNumber: $('[name="childrenNumber"]').val(),
                LegalGuardian: $('[name="legalGuardian"]').val(),
                SiblingsOutsideSOS: $('[name="siblingsOutsideSOS"]').val(),
                HomeType: $('[name="hostageType"]').val(),
                HomePlace: $('[name="homePlace"]').val(),
                HomeComments: $('[name="hostageComments"]').val(),
                HomeImprovementsComments: $('[name="hostageImproveComments"]').val(),
                HomeEducationCenterNoSOS: $('[name="educationalCenterNoSOS"]').val(),
                CurrentSchoolLevel: $('[name="currentEnrollment"]').val(),
                EducationCurrentEnrollment: $('[name="educationCurrentEnrollment"]').val(),
                EducationStudyStart: $('[name="educationStudyStart"]').val(),
                EducationSpecialityName: $('[name="specialityName"]').val(),
                EducationSpecialitySemester: $('[name="specialitySemester"]').val(),
                WorkIncomeType: $('[name="sourceOfIncome"]').val(),
                WorkType: $('[name="typeOfEmployment"]').val(),
                WorkCurrency: $('[name="workCurrency"]').val(),
                WorkSpeacialityRelated: $('[name="workRelatedWithSpeciality"]').val(),
                WorkSector: $('[name="areaOfWork"]').val(),
                WorkMonthsContinuity: $('[name="continueWorkinMonths"]').val(),
                WorkMonthlyIncome: $('[name="incomeMonthly"]').val(),
                WorkMonthsUnemployed: $('[name="monthsUnemployee"]').val(),
                HealthHasDisabilities: $('[name="hasDisability"]').val(),
                HealthHowDisabilityAffects: $('[name="affectsInDailyLife"]').val(),
                HealthDisabilityComments: $('[name="commentsAboutHandicap"]').val()
            });
            trackingDataSource.sync();

           if (navigator.onLine) {                               
                navigator.notification.alert("Se ha registrado correctamente");
            }   
            else
            {                
                navigator.notification.alert("Se ha registrado correctamente en modo desconectado");   
            }            
            

        }
    });

    window.APP.models.tracking = kendo.observable({
        submit: function () {
            var childrenDataSource = new kendo.data.DataSource({
                type: "everlive",
                transport: {
                    typeName: "Child"
                },
                filter: {
                    filters: [
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

    window.APP.synchro = kendo.observable({
        submit: function () {

                var offlineDataSource = new kendo.data.DataSource({
                   offlineStorage: "tracking-offline",
        type: "everlive",
        transport: {
            typeName: "ChildTracking"
        },
                    schema: {
                        model: {
                            id: "Id"
                        }
                    }
    });
            
            if (navigator.onLine) {                               

         var sLocalStorage = localStorage.getItem("tracking-offline");
         var jLocalStorage = JSON.parse(sLocalStorage);
               
               var OfflineDataSource = new kendo.data.DataSource({
                data: jLocalStorage 
            });

            $("#listView").kendoMobileListView({
                dataSource: OfflineDataSource,
                template: "#: StartDate # - #: EndDate # - #: SOSChildID #"
            });
               

               offlineDataSource.online(true);
               
            for (var item in jLocalStorage) {

                
                
                    offlineDataSource.add({
                        SOSChildID: jLocalStorage[item]["SOSChildID"],
                        StartDate: jLocalStorage[item]["StartDate"],
                        EndDate: jLocalStorage[item]["EndDate"]
                    });

            }
               
                localStorage.removeItem("tracking-offline");
               offlineDataSource.sync();


               
                                               navigator.notification.alert("Sincronizacion finalizada!!!");   
               
            }   
            else
            {                
                navigator.notification.alert("No se ha detectado una conexion activa a internet");   
            }            

        }
    });    
    
    // this function is called by Cordova when the application is loaded by the device
    document.addEventListener('deviceready', function () {
        navigator.splashscreen.hide(); // hide the splash screen as soon as the app is ready. otherwise  Cordova will wait 5 very long seconds to do it for you.

        app = new kendo.mobile.Application(document.body, {
            skin: 'flat', // comment out the following line to get a UI which matches the look  and feel of the operating system
            initial: 'views/home.html' // the application needs to know which view to load first
        });
    }, false);
}());