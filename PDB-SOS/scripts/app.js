var app; // store a reference to the application object that will be created  later on so that we can use it if need be

function switchTab(val){
    	var tabStrip = $("#tabstripAddFollowUp").data("kendoMobileTabStrip");
	    tabStrip.switchTo("#General");
    	app.navigate("#General?id=" + val, "slide");
        
    var dsChild = new kendo.data.DataSource({
                        type: "everlive",
                        transport: {
                            typeName: "Child"
                        },
                        serverFiltering: true,
        				filter: [{ field: "SOSChildID", operator: "eq", value: val }]
        });    
		
    //fails when try to filter by GUID, best option would be number or string
    
    dsChild.fetch(function() {
                    var child = dsChild.at(0);
            		$('[name="childID"]').val(child.get("SOSChildID"));
            		$('[name="firstName"]').val(child.get("FirstName"));
                    $('[name="surName"]').val(child.get("LastName"));
    }); 
}

function redirect(val){
    //alert(val);
    app.navigate("views/ViewTracking.html?id=" + val, "slide");
    
}
    
(function () {

    var apiKey = "68s7rFRK3GauGzv2";
    var el = new Everlive(apiKey);

    var trackingDataSource = new kendo.data.DataSource({
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

    var childrenDataSource;
    
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

    
    window.APP.models.listTracking = kendo.observable({
        listTrackingSubmit: function () {            
            if (!navigator.onLine) {
                    navigator.notification.alert("No hay conexion a Internet");
                    return;
            }
            
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
                //template: "Fecha de Inicio: #: kendo.toString(StartDate, 'yyyy/MM/dd' ) #, Fecha de Fin: #: kendo.toString(EndDate, 'yyyy/MM/dd' ) # <a href='javascript:redirect(\"#= id #\")'>Visualizar</a>"          
                template: "Fecha de Inicio: #: kendo.toString(StartDate, 'yyyy/MM/dd' ) #, Fecha de Fin: #: kendo.toString(EndDate, 'yyyy/MM/dd' ) # <a href='views/ViewTracking.html?##id=#: id #'>Visualizar</a>"
            });
        }
    });
    
    window.APP.models.actions = kendo.observable({
        //reasonsForExit: "3",
         getChildItem: function () {            

                if (!navigator.onLine) {
                    navigator.notification.alert("No hay conexion a Internet");
                    return;
                }
             
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

                navigator.notification.alert("Se ha registrado correctamente");

            } else {
                offlineDataSource.online(false);


                offlineDataSource.add({
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
                offlineDataSource.sync();

                navigator.notification.alert("Se ha registrado correctamente en modo desconectado");
            }
        },
        getTrackingChildItem: function () {
            var location = window.location.toString();
            var isbn = location.substring(location.lastIndexOf('?') + 4);
                        
			var ds = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "ChildTracking"
                    },
    				serverFiltering: true,
    			filter: { field: 'ID', operator: 'eq', value: isbn }	
                //filter: { field: 'ID', operator: 'eq', value: $('[name="childIDGuid"]').val() }
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
            if (!navigator.onLine) {
                    navigator.notification.alert("No hay conexion a Internet");
                    return;
            }
            
            childrenDataSource = new kendo.data.DataSource({
                type: "everlive",
                transport: {
                    typeName: "Child"
                }
            });

            //Implementing for filtering by textbox values (missing the motherlastname)
            //http://www.telerik.com/forums/multiple-filters-on-datasource
            
            if(this.firstName != null || this.lastName != null)
            {
                    childrenDataSource.filter([
                    {"logic":"and",
                     "filters":[
                         {
                            "field":"FirstName",
                            "operator":"contains",
                            "value":this.firstName},
                         {
                             "field":"LastName",
                              "operator":"contains",
                              "value":this.lastName}/*,
                         {
                            "field":"MotherLastName",
                            "operator":"contains",
                            "value":this.lastName2}*/
                     ]},                
            	]);
            }
            
            
            $("#children-list").kendoMobileListView({
                dataSource: childrenDataSource,
                template: "#: LastName #, #: FirstName # <a href='javascript:switchTab(\"#= id #\")'>Seguir</a>"
                //implement the ChildSOSID
                //template: "#: LastName #, #: FirstName # <a href='views/AddTracking.html?id=\"#= id #\"'>Seguir</a>"                
            });

        }
    });

    window.APP.synchro = kendo.observable({
        submit: function () {

 

            if (navigator.onLine) {

                var sLocalStorage = localStorage.getItem("tracking-offline");
                var jLocalStorage = JSON.parse(sLocalStorage);

                var localStorageDataSource = new kendo.data.DataSource({
                    data: jLocalStorage
                });

                $("#listView").kendoMobileListView({
                    dataSource: localStorageDataSource,
                    template: "#: StartDate # - #: EndDate # - #: SOSChildID #"
                });


                var synchroDataSource = new kendo.data.DataSource({
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

                for (var item in jLocalStorage) {



                    synchroDataSource.add({
                        SOSChildID: jLocalStorage[item]["SOSChildID"],
                        StartDate: jLocalStorage[item]["StartDate"],
                        EndDate: jLocalStorage[item]["EndDate"]
                    });

                }

                localStorage.removeItem("tracking-offline");
                synchroDataSource.sync();


                navigator.notification.alert("Sincronizacion finalizada!!!");

            } else {
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
    offlineDataSource.online(false);
}());