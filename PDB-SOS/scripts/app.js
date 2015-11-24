var app; // store a reference to the application object that will be created  later on so that we can use it if need be

(function () {
	//remove filters in each search
    //http://www.telerik.com/forums/remove-filters-from-data-source
    //FoodMenuDataSource.filter({});
    //FoodMenuDataSource.filter({ field: "Level", operator: "eq", value: 3 });
    
    
    //requireJS
    //https://github.com/FalafelSoftwareInc/quran-gateway-web
    var apiKey = "68s7rFRK3GauGzv2";
    var el = new Everlive(apiKey);

    var houseDataSource = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "House"
                    },
                    schema: {
                        model: {
                            id: "Id"
                        }
                    }
    });
    
    var caregiverDataSource = new kendo.data.DataSource({
        type: "everlive",
        transport: {
            typeName: "Caregiver"
        },
        schema: {
            model: {
                id: "Id"
            }
        }
    });
    
    var childDataSource = new kendo.data.DataSource({
        type: "everlive",
        transport: {
            typeName: "Child"
        },
        schema: {
            model: {
                id: "Id"
            }
        }
    });
    
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

    var offlineChildDataSource = new kendo.data.DataSource({  
        offlineStorage: "child-offline",
        type: "everlive",
        transport: {
            typeName: "Child"
        },
        schema: {
            model: {
                id: "Id"
            }
        }
    });
    
    var offlineCaregiverDataSource = new kendo.data.DataSource({  
        offlineStorage: "caregiver-offline",
        type: "everlive",
        transport: {
            typeName: "Caregiver"
        },
        schema: {
            model: {
                id: "Id"
            }
        }
    });
    
    var offlineHouseDataSource = new kendo.data.DataSource({  
        offlineStorage: "house-offline",
        type: "everlive",
        transport: {
            typeName: "House"
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
        searchHouseByProgrammeUnit: function(){
            if (!navigator.onLine) {
                    navigator.notification.alert("No hay conexion a Internet");
                    return;
            }
            var programmeUnitID = $("#ddlProgramma").val();
            
            var filters = [];
 
        	//http://www.telerik.com/forums/adding-filters-to-grid-s-source
            filters = UpdateSearchFilters(filters, "ProgrammeUnitID", "eq", programmeUnitID, "and");        
	        houseDataSource.filter(filters);
            
            $("#list").kendoMobileListView({
                dataSource: houseDataSource,
                template: "Casa: #: SOSHouseID #, Dirección #: Address # <a href='javascript:newSwitchTab(\"View\",\"#if (SOSHouseID == null) {# #=''# #} else {##=SOSHouseID##}#\", \"#if (Address == null) {# #=''# #} else {##=Address##}#\", \"#if (NameOrNumber == null) {# #=''# #} else {##=NameOrNumber##}#\", \"" + programmeUnitID + "\")'>Visualizar</a>"                
            });
        },
        addProgrammeUnitToHouse: function(){
            if (!navigator.onLine) {
                    navigator.notification.alert("No hay conexion a Internet");
                    return;
            }
            var programmeUnitID = $("#ddlProgramma").val();
            newSwitchTab("Add", "", "", "", programmeUnitID);              
        },
        getHouseItemByID: function(e){
            var houseID = e.view.params.id;
            
            if(houseID == null)
                return;
            	
            var houseSearchDataSource = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "House"
                    },
    				serverFiltering: true,
    			filter: { field: 'SOSHouseID', operator: 'eq', value: houseID }	
    		});    
            
            houseSearchDataSource.fetch(function() {
  				var entity = houseSearchDataSource.at(0);
  				$('[name="Address"]').val(entity.get("Address"));
                $('[name="DateOfStart"]').val(entity.get("DateOfStart"));
                $('[name="MaximunCapacity"]').val(entity.get("MaximunCapacity"));
                $('[name="NameOrNumber"]').val(entity.get("NameOrNumber"));
                $('[name="Notes"]').val(entity.get("Notes"));
                $('[name="NumberOfChildren"]').val(entity.get("NumberOfChildren"));
                $('[name="PhoneNumber"]').val(entity.get("PhoneNumber"));
                $('[name="ProgrammeUnitID"]').val(entity.get("ProgrammeUnitID"));
                $('[name="SOSHouseID"]').val(entity.get("SOSHouseID"));
                $('[name="Status"]').val(entity.get("Status"));
			});   
         },
        getHouseByID: function () { 
            if (!navigator.onLine) {
                    navigator.notification.alert("No hay conexion a Internet");
                    return;
                }
             
                $('[name="NameOrNumber"]').val("");

                var houseDataSources = new kendo.data.DataSource({
                        type: "everlive",
                        transport: {
                            typeName: "House"
                        },
                        serverFiltering: true,
                        filter: { field: 'SOSHouseID', operator: 'eq', value: $('[name="SOSHouseID"]').val().trim() }
                });    
				
                houseDataSources.fetch(function() {
                    var entity = houseDataSources.at(0);
                    $('[name="SOSHouseID"]').val(entity.get("SOSHouseID"));
                    $('[name="NameOrNumber"]').val(entity.get("NameOrNumber "));
                });
    	},
        addHouseSubmit: function () { 
            if (navigator.onLine) 
            {
                houseDataSource.add({
                    Address : $('[name="Address"]').val(),
                    DateOfStart : $('[name="DateOfStart"]').val(),
                    MaximunCapacity : $('[name="MaximunCapacity"]').val(),
                    NameOrNumber : $('[name="NameOrNumber"]').val(),
                    Notes : $('[name="Notes"]').val(),
                    NumberOfChildren : $('[name="NumberOfChildren"]').val(),
                    PhoneNumber : $('[name="PhoneNumber"]').val(),
                    ProgrammeUnitID : $('[name="ProgrammeUnitID"]').val(),
                    SOSHouseID : $('[name="SOSHouseID"]').val(),
                    Status: $('[name="Status"]').val()
                });
                houseDataSource.sync();
                navigator.notification.alert("Se ha registrado correctamente");
                
            } else {
                offlineHouseDataSource.online(false);
                
                offlineHouseDataSource.add({
                    Address : $('[name="Address"]').val(),
                    DateOfStart : $('[name="DateOfStart"]').val(),
                    MaximunCapacity : $('[name="MaximunCapacity"]').val(),
                    NameOrNumber : $('[name="NameOrNumber"]').val(),
                    Notes : $('[name="Notes"]').val(),
                    NumberOfChildren : $('[name="NumberOfChildren"]').val(),
                    PhoneNumber : $('[name="PhoneNumber"]').val(),
                    ProgrammeUnitID : $('[name="ProgrammeUnitID"]').val(),
                    SOSHouseID : $('[name="SOSHouseID"]').val(),
                    Status: $('[name="Status"]').val()
                });
                
                offlineHouseDataSource.sync();
                navigator.notification.alert("Se ha registrado correctamente en modo desconectado");
            }
    	},
        viewHouseSubmit: function(){
            if (navigator.onLine) 
            {
                 var houseDataSource = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "House"
                    },
    				serverFiltering: true,
    				filter: { field: 'SOSHouseID', operator: 'eq', value: $('[name="SOSHouseID"]').val() }	
    			});    
                
                houseDataSource.fetch(function() {
  					var entity = houseDataSource.at(0);
                    entity.set("Address ",$('[name="Address"]').val());
                    entity.set("DateOfStart ",$('[name="DateOfStart"]').val());
                    entity.set("MaximunCapacity ",$('[name="MaximunCapacity"]').val());
                    entity.set("NameOrNumber ",$('[name="NameOrNumber"]').val());
                    entity.set("Notes ",$('[name="Notes"]').val());
                    entity.set("NumberOfChildren ",$('[name="NumberOfChildren"]').val());
                    entity.set("PhoneNumber ",$('[name="PhoneNumber"]').val());
                    entity.set("ProgrammeUnitID ",$('[name="ProgrammeUnitID"]').val());
                    entity.set("SOSHouseID ",$('[name="SOSHouseID"]').val());
                    entity.set("Status",$('[name="Status"]').val());
                });
                
                houseDataSource.sync();
                navigator.notification.alert("Se ha registrado correctamente");
                
            } else {
                offlineHouseDataSource.online(false);
                
                var filters = [];
 				filters = UpdateSearchFilters(filters, "SOSHouseID", "eq", $('[name="SOSHouseID"]').val(), "and");        
                offlineHouseDataSource.filter(filters);
                
                offlineHouseDataSource.fetch(function() {
  					var entity = offlineHouseDataSource.at(0);
                    entity.set("Address ",$('[name="Address"]').val());
                    entity.set("DateOfStart ",$('[name="DateOfStart"]').val());
                    entity.set("MaximunCapacity ",$('[name="MaximunCapacity"]').val());
                    entity.set("NameOrNumber ",$('[name="NameOrNumber"]').val());
                    entity.set("Notes ",$('[name="Notes"]').val());
                    entity.set("NumberOfChildren ",$('[name="NumberOfChildren"]').val());
                    entity.set("PhoneNumber ",$('[name="PhoneNumber"]').val());
                    entity.set("ProgrammeUnitID ",$('[name="ProgrammeUnitID"]').val());
                    entity.set("SOSHouseID ",$('[name="SOSHouseID"]').val());
                    entity.set("Status",$('[name="Status"]').val());
                });
                
                offlineHouseDataSource.sync();
            }
        }
    });
    
    window.APP.models.caregiver = kendo.observable({
         searchCaregiverByHouse: function(){
            if (!navigator.onLine) {
                    navigator.notification.alert("No hay conexion a Internet");
                    return;
            }
            var houseID = $("#ddlCasa").val();
            
            var filters = [];
 
        	//http://www.telerik.com/forums/adding-filters-to-grid-s-source
            filters = UpdateSearchFilters(filters, "SOSHouseID", "eq", houseID, "and");        
	        caregiverDataSource.filter(filters);
            
            $("#list").kendoMobileListView({
                dataSource: caregiverDataSource,
                template: "Nombres: #: FirstName #, Apellidos #: LastName # <a href='javascript:newSwitchTab(\"View\",\"#if (CaregiverID == null) {# #=''# #} else {##=CaregiverID##}#\", \"#if (FirstName == null) {# #=''# #} else {##=FirstName##}#\", \"#if (SurName == null) {# #=''# #} else {##=SurName##}#\", \"" + houseID + "\")'>Visualizar</a>"                
            });
         },
         addHouseToCaregiver: function(){
            if (!navigator.onLine) {
                    navigator.notification.alert("No hay conexion a Internet");
                    return;
            }
            var houseID = $("#ddlCasa").val();
            newSwitchTab("Add", "", "", "", houseID); 
         },
         getCaregiverItemByID: function(e){
            var caregiverID = e.view.params.id;
            
            if(caregiverID == null)
                return;
            	
            var caregiverSearchDataSource = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "Caregiver"
                    },
    				serverFiltering: true,
    			filter: { field: 'SOSCaregiverID', operator: 'eq', value: caregiverID }	
    		});    
            
            caregiverSearchDataSource.fetch(function() {
  				var entity = caregiverSearchDataSource.at(0);
  				$('[name="PhoneNumber"]').val(entity.get("PhoneNumber"));
                $('[name="Synchronized"]').val(entity.get("Synchronized"));
                $('[name="DateOfStart"]').val(entity.get("DateOfStart"));
                $('[name="DateOfBirth"]').val(entity.get("DateOfBirth"));
                $('[name="LastName"]').val(entity.get("LastName"));
                $('[name="FirstName"]').val(entity.get("FirstName"));
                $('[name="DocumentNumber"]').val(entity.get("DocumentNumber"));
                $('[name="Gender"]').val(entity.get("Gender"));
                $('[name="ReceiveSpecialAttention"]').val(entity.get("ReceiveSpecialAttention"));
                $('[name="IsLiterate"]').val(entity.get("IsLiterate"));
                $('[name="TotalIncome"]').val(entity.get("TotalIncome"));
                $('[name="Address"]').val(entity.get("Address"));
                $('[name="Status"]').val(entity.get("Status"));
                $('[name="DateOfLastHealthControl"]').val(entity.get("DateOfLastHealthControl"));
                $('[name="DateOfLastUpdateDevelopmentPlan"]').val(entity.get("DateOfLastUpdateDevelopmentPlan"));
                $('[name="PlannedUpdateOfDevelopmentPlan"]').val(entity.get("PlannedUpdateOfDevelopmentPlan"));
                $('[name="CaregiverID"]').val(entity.get("CaregiverID"));
                $('[name="SOSHouseID"]').val(entity.get("SOSHouseID"));
			});   
         },
         addCaregiverSubmit: function () {

            if (navigator.onLine) 
            {
                caregiverDataSource.add({
                    PhoneNumber : $('[name="PhoneNumber"]').val(),
                    Synchronized : $('[name="Synchronized"]').val(),
                    DateOfStart : $('[name="DateOfStart"]').val(),
                    DateOfBirth : $('[name="DateOfBirth"]').val(),
                    LastName : $('[name="LastName"]').val(),
                    FirstName : $('[name="FirstName"]').val(),
                    DocumentNumber : $('[name="DocumentNumber"]').val(),
                    Gender : $('[name="Gender"]').val(),
                    ReceiveSpecialAttention: $('[name="ReceiveSpecialAttention"]').val(),
                    IsLiterate : $('[name="IsLiterate"]').val(),
                    TotalIncome : $('[name="TotalIncome"]').val(),
                    Address : $('[name="Address"]').val(),
                    Status : $('[name="Status"]').val(),
                    DateOfLastHealthControl : $('[name="DateOfLastHealthControl"]').val(),
                    DateOfLastUpdateDevelopmentPlan : $('[name="DateOfLastUpdateDevelopmentPlan"]').val(),
                    PlannedUpdateOfDevelopmentPlan : $('[name="PlannedUpdateOfDevelopmentPlan"]').val(),
                    CaregiverID : $('[name="CaregiverID"]').val(),
                    SOSHouseID: $('[name="SOSHouseID"]').val()
                });
                childDataSource.sync();
                navigator.notification.alert("Se ha registrado correctamente");

            } else {
                offlineCaregiverDataSource.online(false);

                offlineCaregiverDataSource.add({
                    PhoneNumber : $('[name="PhoneNumber"]').val(),
                    Synchronized : $('[name="Synchronized"]').val(),
                    DateOfStart : $('[name="DateOfStart"]').val(),
                    DateOfBirth : $('[name="DateOfBirth"]').val(),
                    LastName : $('[name="LastName"]').val(),
                    FirstName : $('[name="FirstName"]').val(),
                    DocumentNumber : $('[name="DocumentNumber"]').val(),
                    Gender : $('[name="Gender"]').val(),
                    ReceiveSpecialAttention: $('[name="ReceiveSpecialAttention"]').val(),
                    IsLiterate : $('[name="IsLiterate"]').val(),
                    TotalIncome : $('[name="TotalIncome"]').val(),
                    Address : $('[name="Address"]').val(),
                    Status : $('[name="Status"]').val(),
                    DateOfLastHealthControl : $('[name="DateOfLastHealthControl"]').val(),
                    DateOfLastUpdateDevelopmentPlan : $('[name="DateOfLastUpdateDevelopmentPlan"]').val(),
                    PlannedUpdateOfDevelopmentPlan : $('[name="PlannedUpdateOfDevelopmentPlan"]').val(),
                    CaregiverID : $('[name="CaregiverID"]').val(),
                    SOSHouseID: $('[name="SOSHouseID"]').val()
                });
                offlineCaregiverDataSource.sync();
                navigator.notification.alert("Se ha registrado correctamente en modo desconectado");
            }
         },
         viewCaregiverSubmit: function(){
            if (navigator.onLine) 
            {
                 var caregiverDataSource = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "Caregiver"
                    },
    				serverFiltering: true,
    				filter: { field: 'SOSCaregiverID', operator: 'eq', value: $('[name="SOSCaregiverID"]').val() }	
    			});    
                
                caregiverDataSource.fetch(function() {
  					var entity = caregiverDataSource.at(0);
                    entity.set("PhoneNumber ",$('[name="PhoneNumber"]').val());
                    entity.set("Synchronized ",$('[name="Synchronized"]').val());
                    entity.set("DateOfStart ",$('[name="DateOfStart"]').val());
                    entity.set("DateOfBirth ",$('[name="DateOfBirth"]').val());
                    entity.set("LastName ",$('[name="LastName"]').val());
                    entity.set("FirstName ",$('[name="FirstName"]').val());
                    entity.set("DocumentNumber ",$('[name="DocumentNumber"]').val());
                    entity.set("Gender ",$('[name="Gender"]').val());
                    entity.set("ReceiveSpecialAttention",$('[name="ReceiveSpecialAttention"]').val());
                    entity.set("IsLiterate ",$('[name="IsLiterate"]').val());
                    entity.set("TotalIncome ",$('[name="TotalIncome"]').val());
                    entity.set("Address ",$('[name="Address"]').val());
                    entity.set("Status ",$('[name="Status"]').val());
                    entity.set("DateOfLastHealthControl ",$('[name="DateOfLastHealthControl"]').val());
                    entity.set("DateOfLastUpdateDevelopmentPlan ",$('[name="DateOfLastUpdateDevelopmentPlan"]').val());
                    entity.set("PlannedUpdateOfDevelopmentPlan ",$('[name="PlannedUpdateOfDevelopmentPlan"]').val());
                    entity.set("CaregiverID ",$('[name="CaregiverID"]').val());
                    entity.set("SOSHouseID",$('[name="SOSHouseID"]').val());
                });
                
                caregiverDataSource.sync();
                navigator.notification.alert("Se ha registrado correctamente");
                
            } else {
                offlineCaregiverDataSource.online(false);
                
                var filters = [];
 				filters = UpdateSearchFilters(filters, "SOSCaregiverID", "eq", $('[name="SOSCaregiverID"]').val(), "and");        
                offlineCaregiverDataSource.filter(filters);
                
                offlineCaregiverDataSource.fetch(function() {
  					var entity = offlineCaregiverDataSource.at(0);
                    entity.set("PhoneNumber ",$('[name="PhoneNumber"]').val());
                    entity.set("Synchronized ",$('[name="Synchronized"]').val());
                    entity.set("DateOfStart ",$('[name="DateOfStart"]').val());
                    entity.set("DateOfBirth ",$('[name="DateOfBirth"]').val());
                    entity.set("LastName ",$('[name="LastName"]').val());
                    entity.set("FirstName ",$('[name="FirstName"]').val());
                    entity.set("DocumentNumber ",$('[name="DocumentNumber"]').val());
                    entity.set("Gender ",$('[name="Gender"]').val());
                    entity.set("ReceiveSpecialAttention",$('[name="ReceiveSpecialAttention"]').val());
                    entity.set("IsLiterate ",$('[name="IsLiterate"]').val());
                    entity.set("TotalIncome ",$('[name="TotalIncome"]').val());
                    entity.set("Address ",$('[name="Address"]').val());
                    entity.set("Status ",$('[name="Status"]').val());
                    entity.set("DateOfLastHealthControl ",$('[name="DateOfLastHealthControl"]').val());
                    entity.set("DateOfLastUpdateDevelopmentPlan ",$('[name="DateOfLastUpdateDevelopmentPlan"]').val());
                    entity.set("PlannedUpdateOfDevelopmentPlan ",$('[name="PlannedUpdateOfDevelopmentPlan"]').val());
                    entity.set("CaregiverID ",$('[name="CaregiverID"]').val());
                    entity.set("SOSHouseID",$('[name="SOSHouseID"]').val());

                });
                
                offlineCaregiverDataSource.sync();
            }
         },
         getCaregiverByID: function () {   
                if (!navigator.onLine) {
                    navigator.notification.alert("No hay conexion a Internet");
                    return;
                }
             
                $('[name="FirstName"]').val("");
                $('[name="LastName"]').val("");

                var caregiverDataSources = new kendo.data.DataSource({
                        type: "everlive",
                        transport: {
                            typeName: "Caregiver"
                        },
                        serverFiltering: true,
                        filter: { field: 'CaregiverID', operator: 'eq', value: $('[name="CaregiverID"]').val().trim() }
                });    
				
                caregiverDataSources.fetch(function() {
                    var caregiver = caregiverDataSources.at(0);
                    $('[name="CaregiverID"]').val(caregiver.get("CaregiverID"));
                    $('[name="FirstName"]').val(caregiver.get("FirstName"));
                    $('[name="LastName"]').val(caregiver.get("LastName"));
                });
            }
    });
    
    window.APP.models.child = kendo.observable({
         addCaregiverToChild: function(){
            if (!navigator.onLine) {
                    navigator.notification.alert("No hay conexion a Internet");
                    return;
            }
            var caregiverID = $("#ddlCuidador").val();
            newSwitchTab("Add", "", "", "", caregiverID); 
         },
         addChildSubmit: function () {

            if (navigator.onLine) 
            {
                childDataSource.add({
                    Birthdate : $('[name="Birthdate"]').val(),
                    LastName : $('[name="LastName"]').val(),
                    FirstName : $('[name="FirstName"]').val(),
                    Trackings : $('[name="Trackings"]').val(),
                    Exitdate : $('[name="Exitdate"]').val(),
                    ExitReason : $('[name="ExitReason"]').val(),
                    MotherLastName : $('[name="MotherLastName"]').val(),
                    SOSChildID : $('[name="SOSChildID"]').val(),
                    CaregiverID: $('[name="CaregiverID"]').val()
                });
                childDataSource.sync();
                navigator.notification.alert("Se ha registrado correctamente");

            } else {
                offlineChildDataSource.online(false);

                offlineChildDataSource.add({
                    Birthdate : $('[name="Birthdate"]').val(),
                    LastName : $('[name="LastName"]').val(),
                    FirstName : $('[name="FirstName"]').val(),
                    Trackings : $('[name="Trackings"]').val(),
                    Exitdate : $('[name="Exitdate"]').val(),
                    ExitReason : $('[name="ExitReason"]').val(),
                    MotherLastName : $('[name="MotherLastName"]').val(),
                    SOSChildID : $('[name="SOSChildID"]').val(),
                    CaregiverID: $('[name="CaregiverID"]').val()
                });
                offlineChildDataSource.sync();
                navigator.notification.alert("Se ha registrado correctamente en modo desconectado");
            }
         },
         searchChildByCaregiver: function(){
           if (!navigator.onLine) {
                    navigator.notification.alert("No hay conexion a Internet");
                    return;
            }
            var caregiverID = $("#ddlCuidador").val();
            
            var filters = [];
 
        	//http://www.telerik.com/forums/adding-filters-to-grid-s-source
            filters = UpdateSearchFilters(filters, "CaregiverID", "eq", caregiverID, "and");        
	        childDataSource.filter(filters);
            
            $("#list").kendoMobileListView({
                dataSource: childDataSource,
                template: "Nombres: #: FirstName #, Apellidos #: LastName # <a href='javascript:newSwitchTab(\"View\",\"#if (SOSChildID == null) {# #=''# #} else {##=SOSChildID##}#\", \"#if (FirstName == null) {# #=''# #} else {##=FirstName##}#\", \"#if (SurName == null) {# #=''# #} else {##=SurName##}#\", \"" + caregiverID + "\")'>Visualizar</a>"                
            }); 
         },
         getChildItemByID: function(e){
            var childID = e.view.params.id;
            
            if(childID == null)
                return;
            	
            var childSearchDataSource = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "Child"
                    },
    				serverFiltering: true,
    			filter: { field: 'SOSChildID', operator: 'eq', value: childID }	
    		});    
            
            childSearchDataSource.fetch(function() {
  				var entity = childSearchDataSource.at(0);
  				$('[name="Birthdate"]').val(entity.get("Birthdate"));
                $('[name="LastName"]').val(entity.get("LastName"));
                $('[name="FirstName"]').val(entity.get("FirstName"));
                $('[name="Trackings"]').val(entity.get("Trackings"));
                $('[name="Exitdate"]').val(entity.get("Exitdate"));
                $('[name="ExitReason"]').val(entity.get("ExitReason"));
                $('[name="MotherLastName"]').val(entity.get("MotherLastName"));
                $('[name="SOSChildID"]').val(entity.get("SOSChildID"));
                $('[name="CaregiverID"]').val(entity.get("CaregiverID"));

			});   
         },
         viewChildSubmit: function(){
            if (navigator.onLine) 
            {
                 var childDataSource = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "Child"
                    },
    				serverFiltering: true,
    				filter: { field: 'SOSChildID', operator: 'eq', value: $('[name="SOSChildID"]').val() }	
    			});    
                
                childDataSource.fetch(function() {
  					var entity = childDataSource.at(0);
                    entity.set("Birthdate ",$('[name="Birthdate"]').val());
                    entity.set("LastName ",$('[name="LastName"]').val());
                    entity.set("FirstName ",$('[name="FirstName"]').val());
                    entity.set("Trackings ",$('[name="Trackings"]').val());
                    entity.set("Exitdate ",$('[name="Exitdate"]').val());
                    entity.set("ExitReason ",$('[name="ExitReason"]').val());
                    entity.set("MotherLastName ",$('[name="MotherLastName"]').val());
                    entity.set("SOSChildID ",$('[name="SOSChildID"]').val());
                    entity.set("CaregiverID",$('[name="CaregiverID"]').val());
                });
                
                childDataSource.sync();
                navigator.notification.alert("Se ha registrado correctamente");
                
            } else {
                offlineChildDataSource.online(false);
                
                var filters = [];
 				filters = UpdateSearchFilters(filters, "SOSChildID", "eq", $('[name="SOSChildID"]').val(), "and");        
                offlineChildDataSource.filter(filters);
                
                offlineChildDataSource.fetch(function() {
  					var entity = offlineChildDataSource.at(0);
                    entity.set("Birthdate ",$('[name="Birthdate"]').val());
                    entity.set("LastName ",$('[name="LastName"]').val());
                    entity.set("FirstName ",$('[name="FirstName"]').val());
                    entity.set("Trackings ",$('[name="Trackings"]').val());
                    entity.set("Exitdate ",$('[name="Exitdate"]').val());
                    entity.set("ExitReason ",$('[name="ExitReason"]').val());
                    entity.set("MotherLastName ",$('[name="MotherLastName"]').val());
                    entity.set("SOSChildID ",$('[name="SOSChildID"]').val());
                    entity.set("CaregiverID",$('[name="CaregiverID"]').val());
                });
                
                offlineChildDataSource.sync();
            }
         },
         getChildByID: function () {   
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
        },
        submitHouse: function(){
            if (navigator.onLine) {

                var sLocalStorage = localStorage.getItem("house-offline");
                var jLocalStorage = JSON.parse(sLocalStorage);

                var localStorageDataSource = new kendo.data.DataSource({
                    data: jLocalStorage
                });

                $("#listView").kendoMobileListView({
                    dataSource: localStorageDataSource,
                    template: "#: NameOrNumber # - #: Address # - #: SOSHouseID #"
                });

                var synchroDataSource = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "House"
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
                        Address : jLocalStorage[item]["Address"],
                        DateOfStart : jLocalStorage[item]["DateOfStart"],
                        MaximunCapacity : jLocalStorage[item]["MaximunCapacity"],
                        NameOrNumber : jLocalStorage[item]["NameOrNumber"],
                        Notes : jLocalStorage[item]["Notes"],
                        NumberOfChildren : jLocalStorage[item]["NumberOfChildren"],
                        PhoneNumber : jLocalStorage[item]["PhoneNumber"],
                        ProgrammeUnitID : jLocalStorage[item]["ProgrammeUnitID"],
                        SOSHouseID : jLocalStorage[item]["SOSHouseID"],
                        Status: jLocalStorage[item]["Status"]
                    });
                }

                localStorage.removeItem("house-offline");
                synchroDataSource.sync();
                navigator.notification.alert("Sincronizacion finalizada!!!");

            }
            else 
            {
                navigator.notification.alert("No se ha detectado una conexion activa a internet");
            }
        },
        submitCaregiver: function(){
            if (navigator.onLine) {

                var sLocalStorage = localStorage.getItem("caregiver-offline");
                var jLocalStorage = JSON.parse(sLocalStorage);

                var localStorageDataSource = new kendo.data.DataSource({
                    data: jLocalStorage
                });

                $("#listView").kendoMobileListView({
                    dataSource: localStorageDataSource,
                    template: "#: FirstName # - #: LastName # - #: SOSCaregiverID #"
                });

                var synchroDataSource = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "Caregiver"
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
                        PhoneNumber : jLocalStorage[item]["PhoneNumber"],
                        Synchronized : jLocalStorage[item]["Synchronized"],
                        DateOfStart : jLocalStorage[item]["DateOfStart"],
                        DateOfBirth : jLocalStorage[item]["DateOfBirth"],
                        LastName : jLocalStorage[item]["LastName"],
                        FirstName : jLocalStorage[item]["FirstName"],
                        DocumentNumber : jLocalStorage[item]["DocumentNumber"],
                        Gender : jLocalStorage[item]["Gender"],
                        ReceiveSpecialAttention: jLocalStorage[item]["ReceiveSpecialAttention"],
                        IsLiterate : jLocalStorage[item]["IsLiterate"],
                        TotalIncome : jLocalStorage[item]["TotalIncome"],
                        Address : jLocalStorage[item]["Address"],
                        Status : jLocalStorage[item]["Status"],
                        DateOfLastHealthControl : jLocalStorage[item]["DateOfLastHealthControl"],
                        DateOfLastUpdateDevelopmentPlan : jLocalStorage[item]["DateOfLastUpdateDevelopmentPlan"],
                        PlannedUpdateOfDevelopmentPlan : jLocalStorage[item]["PlannedUpdateOfDevelopmentPlan"],
                        CaregiverID : jLocalStorage[item]["CaregiverID"],
                        SOSHouseID: jLocalStorage[item]["SOSHouseID"]
                    });
                }

                localStorage.removeItem("caregiver-offline");
                synchroDataSource.sync();
                navigator.notification.alert("Sincronizacion finalizada!!!");

            }
            else 
            {
                navigator.notification.alert("No se ha detectado una conexion activa a internet");
            }
        },
        submitChild: function(){
            if (navigator.onLine) {

                var sLocalStorage = localStorage.getItem("child-offline");
                var jLocalStorage = JSON.parse(sLocalStorage);

                var localStorageDataSource = new kendo.data.DataSource({
                    data: jLocalStorage
                });

                $("#listView").kendoMobileListView({
                    dataSource: localStorageDataSource,
                    template: "#: FirstName # - #: LastName # - #: SOSChildID #"
                });

                var synchroDataSource = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "Child"
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
                        Birthdate : jLocalStorage[item]["Birthdate"],
                        LastName : jLocalStorage[item]["LastName"],
                        FirstName : jLocalStorage[item]["FirstName"],
                        Exitdate : jLocalStorage[item]["Exitdate"],
                        ExitReason : jLocalStorage[item]["ExitReason"],
                        MotherLastName : jLocalStorage[item]["MotherLastName"],
                        SOSChildID : jLocalStorage[item]["SOSChildID"],
                        CaregiverID: jLocalStorage[item]["CaregiverID"]
                    });
                }

                localStorage.removeItem("child-offline");
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