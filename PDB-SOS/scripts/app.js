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

    window.APP.models.listTracking = kendo.observable({
        listTrackingSubmit: function () {            
            var listTracking = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "ChildTracking"
                    },
    				serverFiltering: true,
    				filter: { field: 'SOSChildID', operator: 'eq', value: $('[name="SOSChildID"]').val() }
    		});    
            
            $("#tracking-list").kendoMobileListView({
                dataSource: listTracking,
                template: "Fecha de Inicio: #: kendo.toString(StartDate, 'yyyy/MM/dd' ) #, Fecha de Fin: #: kendo.toString(EndDate, 'yyyy/MM/dd' ) # <a href='views/ViewTracking.html?id=#: id#'>Visualizar</a>"
            });
        }
    });
    window.APP.models.actions = kendo.observable({
        getChildItem: function () {            
            $('[name="firstName"]').val("");
            $('[name="surName"]').val("");
            
            var trackingDataSources = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "Child"
                    },
    				serverFiltering: true,
    				filter: { field: 'SOSChildID', operator: 'eq', value: $('[name="childID"]').val() }
    		});    
            
            trackingDataSources.fetch(function() {
  				var child = trackingDataSources.at(0);
  				$('[name="childID"]').val(child.get("SOSChildID"));
                $('[name="firstName"]').val(child.get("FirstName"));
                $('[name="surName"]').val(child.get("LastName"));
			});
        },
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
            trackingDataSource.one("sync", this.close);
            trackingDataSource.sync();

           if (navigator.onLine) {                               
                navigator.notification.alert("Se ha registrado correctamente");
            }   
            else
            {                
                navigator.notification.alert("Se ha registrado correctamente en modo desconectado");   
            }   
        },
        getTrackingChildItem: function () {
			var ds = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "ChildTracking"
                    },
    				serverFiltering: true,
    				filter: { field: 'ID', operator: 'eq', value: $('[name="childIDGuid"]').val() }
    		});    
            
            ds.fetch(function() {
  				var child = ds.at(0);
  				$('[name="childID"]').val(child.get("SOSChildID"));
                $('[name="startDate"]').val(child.get("StartDate"));
                $('[name="endDate"]').val(child.get("EndDate"));
                
                $('[name="phone"]').val(child.get("Phone"));
                $('[name="email"]').val(child.get("EmailAddress"));
                $('[name="ageWhenHasFirstChild"]').val(child.get("AgeWhenFirstChild"));
                $('[name="childrenNumber"]').val(child.get("ChildrenNumber"));
                $('[name="legalGuardian"]').val(child.get("LegalGuardian"));
                
                $('[name="siblingsOutsideSOS"]').val(child.get("SiblingsOutsideSOS"));
                $('[name="hostageType"]').val(child.get("HomeType"));
                $('[name="homePlace"]').val(child.get("HomePlace"));
                $('[name="hostageComments"]').val(child.get("HomeComments"));
                $('[name="hostageImproveComments"]').val(child.get("HomeImprovementsComments"));
                $('[name="educationalCenterNoSOS"]').val(child.get("HomeEducationCenterNoSOS"));
                
                $('[name="currentEnrollment"]').val(child.get("CurrentSchoolLevel"));
                $('[name="educationCurrentEnrollment"]').val(child.get("EducationCurrentEnrollment"));
                $('[name="educationStudyStart"]').val(child.get("EducationStudyStart"));
                $('[name="specialityName"]').val(child.get("EducationSpecialityName"));
                $('[name="specialitySemester"]').val(child.get("EducationSpecialitySemester"));
                $('[name="sourceOfIncome"]').val(child.get("WorkIncomeType"));
                
                $('[name="typeOfEmployment"]').val(child.get("WorkType"));
                $('[name="workCurrency"]').val(child.get("WorkCurrency"));
                $('[name="workRelatedWithSpeciality"]').val(child.get("WorkSpeacialityRelated"));
                $('[name="areaOfWork"]').val(child.get("WorkSector"));
                $('[name="continueWorkinMonths"]').val(child.get("WorkMonthsContinuity"));
                $('[name="incomeMonthly"]').val(child.get("WorkMonthlyIncome"));
                
                $('[name="monthsUnemployee"]').val(child.get("WorkMonthsUnemployed"));
                $('[name="hasDisability"]').val(child.get("HealthHasDisabilities"));
                $('[name="affectsInDailyLife"]').val(child.get("HealthHowDisabilityAffects"));
                $('[name="commentsAboutHandicap"]').val(child.get("HealthDisabilityComments"));  
			});
            
            var dsChild = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "Child"
                    },
    				serverFiltering: true,
    				filter: { field: 'SOSChildID', operator: 'eq', value: $('[name="childID"]').val() }
    		});    
            
            dsChild.fetch(function() {
  				var child = dsChild.at(0);
  				$('[name="childID"]').val(child.get("SOSChildID"));
                $('[name="firstName"]').val(child.get("FirstName"));
                $('[name="surName"]').val(child.get("LastName"));
            });    
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
           if (navigator.onLine) {                               
                navigator.notification.alert("correcto");
               

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