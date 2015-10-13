function addTracking() {
	alert("click");
}
    
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
        actions:{
              
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
    
    window.APP.models.actions = kendo.observable({
        reasonsForExit: "3",
        submit: function () {            
            	var viewSurname = $('[name="surName"]').val();
            	alert(viewSurname);
            	var viewReason = $('[name="reasonsForExit"]').val();
            	alert(viewReason);
            	/*var viewReason = $("#General").listview.("#reasonsForExit").val();
            	alert(viewReason);
            	var viewComments = $("#Vivienda").listview.("#hostageComments").val();
            	alert(viewComments);*/
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
        
    window.AddTrackingValues = kendo.observable({        
        childID: "6181be40-66fd-11e5-9cce-6925581deeeb",        
        submit: function () {            
            	navigator.notification.alert("Guardado!!. Tipo de conexion = " + this.hostageType.value);
                var trackingDataSource = new kendo.data.DataSource({
                type: "everlive",
                transport: {
                    typeName: "ChildTracking"
                }                    
            });            
            trackingDataSource.add({
                StartDate: this.startDate,
                EndDate: this.endDate,
                Phone: this.phone,
                EmailAddress: this.email,
                AgeWhenFirstChild: this.ageWhenHasFirstChild,
                ChildrenNumber: this.childrenNumber,
                LegalGuardian: this.legalGuardian,
                SiblingsOutsideSOS: this.siblingsOutsideSOS,
                HomeType: this.hostageType,
                HomeComments: this.hostageComments,
                HomeImprovementsComments: this.hostageImproveComments,
                HomeEducationalCenterNoSOS: this.educationalCenterNoSOS,
                CurrentSchoolLevel: this.currentEnrollment,
                EducationStudyStart: this.educationStudyStart,
                EducationalSpecialityName: this.specialityName,
                EducationalSpecialitySemester : this.specialitySemester,
                WorkIncomeType: this.sourceOfIncome,
                WorkType: this.typeOfEmployment,
                WorkSpeacialityRelated: this.workRelatedWithSpeciality,
                WorkSector: this.areaOfWork,
                WorkMonthsContinuity: this.continueWorkinMonths,
                WorkMonthlyIncome: this.incomeMonthly,
                WorkMonthsUnemployed: this.monthsUnemployee,
                HealthHasDisabilities: this.hasDisability,
                HealthHowDisabilityAffects: this.affectsInDailyLife,
                HealthDisabilityComments: this.commentsAboutHandicap                
            });
            trackingDataSource.one("sync", this.close);
            trackingDataSource.sync();                        
            navigator.notification.alert("Guardado!!. Tipo de conexion = " + navigator.connection.type);
        }
    });    

    
    window.GeneralTracking = kendo.observable({
        
        childID: "6181be40-66fd-11e5-9cce-6925581deeeb",
        
        submit: function () {
            
                var trackingDataSource = new kendo.data.DataSource({
                type: "everlive",
                transport: {
                    typeName: "ChildTracking"
                }                    
            });
            
            trackingDataSource.add({
                StartDate: this.startDate,
                EndDate: this.endDate
            });
            trackingDataSource.one("sync", this.close);
            trackingDataSource.sync();
            
            
            navigator.notification.alert("Guardado!!. Tipo de conexion = " + navigator.connection.type);
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
        initial: 'views/AddTracking.html'
      });

    }, false);


}());