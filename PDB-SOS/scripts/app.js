var app; // store a reference to the application object that will be created  later on so that we can use it if need be

(function () { 
    //remove filters in each search
    //http://www.telerik.com/forums/remove-filters-from-data-source
    //FoodMenuDataSource.filter({});
    //FoodMenuDataSource.filter({ field: "Level", operator: "eq", value: 3 });
    
	//When you bind a property in a template and the property or value doesn't exist or is not declare, the app crashed
    //When you bind a property in a dropdown and the property doesn't exist or is not declare, the app get the text value when you invoke
    
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
                    },
        			serverFiltering: true
    });
    
    var caregiverDataSource = new kendo.data.DataSource({
        type: "everlive",
        transport: {
            typeName: "CareGiver"
        },
        schema: {
            model: {
                id: "Id"
            }
        },
		serverFiltering: true
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
        },
		serverFiltering: true        
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
        },
		serverFiltering: true        
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
            typeName: "CareGiver"
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
    
    window.APP = { // create an object to store the models for each view
        models: { home: { title: '¡Bienvenido!' }, credits: { title: '¡Créditos!' } }
    };
    
    window.APP.models.Util = kendo.observable({
       AddItem: function (e) {             
            var data = e.button.data();
            var selectedOpt = $("#" + data.type + " option:selected");                         
            var viewOpt = $("#" + data.type + "Values");
             
            if(viewOpt.find('[value="' + selectedOpt.val() + '"]').length == 0 && selectedOpt.text().trim() != "")                        
            	viewOpt.append($("<option></option>").attr("value",selectedOpt.val()).text(selectedOpt.text()));
           
            //Convert Array To Json (Save in DB)            
            //var myJsonString = GetComboBoxItemsAndConvertToJson(data.type);
            
            //Convert Json To Array (Show in Form)
            //SetComboBoxItemsAndConvertJsonToArray(myJsonString, data.type);
       },
       RemoveItem: function (e) {             
            var data = e.button.data();
            var selectedOpt = $("#" + data.type + "Values option:selected");                         
            var viewOpt = $("#" + data.type + "Values");
             
            viewOpt.find('[value="' + selectedOpt.val() + '"]').remove();             
   	   } 
    });
    
    window.APP.models.Reports = kendo.observable({
        init: function(){
          var paises = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "Country"
                    },
    				serverFiltering: true,
                    serverSorting: true,
      				sort: { field: "Name", dir: "asc" }
    		});               
            
             $("#ddlPaisViewConsolidated").kendoDropDownList({
                        dataTextField: "Name",
                        dataValueField: "CountryID",
                        dataSource: paises
             });  
            
             $("#ddlPaisViewFollowReport").kendoDropDownList({
                        dataTextField: "Name",
                        dataValueField: "CountryID",
                        dataSource: paises
             });              
        },
        submitConsolidatedReport: function(){            
            alert("en implementacion");            
        },
        submitFollowReport: function(){
            alert("en implementacion");            
        }
    });
    
    window.APP.models.house = kendo.observable({
        redirectToAddEntity: function () {             
            SwitchTab("House", "Add", "", "", "", "*");              
        },
        init: function () {
            
            setRestrictions();
            hideTabControls("House", "Add");
            hideTabControls("House", "View");
                        
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
             
             $("#ddlProgrammaView").kendoDropDownList({
                        dataTextField: "Name",
                        dataValueField: "ProgrammeUnitID",
                        dataSource: programa
             });      
            
             $("#listHouse").html("");
    	},
        searchHouseByProgrammeUnit: function(){
            
            var stringTemplate = "Casa: #: SOSHouseID #, Dirección #: Address # <a href='javascript:SwitchTab(\"House\",\"View\",\"#if (SOSHouseID == null) {# #=''# #} else {##=SOSHouseID##}#\", \"#if (Address == null) {# #=''# #} else {##=Address##}#\", \"#if (NameOrNumber == null) {# #=''# #} else {##=NameOrNumber##}#\", \"" + programmeUnitID + "\")'>Visualizar</a>";                
            var inactive = " #if (Status == null || Status != '1') {# <a href='javascript:optEntityTab(\"House\",\"Reactivate\", \"#= SOSHouseID #\")'>Reactivar</a> #}#";                
            var active = " #if (Status != null && Status == '1') {# <a href='javascript:optEntityTab(\"House\",\"Depart\", \"#= SOSHouseID #\")'>Salida</a> #}#";                
            stringTemplate = stringTemplate + inactive + active;
            
            if (!navigator.onLine) {
                	navigator.notification.alert("Se realizará la búsqueda desconectada");
                	offlineHouseDataSource.filter({});
                    
                    $("#listHouse").kendoMobileListView({
                        dataSource: offlineHouseDataSource,
                        template: stringTemplate,
                        dataBound: function () {
                            if (this.dataSource.total() == 0) 
                                $("#listHouse").html('<li>No hay resultados.</li>');
                        }                
                    }); 
                    return;
            }
            
            var programmeUnitID = $("#ddlProgrammaView").val();
            var filters = [];
 			
            houseDataSource.filter({});
        	//http://www.telerik.com/forums/adding-filters-to-grid-s-source
            filters = UpdateSearchFilters(filters, "ProgrammeUnitID", "eq", programmeUnitID, "and");        
	        houseDataSource.filter(filters);
            
            $("#listHouse").kendoMobileListView({
                dataSource: houseDataSource,
                template: stringTemplate,
                dataBound: function () {
                    if (this.dataSource.total() == 0) 
                        $("#listHouse").html('<li>No hay resultados.</li>');
                }
            });
        },
        addProgrammeUnitToHouse: function(){
            /*if (!navigator.onLine) {
                    navigator.notification.alert("No hay conexion a Internet");
                    return;
            }*/            
            var programmeUnitID = "";
            if (navigator.onLine) { programmeUnitID = $("#ddlProgramma").val(); }
            SwitchTab("House", "Add", "", "", "", programmeUnitID);              
        },
        getHouseItemByID: function(e){
            var houseID = e.view.params.id;
            
            if(houseID == null)
                return;
            	
            houseDataSource.filter({});
            
            var filters = [];
            filters = UpdateSearchFilters(filters, "SOSHouseID", "eq", houseID, "and");        
             
			var datasource = houseDataSource;
             
            if (!navigator.onLine) { datasource = offlineHouseDataSource; }          
            
            datasource.filter({});
            datasource.filter(filters);  

            datasource.fetch(function() {
  				var entity = datasource.at(0);
  				$('[name="AddressView"]').val(entity.get("Address"));
                $('[name="DateOfStartView"]').val(kendo.toString(entity.get("DateOfStart"), "yyyy-MM-dd"));
                $('[name="MaximunCapacityView"]').val(entity.get("MaximunCapacity"));
                $('[name="NameOrNumberView"]').val(entity.get("NameOrNumber"));
                $('[name="NotesView"]').val(entity.get("Notes"));
                $('[name="NumberOfChildrenView"]').val(entity.get("NumberOfChildren"));
                $('[name="PhoneNumberView"]').val(entity.get("PhoneNumber"));
                $('[name="ProgrammeUnitIDView"]').val(entity.get("ProgrammeUnitID"));
                $('[name="SOSHouseIDView"]').val(entity.get("SOSHouseID"));
                
                if(entity.get("Status") == "1")                	
                    $('[name="StatusView"]').val("Activo");
                else
                	$('[name="StatusView"]').val("Inactivo");
			}); 
            
            houseDataSource.filter({});
        },
        getHouseByID: function () { 
            if (!navigator.onLine) {
                    navigator.notification.alert("No hay conexion a Internet");
                    return;
                }
             
                $('[name="NameOrNumberView"]').val("");

                houseDataSource.filter({});
                houseDataSource = new kendo.data.DataSource({
                        type: "everlive",
                        transport: {
                            typeName: "House"
                        },
                        serverFiltering: true,
                        filter: { field: 'SOSHouseID', operator: 'eq', value: $('[name="SOSHouseIDView"]').val().trim() }
                });    
				
                houseDataSource.fetch(function() {
                    var entity = houseDataSource.at(0);
                    $('[name="SOSHouseIDView"]').val(entity.get("SOSHouseID"));
                    $('[name="NameOrNumberView"]').val(entity.get("NameOrNumber"));
                });
            
            	houseDataSource.filter({});
    	},
        addHouseSubmit: function () { 
            if(validateNullValues($('[name="Address"]').val()) == ""){
                navigator.notification.alert("La dirección es obligatoria");
                return;
        	}
            
            if(validateNullValues($('[name="NameOrNumber"]').val()) == ""){
                navigator.notification.alert("El nombre de hogar es obligatorio");
                return;
        	}            
        
            if(validateNullValues($('[name="SOSHouseID"]').val()) == "" || validateNullValues($('[name="SOSHouseID"]').val()).length != 8){
                navigator.notification.alert("El código de hogar es obligatorio y ser de 8 caracteres");
                return;
        	}
            
            if (navigator.onLine) 
            {
                var searchHouseDataSource = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "House"
                    },
    				serverFiltering: true,
                    change: function(e) {
                        var view = this.view();
                                                
                        if(view.length > 0){
                            navigator.notification.alert("El código de hogar ya está registrado");                
                            return;
                        }else{
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
                                Status: "1"
                                //Status: $('[name="Status"]').val()
                            });
                            houseDataSource.sync();
                            navigator.notification.alert("Se ha registrado correctamente");            
                        }                      
                    },
    				filter: { field: 'SOSHouseID', operator: 'eq', value: $('[name="SOSHouseID"]').val() }	
    			});    
                
                searchHouseDataSource.read();
                
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
                    Status: "1"
                });
                
                offlineHouseDataSource.sync();
                navigator.notification.alert("Se ha registrado correctamente en modo desconectado");
            }
    	},
        viewHouseSubmit: function(){
            //http://docs.telerik.com/kendo-ui/api/javascript/ui/validator
            //In the tag control  add: required data-required-msg="Fecha de inicio es mandatorio"
            /*var validatable = $("#formViewHouse").kendoValidator().data("kendoValidator");            
            if (validatable.validate() === false) {
                var errors = validatable.errors();
                $(errors).each(function() {
                  $("#errors").html(this);
                });
                return;
            }*/
            if(validateNullValues($('[name="AddressView"]').val()) == ""){
                    navigator.notification.alert("La dirección es obligatoria");
                    return;
            }

            if(validateNullValues($('[name="NameOrNumberView"]').val()) == ""){
                    navigator.notification.alert("El nombre de hogar es obligatorio");
                    return;
            }            

            if(validateNullValues($('[name="SOSHouseIDView"]').val()) == "" || validateNullValues($('[name="SOSHouseIDView"]').val()).length != 8){
                    navigator.notification.alert("El código de hogar es obligatorio y ser de 8 caracteres");
                    return;
            }
            
            if (navigator.onLine) 
            {
                 houseDataSource = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "House"
                    },
    				serverFiltering: true,
    				filter: { field: 'SOSHouseID', operator: 'eq', value: $('[name="SOSHouseIDView"]').val() }	
    			});    
                
                houseDataSource.fetch(function() {
                    var entity = houseDataSource.at(0);
                    entity.set("Address",$('[name="AddressView"]').val());
                    entity.set("DateOfStart",$('[name="DateOfStartView"]').val());
                    entity.set("MaximunCapacity",$('[name="MaximunCapacityView"]').val());
                    entity.set("NameOrNumber",$('[name="NameOrNumberView"]').val());
                    entity.set("Notes",$('[name="NotesView"]').val());
                    entity.set("NumberOfChildren",$('[name="NumberOfChildrenView"]').val());
                    entity.set("PhoneNumber",$('[name="PhoneNumberView"]').val());
                    entity.set("ProgrammeUnitID",$('[name="ProgrammeUnitIDView"]').val());
                    entity.set("SOSHouseID",$('[name="SOSHouseIDView"]').val());
                    //entity.set("Status","1");
                    //entity.set("Status",$('[name="StatusView"]').val());
                    houseDataSource.sync();                	
                    navigator.notification.alert("Se ha registrado correctamente");
                });
                
                houseDataSource.filter({});
                
            } else {
                offlineHouseDataSource.online(false);
                
                var filters = [];
 				filters = UpdateSearchFilters(filters, "SOSHouseID", "eq", $('[name="SOSHouseIDView"]').val(), "and");        
                offlineHouseDataSource.filter(filters);
                
                offlineHouseDataSource.fetch(function() {
  					var entity = offlineHouseDataSource.at(0);
                    entity.set("Address",$('[name="AddressView"]').val());
                    entity.set("DateOfStart",$('[name="DateOfStartView"]').val());
                    entity.set("MaximunCapacity",$('[name="MaximunCapacityView"]').val());
                    entity.set("NameOrNumber",$('[name="NameOrNumberView"]').val());
                    entity.set("Notes",$('[name="NotesView"]').val());
                    entity.set("NumberOfChildren",$('[name="NumberOfChildrenView"]').val());
                    entity.set("PhoneNumber",$('[name="PhoneNumberView"]').val());
                    entity.set("ProgrammeUnitID",$('[name="ProgrammeUnitIDView"]').val());
                    entity.set("SOSHouseID",$('[name="SOSHouseIDView"]').val());
                    //entity.set("Status",$('[name="StatusView"]').val());
                    offlineHouseDataSource.sync();
                    navigator.notification.alert("Se ha registrado correctamente");
                });
            }
        },
        departHouseSubmit: function(){
             	houseDataSource.filter({});
                houseDataSource = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "House"
                    },
    				serverFiltering: true,
    				filter: { field: 'SOSHouseID', operator: 'eq', value: $('[name="SOSHouseIDView"]').val() }	
    			});    
                
                houseDataSource.fetch(function() {
                    var entity = houseDataSource.at(0);                    
                    entity.set("Status","0");
                    //entity.set("ReentryReason",$('[name="ExitReason"]').val());
                    houseDataSource.sync();
                	navigator.notification.alert("Se ha inactivado el hogar correctamente");
                });
         },
        reactivateHouseSubmit: function(){
             	houseDataSource.filter({});
                houseDataSource = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "House"
                    },
    				serverFiltering: true,
    				filter: { field: 'SOSHouseID', operator: 'eq', value: $('[name="SOSHouseIDView"]').val() }	
    			});    
                
                houseDataSource.fetch(function() {
                    var entity = houseDataSource.at(0);                    
                    entity.set("Status","1");
                    //entity.set("ReentryReason",$('[name="ReentryReason"]').val());
                    houseDataSource.sync();
                	navigator.notification.alert("Se ha reactivado el hogar correctamente");
                });
         }         
    });
    
    window.APP.models.caregiver = kendo.observable({
         redirectToAddEntity: function () {             
            SwitchTab("Caregiver", "Add", "", "", "", "*");              
         },
         init: function () {     
            setRestrictions();
            hideTabControls("Caregiver", "Add");
            hideTabControls("Caregiver", "View");
             
            var casa = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "House"
                    },
    				serverFiltering: true,
                    serverSorting: true,
      				sort: { field: "NameOrNumber", dir: "asc" }
    		 });               
            
             $("#ddlCasaView").kendoDropDownList({
                        dataTextField: "NameOrNumber",
                        dataValueField: "SOSHouseID",
                        dataSource: casa
             });
             
             var filters = []; 
             casa.filter({});
             filters = UpdateSearchFilters(filters, "Status", "eq", "1", "and");        
	         casa.filter(filters);
             
             $("#ddlCasa").kendoDropDownList({
                        dataTextField: "NameOrNumber",
                        dataValueField: "SOSHouseID",
                        dataSource: casa
                    });
             
             $("#listCaregiver").html("");
    	 },
         searchCaregiverByHouse: function(){
             
             var stringTemplate = "Nombres: #: FirstName #, Apellidos #: LastName # <a href='javascript:SwitchTab(\"Caregiver\",\"View\",\"#if (CaregiverID == null) {# #=''# #} else {##=CaregiverID##}#\", \"#if (FirstName == null) {# #=''# #} else {##=FirstName##}#\", \"#if (LastName == null) {# #=''# #} else {##=LastName##}#\", \"" + houseID + "\")'>Visualizar</a>";                
             var inactive = " #if (Status == null || Status != '1') {# <a href='javascript:optEntityTab(\"Caregiver\",\"Reactivate\", \"#= CaregiverID #\")'>Reactivar</a> #}#";                
             var active = " #if (Status != null && Status == '1') {# <a href='javascript:optEntityTab(\"Caregiver\",\"Depart\", \"#= CaregiverID #\")'>Salida</a> <a href='javascript:optEntityTab(\"Caregiver\",\"Transfer\", \"#= CaregiverID #\")'>Transferencia</a> #}#";                
             stringTemplate = stringTemplate + inactive + active;            
             
             if (!navigator.onLine) {
                    //navigator.notification.alert("No hay conexion a Internet");
                    //return;
                	navigator.notification.alert("Se realizará la búsqueda desconectada");
                	offlineCaregiverDataSource.filter({});
                    
                    $("#listCaregiver").kendoMobileListView({
                        dataSource: offlineCaregiverDataSource,
                        template: stringTemplate,
                        dataBound: function () {
                            if (this.dataSource.total() == 0) 
                                $("#listCaregiver").html('<li>No hay resultados.</li>');
                        }                
                    }); 
                    return;
            }
             
            var houseID = $("#ddlCasaView").val();
            
            var filters = []; 
            caregiverDataSource.filter({});
             
        	//http://www.telerik.com/forums/adding-filters-to-grid-s-source
            filters = UpdateSearchFilters(filters, "SOSHouseID", "eq", houseID, "and");        
	        caregiverDataSource.filter(filters);
            
            $("#listCaregiver").kendoMobileListView({
                dataSource: caregiverDataSource,
                template: stringTemplate,
                dataBound: function () {
                    if (this.dataSource.total() == 0) 
                        $("#listCaregiver").html('<li>No hay resultados.</li>');
                }
            });
         },
         addHouseToCaregiver: function(){
            /*if (!navigator.onLine) {
                    navigator.notification.alert("No hay conexion a Internet");
                    return;
            }*/
            var houseID = "";
            if (navigator.onLine) { houseID = $("#ddlCasa").val(); }
            SwitchTab("Caregiver", "Add", "", "", "", houseID); 
         },
         getCaregiverItemByID: function(e){
            var caregiverID = e.view.params.id;
            
            if(caregiverID == null)
                return;
            	
            var filters = [];
            filters = UpdateSearchFilters(filters, "CaregiverID", "eq", caregiverID, "and");        
             
            var datasource = caregiverDataSource;

			if (!navigator.onLine) { datasource = offlineCaregiverDataSource; }          

            datasource.filter({});
            datasource.filter(filters);  

            datasource.fetch(function() {
  				var entity = datasource.at(0);
                
  				$('[name="PhoneNumberView"]').val(entity.get("PhoneNumber"));
                
                if(entity.get("Synchronized") == true) $('[name="SynchronizedView"]').attr('checked', true);                
                $('[name="DateOfStartView"]').val(kendo.toString(entity.get("DateOfStart"), "yyyy-MM-dd"));
                $('[name="DateOfBirthView"]').val(kendo.toString(entity.get("DateOfBirth"), "yyyy-MM-dd"));
                $('[name="LastNameView"]').val(entity.get("LastName"));
                $('[name="FirstNameView"]').val(entity.get("FirstName"));
                $('[name="DocumentNumberView"]').val(entity.get("DocumentNumber"));
                $('[name="GenderView"]').val(entity.get("Gender"));
                
                if(entity.get("ReceiveSpecialAttention") == true) $('[name="ReceiveSpecialAttentionView"]').attr('checked', true);
                if(entity.get("IsLiterate") == true) $('[name="IsLiterateView"]').attr('checked', true);
                $('[name="TotalIncomeView"]').val(entity.get("TotalIncome"));
                $('[name="AddressView"]').val(entity.get("Address"));                
                $('[name="DateOfLastHealthControlView"]').val(kendo.toString(entity.get("DateOfLastHealthControl"), "yyyy-MM-dd"));
                $('[name="DateOfLastUpdateDevelopmentPlanView"]').val(kendo.toString(entity.get("DateOfLastUpdateDevelopmentPlan"), "yyyy-MM-dd"));
                $('[name="PlannedUpdateOfDevelopmentPlanView"]').val(kendo.toString(entity.get("PlannedUpdateOfDevelopmentPlan"), "yyyy-MM-dd"));
                $('[name="CaregiverIDView"]').val(entity.get("CaregiverID"));
                $('[name="SOSHouseIDView"]').val(entity.get("SOSHouseID"));
                
                if(entity.get("HasDevelopmentPlan") == true) $('[name="HasDevelopmentPlanView"]').attr('checked', true);
                $('[name="TypeofFamilyView"]').val(entity.get("TypeofFamily"));
                $('[name="NationalityView"]').val(entity.get("Nationality"));
                $('[name="TypeOfCaregiverView"]').val(entity.get("TypeOfCaregiver"));
                $('[name="PlannedRetirementDateView"]').val(kendo.toString(entity.get("PlannedRetirementDate"), "yyyy-MM-dd"));
                
                if(entity.get("HasChildrenSiblings") == true) $('[name="HasChildrenSiblingsView"]').attr('checked', true);
                $('[name="TypeOfSupportView"]').val(entity.get("TypeOfSupport"));
                $('[name="ProfessionView"]').val(entity.get("Profession"));
                $('[name="TrainingInSOSView"]').val(entity.get("TrainingInSOS"));
                $('[name="FormalEducationalLevelView"]').val(entity.get("FormalEducationalLevel"));
                $('[name="YearsOfFormalEducationView"]').val(entity.get("YearsOfFormalEducation"));
                
                if(entity.get("MedicalCare") == true) $('[name="MedicalCareView"]').attr('checked', true);
                SetComboBoxItemsAndConvertJsonToArray(entity.get("TypeOfDisease"),"TypeOfDiseaseView");
                SetComboBoxItemsAndConvertJsonToArray(entity.get("HousingAndLivingSupport"),"HousingAndLivingSupportView");
                SetComboBoxItemsAndConvertJsonToArray(entity.get("FoodSupport"),"FoodSupportView");
                SetComboBoxItemsAndConvertJsonToArray(entity.get("MedicalCareSupport"),"MedicalCareSupportView");
                SetComboBoxItemsAndConvertJsonToArray(entity.get("PsychosocialSupport"),"PsychosocialSupportView");
                SetComboBoxItemsAndConvertJsonToArray(entity.get("ChildCareAndParentSupport"),"ChildCareAndParentSupportView");
                SetComboBoxItemsAndConvertJsonToArray(entity.get("LegalSupport"),"LegalSupportView");
                SetComboBoxItemsAndConvertJsonToArray(entity.get("EconomicSupport"),"EconomicSupportView");

                if(entity.get("Status") == "1")                	
                    $('[name="StatusView"]').val("Activo");
                else
                	$('[name="StatusView"]').val("Inactivo");
			}); 
            
            caregiverDataSource.filter({});  
         },
         getCaregiverByID: function () {   
                if (!navigator.onLine) {
                    navigator.notification.alert("No hay conexion a Internet");
                    return;
                }
             
                $('[name="FirstNameView"]').val("");
                $('[name="LastNameView"]').val("");

                caregiverDataSource.filter({});
                caregiverDataSource = new kendo.data.DataSource({
                        type: "everlive",
                        transport: {
                            typeName: "CareGiver"
                        },
                        serverFiltering: true,
                        filter: { field: 'CaregiverID', operator: 'eq', value: $('[name="CaregiverIDView"]').val().trim() }
                });    
				
                caregiverDataSource.fetch(function() {
                    var caregiver = caregiverDataSource.at(0);
                    $('[name="CaregiverIDView"]').val(caregiver.get("CaregiverID"));
                    $('[name="FirstNameView"]').val(caregiver.get("FirstName"));
                    $('[name="LastNameView"]').val(caregiver.get("LastName"));
                });
            },
         addCaregiverSubmit: function () {

            if(validateNullValues($('[name="FirstName"]').val()) == ""){
                navigator.notification.alert("Los nombres son obligatorios");
                return;
        	}
            
            if(validateNullValues($('[name="LastName"]').val()) == ""){
                navigator.notification.alert("Los apellidos son obligatorios");
                return;
        	}            
        
            if(validateNullValues($('[name="CaregiverID"]').val()) == "" || validateNullValues($('[name="CaregiverID"]').val()).length != 8){
                navigator.notification.alert("El código de cuidador es obligatorio y ser de 8 caracteres");
                return;
        	}
             
            if (navigator.onLine) 
            {
                var searchCaregiverDataSource = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "CareGiver"
                    },
    				serverFiltering: true,
                    change: function(e) {
                        var view = this.view();
                                                
                        if(view.length > 0){
                            navigator.notification.alert("El código del cuidador ya está registrado");                
                            return;
                        }else{
                            caregiverDataSource.add({
                                PhoneNumber : $('[name="PhoneNumber"]').val(),
                                Synchronized : $('[name="Synchronized"]').is(":checked"),
                                DateOfStart : $('[name="DateOfStart"]').val(),
                                DateOfBirth : $('[name="DateOfBirth"]').val(),
                                LastName : $('[name="LastName"]').val(),
                                FirstName : $('[name="FirstName"]').val(),
                                DocumentNumber : $('[name="DocumentNumber"]').val(),
                                Gender : $('[name="Gender"]').val(),
                                ReceiveSpecialAttention: $('[name="ReceiveSpecialAttention"]').is(":checked"),
                                IsLiterate : $('[name="IsLiterate"]').is(":checked"),
                                TotalIncome : $('[name="TotalIncome"]').val(),
                                Address : $('[name="Address"]').val(),
                                DateOfLastHealthControl : $('[name="DateOfLastHealthControl"]').val(),
                                DateOfLastUpdateDevelopmentPlan : $('[name="DateOfLastUpdateDevelopmentPlan"]').val(),
                                PlannedUpdateOfDevelopmentPlan : $('[name="PlannedUpdateOfDevelopmentPlan"]').val(),
                                CaregiverID : $('[name="CaregiverID"]').val(),
                                SOSHouseID: $('[name="SOSHouseID"]').val(),
                                HasDevelopmentPlan:$('[name="HasDevelopmentPlan"]').is(":checked"),
                                TypeofFamily:$('[name="TypeofFamily"]').val(),
                                Nationality:$('[name="Nationality"]').val(),
                                TypeOfCaregiver:$('[name="TypeOfCaregiver"]').val(),
                                PlannedRetirementDate:$('[name="PlannedRetirementDate"]').val(),
                                HasChildrenSiblings:$('[name="HasChildrenSiblings"]').is(":checked"),
                                TypeOfSupport:$('[name="TypeOfSupport"]').val(),
                                Profession:$('[name="Profession"]').val(),
                                TrainingInSOS:$('[name="TrainingInSOS"]').val(),
                                FormalEducationalLevel:$('[name="FormalEducationalLevel"]').val(),
                                YearsOfFormalEducation:$('[name="YearsOfFormalEducation"]').val(),
                                MedicalCare:$('[name="MedicalCare"]').is(":checked"),
                                TypeOfDisease:GetComboBoxItemsAndConvertToJson("TypeOfDisease"),
                                HousingAndLivingSupport:GetComboBoxItemsAndConvertToJson("HousingAndLivingSupport"),
                                FoodSupport:GetComboBoxItemsAndConvertToJson("FoodSupport"),
                                MedicalCareSupport:GetComboBoxItemsAndConvertToJson("MedicalCareSupport"),
                                PsychosocialSupport:GetComboBoxItemsAndConvertToJson("PsychosocialSupport"),
                                ChildCareAndParentSupport:GetComboBoxItemsAndConvertToJson("ChildCareAndParentSupport"),
                                LegalSupport:GetComboBoxItemsAndConvertToJson("LegalSupport"),
                                EconomicSupport:GetComboBoxItemsAndConvertToJson("EconomicSupport"),
                                Status: "1"
                            });
                            caregiverDataSource.sync();
                            navigator.notification.alert("Se ha registrado correctamente");            
                        }                      
                    },
    				filter: { field: 'CaregiverID', operator: 'eq', value: $('[name="CaregiverID"]').val() }	
    			});    
                
                searchCaregiverDataSource.read();

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
                    ReceiveSpecialAttention: $('[name="ReceiveSpecialAttention"]').is(":checked"),
                    IsLiterate : $('[name="IsLiterate"]').is(":checked"),
                    TotalIncome : $('[name="TotalIncome"]').val(),
                    Address : $('[name="Address"]').val(),
                    DateOfLastHealthControl : $('[name="DateOfLastHealthControl"]').val(),
                    DateOfLastUpdateDevelopmentPlan : $('[name="DateOfLastUpdateDevelopmentPlan"]').val(),
                    PlannedUpdateOfDevelopmentPlan : $('[name="PlannedUpdateOfDevelopmentPlan"]').val(),
                    CaregiverID : $('[name="CaregiverID"]').val(),
                    SOSHouseID: $('[name="SOSHouseID"]').val(),
                    HasDevelopmentPlan:$('[name="HasDevelopmentPlan"]').is(":checked"),
                    TypeofFamily:$('[name="TypeofFamily"]').val(),
                    Nationality:$('[name="Nationality"]').val(),
                    TypeOfCaregiver:$('[name="TypeOfCaregiver"]').val(),
                    PlannedRetirementDate:$('[name="PlannedRetirementDate"]').val(),
                    HasChildrenSiblings:$('[name="HasChildrenSiblings"]').is(":checked"),
                    TypeOfSupport:$('[name="TypeOfSupport"]').val(),
                    Profession:$('[name="Profession"]').val(),
                    TrainingInSOS:$('[name="TrainingInSOS"]').val(),
                    FormalEducationalLevel:$('[name="FormalEducationalLevel"]').val(),
                    YearsOfFormalEducation:$('[name="YearsOfFormalEducation"]').val(),
                    MedicalCare:$('[name="MedicalCare"]').is(":checked"),
                    TypeOfDisease:GetComboBoxItemsAndConvertToJson("TypeOfDisease"),
                    HousingAndLivingSupport:GetComboBoxItemsAndConvertToJson("HousingAndLivingSupport"),
                    FoodSupport:GetComboBoxItemsAndConvertToJson("FoodSupport"),
                    MedicalCareSupport:GetComboBoxItemsAndConvertToJson("MedicalCareSupport"),
                    PsychosocialSupport:GetComboBoxItemsAndConvertToJson("PsychosocialSupport"),
                    ChildCareAndParentSupport:GetComboBoxItemsAndConvertToJson("ChildCareAndParentSupport"),
                    LegalSupport:GetComboBoxItemsAndConvertToJson("LegalSupport"),
                    EconomicSupport:GetComboBoxItemsAndConvertToJson("EconomicSupport"),
                    Status: "1"
                });
                offlineCaregiverDataSource.sync();
                navigator.notification.alert("Se ha registrado correctamente en modo desconectado");
            }
         },
         viewCaregiverSubmit: function(){
            if(validateNullValues($('[name="FirstNameView"]').val()) == ""){
                navigator.notification.alert("Los nombres son obligatorios");
                return;
        	}
            
            if(validateNullValues($('[name="LastNameView"]').val()) == ""){
                navigator.notification.alert("Los apellidos son obligatorios");
                return;
        	}            
        
            if(validateNullValues($('[name="CaregiverIDView"]').val()) == "" || validateNullValues($('[name="CaregiverIDView"]').val()).length != 8){
                navigator.notification.alert("El código de cuidador es obligatorio y ser de 8 caracteres");
                return;
        	}
             
            if (navigator.onLine) 
            {
                caregiverDataSource.filter({});
                caregiverDataSource = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "CareGiver"
                    },
    				serverFiltering: true,
    				filter: { field: 'CaregiverID', operator: 'eq', value: $('[name="CaregiverIDView"]').val() }	
    			});    
                
                caregiverDataSource.fetch(function() {
                    var entity = caregiverDataSource.at(0);                    
                    entity.set("PhoneNumber",$('[name="PhoneNumberView"]').val());
                    entity.set("Synchronized",$('[name="SynchronizedView"]').is(":checked"));
                    entity.set("DateOfStart",$('[name="DateOfStartView"]').val());
                    entity.set("DateOfBirth",$('[name="DateOfBirthView"]').val());
                    entity.set("LastName",$('[name="LastNameView"]').val());
                    entity.set("FirstName",$('[name="FirstNameView"]').val());
                    entity.set("DocumentNumber",$('[name="DocumentNumberView"]').val());
                    entity.set("Gender",$('[name="GenderView"]').val());
                    entity.set("ReceiveSpecialAttention",$('[name="ReceiveSpecialAttentionView"]').is(":checked"));
                    entity.set("IsLiterate",$('[name="IsLiterateView"]').is(":checked"));
                    entity.set("TotalIncome",$('[name="TotalIncomeView"]').val());
                    entity.set("Address",$('[name="AddressView"]').val());
                    entity.set("Status",$('[name="StatusView"]').val());
                    entity.set("DateOfLastHealthControl",$('[name="DateOfLastHealthControlView"]').val());
                    entity.set("DateOfLastUpdateDevelopmentPlan",$('[name="DateOfLastUpdateDevelopmentPlanView"]').val());
                    entity.set("PlannedUpdateOfDevelopmentPlan",$('[name="PlannedUpdateOfDevelopmentPlanView"]').val());
                    entity.set("CaregiverID",$('[name="CaregiverIDView"]').val());
                    entity.set("SOSHouseID",$('[name="SOSHouseIDView"]').val());
                    
                    entity.set("HasDevelopmentPlan",$('[name="HasDevelopmentPlanView"]').is(":checked"));
                    entity.set("TypeofFamily",$('[name="TypeofFamilyView"]').val());
                    entity.set("Nationality",$('[name="NationalityView"]').val());
                    entity.set("TypeOfCaregiver",$('[name="TypeOfCaregiverView"]').val());
                    entity.set("PlannedRetirementDate",$('[name="PlannedRetirementDateView"]').val());
                    entity.set("HasChildrenSiblings",$('[name="HasChildrenSiblingsView"]').is(":checked"));
                    entity.set("TypeOfSupport",$('[name="TypeOfSupportView"]').val());
                    entity.set("Profession",$('[name="ProfessionView"]').val());
                    entity.set("TrainingInSOS",$('[name="TrainingInSOSView"]').val());
                    entity.set("FormalEducationalLevel",$('[name="FormalEducationalLevelView"]').val());
                    entity.set("YearsOfFormalEducation",$('[name="YearsOfFormalEducationView"]').val());
                    entity.set("MedicalCare",$('[name="MedicalCareView"]').is(":checked"));
                    entity.set("TypeOfDisease",GetComboBoxItemsAndConvertToJson("TypeOfDiseaseView"));
                    entity.set("HousingAndLivingSupport",GetComboBoxItemsAndConvertToJson("HousingAndLivingSupportView"));
                    entity.set("FoodSupport",GetComboBoxItemsAndConvertToJson("FoodSupportView"));
                    entity.set("MedicalCareSupport",GetComboBoxItemsAndConvertToJson("MedicalCareSupportView"));
                    entity.set("PsychosocialSupport",GetComboBoxItemsAndConvertToJson("PsychosocialSupportView"));
                    entity.set("ChildCareAndParentSupport",GetComboBoxItemsAndConvertToJson("ChildCareAndParentSupportView"));
                    entity.set("LegalSupport",GetComboBoxItemsAndConvertToJson("LegalSupportView"));
                    entity.set("EconomicSupport",GetComboBoxItemsAndConvertToJson("EconomicSupportView"));

                    caregiverDataSource.sync();
                	navigator.notification.alert("Se ha registrado correctamente");
                });
                
            } else {
                offlineCaregiverDataSource.online(false);
                
                var filters = [];
 				filters = UpdateSearchFilters(filters, "CaregiverID", "eq", $('[name="CaregiverIDView"]').val(), "and");        
                offlineCaregiverDataSource.filter(filters);
                
                offlineCaregiverDataSource.fetch(function() {
  					var entity = caregiverDataSource.at(0);
                    entity.set("PhoneNumber",$('[name="PhoneNumberView"]').val());
                    entity.set("Synchronized",$('[name="SynchronizedView"]').val());
                    entity.set("DateOfStart",$('[name="DateOfStartView"]').val());
                    entity.set("DateOfBirth",$('[name="DateOfBirthView"]').val());
                    entity.set("LastName",$('[name="LastNameView"]').val());
                    entity.set("FirstName",$('[name="FirstNameView"]').val());
                    entity.set("DocumentNumber",$('[name="DocumentNumberView"]').val());
                    entity.set("Gender",$('[name="GenderView"]').val());
                    entity.set("ReceiveSpecialAttention",$('[name="ReceiveSpecialAttentionView"]').is(":checked"));
                    entity.set("IsLiterate",$('[name="IsLiterateView"]').is(":checked"));
                    entity.set("TotalIncome",$('[name="TotalIncomeView"]').val());
                    entity.set("Address",$('[name="AddressView"]').val());
                    entity.set("Status",$('[name="StatusView"]').val());
                    entity.set("DateOfLastHealthControl",$('[name="DateOfLastHealthControlView"]').val());
                    entity.set("DateOfLastUpdateDevelopmentPlan",$('[name="DateOfLastUpdateDevelopmentPlanView"]').val());
                    entity.set("PlannedUpdateOfDevelopmentPlan",$('[name="PlannedUpdateOfDevelopmentPlanView"]').val());
                    entity.set("CaregiverID",$('[name="CaregiverIDView"]').val());
                    entity.set("SOSHouseID",$('[name="SOSHouseIDView"]').val());
                    
                    entity.set("HasDevelopmentPlan",$('[name="HasDevelopmentPlanView"]').is(":checked"));
                    entity.set("TypeofFamily",$('[name="TypeofFamilyView"]').val());
                    entity.set("Nationality",$('[name="NationalityView"]').val());
                    entity.set("TypeOfCaregiver",$('[name="TypeOfCaregiverView"]').val());
                    entity.set("PlannedRetirementDate",$('[name="PlannedRetirementDateView"]').val());
                    entity.set("HasChildrenSiblings",$('[name="HasChildrenSiblingsView"]').val());
                    entity.set("TypeOfSupport",$('[name="TypeOfSupportView"]').val());
                    entity.set("Profession",$('[name="ProfessionView"]').val());
                    entity.set("TrainingInSOS",$('[name="TrainingInSOSView"]').val());
                    entity.set("FormalEducationalLevel",$('[name="FormalEducationalLevelView"]').val());
                    entity.set("YearsOfFormalEducation",$('[name="YearsOfFormalEducationView"]').val());
                    entity.set("MedicalCare",$('[name="MedicalCareView"]').is(":checked"));
                    entity.set("TypeOfDisease",GetComboBoxItemsAndConvertToJson("TypeOfDiseaseView"));
                    entity.set("HousingAndLivingSupport",GetComboBoxItemsAndConvertToJson("HousingAndLivingSupportView"));
                    entity.set("FoodSupport",GetComboBoxItemsAndConvertToJson("FoodSupportView"));
                    entity.set("MedicalCareSupport",GetComboBoxItemsAndConvertToJson("MedicalCareSupportView"));
                    entity.set("PsychosocialSupport",GetComboBoxItemsAndConvertToJson("PsychosocialSupportView"));
                    entity.set("ChildCareAndParentSupport",GetComboBoxItemsAndConvertToJson("ChildCareAndParentSupportView"));
                    entity.set("LegalSupport",GetComboBoxItemsAndConvertToJson("LegalSupportView"));
                    entity.set("EconomicSupport",GetComboBoxItemsAndConvertToJson("EconomicSupportView"));

                    offlineCaregiverDataSource.sync();
                    navigator.notification.alert("Se ha registrado correctamente");            
                });
            }
         },
         departCaregiverSubmit: function(){
             	caregiverDataSource.filter({});
                caregiverDataSource = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "CareGiver"
                    },
    				serverFiltering: true,
    				filter: { field: 'CaregiverID', operator: 'eq', value: $('[name="CaregiverIDView"]').val() }	
    			});    
                
                caregiverDataSource.fetch(function() {
                    var entity = caregiverDataSource.at(0);                    
                    entity.set("Status","0");
                    entity.set("ExitReason",$('[name="ExitReason"]').val());
                    entity.set("Exitdate",new Date().toJSON().slice(0,10));
                    caregiverDataSource.sync();
                	navigator.notification.alert("Se ha inactivado el cuidador correctamente");
                });
         },
         reactivateCaregiverSubmit: function(){
             	caregiverDataSource.filter({});
                caregiverDataSource = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "CareGiver"
                    },
    				serverFiltering: true,
    				filter: { field: 'CaregiverID', operator: 'eq', value: $('[name="CaregiverIDView"]').val() }	
    			});    
                
                caregiverDataSource.fetch(function() {
                    var entity = caregiverDataSource.at(0);                    
                    entity.set("Status","1");
                    entity.set("ReentryReason",$('[name="ReentryReason"]').val());
                    entity.set("DateOfReentry",new Date().toJSON().slice(0,10));
                    caregiverDataSource.sync();
                	navigator.notification.alert("Se ha reactivado el cuidador correctamente");
                });
         },
         initTransfer: function(){
             var programa = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "ProgrammeUnit"
                    },
    				serverFiltering: true,
                    serverSorting: true,
      				sort: { field: "Name", dir: "asc" }
    		});               
            
             $("#ddlProgramaTransfer").kendoDropDownList({
                        dataTextField: "Name",
                        dataValueField: "ProgrammeUnitID",
                        dataSource: programa
             });
             
             $("#ddlProgramaTransfer").data("kendoDropDownList").bind("dataBound", function(e) {
                this.trigger("change");    			
			 });
             $("#ddlProgramaTransfer").data("kendoDropDownList").bind("change", function(){
                var casa = new kendo.data.DataSource({
                        type: "everlive",
                        transport: {
                            typeName: "House"
                        },
                        serverFiltering: true,
                        serverSorting: true,
                        sort: { field: "NameOrNumber", dir: "asc" },
                        filter: { field: 'ProgrammeUnitID', operator: 'eq', value: $("#ddlProgramaTransfer").val() }	
                });               

                 $("#ddlCasaTransfer").kendoDropDownList({
                            dataTextField: "NameOrNumber",
                            dataValueField: "SOSHouseID",
                            dataSource: casa
                 }); 
             });
         },
         tranferCaregiverSubmit: function(){
                if(validateNullValues($("#ddlCasaTransfer").val()) == ""){
                    navigator.notification.alert("Debe seleccionar una casa");
                    return;
                }
             
             	caregiverDataSource.filter({});
                caregiverDataSource = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "CareGiver"
                    },
    				serverFiltering: true,
    				filter: { field: 'CaregiverID', operator: 'eq', value: $('[name="CaregiverIDView"]').val() }	
    			});    
                
                caregiverDataSource.fetch(function() {
                    var entity = caregiverDataSource.at(0);                    
                    entity.set("SOSHouseID", $("#ddlCasaTransfer").val());
                    entity.set("TransferReason",$('[name="TransferReason"]').val());
                    entity.set("DateOfTransfer",new Date().toJSON().slice(0,10));
                    caregiverDataSource.sync();
                	navigator.notification.alert("Se ha transferido el cuidador correctamente");
                });
         }
    });
    
    window.APP.models.child = kendo.observable({         
         redirectToAddEntity: function () {             
            SwitchTab("Child", "Add", "", "", "", "*");              
         },
         init: function () {             
            setRestrictions();
            hideTabControls("Child", "Add");
            hideTabControls("Child", "View");
             
            var cuidador = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "CareGiver"
                    },
    				serverFiltering: true,
                    serverSorting: true,
      				sort: { field: "LastName", dir: "asc" }
    		});               
             $("#ddlCuidadorView").kendoDropDownList({
                        dataTextField: "LastName",
                        dataValueField: "CaregiverID",
                        dataSource: cuidador
                    });
             
             var filters = []; 
             cuidador.filter({});
             filters = UpdateSearchFilters(filters, "Status", "eq", "1", "and");        
	         cuidador.filter(filters);
             
             $("#ddlCuidador").kendoDropDownList({
                        dataTextField: "LastName",
                        dataValueField: "CaregiverID",
                        dataSource: cuidador
                    });
             
             $("#listChild").html("");
    	 },
         searchChildByCaregiver: function(){
            var stringTemplate = "Nombres: #: FirstName #, Apellidos #: LastName # <a href='javascript:SwitchTab(\"Child\",\"View\",\"#if (SOSChildID == null) {# #=''# #} else {##=SOSChildID##}#\", \"#if (FirstName == null) {# #=''# #} else {##=FirstName##}#\", \"#if (LastName == null) {# #=''# #} else {##=LastName##}#\", \"" + caregiverID + "\")'>Visualizar</a>";                
            var inactive = " #if (Status == null || Status != '1') {# <a href='javascript:optEntityTab(\"Child\",\"Reactivate\", \"#= SOSChildID #\")'>Reactivar</a> #}#";                
            var active = " #if (Status != null && Status == '1') {# <a href='javascript:optEntityTab(\"Child\", \"Depart\", \"#= SOSChildID #\")'>Salida</a> <a href='javascript:optEntityTab(\"Child\",\"Transfer\", \"#= SOSChildID #\")'>Transferencia</a> #}#";                
            stringTemplate = stringTemplate + inactive + active;            
            
            if (!navigator.onLine) {
                	navigator.notification.alert("Se realizará la búsqueda desconectada");
                	offlineChildDataSource.filter({});
                    
                    $("#listChild").kendoMobileListView({
                        dataSource: offlineChildDataSource,
                        template: stringTemplate,
                        dataBound: function () {
                            if (this.dataSource.total() == 0) 
                                $("#listChild").html('<li>No hay resultados.</li>');
                        }                
                    }); 
                    return;
            }
            
            var caregiverID = $("#ddlCuidadorView").val();
            var filters = [];
 
            childDataSource.filter({});
        	//http://www.telerik.com/forums/adding-filters-to-grid-s-source
            filters = UpdateSearchFilters(filters, "CaregiverID", "eq", caregiverID, "and");        
	        childDataSource.filter(filters);
            
            $("#listChild").kendoMobileListView({
                dataSource: childDataSource,
                template: stringTemplate,
                dataBound: function () {
                    if (this.dataSource.total() == 0) 
                        $("#listChild").html('<li>No hay resultados.</li>');
                }                
            }); 
         },
         addCaregiverToChild: function(){
            /*if (!navigator.onLine) {
                    navigator.notification.alert("No hay conexion a Internet");
                    return;
            }*/
             
            var caregiverID = "";
            if (navigator.onLine) { caregiverID =  $("#ddlCuidador").val(); }
            SwitchTab("Child", "Add", "", "", "", caregiverID); 
         },
         getChildItemByID: function(e){
            var childID = e.view.params.id;
            
            if(childID == null)
                return;
            
            var filters = [];
            filters = UpdateSearchFilters(filters, "SOSChildID", "eq", childID, "and");        
             
            var datasource = childDataSource;
             
            if (!navigator.onLine) { datasource = offlineChildDataSource; }          
            
            datasource.filter({});
            datasource.filter(filters);    			
             
            datasource.fetch(function() {
  				var entity = datasource.at(0);
                
  				$('[name="BirthdateView"]').val(kendo.toString(entity.get("Birthdate"), "yyyy-MM-dd"));
                $('[name="LastNameView"]').val(entity.get("LastName"));
                $('[name="FirstNameView"]').val(entity.get("FirstName"));
                $('[name="ExitdateView"]').val(kendo.toString(entity.get("Exitdate"), "yyyy-MM-dd"));
                $('[name="ExitReasonView"]').val(entity.get("ExitReason"));
                $('[name="MotherLastNameView"]').val(entity.get("MotherLastName"));
                $('[name="SOSChildIDView"]').val(entity.get("SOSChildID"));
                $('[name="CaregiverIDView"]').val(entity.get("CaregiverID"));
                
                $('[name="DocumentNumberView"]').val(entity.get("DocumentNumber"));
                $('[name="GenderView"]').val(entity.get("Gender"));
                $('[name="NativeLanguageView"]').val(entity.get("NativeLanguage"));
                $('[name="OriginPlaceFromParentsView"]').val(entity.get("OriginPlaceFromParents"));
                
                if(entity.get("HasChildDevelopmentPlan") == true) $('[name="HasChildDevelopmentPlanView"]').attr('checked', true);
                
                $('[name="DateOfExpectedUpdateView"]').val(kendo.toString(entity.get("DateOfExpectedUpdate"), "yyyy-MM-dd"));
                $('[name="DateOfStartView"]').val(kendo.toString(entity.get("DateOfStart"), "yyyy-MM-dd"));
                $('[name="NationalityView"]').val(entity.get("Nationality"));
                
                if(entity.get("GoesToEducationalCenterSOS") == true) $('[name="GoesToEducationalCenterSOSView"]').attr('checked', true);                
                $('[name="NonSOSEducationalCenterNameView"]').val(entity.get("NonSOSEducationalCenterName"));                                
                if(entity.get("CurrentEnrollment") == true) $('[name="CurrentEnrollmentView"]').attr('checked', true);
                
                $('[name="CurrentSchoolYearView"]').val(entity.get("CurrentSchoolYear"));
                $('[name="DateOfLastMedicalControlView"]').val(kendo.toString(entity.get("DateOfLastMedicalControl"), "yyyy-MM-dd"));
                
                if(entity.get("Disability") == true) $('[name="DisabilityView"]').attr('checked', true);
                $('[name="NutritionalStatusView"]').val(entity.get("NutritionalStatus"));
                
                if(entity.get("HasMedicalCare") == true) $('[name="HasMedicalCareView"]').attr('checked', true);
                if(entity.get("HasHIV") == true) $('[name="HasHIVView"]').attr('checked', true);
                
                SetComboBoxItemsAndConvertJsonToArray(entity.get("TypeOfVaccination"),"TypeOfVaccinationView");
				SetComboBoxItemsAndConvertJsonToArray(entity.get("TypeOfDisease"),"TypeOfDiseaseView");
                $('[name="ReasonForAdmissionView"]').val(entity.get("ReasonForAdmission"));
                $('[name="DetailsForAdmissionView"]').val(entity.get("DetailsForAdmission"));
                $('[name="AdmissionProvidedByView"]').val(entity.get("AdmissionProvidedBy"));
                SetComboBoxItemsAndConvertJsonToArray(entity.get("DocumentsForAdmission"),"DocumentsForAdmissionView");
                SetComboBoxItemsAndConvertJsonToArray(entity.get("RecordBeforeAdmission"),"RecordBeforeAdmissionView");
                SetComboBoxItemsAndConvertJsonToArray(entity.get("BiologicalSiblings"),"BiologicalSiblingsView");
                SetComboBoxItemsAndConvertJsonToArray(entity.get("ChildParticipation"),"ChildParticipationView");
                
                if(entity.get("HasExitPlan") == true) $('[name="HasExitPlanView"]').attr('checked', true);
                
                $('[name="TypeOfEmploymentView"]').val(entity.get("TypeOfEmployment"));
                $('[name="DetailsOfEmploymentView"]').val(entity.get("DetailsOfEmployment"));
                $('[name="PsychosocialDevelopmentView"]').val(entity.get("PsychosocialDevelopment"));
                
                if(entity.get("ChildAbuseReceived") == true) $('[name="ChildAbuseReceivedView"]').attr('checked', true);
                SetComboBoxItemsAndConvertJsonToArray(entity.get("PsychosocialSupport"),"PsychosocialSupportView");
                SetComboBoxItemsAndConvertJsonToArray(entity.get("MedicalSupport"),"MedicalSupportView");
                SetComboBoxItemsAndConvertJsonToArray(entity.get("EducationalSupport"),"EducationalSupportView");
                SetComboBoxItemsAndConvertJsonToArray(entity.get("AdditionalSupport"),"AdditionalSupportView");

                if(entity.get("Status") == "1")                	
                    $('[name="StatusView"]').val("Activo");
                else
                	$('[name="StatusView"]').val("Inactivo");
			});                
         },
         getChildByID: function () {   
                if (!navigator.onLine) {
                    navigator.notification.alert("No hay conexion a Internet");
                    return;
                }
             
                $('[name="firstName"]').val("");
                $('[name="surName"]').val("");

                childDataSource.filter({});
                childDataSource = new kendo.data.DataSource({
                        type: "everlive",
                        transport: {
                            typeName: "Child"
                        },
                        serverFiltering: true,
                        filter: { field: 'SOSChildID', operator: 'eq', value: $('[name="childID"]').val().trim() }
                });    
				
                childDataSource.fetch(function() {
                    var child = childDataSource.at(0);
                    $('[name="childID"]').val(child.get("SOSChildID"));
                    $('[name="firstName"]').val(child.get("FirstName"));
                    $('[name="surName"]').val(child.get("LastName"));
                });
         },
         addChildSubmit: function () {

            if(validateNullValues($('[name="FirstName"]').val()) == ""){
                navigator.notification.alert("Los nombres son obligatorios");
                return;
        	}
            
            if(validateNullValues($('[name="LastName"]').val()) == ""){
                navigator.notification.alert("Los apellidos son obligatorios");
                return;
        	}            
        
            if(validateNullValues($('[name="SOSChildID"]').val()) == "" || validateNullValues($('[name="SOSChildID"]').val()).length != 8){
                navigator.notification.alert("El código de niño es obligatorio y ser de 8 caracteres");
                return;
        	}
             
            if (navigator.onLine) 
            {
                 var searchChildDataSource = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "Child"
                    },
    				serverFiltering: true,
                    change: function(e) {
                        var view = this.view();
        
                        if(view.length > 0){
                            navigator.notification.alert("El código del niño ya está registrado");                
                            return;
                        }else{
                            childDataSource.add({
                                Birthdate : $('[name="Birthdate"]').val(),
                                LastName : $('[name="LastName"]').val(),
                                FirstName : $('[name="FirstName"]').val(),
                                Exitdate : $('[name="Exitdate"]').val(),
                                ExitReason : $('[name="ExitReason"]').val(),
                                MotherLastName : $('[name="MotherLastName"]').val(),
                                SOSChildID : $('[name="SOSChildID"]').val(),
                                CaregiverID: $('[name="CaregiverID"]').val(),
                                DocumentNumber:$('[name="DocumentNumber"]').val(),
                                Gender:$('[name="Gender"]').val(),
                                NativeLanguage:$('[name="NativeLanguage"]').val(),
                                OriginPlaceFromParents:$('[name="OriginPlaceFromParents"]').val(),
                                HasChildDevelopmentPlan:$('[name="HasChildDevelopmentPlan"]').is(":checked"),
                                DateOfExpectedUpdate:$('[name="DateOfExpectedUpdate"]').val(),
                                DateOfStart:$('[name="DateOfStart"]').val(),
                                Nationality:$('[name="Nationality"]').val(),
                                GoesToEducationalCenterSOS:$('[name="GoesToEducationalCenterSOS"]').is(":checked"),
                                NonSOSEducationalCenterName:$('[name="NonSOSEducationalCenterName"]').val(),
                                CurrentEnrollment:$('[name="CurrentEnrollment"]').is(":checked"),
                                CurrentSchoolYear:$('[name="CurrentSchoolYear"]').val(),
                                DateOfLastMedicalControl:$('[name="DateOfLastMedicalControl"]').val(),
                                Disability:$('[name="Disability"]').is(":checked"),
                                NutritionalStatus:$('[name="NutritionalStatus"]').val(),
                                HasMedicalCare:$('[name="HasMedicalCare"]').is(":checked"),
                                HasHIV:$('[name="HasHIV"]').is(":checked"),
                                TypeOfVaccination:GetComboBoxItemsAndConvertToJson("TypeOfVaccination"),
								TypeOfDisease:GetComboBoxItemsAndConvertToJson("TypeOfDisease"),
                                ReasonForAdmission:$('[name="ReasonForAdmission"]').val(),
                                DetailsForAdmission:$('[name="DetailsForAdmission"]').val(),
                                AdmissionProvidedBy:$('[name="AdmissionProvidedBy"]').val(),
                                DocumentsForAdmission:GetComboBoxItemsAndConvertToJson("DocumentsForAdmission"),
                                RecordBeforeAdmission:GetComboBoxItemsAndConvertToJson("RecordBeforeAdmission"),
                                BiologicalSiblings:GetComboBoxItemsAndConvertToJson("BiologicalSiblings"),
                                ChildParticipation:GetComboBoxItemsAndConvertToJson("ChildParticipation"),
                                HasExitPlan:$('[name="HasExitPlan"]').is(":checked"),
                                TypeOfEmployment:$('[name="TypeOfEmployment"]').val(),
                                DetailsOfEmployment:$('[name="DetailsOfEmployment"]').val(),
                                PsychosocialDevelopment:$('[name="PsychosocialDevelopment"]').val(),
                                ChildAbuseReceived:$('[name="ChildAbuseReceived"]').is(":checked"),
                                PsychosocialSupport:GetComboBoxItemsAndConvertToJson("PsychosocialSupport"),
                                MedicalSupport:GetComboBoxItemsAndConvertToJson("MedicalSupport"),
                                EducationalSupport:GetComboBoxItemsAndConvertToJson("EducationalSupport"),
                                AdditionalSupport:GetComboBoxItemsAndConvertToJson("AdditionalSupport"),
                                Status: "1"
                            });
                            childDataSource.sync();
                            navigator.notification.alert("Se ha registrado correctamente");
						}                      
                    },
    				filter: { field: 'SOSChildID', operator: 'eq', value: $('[name="SOSChildID"]').val() }	
    			});    
                
                searchChildDataSource.read();

            } else {
                offlineChildDataSource.online(false);

                offlineChildDataSource.add({
                                Birthdate : $('[name="Birthdate"]').val(),
                                LastName : $('[name="LastName"]').val(),
                                FirstName : $('[name="FirstName"]').val(),
                                Exitdate : $('[name="Exitdate"]').val(),
                                ExitReason : $('[name="ExitReason"]').val(),
                                MotherLastName : $('[name="MotherLastName"]').val(),
                                SOSChildID : $('[name="SOSChildID"]').val(),
                                CaregiverID: $('[name="CaregiverID"]').val(),
                                DocumentNumber:$('[name="DocumentNumber"]').val(),
                                Gender:$('[name="Gender"]').val(),
                                NativeLanguage:$('[name="NativeLanguage"]').val(),
                                OriginPlaceFromParents:$('[name="OriginPlaceFromParents"]').val(),
                                HasChildDevelopmentPlan:$('[name="HasChildDevelopmentPlan"]').is(":checked"),
                                DateOfExpectedUpdate:$('[name="DateOfExpectedUpdate"]').val(),
                                DateOfStart:$('[name="DateOfStart"]').val(),
                                Nationality:$('[name="Nationality"]').val(),
                                GoesToEducationalCenterSOS:$('[name="GoesToEducationalCenterSOS"]').is(":checked"),
                                NonSOSEducationalCenterName:$('[name="NonSOSEducationalCenterName"]').val(),
                                CurrentEnrollment:$('[name="CurrentEnrollment"]').is(":checked"),
                                CurrentSchoolYear:$('[name="CurrentSchoolYear"]').val(),
                                DateOfLastMedicalControl:$('[name="DateOfLastMedicalControl"]').val(),
                                Disability:$('[name="Disability"]').is(":checked"),
                                NutritionalStatus:$('[name="NutritionalStatus"]').val(),
                                HasMedicalCare:$('[name="HasMedicalCare"]').is(":checked"),
                                HasHIV:$('[name="HasHIV"]').is(":checked"),
                                TypeOfVaccination:GetComboBoxItemsAndConvertToJson("TypeOfVaccination"),
								TypeOfDisease:GetComboBoxItemsAndConvertToJson("TypeOfDisease"),
                                ReasonForAdmission:$('[name="ReasonForAdmission"]').val(),
                                DetailsForAdmission:$('[name="DetailsForAdmission"]').val(),
                                AdmissionProvidedBy:$('[name="AdmissionProvidedBy"]').val(),
                                DocumentsForAdmission:GetComboBoxItemsAndConvertToJson("DocumentsForAdmission"),
                                RecordBeforeAdmission:GetComboBoxItemsAndConvertToJson("RecordBeforeAdmission"),
                                BiologicalSiblings:GetComboBoxItemsAndConvertToJson("BiologicalSiblings"),
                                ChildParticipation:GetComboBoxItemsAndConvertToJson("ChildParticipation"),
                                HasExitPlan:$('[name="HasExitPlan"]').is(":checked"),
                                TypeOfEmployment:$('[name="TypeOfEmployment"]').val(),
                                DetailsOfEmployment:$('[name="DetailsOfEmployment"]').val(),
                                PsychosocialDevelopment:$('[name="PsychosocialDevelopment"]').val(),
                                ChildAbuseReceived:$('[name="ChildAbuseReceived"]').is(":checked"),
                                PsychosocialSupport:GetComboBoxItemsAndConvertToJson("PsychosocialSupport"),
                                MedicalSupport:GetComboBoxItemsAndConvertToJson("MedicalSupport"),
                                EducationalSupport:GetComboBoxItemsAndConvertToJson("EducationalSupport"),
                                AdditionalSupport:GetComboBoxItemsAndConvertToJson("AdditionalSupport"),
                    			Status: "1"
                });
                offlineChildDataSource.sync();
                navigator.notification.alert("Se ha registrado correctamente en modo desconectado");
            }
         },
         viewChildSubmit: function(){
             
            if(validateNullValues($('[name="FirstNameView"]').val()) == ""){
                navigator.notification.alert("Los nombres son obligatorios");
                return;
        	}
            
            if(validateNullValues($('[name="LastNameView"]').val()) == ""){
                navigator.notification.alert("Los apellidos son obligatorios");
                return;
        	}            
        
            if(validateNullValues($('[name="SOSChildIDView"]').val()) == "" || validateNullValues($('[name="SOSChildIDView"]').val()).length != 8){
                navigator.notification.alert("El código de niño es obligatorio y ser de 8 caracteres");
                return;
        	}
             
            if (navigator.onLine) 
            {
                 childDataSource.filter({});
                 childDataSource = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "Child"
                    },
    				serverFiltering: true,
    				filter: { field: 'SOSChildID', operator: 'eq', value: $('[name="SOSChildIDView"]').val() }	
    			});    
                
                childDataSource.fetch(function() {
  					var entity = childDataSource.at(0);
                    entity.set("Birthdate",$('[name="BirthdateView"]').val());
                    entity.set("LastName",$('[name="LastNameView"]').val());
                    entity.set("FirstName",$('[name="FirstNameView"]').val());
                    entity.set("Exitdate",$('[name="ExitdateView"]').val());
                    entity.set("ExitReason",$('[name="ExitReasonView"]').val());
                    entity.set("MotherLastName",$('[name="MotherLastNameView"]').val());
                    entity.set("SOSChildID",$('[name="SOSChildIDView"]').val());
                    entity.set("CaregiverID",$('[name="CaregiverIDView"]').val());
                    
                    entity.set("DocumentNumber",$('[name="DocumentNumberView"]').val());
                    entity.set("Gender",$('[name="GenderView"]').val());
                    entity.set("NativeLanguage",$('[name="NativeLanguageView"]').val());
                    entity.set("OriginPlaceFromParents",$('[name="OriginPlaceFromParentsView"]').val());
                    entity.set("HasChildDevelopmentPlan",$('[name="HasChildDevelopmentPlanView"]').is(":checked"));
                    entity.set("DateOfExpectedUpdate",$('[name="DateOfExpectedUpdateView"]').val());
                    entity.set("DateOfStart",$('[name="DateOfStartView"]').val());
                    entity.set("Nationality",$('[name="NationalityView"]').val());
                    entity.set("GoesToEducationalCenterSOS",$('[name="GoesToEducationalCenterSOSView"]').is(":checked"));
                    entity.set("NonSOSEducationalCenterName",$('[name="NonSOSEducationalCenterNameView"]').val());
                    entity.set("CurrentEnrollment",$('[name="CurrentEnrollmentView"]').is(":checked"));
                    entity.set("CurrentSchoolYear",$('[name="CurrentSchoolYearView"]').val());
                    entity.set("DateOfLastMedicalControl",$('[name="DateOfLastMedicalControlView"]').val());
                    entity.set("Disability",$('[name="DisabilityView"]').is(":checked"));
                    entity.set("NutritionalStatus",$('[name="NutritionalStatusView"]').val());
                    entity.set("HasMedicalCare",$('[name="HasMedicalCareView"]').is(":checked"));
                    entity.set("HasHIV",$('[name="HasHIVView"]').is(":checked"));
                    entity.set("TypeOfVaccination",GetComboBoxItemsAndConvertToJson("TypeOfVaccinationView"));
					entity.set("TypeOfDisease",GetComboBoxItemsAndConvertToJson("TypeOfDiseaseView"));
                    entity.set("ReasonForAdmission",$('[name="ReasonForAdmissionView"]').val());
                    entity.set("DetailsForAdmission",$('[name="DetailsForAdmissionView"]').val());
                    entity.set("AdmissionProvidedBy",$('[name="AdmissionProvidedByView"]').val());
                    entity.set("DocumentsForAdmission",GetComboBoxItemsAndConvertToJson("DocumentsForAdmissionView"));
                    entity.set("RecordBeforeAdmission",GetComboBoxItemsAndConvertToJson("RecordBeforeAdmissionView"));
                    entity.set("BiologicalSiblings",GetComboBoxItemsAndConvertToJson("BiologicalSiblingsView"));
                    entity.set("ChildParticipation",GetComboBoxItemsAndConvertToJson("ChildParticipationView"));
                    entity.set("HasExitPlan",$('[name="HasExitPlanView"]').is(":checked"));
                    entity.set("TypeOfEmployment",$('[name="TypeOfEmploymentView"]').val());
                    entity.set("DetailsOfEmployment",$('[name="DetailsOfEmploymentView"]').val());
                    entity.set("PsychosocialDevelopment",$('[name="PsychosocialDevelopmentView"]').val());
                    entity.set("ChildAbuseReceived",$('[name="ChildAbuseReceivedView"]').is(":checked"));
                    entity.set("PsychosocialSupport",GetComboBoxItemsAndConvertToJson("PsychosocialSupportView"));
                    entity.set("MedicalSupport",GetComboBoxItemsAndConvertToJson("MedicalSupportView"));
                    entity.set("EducationalSupport",GetComboBoxItemsAndConvertToJson("EducationalSupportView"));
                    entity.set("AdditionalSupport",GetComboBoxItemsAndConvertToJson("AdditionalSupportView"));

					/*var jsonExitReasonView = GetComboBoxItemsAndConvertToJson("ExitReasonView");                    
                    if(jsonExitReasonView.trim() != "")
                    	entity.set("ExitReason", jsonExitReasonView);*/                    
                    //entity.set("ExitReason",GetComboBoxItemsAndConvertToJson("ExitReasonView"));

                    childDataSource.sync();
                	navigator.notification.alert("Se ha registrado correctamente");
                });
                
            } else {
                offlineChildDataSource.online(false);
                
                var filters = [];
                offlineChildDataSource.filter({});
 				filters = UpdateSearchFilters(filters, "SOSChildID", "eq", $('[name="SOSChildIDView"]').val(), "and");        
                offlineChildDataSource.filter(filters);
                
                offlineChildDataSource.fetch(function() {
                    var entity = offlineChildDataSource.at(0);
                    
                    entity.set("Birthdate",$('[name="BirthdateView"]').val());
                    entity.set("LastName",$('[name="LastNameView"]').val());
                    entity.set("FirstName",$('[name="FirstNameView"]').val());
                    entity.set("Exitdate",$('[name="ExitdateView"]').val());
                    entity.set("ExitReason",$('[name="ExitReasonView"]').val());
                    entity.set("MotherLastName",$('[name="MotherLastNameView"]').val());
                    entity.set("SOSChildID",$('[name="SOSChildIDView"]').val());
                    entity.set("CaregiverID",$('[name="CaregiverIDView"]').val());
                    
                    entity.set("DocumentNumber",$('[name="DocumentNumberView"]').val());
                    entity.set("Gender",$('[name="GenderView"]').val());
                    entity.set("NativeLanguage",$('[name="NativeLanguageView"]').val());
                    entity.set("OriginPlaceFromParents",$('[name="OriginPlaceFromParentsView"]').val());
                    entity.set("HasChildDevelopmentPlan",$('[name="HasChildDevelopmentPlanView"]').is(":checked"));
                    entity.set("DateOfExpectedUpdate",$('[name="DateOfExpectedUpdateView"]').val());
                    entity.set("DateOfStart",$('[name="DateOfStartView"]').val());
                    entity.set("Nationality",$('[name="NationalityView"]').val());
                    entity.set("GoesToEducationalCenterSOS",$('[name="GoesToEducationalCenterSOSView"]').is(":checked"));
                    entity.set("NonSOSEducationalCenterName",$('[name="NonSOSEducationalCenterNameView"]').val());
                    entity.set("CurrentEnrollment",$('[name="CurrentEnrollmentView"]').is(":checked"));
                    entity.set("CurrentSchoolYear",$('[name="CurrentSchoolYearView"]').val());
                    entity.set("DateOfLastMedicalControl",$('[name="DateOfLastMedicalControlView"]').val());
                    entity.set("Disability",$('[name="DisabilityView"]').is(":checked"));
                    entity.set("NutritionalStatus",$('[name="NutritionalStatusView"]').val());
                    entity.set("HasMedicalCare",$('[name="HasMedicalCareView"]').is(":checked"));
                    entity.set("HasHIV",$('[name="HasHIVView"]').is(":checked"));
                    entity.set("TypeOfVaccination",GetComboBoxItemsAndConvertToJson("TypeOfVaccinationView"));
					entity.set("TypeOfDisease",GetComboBoxItemsAndConvertToJson("TypeOfDiseaseView"));
                    entity.set("ReasonForAdmission",$('[name="ReasonForAdmissionView"]').val());
                    entity.set("DetailsForAdmission",$('[name="DetailsForAdmissionView"]').val());
                    entity.set("AdmissionProvidedBy",$('[name="AdmissionProvidedByView"]').val());
                    entity.set("DocumentsForAdmission",GetComboBoxItemsAndConvertToJson("DocumentsForAdmissionView"));
                    entity.set("RecordBeforeAdmission",GetComboBoxItemsAndConvertToJson("RecordBeforeAdmissionView"));
                    entity.set("BiologicalSiblings",GetComboBoxItemsAndConvertToJson("BiologicalSiblingsView"));
                    entity.set("ChildParticipation",GetComboBoxItemsAndConvertToJson("ChildParticipationView"));
                    entity.set("HasExitPlan",$('[name="HasExitPlanView"]').is(":checked"));
                    entity.set("TypeOfEmployment",$('[name="TypeOfEmploymentView"]').val());
                    entity.set("DetailsOfEmployment",$('[name="DetailsOfEmploymentView"]').val());
                    entity.set("PsychosocialDevelopment",$('[name="PsychosocialDevelopmentView"]').val());
                    entity.set("ChildAbuseReceived",$('[name="ChildAbuseReceivedView"]').is(":checked"));
                    entity.set("PsychosocialSupport",GetComboBoxItemsAndConvertToJson("PsychosocialSupportView"));
                    entity.set("MedicalSupport",GetComboBoxItemsAndConvertToJson("MedicalSupportView"));
                    entity.set("EducationalSupport",GetComboBoxItemsAndConvertToJson("EducationalSupportView"));
                    entity.set("AdditionalSupport",GetComboBoxItemsAndConvertToJson("AdditionalSupportView"));
                    offlineChildDataSource.sync();
                    navigator.notification.alert("Se ha registrado correctamente en modo desconectado");
                });
            }
         },
         departChildSubmit: function(){
             	childDataSource.filter({});
                childDataSource = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "Child"
                    },
    				serverFiltering: true,
    				filter: { field: 'SOSChildID', operator: 'eq', value: $('[name="SOSChildIDView"]').val() }	
    			});    
                
                childDataSource.fetch(function() {
                    var entity = childDataSource.at(0);                    
                    entity.set("Status","0");
                    entity.set("ExitReason",$('[name="ExitReasonChild"]').val());
                    entity.set("Exitdate",new Date().toJSON().slice(0,10));
                    childDataSource.sync();
                	navigator.notification.alert("Se ha inactivado al niño correctamente");
                });
         },
         reactivateChildSubmit: function(){
             	childDataSource.filter({});
                childDataSource = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "Child"
                    },
    				serverFiltering: true,
    				filter: { field: 'SOSChildID', operator: 'eq', value: $('[name="ChildIDView"]').val() }	
    			});    
                
                childDataSource.fetch(function() {
                    var entity = childDataSource.at(0);                    
                    entity.set("Status","1");
                    entity.set("ReentryReason",$('[name="ReentryReasonChild"]').val());
                    entity.set("DateOfReentry",new Date().toJSON().slice(0,10));
                    childDataSource.sync();
                	navigator.notification.alert("Se ha reactivado al niño correctamente");
                });
         },
         initChildTransfer: function(){
             var programa = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "ProgrammeUnit"
                    },
    				serverFiltering: true,
                    serverSorting: true,
      				sort: { field: "Name", dir: "asc" }
    		});               
            
             $("#ddlProgramaChildTransfer").kendoDropDownList({
                        dataTextField: "Name",
                        dataValueField: "ProgrammeUnitID",
                        dataSource: programa
             });
             
             $("#ddlProgramaChildTransfer").data("kendoDropDownList").bind("dataBound", function(e) {
                this.trigger("change");    			
			 });
             
             $("#ddlProgramaChildTransfer").data("kendoDropDownList").bind("change", function(){
                var casa = new kendo.data.DataSource({
                        type: "everlive",
                        transport: {
                            typeName: "House"
                        },
                        serverFiltering: true,
                        serverSorting: true,
                        sort: { field: "NameOrNumber", dir: "asc" },
                        filter: { field: 'ProgrammeUnitID', operator: 'eq', value: $("#ddlProgramaChildTransfer").val() }	
                });               

                 $("#ddlCasaChildTransfer").kendoDropDownList({
                            dataTextField: "NameOrNumber",
                            dataValueField: "SOSHouseID",
                            dataSource: casa
                 }); 
                 
                 $("#ddlCasaChildTransfer").data("kendoDropDownList").bind("dataBound", function(e) {
                    this.trigger("change");    			
                 });
                 
                 $("#ddlCasaChildTransfer").data("kendoDropDownList").bind("change", function(){
                    var cuidador = new kendo.data.DataSource({
                            type: "everlive",
                            transport: {
                                typeName: "CareGiver"
                            },
                            serverFiltering: true,
                            serverSorting: true,
                            sort: { field: "LastName", dir: "asc" },
                            filter: { field: 'SOSHouseID', operator: 'eq', value: $("#ddlCasaChildTransfer").val() }	
                    });               

                     $("#ddlCuidadorChildTransfer").kendoDropDownList({
                                dataTextField: "LastName",
                                dataValueField: "CaregiverID",
                                dataSource: cuidador
                     }); 

                     /*$("#ddlCuidadorChildTransfer").data("kendoDropDownList").bind("dataBound", function(e) {
                        this.trigger("change");    			
                     });*/
                 });
             });
         },
         transferChildSubmit: function(){
                if(validateNullValues($("#ddlCuidadorChildTransfer").val()) == ""){
                    navigator.notification.alert("Debe seleccionar un cuidador");
                    return;
                }
             
             	childDataSource.filter({});
                childDataSource = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "Child"
                    },
    				serverFiltering: true,
    				filter: { field: 'SOSChildID', operator: 'eq', value: $('[name="SOSChildIDView"]').val() }	
    			});    
                
                childDataSource.fetch(function() {
                    var entity = childDataSource.at(0);                    
                    entity.set("CaregiverID", $('[name="ddlCuidadorChildTransfer"]').val());
                    entity.set("TransferReason",$('[name="TransferReasonChild"]').val());
                    entity.set("DateOfTransfer",new Date().toJSON().slice(0,10));
                    childDataSource.sync();
                	navigator.notification.alert("Se ha transferido al niño correctamente");
                });
         }
    });

    window.APP.models.tracking = kendo.observable({
        redirectToAddEntity: function () {             
            SwitchTab("Follow", "Add", "", "", "", "*");              
        },
        init: function () {             
            setRestrictions();
            hideTabControls("Follow", "Add");
            hideTabControls("Follow", "View");
             
            $("#trackAddList").html("");
            $("#trackViewList").html("");            
    	},
        searchTrackingByChildID: function () {            
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
                
                template: "Fecha de Inicio: #: kendo.toString(StartDate, 'yyyy/MM/dd' ) #, Fecha de Fin: #: kendo.toString(EndDate, 'yyyy/MM/dd' ) # <a href='javascript:SwitchTab(\"Follow\",\"View\",\"#if (SOSFollowID == null) {# #=''# #} else {##=SOSFollowID##}#\", \"\", \"\", \"#if (SOSChildID == null) {# #=''# #} else {##=SOSChildID##}#\")'>Visualizar</a>",                
                dataBound: function () {
                    if (this.dataSource.total() == 0) 
                        $("#trackViewList").html('<li>No hay resultados.</li>');
                }
            });
        },
        searchChildByFilters: function () {
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
                template: "#: LastName #, #: FirstName # <a href='javascript:SwitchTab(\"Follow\",\"Add\",\"#if (SOSChildID == null) {# #=''# #} else {# #=SOSChildID# #}#\", \"#if (FirstName == null) {# #=''# #} else {# #=FirstName# #}#\", \"#if (LastName == null) {# #=''# #} else {# #=LastName# #}#\")'>Seguir</a>",                
                dataBound: function () {
                    if (this.dataSource.total() == 0) 
                        $("#trackAddList").html('<li>No hay resultados.</li>');
                }
            });            
        },
        addTrackingSubmit: function () {

            if (navigator.onLine) 
            {
                trackingDataSource.add({
                    SOSFollowID: randomIntFromInterval(10000000,99999999),
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
                    HealthHasDisabilities: $('[name="hasDisability"]').is(":checked"),
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
                    HealthHasDisabilities: $('[name="hasDisability"]').is(":checked"),
                    HealthHowDisabilityAffects: $('[name="affectsInDailyLife"]').val(),
                    HealthDisabilityComments: $('[name="commentsAboutHandicap"]').val()
                });
                offlineDataSource.sync();
                navigator.notification.alert("Se ha registrado correctamente en modo desconectado");
            }
        },
        getTrackingByID: function (e) {
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
  				$('[name="childIDView"]').val(child.get("SOSChildID"));
                $('[name="startDateView"]').val(child.get("StartDate"));
                $('[name="endDateView"]').val(child.get("EndDate"));
                
                $('[name="phoneView"]').val(child.get("Phone"));
                $('[name="emailView"]').val(child.get("EmailAddress"));
                $('[name="ageWhenHasFirstChildView"]').val(child.get("AgeWhenFirstChild"));
                $('[name="childrenNumberView"]').val(child.get("ChildrenNumber"));
                $('[name="legalGuardianView"]').val(child.get("LegalGuardian"));
                
                $('[name="siblingsOutsideSOSView"]').val(child.get("SiblingsOutsideSOS"));
                $('[name="hostageTypeView"]').val(child.get("HomeType"));
                $('[name="homePlaceView"]').val(child.get("HomePlace"));
                $('[name="hostageCommentsView"]').val(child.get("HomeComments"));
                $('[name="hostageImproveCommentsView"]').val(child.get("HomeImprovementsComments"));
                $('[name="educationalCenterNoSOSView"]').val(child.get("HomeEducationCenterNoSOS"));
                
                $('[name="currentEnrollmentView"]').val(child.get("CurrentSchoolLevel"));
                $('[name="educationCurrentEnrollmentView"]').val(child.get("EducationCurrentEnrollment"));
                $('[name="educationStudyStartView"]').val(child.get("EducationStudyStart"));
                $('[name="specialityNameView"]').val(child.get("EducationSpecialityName"));
                $('[name="specialitySemesterView"]').val(child.get("EducationSpecialitySemester"));
                $('[name="sourceOfIncomeView"]').val(child.get("WorkIncomeType"));
                
                $('[name="typeOfEmploymentView"]').val(child.get("WorkType"));
                $('[name="workCurrencyView"]').val(child.get("WorkCurrency"));
                $('[name="workRelatedWithSpecialityView"]').val(child.get("WorkSpeacialityRelated"));
                $('[name="areaOfWorkView"]').val(child.get("WorkSector"));
                $('[name="continueWorkinMonthsView"]').val(child.get("WorkMonthsContinuity"));
                $('[name="incomeMonthlyView"]').val(child.get("WorkMonthlyIncome"));
                
                $('[name="monthsUnemployeeView"]').val(child.get("WorkMonthsUnemployed"));
                if(child.get("HealthHasDisabilities") == true) $('[name="hasDisability"]').attr('checked', true);
                $('[name="affectsInDailyLifeView"]').val(child.get("HealthHowDisabilityAffects"));
                $('[name="commentsAboutHandicapView"]').val(child.get("HealthDisabilityComments"));  
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
  				$('[name="childIDView"]').val(child.get("SOSChildID"));
                $('[name="firstNameView"]').val(child.get("FirstName"));
                $('[name="surNameView"]').val(child.get("LastName"));
            });    
        }
    });

    window.APP.synchro = kendo.observable({
        submitFollow: function () { 

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
                        EndDate: jLocalStorage[item]["EndDate"],
                        EducationSpecialityName: jLocalStorage[item]["EducationSpecialityName"],
                        CurrentSchoolLevel: jLocalStorage[item]["CurrentSchoolLevel"],
                        SiblingsOutsideSOS: jLocalStorage[item]["SiblingsOutsideSOS"],
                        HomePlace: jLocalStorage[item]["HomePlace"],
                        EducationStudyStart: jLocalStorage[item]["EducationStudyStart"],
                        HealthHasDisabilities: jLocalStorage[item]["HealthHasDisabilities"],
                        WorkMonthsUnemployed: jLocalStorage[item]["WorkMonthsUnemployed"],
                        WorkMonthsContinuity: jLocalStorage[item]["WorkMonthsContinuity"],
                        WorkSector: jLocalStorage[item]["WorkSector"],
                        WorkSpeacialityRelated: jLocalStorage[item]["WorkSpeacialityRelated"],
                        WorkType: jLocalStorage[item]["WorkType"],
                        AgeWhenFirstChild: jLocalStorage[item]["AgeWhenFirstChild"],
                        WorkIncomeType: jLocalStorage[item]["WorkIncomeType"],
                        EmailAddress: jLocalStorage[item]["EmailAddress"],
                        StartDate: jLocalStorage[item]["StartDate"],
                        ChildrenNumber: jLocalStorage[item]["ChildrenNumber"],
                        Phone: jLocalStorage[item]["Phone"],
                        HomeImprovementsComments: jLocalStorage[item]["HomeImprovementsComments"],
                        LegalGuardian: jLocalStorage[item]["LegalGuardian"],
                        HomeComments: jLocalStorage[item]["HomeComments"],
                        HomeType: jLocalStorage[item]["HomeType"],
                        WorkCurrency: jLocalStorage[item]["WorkCurrency"],
                        WorkMonthlyIncome: jLocalStorage[item]["WorkMonthlyIncome"],
                        HomeEducationCenterNoSOS: jLocalStorage[item]["HomeEducationCenterNoSOS"],
                        EducationCurrentEnrollment: jLocalStorage[item]["EducationCurrentEnrollment"],
                        EducationSpecialitySemester: jLocalStorage[item]["EducationSpecialitySemester"],
                        HealthHowDisabilityAffects: jLocalStorage[item]["HealthHowDisabilityAffects"],
                        HealthDisabilityComments: jLocalStorage[item]["HealthDisabilityComments"],
                        SOSChildID: jLocalStorage[item]["SOSChildID"]
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
                    template: "#: FirstName # - #: LastName # - #: CaregiverID #"
                });

                var synchroDataSource = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "CareGiver"
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
        
        setInterval("checkConnection();", 3000);
        
        //$.getScript( "scripts/actions.js", function( data, textStatus, jqxhr ) {});
    }, false);
      
    offlineDataSource.online(false);
    offlineHouseDataSource.online(false);
    offlineCaregiverDataSource.online(false);
	offlineChildDataSource.online(false);
    
}());