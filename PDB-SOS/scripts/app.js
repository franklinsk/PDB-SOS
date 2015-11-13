var app; // store a reference to the application object that will be created  later on so that we can use it if need be

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
        models: { home: { title: 'Bienvenido!!!' } }
    };
    
    
    window.APP.models.house = kendo.observable({
        init: function () {             
            var programa = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "ProgrammeUnit"
                    },
    				serverFiltering: true,
                    serverSorting: true,
      				sort: { field: "Name", dir: "asc" }
    		});               
            
             $("#ddlProgramma").kendoDropDownList({
                        dataTextField: "Name",
                        dataValueField: "ProgrammeUnitID",
                        dataSource: programa
                    });
    	},
        submit: function(){
            if (!navigator.onLine) {
                    navigator.notification.alert("No hay conexion a Internet");
                    return;
            }
            var programmeUnitID = $("#ddlProgramma").val();
            
            var list = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "House"
                    },
    				serverFiltering: true,
    				filter: { field: 'ProgrammeUnitID', operator: 'eq', value: programmeUnitID}
    		});                            
            
            $("#list").kendoMobileListView({
                dataSource: list,
                template: "Casa: #: SOSHouseID #, Dirección #: Address # <a href='javascript:newSwitchTab(\"View\",\"#if (SOSHouseID == null) {# #=''# #} else {##=SOSHouseID##}#\", \"#if (Address == null) {# #=''# #} else {##=Address##}#\", \"#if (NameOrNumber == null) {# #=''# #} else {##=NameOrNumber##}#\", \"" + programmeUnitID + "\")'>Visualizar</a>"                
            });
        },
        setProgrammeToNewHouse: function(){
            if (!navigator.onLine) {
                    navigator.notification.alert("No hay conexion a Internet");
                    return;
            }
            var programmeUnitID = $("#ddlProgramma").val();
            newSwitchTab("Add", "", "", "", programmeUnitID); 
             
        },
        getHouseChildItem: function () { 
            
    	},
        getHouseItem: function () { 
            alert("c");
    	},
        addHouseSubmit: function () { 
            alert("d");
    	}
    });
        
    window.APP.models.child = kendo.observable({
         getChildItem: function () {   
                if (!navigator.onLine) {
                    navigator.notification.alert("No hay conexion a Internet");
                    return;
                }
             
                $('[name="firstName"]').val("");
                $('[name="surName"]').val("");

                var childDataSources = new kendo.data.DataSource({
                        type: "everlive",
                        transport: {
                            typeName: "Child"
                        },
                        serverFiltering: true,
                        filter: { field: 'SOSChildID', operator: 'eq', value: $('[name="childID"]').val().trim() }
                });    
				
                childDataSources.fetch(function() {
                    var child = childDataSources.at(0);
                    $('[name="childID"]').val(child.get("SOSChildID"));
                    $('[name="firstName"]').val(child.get("FirstName"));
                    $('[name="surName"]').val(child.get("LastName"));
                });
            }
    });

    window.APP.models.tracking = kendo.observable({
        searchByCode: function () {            
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
            
            $("#trackViewList").kendoMobileListView({
                dataSource: listTracking,
                //template: "Fecha de Inicio: #: kendo.toString(StartDate, 'yyyy/MM/dd' ) #, Fecha de Fin: #: kendo.toString(EndDate, 'yyyy/MM/dd' ) # <a href='javascript:switchTab(\"#if (SOSChildID == null) {# #=''# #} else {# #=SOSChildID# #}#\", \"#if (FirstName == null) {# #=''# #} else {# #=FirstName# #}#\", \"#if (LastName == null) {# #=''# #} else {# #=LastName# #}#\")'>Visualizar</a>"                
                //No values for firstName and lastName
                template: "Fecha de Inicio: #: kendo.toString(StartDate, 'yyyy/MM/dd' ) #, Fecha de Fin: #: kendo.toString(EndDate, 'yyyy/MM/dd' ) # <a href='javascript:switchTab(\"View\",\"#if (SOSChildID == null) {# #=''# #} else {##=SOSChildID##}#\", \"\",\"\")'>Visualizar</a>"                
            });
        },
        search: function () {
            if (!navigator.onLine) {
                    navigator.notification.alert("No hay conexion a Internet");
                    return;
            }
            
            var childDataSource = new kendo.data.DataSource({
                type: "everlive",
                transport: {
                    typeName: "Child"
                }
            });
            
            //Implementing for filtering by textbox values (missing the motherlastname)
            //http://www.telerik.com/forums/multiple-filters-on-datasource
            
            var opt1 = validateNullValues(this.firstNameSearch);
            var opt2 = validateNullValues(this.lastNameSearch);
            var opt3 = validateNullValues(this.lastName2Search);
                       
            childDataSource.filter([
            {
                        "logic": "and",
                     	"filters": 
                         [
                             {
                                "field":"FirstName",
                                "operator":"contains",
                                "value":opt1
                             },
                             {
                                 "field":"LastName",
                                  "operator":"contains",
                                  "value":opt2
                             },
                             {
                                "field":"MotherLastName",
                                "operator":"contains",
                                "value":opt3
                             }
                         ]}                
            ]);
            
            //Values should be different to null, instead of this the app crashed (template)
            $("#trackAddList").kendoMobileListView({
                dataSource: childDataSource,
                template: "#: LastName #, #: FirstName # <a href='javascript:switchTab(\"Add\",\"#if (SOSChildID == null) {# #=''# #} else {# #=SOSChildID# #}#\", \"#if (FirstName == null) {# #=''# #} else {# #=FirstName# #}#\", \"#if (LastName == null) {# #=''# #} else {# #=LastName# #}#\")'>Seguir</a>"                
            });            
        },
        addTrackingSubmit: function () {

            if (navigator.onLine) 
            {
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
        getTracking: function (e) {
            var childID = e.view.params.id;
            
            if(childID == null)
                return;
            	
            var trackingSearchDataSource = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "ChildTracking"
                    },
    				serverFiltering: true,
    			filter: { field: 'SOSChildID', operator: 'eq', value: childID }	
    		});    
            
            trackingSearchDataSource.fetch(function() {
  				var child = trackingSearchDataSource.at(0);
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
            
            var childSearchDataSource = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "Child"
                    },
    				serverFiltering: true,
    				filter: { field: 'SOSChildID', operator: 'eq', value: childID }
    		});    
            
            childSearchDataSource.fetch(function() 
            {
  				var child = childSearchDataSource.at(0);
  				$('[name="childID"]').val(child.get("SOSChildID"));
                $('[name="firstName"]').val(child.get("FirstName"));
                $('[name="surName"]').val(child.get("LastName"));
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

                for (var item in jLocalStorage) 
                {
                    synchroDataSource.add({
                        SOSChildID: jLocalStorage[item]["SOSChildID"],
                        StartDate: jLocalStorage[item]["StartDate"],
                        EndDate: jLocalStorage[item]["EndDate"]
                    });
                }

                localStorage.removeItem("tracking-offline");
                synchroDataSource.sync();
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
    offlineDataSource.online(false);
}());