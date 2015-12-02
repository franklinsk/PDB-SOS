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
            var selectedOpt = $("#" + data.entity + data.type + " option:selected");                         
            var viewOpt = $("#" + data.entity + data.type + "Values");
             
            if(viewOpt.find('[value="' + selectedOpt.val() + '"]').length == 0 && selectedOpt.text().trim() != "")                        
            	viewOpt.append($("<option></option>").attr("value",selectedOpt.val()).text(selectedOpt.text()));
           
            //Convert Array To Json (Save in DB)            
            //var myJsonString = GetComboBoxItemsAndConvertToJson(data.type);
            
            //Convert Json To Array (Show in Form)
            //SetComboBoxItemsAndConvertJsonToArray(myJsonString, data.type);
       },
       RemoveItem: function (e) {             
            var data = e.button.data();
            var selectedOpt = $("#" + data.entity + data.type + "Values option:selected");                         
            var viewOpt = $("#" + data.entity + data.type + "Values");
             
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
            
             $("#HouseddlProgramma").kendoDropDownList({
                        dataTextField: "Name",
                        dataValueField: "ProgrammeUnitID",
                        dataSource: programa
             });
             
             $("#HouseddlProgrammaView").kendoDropDownList({
                        dataTextField: "Name",
                        dataValueField: "ProgrammeUnitID",
                        dataSource: programa
             });      
            
             $("#listHouse").html("");
    	},
        searchHouseByProgrammeUnit: function(){
            var programmeUnitID = $("#HouseddlProgrammaView").val();
            
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
            if (navigator.onLine) { programmeUnitID = $("#HouseddlProgramma").val(); }
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
  				$('[name="HouseAddressView"]').val(entity.get("Address"));
                $('[name="HouseDateOfStartView"]').val(kendo.toString(entity.get("DateOfStart"), "yyyy-MM-dd"));
                $('[name="HouseMaximunCapacityView"]').val(entity.get("MaximunCapacity"));
                $('[name="HouseNameOrNumberView"]').val(entity.get("NameOrNumber"));
                $('[name="HouseNotesView"]').val(entity.get("Notes"));
                $('[name="HouseNumberOfChildrenView"]').val(entity.get("NumberOfChildren"));
                $('[name="HousePhoneNumberView"]').val(entity.get("PhoneNumber"));
                $('[name="HouseProgrammeUnitIDView"]').val(entity.get("ProgrammeUnitID"));
                $('[name="HouseSOSHouseIDView"]').val(entity.get("SOSHouseID"));
                
                if(entity.get("Status") == "1")                	
                    $('[name="HouseStatusView"]').val("Activo");
                else
                	$('[name="HouseStatusView"]').val("Inactivo");
			}); 
            
            houseDataSource.filter({});
        },
        getHouseByID: function () { 
            if (!navigator.onLine) {
                    navigator.notification.alert("No hay conexion a Internet");
                    return;
                }
             
                $('[name="HouseNameOrNumberView"]').val("");

                houseDataSource.filter({});
                houseDataSource = new kendo.data.DataSource({
                        type: "everlive",
                        transport: {
                            typeName: "House"
                        },
                        serverFiltering: true,
                        filter: { field: 'SOSHouseID', operator: 'eq', value: $('[name="HouseSOSHouseIDView"]').val().trim() }
                });    
				
                houseDataSource.fetch(function() {
                    var entity = houseDataSource.at(0);
                    $('[name="HouseSOSHouseIDView"]').val(entity.get("SOSHouseID"));
                    $('[name="HouseNameOrNumberView"]').val(entity.get("NameOrNumber"));
                });
            
            	houseDataSource.filter({});
    	},
        addHouseSubmit: function () { 
            if(validateNullValues($('[name="HouseAddress"]').val()) == ""){
                navigator.notification.alert("La dirección es obligatoria");
                return;
        	}
            
            if(validateNullValues($('[name="HouseNameOrNumber"]').val()) == ""){
                navigator.notification.alert("El nombre de hogar es obligatorio");
                return;
        	}            
        
            if(validateNullValues($('[name="HouseSOSHouseID"]').val()) == "" || validateNullValues($('[name="HouseSOSHouseID"]').val()).length != 8){
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
                                Address : $('[name="HouseAddress"]').val(),
                                DateOfStart : $('[name="HouseDateOfStart"]').val(),
                                MaximunCapacity : $('[name="HouseMaximunCapacity"]').val(),
                                NameOrNumber : $('[name="HouseNameOrNumber"]').val(),
                                Notes : $('[name="HouseNotes"]').val(),
                                NumberOfChildren : $('[name="HouseNumberOfChildren"]').val(),
                                PhoneNumber : $('[name="HousePhoneNumber"]').val(),
                                ProgrammeUnitID : $('[name="HouseProgrammeUnitID"]').val(),
                                SOSHouseID : $('[name="HouseSOSHouseID"]').val(),
                                Status: "1"
                                //Status: $('[name="Status"]').val()
                            });
                            houseDataSource.sync();
                            navigator.notification.alert("Se ha registrado correctamente");            
                        }                      
                    },
    				filter: { field: 'SOSHouseID', operator: 'eq', value: $('[name="HouseSOSHouseID"]').val() }	
    			});    
                
                searchHouseDataSource.read();
                
            } else {
                offlineHouseDataSource.online(false);
                
                offlineHouseDataSource.add({
                    Address : $('[name="HouseAddress"]').val(),
                    DateOfStart : $('[name="HouseDateOfStart"]').val(),
                    MaximunCapacity : $('[name="HouseMaximunCapacity"]').val(),
                    NameOrNumber : $('[name="HouseNameOrNumber"]').val(),
                    Notes : $('[name="HouseNotes"]').val(),
                    NumberOfChildren : $('[name="HouseNumberOfChildren"]').val(),
                    PhoneNumber : $('[name="PhoneNumber"]').val(),
                    ProgrammeUnitID : $('[name="HouseProgrammeUnitID"]').val(),
                    SOSHouseID : $('[name="HouseSOSHouseID"]').val(),                    
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
            if(validateNullValues($('[name="HouseAddressView"]').val()) == ""){
                    navigator.notification.alert("La dirección es obligatoria");
                    return;
            }

            if(validateNullValues($('[name="HouseNameOrNumberView"]').val()) == ""){
                    navigator.notification.alert("El nombre de hogar es obligatorio");
                    return;
            }            

            if(validateNullValues($('[name="HouseSOSHouseIDView"]').val()) == "" || validateNullValues($('[name="HouseSOSHouseIDView"]').val()).length != 8){
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
    				filter: { field: 'SOSHouseID', operator: 'eq', value: $('[name="HouseSOSHouseIDView"]').val() }	
    			});    
                
                houseDataSource.fetch(function() {
                    var entity = houseDataSource.at(0);
                    entity.set("Address",$('[name="HouseAddressView"]').val());
                    entity.set("DateOfStart",$('[name="HouseDateOfStartView"]').val());
                    entity.set("MaximunCapacity",$('[name="HouseMaximunCapacityView"]').val());
                    entity.set("NameOrNumber",$('[name="HouseNameOrNumberView"]').val());
                    entity.set("Notes",$('[name="HouseNotesView"]').val());
                    entity.set("NumberOfChildren",$('[name="HouseNumberOfChildrenView"]').val());
                    entity.set("PhoneNumber",$('[name="HousePhoneNumberView"]').val());
                    entity.set("ProgrammeUnitID",$('[name="HouseProgrammeUnitIDView"]').val());
                    entity.set("SOSHouseID",$('[name="HouseSOSHouseIDView"]').val());
                    //entity.set("Status","1");
                    //entity.set("Status",$('[name="StatusView"]').val());
                    houseDataSource.sync();                	
                    navigator.notification.alert("Se ha registrado correctamente");
                });
                
                houseDataSource.filter({});
                
            } else {
                offlineHouseDataSource.online(false);
                
                var filters = [];
 				filters = UpdateSearchFilters(filters, "SOSHouseID", "eq", $('[name="HouseSOSHouseIDView"]').val(), "and");        
                offlineHouseDataSource.filter(filters);
                
                offlineHouseDataSource.fetch(function() {
  					var entity = offlineHouseDataSource.at(0);
                    entity.set("Address",$('[name="HouseAddressView"]').val());
                    entity.set("DateOfStart",$('[name="HouseDateOfStartView"]').val());
                    entity.set("MaximunCapacity",$('[name="HouseMaximunCapacityView"]').val());
                    entity.set("NameOrNumber",$('[name="HouseNameOrNumberView"]').val());
                    entity.set("Notes",$('[name="HouseNotesView"]').val());
                    entity.set("NumberOfChildren",$('[name="HouseNumberOfChildrenView"]').val());
                    entity.set("PhoneNumber",$('[name="HousePhoneNumberView"]').val());
                    entity.set("ProgrammeUnitID",$('[name="HouseProgrammeUnitIDView"]').val());
                    entity.set("SOSHouseID",$('[name="HouseSOSHouseIDView"]').val());
                    //entity.set("Status",$('[name="StatusView"]').val());
                    offlineHouseDataSource.sync();
                    navigator.notification.alert("Se ha registrado correctamente");
                });
            }
        },
        departHouseSubmit: function(){
            	if (!navigator.onLine) {
                    navigator.notification.alert("Algunas opciones no podrán ser usadas en modo desconectado");
                    return;
                 }

             	houseDataSource.filter({});
                houseDataSource = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "House"
                    },
    				serverFiltering: true,
    				filter: { field: 'SOSHouseID', operator: 'eq', value: $('[name="HouseSOSHouseIDView"]').val() }	
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
            	if (!navigator.onLine) {
                    navigator.notification.alert("Algunas opciones no podrán ser usadas en modo desconectado");
                    return;
                 }

             	houseDataSource.filter({});
                houseDataSource = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "House"
                    },
    				serverFiltering: true,
    				filter: { field: 'SOSHouseID', operator: 'eq', value: $('[name="HouseSOSHouseIDView"]').val() }	
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
             
            $("#listCaregiver").html("");
             
            if (!navigator.onLine) {
                	navigator.notification.alert("Se realizará la búsqueda desconectada");
                	offlineHouseDataSource.filter({});
             
                	$("#CaregiverddlCasa").kendoDropDownList({
                        dataTextField: "NameOrNumber",
                        dataValueField: "SOSHouseID",
                        dataSource: offlineHouseDataSource
                    });
                
                    $("#CaregiverddlCasaView").kendoDropDownList({
                        dataTextField: "NameOrNumber",
                        dataValueField: "SOSHouseID",
                        dataSource: offlineHouseDataSource
                    });
                    return;
            }
             
            var casa = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "House"
                    },
    				serverFiltering: true,
                    serverSorting: true,
      				sort: { field: "NameOrNumber", dir: "asc" }
    		 });               
            
             $("#CaregiverddlCasaView").kendoDropDownList({
                        dataTextField: "NameOrNumber",
                        dataValueField: "SOSHouseID",
                        dataSource: casa
             });
             
             var filters = []; 
             casa.filter({});
             filters = UpdateSearchFilters(filters, "Status", "eq", "1", "and");        
	         casa.filter(filters);
             
             $("#CaregiverddlCasa").kendoDropDownList({
                        dataTextField: "NameOrNumber",
                        dataValueField: "SOSHouseID",
                        dataSource: casa
                    });
    	 },
         searchCaregiverByHouse: function(){
             var houseID = $("#CaregiverddlCasaView").val();
             
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
            if (navigator.onLine) { houseID = $("#CaregiverddlCasa").val(); }
            SwitchTab("Caregiver", "Add", "", "", "", houseID); 
             
            if(houseID != "")
            {
                    houseDataSource.filter({});
                    offlineHouseDataSource.filter({});

                    var filters = [];
                    filters = UpdateSearchFilters(filters, "SOSHouseID", "eq", houseID, "and");        

                    var datasourceH = houseDataSource;

                    if (!navigator.onLine) { datasourceH = offlineHouseDataSource; }          

                    datasourceH.filter({});
                    datasourceH.filter(filters);  

                    datasourceH.fetch(function() 
                    {
                        var entity = datasourceH.at(0);
                        $('[name="CaregiverhouseName"]').val(entity.get("NameOrNumber"));
                    });    
            }
         },
         getCaregiverItemByID: function(e){
            var caregiverID = e.view.params.id;
            
            if(caregiverID == null)
                return;
            	
            var filters = [];
            filters = UpdateSearchFilters(filters, "CaregiverID", "eq", caregiverID, "and");        
            
            var datasource = caregiverDataSource;

			if (!navigator.onLine) { datasource = offlineCaregiverDataSource; }          

            datasource.filter(filters);  
             
			var houseID="";
             
            datasource.fetch(function() {
                var entity = datasource.at(0);
                houseID = entity.get("SOSHouseID");
                
                $('[name="CaregiverPhoneNumberView"]').val(entity.get("PhoneNumber"));
                
                if(entity.get("Synchronized") == true) $('[name="CaregiverSynchronizedView"]').attr('checked', true);                
                $('[name="CaregiverDateOfStartView"]').val(kendo.toString(entity.get("DateOfStart"), "yyyy-MM-dd"));
                $('[name="CaregiverDateOfBirthView"]').val(kendo.toString(entity.get("DateOfBirth"), "yyyy-MM-dd"));
                $('[name="CaregiverLastNameView"]').val(entity.get("LastName"));
                $('[name="CaregiverFirstNameView"]').val(entity.get("FirstName"));
                $('[name="CaregiverDocumentNumberView"]').val(entity.get("DocumentNumber"));
                $('[name="CaregiverGenderView"]').val(entity.get("Gender"));
                
                if(entity.get("ReceiveSpecialAttention") == true) $('[name="CaregiverReceiveSpecialAttentionView"]').attr('checked', true);
                if(entity.get("IsLiterate") == true) $('[name="CaregiverIsLiterateView"]').attr('checked', true);
                $('[name="CaregiverTotalIncomeView"]').val(entity.get("TotalIncome"));
                $('[name="CaregiverAddressView"]').val(entity.get("Address"));                
                $('[name="CaregiverDateOfLastHealthControlView"]').val(kendo.toString(entity.get("DateOfLastHealthControl"), "yyyy-MM-dd"));
                $('[name="CaregiverDateOfLastUpdateDevelopmentPlanView"]').val(kendo.toString(entity.get("DateOfLastUpdateDevelopmentPlan"), "yyyy-MM-dd"));
                $('[name="CaregiverPlannedUpdateOfDevelopmentPlanView"]').val(kendo.toString(entity.get("PlannedUpdateOfDevelopmentPlan"), "yyyy-MM-dd"));
                $('[name="CaregiverCaregiverIDView"]').val(entity.get("CaregiverID"));
                $('[name="CaregiverSOSHouseIDView"]').val(entity.get("SOSHouseID"));
                
                if(entity.get("HasDevelopmentPlan") == true) $('[name="CaregiverHasDevelopmentPlanView"]').attr('checked', true);
                $('[name="CaregiverTypeofFamilyView"]').val(entity.get("TypeofFamily"));
                $('[name="CaregiverNationalityView"]').val(entity.get("Nationality"));
                $('[name="CaregiverTypeOfCaregiverView"]').val(entity.get("TypeOfCaregiver"));
                $('[name="CaregiverPlannedRetirementDateView"]').val(kendo.toString(entity.get("PlannedRetirementDate"), "yyyy-MM-dd"));
                
                if(entity.get("HasChildrenSiblings") == true) $('[name="CaregiverHasChildrenSiblingsView"]').attr('checked', true);
                $('[name="CaregiverTypeOfSupportView"]').val(entity.get("TypeOfSupport"));
                $('[name="CaregiverProfessionView"]').val(entity.get("Profession"));
                $('[name="CaregiverTrainingInSOSView"]').val(entity.get("TrainingInSOS"));
                $('[name="CaregiverFormalEducationalLevelView"]').val(entity.get("FormalEducationalLevel"));
                $('[name="CaregiverYearsOfFormalEducationView"]').val(entity.get("YearsOfFormalEducation"));
                
                if(entity.get("MedicalCare") == true) $('[name="CaregiverMedicalCareView"]').attr('checked', true);
                SetComboBoxItemsAndConvertJsonToArray(entity.get("TypeOfDisease"),"CaregiverTypeOfDiseaseView");
                SetComboBoxItemsAndConvertJsonToArray(entity.get("HousingAndLivingSupport"),"CaregiverHousingAndLivingSupportView");
                SetComboBoxItemsAndConvertJsonToArray(entity.get("FoodSupport"),"CaregiverFoodSupportView");
                SetComboBoxItemsAndConvertJsonToArray(entity.get("MedicalCareSupport"),"CaregiverMedicalCareSupportView");
                SetComboBoxItemsAndConvertJsonToArray(entity.get("PsychosocialSupport"),"CaregiverPsychosocialSupportView");
                SetComboBoxItemsAndConvertJsonToArray(entity.get("ChildCareAndParentSupport"),"CaregiverChildCareAndParentSupportView");
                SetComboBoxItemsAndConvertJsonToArray(entity.get("LegalSupport"),"CaregiverLegalSupportView");
                SetComboBoxItemsAndConvertJsonToArray(entity.get("EconomicSupport"),"CaregiverEconomicSupportView");

                if(entity.get("Status") == "1")                	
                    $('[name="CaregiverStatusView"]').val("Activo");
                else
                	$('[name="CaregiverStatusView"]').val("Inactivo");
                
                if(houseID != "")
             	{
                    houseDataSource.filter({});
                    offlineHouseDataSource.filter({});

                    filters = [];
                    filters = UpdateSearchFilters(filters, "SOSHouseID", "eq", houseID, "and");        

                    var datasourceH = houseDataSource;

                    if (!navigator.onLine) { datasourceH = offlineHouseDataSource; }          

                    datasourceH.filter({});
                    datasourceH.filter(filters);  

                    datasourceH.fetch(function() 
                    {
                        var entity = datasourceH.at(0);
                        $('[name="CaregiverhouseNameView"]').val(entity.get("NameOrNumber"));
                    });    
                }
			}); 
         },
         getCaregiverByID: function () {   
                if (!navigator.onLine) {
                    navigator.notification.alert("No hay conexion a Internet");
                    return;
                }
             
                $('[name="CaregiverFirstNameView"]').val("");
                $('[name="CaregiverLastNameView"]').val("");

                caregiverDataSource.filter({});
                caregiverDataSource = new kendo.data.DataSource({
                        type: "everlive",
                        transport: {
                            typeName: "CareGiver"
                        },
                        serverFiltering: true,
                        filter: { field: 'CaregiverID', operator: 'eq', value: $('[name="CaregiverCaregiverIDView"]').val().trim() }
                });    
             
				caregiverDataSource.fetch(function() {
                    var caregiver = caregiverDataSource.at(0);
                    $('[name="CaregiverCaregiverIDView"]').val(caregiver.get("CaregiverID"));
                    $('[name="CaregiverFirstNameView"]').val(caregiver.get("FirstName"));
                    $('[name="CaregiverLastNameView"]').val(caregiver.get("LastName"));
                });
             
            },
         addCaregiverSubmit: function () {

            if(validateNullValues($('[name="CaregiverFirstName"]').val()) == ""){
                navigator.notification.alert("Los nombres son obligatorios");
                return;
        	}
            
            if(validateNullValues($('[name="CaregiverLastName"]').val()) == ""){
                navigator.notification.alert("Los apellidos son obligatorios");
                return;
        	}            
        
            if(validateNullValues($('[name="CaregiverCaregiverID"]').val()) == "" || validateNullValues($('[name="CaregiverCaregiverID"]').val()).length != 8){
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
                                PhoneNumber : $('[name="CaregiverPhoneNumber"]').val(),
                                Synchronized : $('[name="CaregiverSynchronized"]').is(":checked"),
                                DateOfStart : $('[name="CaregiverDateOfStart"]').val(),
                                DateOfBirth : $('[name="CaregiverDateOfBirth"]').val(),
                                LastName : $('[name="CaregiverLastName"]').val(),
                                FirstName : $('[name="CaregiverFirstName"]').val(),
                                DocumentNumber : $('[name="CaregiverDocumentNumber"]').val(),
                                Gender : $('[name="CaregiverGender"]').val(),
                                ReceiveSpecialAttention: $('[name="CaregiverReceiveSpecialAttention"]').is(":checked"),
                                IsLiterate : $('[name="CaregiverIsLiterate"]').is(":checked"),
                                TotalIncome : $('[name="CaregiverTotalIncome"]').val(),
                                Address : $('[name="CaregiverAddress"]').val(),
                                DateOfLastHealthControl : $('[name="CaregiverDateOfLastHealthControl"]').val(),
                                DateOfLastUpdateDevelopmentPlan : $('[name="CaregiverDateOfLastUpdateDevelopmentPlan"]').val(),
                                PlannedUpdateOfDevelopmentPlan : $('[name="CaregiverPlannedUpdateOfDevelopmentPlan"]').val(),
                                CaregiverID : $('[name="CaregiverCaregiverID"]').val(),
                                SOSHouseID: $('[name="CaregiverSOSHouseID"]').val(),
                                HasDevelopmentPlan:$('[name="CaregiverHasDevelopmentPlan"]').is(":checked"),
                                TypeofFamily:$('[name="CaregiverTypeofFamily"]').val(),
                                Nationality:$('[name="CaregiverNationality"]').val(),
                                TypeOfCaregiver:$('[name="CaregiverTypeOfCaregiver"]').val(),
                                PlannedRetirementDate:$('[name="CaregiverPlannedRetirementDate"]').val(),
                                HasChildrenSiblings:$('[name="CaregiverHasChildrenSiblings"]').is(":checked"),
                                TypeOfSupport:$('[name="CaregiverTypeOfSupport"]').val(),
                                Profession:$('[name="CaregiverProfession"]').val(),
                                TrainingInSOS:$('[name="CaregiverTrainingInSOS"]').val(),
                                FormalEducationalLevel:$('[name="CaregiverFormalEducationalLevel"]').val(),
                                YearsOfFormalEducation:$('[name="CaregiverYearsOfFormalEducation"]').val(),
                                MedicalCare:$('[name="CaregiverMedicalCare"]').is(":checked"),
                                TypeOfDisease:GetComboBoxItemsAndConvertToJson("CaregiverTypeOfDisease"),
                                HousingAndLivingSupport:GetComboBoxItemsAndConvertToJson("CaregiverHousingAndLivingSupport"),
                                FoodSupport:GetComboBoxItemsAndConvertToJson("CaregiverFoodSupport"),
                                MedicalCareSupport:GetComboBoxItemsAndConvertToJson("CaregiverMedicalCareSupport"),
                                PsychosocialSupport:GetComboBoxItemsAndConvertToJson("CaregiverPsychosocialSupport"),
                                ChildCareAndParentSupport:GetComboBoxItemsAndConvertToJson("CaregiverChildCareAndParentSupport"),
                                LegalSupport:GetComboBoxItemsAndConvertToJson("CaregiverLegalSupport"),
                                EconomicSupport:GetComboBoxItemsAndConvertToJson("CaregiverEconomicSupport"),
                                Status: "1"
                            });
                            caregiverDataSource.sync();
                            navigator.notification.alert("Se ha registrado correctamente");            
                        }                      
                    },
    				filter: { field: 'CaregiverID', operator: 'eq', value: $('[name="CaregiverCaregiverID"]').val() }	
    			});    
                
                searchCaregiverDataSource.read();

            } else {
                offlineCaregiverDataSource.online(false);
                offlineCaregiverDataSource.add({
                    PhoneNumber : $('[name="CaregiverPhoneNumber"]').val(),
                    Synchronized : $('[name="CaregiverSynchronized"]').val(),
                    DateOfStart : $('[name="CaregiverDateOfStart"]').val(),
                    DateOfBirth : $('[name="CaregiverDateOfBirth"]').val(),
                    LastName : $('[name="CaregiverLastName"]').val(),
                    FirstName : $('[name="CaregiverFirstName"]').val(),
                    DocumentNumber : $('[name="CaregiverDocumentNumber"]').val(),
                    Gender : $('[name="CaregiverGender"]').val(),
                    ReceiveSpecialAttention: $('[name="CaregiverReceiveSpecialAttention"]').is(":checked"),
                    IsLiterate : $('[name="CaregiverIsLiterate"]').is(":checked"),
                    TotalIncome : $('[name="CaregiverTotalIncome"]').val(),
                    Address : $('[name="CaregiverAddress"]').val(),
                    DateOfLastHealthControl : $('[name="CaregiverDateOfLastHealthControl"]').val(),
                    DateOfLastUpdateDevelopmentPlan : $('[name="CaregiverDateOfLastUpdateDevelopmentPlan"]').val(),
                    PlannedUpdateOfDevelopmentPlan : $('[name="CaregiverPlannedUpdateOfDevelopmentPlan"]').val(),
                    CaregiverID : $('[name="CaregiverCaregiverID"]').val(),
                    SOSHouseID: $('[name="CaregiverSOSHouseID"]').val(),
                    HasDevelopmentPlan:$('[name="CaregiverHasDevelopmentPlan"]').is(":checked"),
                    TypeofFamily:$('[name="CaregiverTypeofFamily"]').val(),
                    Nationality:$('[name="CaregiverNationality"]').val(),
                    TypeOfCaregiver:$('[name="CaregiverTypeOfCaregiver"]').val(),
                    PlannedRetirementDate:$('[name="CaregiverPlannedRetirementDate"]').val(),
                    HasChildrenSiblings:$('[name="CaregiverHasChildrenSiblings"]').is(":checked"),
                    TypeOfSupport:$('[name="CaregiverTypeOfSupport"]').val(),
                    Profession:$('[name="CaregiverProfession"]').val(),
                    TrainingInSOS:$('[name="CaregiverTrainingInSOS"]').val(),
                    FormalEducationalLevel:$('[name="CaregiverFormalEducationalLevel"]').val(),
                    YearsOfFormalEducation:$('[name="CaregiverYearsOfFormalEducation"]').val(),
                    MedicalCare:$('[name="CaregiverMedicalCare"]').is(":checked"),
                    TypeOfDisease:GetComboBoxItemsAndConvertToJson("CaregiverTypeOfDisease"),
                    HousingAndLivingSupport:GetComboBoxItemsAndConvertToJson("CaregiverHousingAndLivingSupport"),
                    FoodSupport:GetComboBoxItemsAndConvertToJson("CaregiverFoodSupport"),
                    MedicalCareSupport:GetComboBoxItemsAndConvertToJson("CaregiverMedicalCareSupport"),
                    PsychosocialSupport:GetComboBoxItemsAndConvertToJson("CaregiverPsychosocialSupport"),
                    ChildCareAndParentSupport:GetComboBoxItemsAndConvertToJson("CaregiverChildCareAndParentSupport"),
                    LegalSupport:GetComboBoxItemsAndConvertToJson("CaregiverLegalSupport"),
                    EconomicSupport:GetComboBoxItemsAndConvertToJson("CaregiverEconomicSupport"),
                    Status: "1"
                });
                offlineCaregiverDataSource.sync();
                navigator.notification.alert("Se ha registrado correctamente en modo desconectado");
            }
         },
         viewCaregiverSubmit: function(){
            if(validateNullValues($('[name="CaregiverFirstNameView"]').val()) == ""){
                navigator.notification.alert("Los nombres son obligatorios");
                return;
        	}
            
            if(validateNullValues($('[name="CaregiverLastNameView"]').val()) == ""){
                navigator.notification.alert("Los apellidos son obligatorios");
                return;
        	}            
        
            if(validateNullValues($('[name="CaregiverCaregiverIDView"]').val()) == "" || validateNullValues($('[name="CaregiverCaregiverIDView"]').val()).length != 8){
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
    				filter: { field: 'CaregiverID', operator: 'eq', value: $('[name="CaregiverCaregiverIDView"]').val() }	
    			});    
                
                caregiverDataSource.fetch(function() {
                    var entity = caregiverDataSource.at(0);                    
                    entity.set("PhoneNumber",$('[name="CaregiverPhoneNumberView"]').val());
                    entity.set("Synchronized",$('[name="CaregiverSynchronizedView"]').is(":checked"));
                    entity.set("DateOfStart",$('[name="CaregiverDateOfStartView"]').val());
                    entity.set("DateOfBirth",$('[name="CaregiverDateOfBirthView"]').val());
                    entity.set("LastName",$('[name="CaregiverLastNameView"]').val());
                    entity.set("FirstName",$('[name="CaregiverFirstNameView"]').val());
                    entity.set("DocumentNumber",$('[name="CaregiverDocumentNumberView"]').val());
                    entity.set("Gender",$('[name="CaregiverGenderView"]').val());
                    entity.set("ReceiveSpecialAttention",$('[name="CaregiverReceiveSpecialAttentionView"]').is(":checked"));
                    entity.set("IsLiterate",$('[name="CaregiverIsLiterateView"]').is(":checked"));
                    entity.set("TotalIncome",$('[name="CaregiverTotalIncomeView"]').val());
                    entity.set("Address",$('[name="CaregiverAddressView"]').val());
                    entity.set("Status",$('[name="CaregiverStatusView"]').val());
                    entity.set("DateOfLastHealthControl",$('[name="CaregiverDateOfLastHealthControlView"]').val());
                    entity.set("DateOfLastUpdateDevelopmentPlan",$('[name="CaregiverDateOfLastUpdateDevelopmentPlanView"]').val());
                    entity.set("PlannedUpdateOfDevelopmentPlan",$('[name="CaregiverPlannedUpdateOfDevelopmentPlanView"]').val());
                    entity.set("CaregiverID",$('[name="CaregiverCaregiverIDView"]').val());
                    entity.set("SOSHouseID",$('[name="CaregiverSOSHouseIDView"]').val());
                    
                    entity.set("HasDevelopmentPlan",$('[name="CaregiverHasDevelopmentPlanView"]').is(":checked"));
                    entity.set("TypeofFamily",$('[name="CaregiverTypeofFamilyView"]').val());
                    entity.set("Nationality",$('[name="CaregiverNationalityView"]').val());
                    entity.set("TypeOfCaregiver",$('[name="CaregiverTypeOfCaregiverView"]').val());
                    entity.set("PlannedRetirementDate",$('[name="CaregiverPlannedRetirementDateView"]').val());
                    entity.set("HasChildrenSiblings",$('[name="CaregiverHasChildrenSiblingsView"]').is(":checked"));
                    entity.set("TypeOfSupport",$('[name="CaregiverTypeOfSupportView"]').val());
                    entity.set("Profession",$('[name="CaregiverProfessionView"]').val());
                    entity.set("TrainingInSOS",$('[name="CaregiverTrainingInSOSView"]').val());
                    entity.set("FormalEducationalLevel",$('[name="CaregiverFormalEducationalLevelView"]').val());
                    entity.set("YearsOfFormalEducation",$('[name="CaregiverYearsOfFormalEducationView"]').val());
                    entity.set("MedicalCare",$('[name="CaregiverMedicalCareView"]').is(":checked"));
                    entity.set("TypeOfDisease",GetComboBoxItemsAndConvertToJson("CaregiverTypeOfDiseaseView"));
                    entity.set("HousingAndLivingSupport",GetComboBoxItemsAndConvertToJson("CaregiverHousingAndLivingSupportView"));
                    entity.set("FoodSupport",GetComboBoxItemsAndConvertToJson("CaregiverFoodSupportView"));
                    entity.set("MedicalCareSupport",GetComboBoxItemsAndConvertToJson("CaregiverMedicalCareSupportView"));
                    entity.set("PsychosocialSupport",GetComboBoxItemsAndConvertToJson("CaregiverPsychosocialSupportView"));
                    entity.set("ChildCareAndParentSupport",GetComboBoxItemsAndConvertToJson("CaregiverChildCareAndParentSupportView"));
                    entity.set("LegalSupport",GetComboBoxItemsAndConvertToJson("CaregiverLegalSupportView"));
                    entity.set("EconomicSupport",GetComboBoxItemsAndConvertToJson("CaregiverEconomicSupportView"));

                    caregiverDataSource.sync();
                	navigator.notification.alert("Se ha registrado correctamente");
                });
                
            } else {
                offlineCaregiverDataSource.online(false);
                
                var filters = [];
 				filters = UpdateSearchFilters(filters, "CaregiverID", "eq", $('[name="CaregiverCaregiverIDView"]').val(), "and");        
                offlineCaregiverDataSource.filter(filters);
                
                offlineCaregiverDataSource.fetch(function() {
  					var entity = caregiverDataSource.at(0);
                    entity.set("PhoneNumber",$('[name="CaregiverPhoneNumberView"]').val());
                    entity.set("Synchronized",$('[name="CaregiverSynchronizedView"]').val());
                    entity.set("DateOfStart",$('[name="CaregiverDateOfStartView"]').val());
                    entity.set("DateOfBirth",$('[name="CaregiverDateOfBirthView"]').val());
                    entity.set("LastName",$('[name="CaregiverLastNameView"]').val());
                    entity.set("FirstName",$('[name="CaregiverFirstNameView"]').val());
                    entity.set("DocumentNumber",$('[name="CaregiverDocumentNumberView"]').val());
                    entity.set("Gender",$('[name="CaregiverGenderView"]').val());
                    entity.set("ReceiveSpecialAttention",$('[name="CaregiverReceiveSpecialAttentionView"]').is(":checked"));
                    entity.set("IsLiterate",$('[name="CaregiverIsLiterateView"]').is(":checked"));
                    entity.set("TotalIncome",$('[name="CaregiverTotalIncomeView"]').val());
                    entity.set("Address",$('[name="CaregiverAddressView"]').val());
                    entity.set("Status",$('[name="CaregiverStatusView"]').val());
                    entity.set("DateOfLastHealthControl",$('[name="CaregiverDateOfLastHealthControlView"]').val());
                    entity.set("DateOfLastUpdateDevelopmentPlan",$('[name="CaregiverDateOfLastUpdateDevelopmentPlanView"]').val());
                    entity.set("PlannedUpdateOfDevelopmentPlan",$('[name="CaregiverPlannedUpdateOfDevelopmentPlanView"]').val());
                    entity.set("CaregiverID",$('[name="CaregiverCaregiverIDView"]').val());
                    entity.set("SOSHouseID",$('[name="CaregiverSOSHouseIDView"]').val());
                    
                    entity.set("HasDevelopmentPlan",$('[name="CaregiverHasDevelopmentPlanView"]').is(":checked"));
                    entity.set("TypeofFamily",$('[name="CaregiverTypeofFamilyView"]').val());
                    entity.set("Nationality",$('[name="CaregiverNationalityView"]').val());
                    entity.set("TypeOfCaregiver",$('[name="CaregiverTypeOfCaregiverView"]').val());
                    entity.set("PlannedRetirementDate",$('[name="CaregiverPlannedRetirementDateView"]').val());
                    entity.set("HasChildrenSiblings",$('[name="CaregiverHasChildrenSiblingsView"]').val());
                    entity.set("TypeOfSupport",$('[name="CaregiverTypeOfSupportView"]').val());
                    entity.set("Profession",$('[name="CaregiverProfessionView"]').val());
                    entity.set("TrainingInSOS",$('[name="CaregiverTrainingInSOSView"]').val());
                    entity.set("FormalEducationalLevel",$('[name="CaregiverFormalEducationalLevelView"]').val());
                    entity.set("YearsOfFormalEducation",$('[name="CaregiverYearsOfFormalEducationView"]').val());
                    entity.set("MedicalCare",$('[name="CaregiverMedicalCareView"]').is(":checked"));
                    entity.set("TypeOfDisease",GetComboBoxItemsAndConvertToJson("CaregiverTypeOfDiseaseView"));
                    entity.set("HousingAndLivingSupport",GetComboBoxItemsAndConvertToJson("CaregiverHousingAndLivingSupportView"));
                    entity.set("FoodSupport",GetComboBoxItemsAndConvertToJson("CaregiverFoodSupportView"));
                    entity.set("MedicalCareSupport",GetComboBoxItemsAndConvertToJson("CaregiverMedicalCareSupportView"));
                    entity.set("PsychosocialSupport",GetComboBoxItemsAndConvertToJson("CaregiverPsychosocialSupportView"));
                    entity.set("ChildCareAndParentSupport",GetComboBoxItemsAndConvertToJson("CaregiverChildCareAndParentSupportView"));
                    entity.set("LegalSupport",GetComboBoxItemsAndConvertToJson("CaregiverLegalSupportView"));
                    entity.set("EconomicSupport",GetComboBoxItemsAndConvertToJson("CaregiverEconomicSupportView"));

                    offlineCaregiverDataSource.sync();
                    navigator.notification.alert("Se ha registrado correctamente");            
                });
            }
         },
         departCaregiverSubmit: function(){
             	if (!navigator.onLine) {
                    navigator.notification.alert("Algunas opciones no podrán ser usadas en modo desconectado");
                    return;
                 }
             
             	caregiverDataSource.filter({});
                caregiverDataSource = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "CareGiver"
                    },
    				serverFiltering: true,
    				filter: { field: 'CaregiverID', operator: 'eq', value: $('[name="CaregiverCaregiverIDView"]').val() }	
    			});    
                
                caregiverDataSource.fetch(function() {
                    var entity = caregiverDataSource.at(0);                    
                    entity.set("Status","0");
                    entity.set("ExitReason",$('[name="CaregiverExitReason"]').val());
                    entity.set("Exitdate",new Date().toJSON().slice(0,10));
                    caregiverDataSource.sync();
                	navigator.notification.alert("Se ha inactivado el cuidador correctamente");
                });
         },
         reactivateCaregiverSubmit: function(){
             	if (!navigator.onLine) {
                    navigator.notification.alert("Algunas opciones no podrán ser usadas en modo desconectado");
                    return;
                 }
             
             	caregiverDataSource.filter({});
                caregiverDataSource = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "CareGiver"
                    },
    				serverFiltering: true,
    				filter: { field: 'CaregiverID', operator: 'eq', value: $('[name="CaregiverCaregiverIDView"]').val() }	
    			});    
                
                caregiverDataSource.fetch(function() {
                    var entity = caregiverDataSource.at(0);                    
                    entity.set("Status","1");
                    entity.set("ReentryReason",$('[name="CaregiverReentryReason"]').val());
                    entity.set("DateOfReentry",new Date().toJSON().slice(0,10));
                    caregiverDataSource.sync();
                	navigator.notification.alert("Se ha reactivado el cuidador correctamente");
                });
         },
         initTransfer: function(){
             if (!navigator.onLine) {
            	navigator.notification.alert("Algunas opciones no podrán ser usadas en modo desconectado");
                return;
             }
             
             var programa = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "ProgrammeUnit"
                    },
    				serverFiltering: true,
                    serverSorting: true,
      				sort: { field: "Name", dir: "asc" }
    		});               
            
             $("#CaregiverddlProgramaTransfer").kendoDropDownList({
                        dataTextField: "Name",
                        dataValueField: "ProgrammeUnitID",
                        dataSource: programa
             });
             
             $("#CaregiverddlProgramaTransfer").data("kendoDropDownList").bind("dataBound", function(e) {
                this.trigger("change");    			
			 });
             $("#CaregiverddlProgramaTransfer").data("kendoDropDownList").bind("change", function(){
                var casa = new kendo.data.DataSource({
                        type: "everlive",
                        transport: {
                            typeName: "House"
                        },
                        serverFiltering: true,
                        serverSorting: true,
                        sort: { field: "NameOrNumber", dir: "asc" },
                        filter: { field: 'ProgrammeUnitID', operator: 'eq', value: $("#CaregiverddlProgramaTransfer").val() }	
                });               

                 $("#CaregiverddlCasaTransfer").kendoDropDownList({
                            dataTextField: "NameOrNumber",
                            dataValueField: "SOSHouseID",
                            dataSource: casa
                 }); 
             });
         },
         tranferCaregiverSubmit: function(){
             	if (!navigator.onLine) {
                    navigator.notification.alert("Algunas opciones no podrán ser usadas en modo desconectado");
                    return;
                 }
             
                if(validateNullValues($("#CaregiverddlCasaTransfer").val()) == ""){
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
    				filter: { field: 'CaregiverID', operator: 'eq', value: $('[name="CaregiverCaregiverIDView"]').val() }	
    			});    
                
                caregiverDataSource.fetch(function() {
                    var entity = caregiverDataSource.at(0);                    
                    entity.set("SOSHouseID", $("#CaregiverddlCasaTransfer").val());
                    entity.set("TransferReason",$('[name="CaregiverTransferReason"]').val());
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
             
            $("#listChild").html("");
             
            if (!navigator.onLine) {
                	navigator.notification.alert("Se realizará la búsqueda desconectada");
                	offlineCaregiverDataSource.filter({});
             
                	$("#ChildddlCuidador").kendoDropDownList({
                        dataTextField: "LastName",
                        dataValueField: "CaregiverID",
                        dataSource: offlineCaregiverDataSource
                    });
                
                    $("#ChildddlCuidadorView").kendoDropDownList({
                        dataTextField: "LastName",
                        dataValueField: "CaregiverID",
                        dataSource: offlineCaregiverDataSource
                    });
                    return;
            }
             
            var cuidador = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "CareGiver"
                    },
    				serverFiltering: true,
                    serverSorting: true,
      				sort: { field: "LastName", dir: "asc" }
    		 });               
            
             $("#ChildddlCuidadorView").kendoDropDownList({
                        dataTextField: "LastName",
                        dataValueField: "CaregiverID",
                        dataSource: cuidador
             });
             
             var filters = []; 
             cuidador.filter({});
             filters = UpdateSearchFilters(filters, "Status", "eq", "1", "and");        
	         cuidador.filter(filters);
             
             $("#ChildddlCuidador").kendoDropDownList({
                        dataTextField: "LastName",
                        dataValueField: "CaregiverID",
                        dataSource: cuidador
                    });
    	 },
         searchChildByCaregiver: function(){
            var caregiverID = $("#ChildddlCuidadorView").val();            
             
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
            if (navigator.onLine) { caregiverID =  $("#ChildddlCuidador").val(); }
            SwitchTab("Child", "Add", "", "", "", caregiverID); 
             
            if(caregiverID != "")
            {
                    caregiverDataSource.filter({});
                    offlineCaregiverDataSource.filter({});

                    var filters = [];
                    filters = UpdateSearchFilters(filters, "CaregiverID", "eq", caregiverID, "and");        

                    var datasourceC = caregiverDataSource;

                    if (!navigator.onLine) { datasourceC = offlineCaregiverDataSource; }          

                    datasourceC.filter({});
                    datasourceC.filter(filters);  

                    datasourceC.fetch(function() 
                    {
                        var entity = datasourceC.at(0);
                        $('[name="CaregiverFirstname"]').val(entity.get("FirstName"));
                        $('[name="CaregiverLastname"]').val(entity.get("LastName"));
                    });    
            }
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
             
            var caregiverID = "";
            datasource.fetch(function() {
  				var entity = datasource.at(0);
                caregiverID = entity.get("CaregiverID");
                
  				$('[name="ChildBirthdateView"]').val(kendo.toString(entity.get("Birthdate"), "yyyy-MM-dd"));
                $('[name="ChildLastNameView"]').val(entity.get("LastName"));
                $('[name="ChildFirstNameView"]').val(entity.get("FirstName"));
                $('[name="ChildExitdateView"]').val(kendo.toString(entity.get("Exitdate"), "yyyy-MM-dd"));
                $('[name="ChildExitReasonView"]').val(entity.get("ExitReason"));
                $('[name="ChildMotherLastNameView"]').val(entity.get("MotherLastName"));
                $('[name="ChildSOSChildIDView"]').val(entity.get("SOSChildID"));
                $('[name="ChildCaregiverIDView"]').val(entity.get("CaregiverID"));
                
                $('[name="ChildDocumentNumberView"]').val(entity.get("DocumentNumber"));
                $('[name="ChildGenderView"]').val(entity.get("Gender"));
                $('[name="ChildNativeLanguageView"]').val(entity.get("NativeLanguage"));
                $('[name="ChildOriginPlaceFromParentsView"]').val(entity.get("OriginPlaceFromParents"));
                
                if(entity.get("HasChildDevelopmentPlan") == true) $('[name="ChildHasChildDevelopmentPlanView"]').attr('checked', true);
                
                $('[name="ChildDateOfExpectedUpdateView"]').val(kendo.toString(entity.get("DateOfExpectedUpdate"), "yyyy-MM-dd"));
                $('[name="ChildDateOfStartView"]').val(kendo.toString(entity.get("DateOfStart"), "yyyy-MM-dd"));
                $('[name="ChildNationalityView"]').val(entity.get("Nationality"));
                
                if(entity.get("GoesToEducationalCenterSOS") == true) $('[name="ChildGoesToEducationalCenterSOSView"]').attr('checked', true);     
                $('[name="ChildNonSOSEducationalCenterNameView"]').val(entity.get("NonSOSEducationalCenterName"));                                
                if(entity.get("CurrentEnrollment") == true) $('[name="ChildCurrentEnrollmentView"]').attr('checked', true);
                
                $('[name="ChildCurrentSchoolYearView"]').val(entity.get("CurrentSchoolYear"));
                $('[name="ChildDateOfLastMedicalControlView"]').val(kendo.toString(entity.get("DateOfLastMedicalControl"), "yyyy-MM-dd"));
                
                if(entity.get("Disability") == true) $('[name="ChildDisabilityView"]').attr('checked', true);
                $('[name="ChildNutritionalStatusView"]').val(entity.get("NutritionalStatus"));
                
                if(entity.get("HasMedicalCare") == true) $('[name="ChildHasMedicalCareView"]').attr('checked', true);
                if(entity.get("HasHIV") == true) $('[name="ChildHasHIVView"]').attr('checked', true);
                
                SetComboBoxItemsAndConvertJsonToArray(entity.get("TypeOfVaccination"),"ChildTypeOfVaccinationView");
				SetComboBoxItemsAndConvertJsonToArray(entity.get("TypeOfDisease"),"ChildTypeOfDiseaseView");
                $('[name="ChildReasonForAdmissionView"]').val(entity.get("ReasonForAdmission"));
                $('[name="ChildDetailsForAdmissionView"]').val(entity.get("DetailsForAdmission"));
                $('[name="ChildAdmissionProvidedByView"]').val(entity.get("AdmissionProvidedBy"));
                SetComboBoxItemsAndConvertJsonToArray(entity.get("DocumentsForAdmission"),"ChildDocumentsForAdmissionView");
                SetComboBoxItemsAndConvertJsonToArray(entity.get("RecordBeforeAdmission"),"ChildRecordBeforeAdmissionView");
                SetComboBoxItemsAndConvertJsonToArray(entity.get("BiologicalSiblings"),"ChildBiologicalSiblingsView");
                SetComboBoxItemsAndConvertJsonToArray(entity.get("ChildParticipation"),"ChildChildParticipationView");
                
                if(entity.get("HasExitPlan") == true) $('[name="ChildHasExitPlanView"]').attr('checked', true);
                
                $('[name="ChildTypeOfEmploymentView"]').val(entity.get("TypeOfEmployment"));
                $('[name="ChildDetailsOfEmploymentView"]').val(entity.get("DetailsOfEmployment"));
                $('[name="ChildPsychosocialDevelopmentView"]').val(entity.get("PsychosocialDevelopment"));
                
                if(entity.get("ChildAbuseReceived") == true) $('[name="ChildChildAbuseReceivedView"]').attr('checked', true);
                SetComboBoxItemsAndConvertJsonToArray(entity.get("PsychosocialSupport"),"ChildPsychosocialSupportView");
                SetComboBoxItemsAndConvertJsonToArray(entity.get("MedicalSupport"),"ChildMedicalSupportView");
                SetComboBoxItemsAndConvertJsonToArray(entity.get("EducationalSupport"),"ChildEducationalSupportView");
                SetComboBoxItemsAndConvertJsonToArray(entity.get("AdditionalSupport"),"ChildAdditionalSupportView");
                
                if(entity.get("Status") == "1")                	
                    $('[name="ChildStatusView"]').val("Activo");
                else
                	$('[name="ChildStatusView"]').val("Inactivo");
                
                if(caregiverID != "")
             	{
                    caregiverDataSource.filter({});
                    offlineCaregiverDataSource.filter({});

                    filters = [];
                    filters = UpdateSearchFilters(filters, "CaregiverID", "eq", caregiverID, "and");        

                    var datasourceC = caregiverDataSource;

                    if (!navigator.onLine) { datasourceC = offlineCaregiverDataSource; }          

                    datasourceC.filter({});
                    datasourceC.filter(filters);  

                    datasourceC.fetch(function() 
                    {
                        var entity = datasourceC.at(0);
                        $('[name="CaregiverFirstnameView"]').val(entity.get("FirstName"));
                        $('[name="CaregiverLastnameView"]').val(entity.get("LastName"));
                    });    
                }
			});                
         },
         getChildByID: function () {   
                if (!navigator.onLine) {
                    navigator.notification.alert("No hay conexion a Internet");
                    return;
                }
             
                $('[name="ChildFirstNameView"]').val("");
                $('[name="ChildLastNameView"]').val("");

                childDataSource.filter({});
                childDataSource = new kendo.data.DataSource({
                        type: "everlive",
                        transport: {
                            typeName: "Child"
                        },
                        serverFiltering: true,
                        filter: { field: 'SOSChildID', operator: 'eq', value: $('[name="ChildSOSChildIDView"]').val().trim() }
                });    
				
                childDataSource.fetch(function() {
                    var child = childDataSource.at(0);
                    $('[name="ChildSOSChildIDView"]').val(child.get("SOSChildID"));
                    $('[name="ChildFirstNameView"]').val(child.get("FirstName"));
                    $('[name="ChildLastNameView"]').val(child.get("LastName"));
                });
         },
         addChildSubmit: function () {
			if(validateNullValues($('[ name="ChildFirstName"]').val()) == ""){
                navigator.notification.alert("Los nombres son obligatorios");
                return;
        	}
            
            if(validateNullValues($('[ name="ChildLastName"]').val()) == ""){
                navigator.notification.alert("Los apellidos son obligatorios");
                return;
        	}            
        
            if(validateNullValues($('[ name="ChildSOSChildID"]').val()) == "" || validateNullValues($('[ name="ChildSOSChildID"]').val()).length != 8){
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
                                Birthdate : $('[ name="ChildBirthdate"]').val(),
                                LastName : $('[ name="ChildLastName"]').val(),
                                FirstName : $('[ name="ChildFirstName"]').val(),
                                Exitdate : $('[ name="ChildExitdate"]').val(),
                                ExitReason : $('[ name="ChildExitReason"]').val(),
                                MotherLastName : $('[ name="ChildMotherLastName"]').val(),
                                SOSChildID : $('[ name="ChildSOSChildID"]').val(),
                                CaregiverID: $('[ name="ChildCaregiverID"]').val(),
                                DocumentNumber:$('[ name="ChildDocumentNumber"]').val(),
                                Gender:$('[ name="ChildGender"]').val(),
                                NativeLanguage:$('[ name="ChildNativeLanguage"]').val(),
                                OriginPlaceFromParents:$('[ name="ChildOriginPlaceFromParents"]').val(),
                                HasChildDevelopmentPlan:$('[ name="ChildHasChildDevelopmentPlan"]').is(":checked"),
                                DateOfExpectedUpdate:$('[ name="ChildDateOfExpectedUpdate"]').val(),
                                DateOfStart:$('[ name="ChildDateOfStart"]').val(),
                                Nationality:$('[ name="ChildNationality"]').val(),
                                GoesToEducationalCenterSOS:$('[ name="ChildGoesToEducationalCenterSOS"]').is(":checked"),
                                NonSOSEducationalCenterName:$('[ name="ChildNonSOSEducationalCenterName"]').val(),
                                CurrentEnrollment:$('[ name="ChildCurrentEnrollment"]').is(":checked"),
                                CurrentSchoolYear:$('[ name="ChildCurrentSchoolYear"]').val(),
                                DateOfLastMedicalControl:$('[ name="ChildDateOfLastMedicalControl"]').val(),
                                Disability:$('[ name="ChildDisability"]').is(":checked"),
                                NutritionalStatus:$('[ name="ChildNutritionalStatus"]').val(),
                                HasMedicalCare:$('[ name="ChildHasMedicalCare"]').is(":checked"),
                                HasHIV:$('[ name="ChildHasHIV"]').is(":checked"),
                                TypeOfVaccination:GetComboBoxItemsAndConvertToJson("ChildTypeOfVaccination"),
								TypeOfDisease:GetComboBoxItemsAndConvertToJson("ChildTypeOfDisease"),
                                ReasonForAdmission:$('[ name="ChildReasonForAdmission"]').val(),
                                DetailsForAdmission:$('[ name="ChildDetailsForAdmission"]').val(),
                                AdmissionProvidedBy:$('[ name="ChildAdmissionProvidedBy"]').val(),
                                DocumentsForAdmission:GetComboBoxItemsAndConvertToJson("ChildDocumentsForAdmission"),
                                RecordBeforeAdmission:GetComboBoxItemsAndConvertToJson("ChildRecordBeforeAdmission"),
                                BiologicalSiblings:GetComboBoxItemsAndConvertToJson("ChildBiologicalSiblings"),
                                ChildParticipation:GetComboBoxItemsAndConvertToJson("ChildChildParticipation"),
                                HasExitPlan:$('[ name="ChildHasExitPlan"]').is(":checked"),
                                TypeOfEmployment:$('[ name="ChildTypeOfEmployment"]').val(),
                                DetailsOfEmployment:$('[ name="ChildDetailsOfEmployment"]').val(),
                                PsychosocialDevelopment:$('[ name="ChildPsychosocialDevelopment"]').val(),
                                ChildAbuseReceived:$('[ name="ChildChildAbuseReceived"]').is(":checked"),
                                PsychosocialSupport:GetComboBoxItemsAndConvertToJson("ChildPsychosocialSupport"),
                                MedicalSupport:GetComboBoxItemsAndConvertToJson("ChildMedicalSupport"),
                                EducationalSupport:GetComboBoxItemsAndConvertToJson("ChildEducationalSupport"),
                                AdditionalSupport:GetComboBoxItemsAndConvertToJson("ChildAdditionalSupport"),
                                Status: "1"
                            });
                            childDataSource.sync();
                            navigator.notification.alert("Se ha registrado correctamente");
						}                      
                    },
    				filter: { field: 'SOSChildID', operator: 'eq', value: $('[ name="ChildSOSChildID"]').val() }	
    			});    
                
                searchChildDataSource.read();

            } else {
                offlineChildDataSource.online(false);

                offlineChildDataSource.add({
                                Birthdate : $('[ name="ChildBirthdate"]').val(),
                                LastName : $('[ name="ChildLastName"]').val(),
                                FirstName : $('[ name="ChildFirstName"]').val(),
                                Exitdate : $('[ name="ChildExitdate"]').val(),
                                ExitReason : $('[ name="ChildExitReason"]').val(),
                                MotherLastName : $('[ name="ChildMotherLastName"]').val(),
                                SOSChildID : $('[ name="ChildSOSChildID"]').val(),
                                CaregiverID: $('[ name="ChildCaregiverID"]').val(),
                                DocumentNumber:$('[ name="ChildDocumentNumber"]').val(),
                                Gender:$('[ name="ChildGender"]').val(),
                                NativeLanguage:$('[ name="ChildNativeLanguage"]').val(),
                                OriginPlaceFromParents:$('[ name="ChildOriginPlaceFromParents"]').val(),
                                HasChildDevelopmentPlan:$('[ name="ChildHasChildDevelopmentPlan"]').is(":checked"),
                                DateOfExpectedUpdate:$('[ name="ChildDateOfExpectedUpdate"]').val(),
                                DateOfStart:$('[ name="ChildDateOfStart"]').val(),
                                Nationality:$('[ name="ChildNationality"]').val(),
                                GoesToEducationalCenterSOS:$('[ name="ChildGoesToEducationalCenterSOS"]').is(":checked"),
                                NonSOSEducationalCenterName:$('[ name="ChildNonSOSEducationalCenterName"]').val(),
                                CurrentEnrollment:$('[ name="ChildCurrentEnrollment"]').is(":checked"),
                                CurrentSchoolYear:$('[ name="ChildCurrentSchoolYear"]').val(),
                                DateOfLastMedicalControl:$('[ name="ChildDateOfLastMedicalControl"]').val(),
                                Disability:$('[ name="ChildDisability"]').is(":checked"),
                                NutritionalStatus:$('[ name="ChildNutritionalStatus"]').val(),
                                HasMedicalCare:$('[ name="ChildHasMedicalCare"]').is(":checked"),
                                HasHIV:$('[ name="ChildHasHIV"]').is(":checked"),
                                TypeOfVaccination:GetComboBoxItemsAndConvertToJson("ChildTypeOfVaccination"),
								TypeOfDisease:GetComboBoxItemsAndConvertToJson("ChildTypeOfDisease"),
                                ReasonForAdmission:$('[ name="ChildReasonForAdmission"]').val(),
                                DetailsForAdmission:$('[ name="ChildDetailsForAdmission"]').val(),
                                AdmissionProvidedBy:$('[ name="ChildAdmissionProvidedBy"]').val(),
                                DocumentsForAdmission:GetComboBoxItemsAndConvertToJson("ChildDocumentsForAdmission"),
                                RecordBeforeAdmission:GetComboBoxItemsAndConvertToJson("ChildRecordBeforeAdmission"),
                                BiologicalSiblings:GetComboBoxItemsAndConvertToJson("ChildBiologicalSiblings"),
                                ChildParticipation:GetComboBoxItemsAndConvertToJson("ChildChildParticipation"),
                                HasExitPlan:$('[ name="ChildHasExitPlan"]').is(":checked"),
                                TypeOfEmployment:$('[ name="ChildTypeOfEmployment"]').val(),
                                DetailsOfEmployment:$('[ name="ChildDetailsOfEmployment"]').val(),
                                PsychosocialDevelopment:$('[ name="ChildPsychosocialDevelopment"]').val(),
                                ChildAbuseReceived:$('[ name="ChildChildAbuseReceived"]').is(":checked"),
                                PsychosocialSupport:GetComboBoxItemsAndConvertToJson("ChildPsychosocialSupport"),
                                MedicalSupport:GetComboBoxItemsAndConvertToJson("ChildMedicalSupport"),
                                EducationalSupport:GetComboBoxItemsAndConvertToJson("ChildEducationalSupport"),
                                AdditionalSupport:GetComboBoxItemsAndConvertToJson("ChildAdditionalSupport"),                    
                                Status: "1"
                });
                offlineChildDataSource.sync();
                navigator.notification.alert("Se ha registrado correctamente en modo desconectado");
            }
         },
         viewChildSubmit: function(){
             
            if(validateNullValues($('[name="ChildFirstNameView"]').val()) == ""){
                navigator.notification.alert("Los nombres son obligatorios");
                return;
        	}
            
            if(validateNullValues($('[name="ChildLastNameView"]').val()) == ""){
                navigator.notification.alert("Los apellidos son obligatorios");
                return;
        	}            
        
            if(validateNullValues($('[name="ChildSOSChildIDView"]').val()) == "" || validateNullValues($('[name="ChildSOSChildIDView"]').val()).length != 8){
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
    				filter: { field: 'SOSChildID', operator: 'eq', value: $('[name="ChildSOSChildIDView"]').val() }	
    			});    
                
                childDataSource.fetch(function() {
  					var entity = childDataSource.at(0);
                    entity.set("Birthdate",$('[name="ChildBirthdateView"]').val());
                    entity.set("LastName",$('[name="ChildLastNameView"]').val());
                    entity.set("FirstName",$('[name="ChildFirstNameView"]').val());
                    entity.set("Exitdate",$('[name="ChildExitdateView"]').val());
                    entity.set("ExitReason",$('[name="ChildExitReasonView"]').val());
                    entity.set("MotherLastName",$('[name="ChildMotherLastNameView"]').val());
                    entity.set("SOSChildID",$('[name="ChildSOSChildIDView"]').val());
                    entity.set("CaregiverID",$('[name="ChildCaregiverIDView"]').val());
                    
                    entity.set("DocumentNumber",$('[name="ChildDocumentNumberView"]').val());
                    entity.set("Gender",$('[name="ChildGenderView"]').val());
                    entity.set("NativeLanguage",$('[name="ChildNativeLanguageView"]').val());
                    entity.set("OriginPlaceFromParents",$('[name="ChildOriginPlaceFromParentsView"]').val());
                    entity.set("HasChildDevelopmentPlan",$('[name="ChildHasChildDevelopmentPlanView"]').is(":checked"));
                    entity.set("DateOfExpectedUpdate",$('[name="ChildDateOfExpectedUpdateView"]').val());
                    entity.set("DateOfStart",$('[name="ChildDateOfStartView"]').val());
                    entity.set("Nationality",$('[name="ChildNationalityView"]').val());
                    entity.set("GoesToEducationalCenterSOS",$('[name="ChildGoesToEducationalCenterSOSView"]').is(":checked"));
                    entity.set("NonSOSEducationalCenterName",$('[name="ChildNonSOSEducationalCenterNameView"]').val());
                    entity.set("CurrentEnrollment",$('[name="ChildCurrentEnrollmentView"]').is(":checked"));
                    entity.set("CurrentSchoolYear",$('[name="ChildCurrentSchoolYearView"]').val());
                    entity.set("DateOfLastMedicalControl",$('[name="ChildDateOfLastMedicalControlView"]').val());
                    entity.set("Disability",$('[name="ChildDisabilityView"]').is(":checked"));
                    entity.set("NutritionalStatus",$('[name="ChildNutritionalStatusView"]').val());
                    entity.set("HasMedicalCare",$('[name="ChildHasMedicalCareView"]').is(":checked"));
                    entity.set("HasHIV",$('[name="ChildHasHIVView"]').is(":checked"));
                    entity.set("TypeOfVaccination",GetComboBoxItemsAndConvertToJson("ChildTypeOfVaccinationView"));
					entity.set("TypeOfDisease",GetComboBoxItemsAndConvertToJson("ChildTypeOfDiseaseView"));
                    entity.set("ReasonForAdmission",$('[name="ChildReasonForAdmissionView"]').val());
                    entity.set("DetailsForAdmission",$('[name="ChildDetailsForAdmissionView"]').val());
                    entity.set("AdmissionProvidedBy",$('[name="ChildAdmissionProvidedByView"]').val());
                    entity.set("DocumentsForAdmission",GetComboBoxItemsAndConvertToJson("ChildDocumentsForAdmissionView"));
                    entity.set("RecordBeforeAdmission",GetComboBoxItemsAndConvertToJson("ChildRecordBeforeAdmissionView"));
                    entity.set("BiologicalSiblings",GetComboBoxItemsAndConvertToJson("ChildBiologicalSiblingsView"));
                    entity.set("ChildParticipation",GetComboBoxItemsAndConvertToJson("ChildChildParticipationView"));
                    entity.set("HasExitPlan",$('[name="ChildHasExitPlanView"]').is(":checked"));
                    entity.set("TypeOfEmployment",$('[name="ChildTypeOfEmploymentView"]').val());
                    entity.set("DetailsOfEmployment",$('[name="ChildDetailsOfEmploymentView"]').val());
                    entity.set("PsychosocialDevelopment",$('[name="ChildPsychosocialDevelopmentView"]').val());
                    entity.set("ChildAbuseReceived",$('[name="ChildChildAbuseReceivedView"]').is(":checked"));
                    entity.set("PsychosocialSupport",GetComboBoxItemsAndConvertToJson("ChildPsychosocialSupportView"));
                    entity.set("MedicalSupport",GetComboBoxItemsAndConvertToJson("ChildMedicalSupportView"));
                    entity.set("EducationalSupport",GetComboBoxItemsAndConvertToJson("ChildEducationalSupportView"));
                    entity.set("AdditionalSupport",GetComboBoxItemsAndConvertToJson("ChildAdditionalSupportView"));
					                               
                                    
					/*var jsonExitReasonView = GetComboBoxItemsAndConvertToJson("ChildExitReasonView");                    
                    if(jsonExitReasonView.trim() != "")
                    	entity.set("ExitReason", jsonExitReasonView);*/                    
                    //entity.set("ExitReason",GetComboBoxItemsAndConvertToJson("ChildExitReasonView"));

                    childDataSource.sync();
                	navigator.notification.alert("Se ha registrado correctamente");
                });
                
            } else {
                offlineChildDataSource.online(false);
                
                var filters = [];
                offlineChildDataSource.filter({});
 				filters = UpdateSearchFilters(filters, "SOSChildID", "eq", $('[name="ChildSOSChildIDView"]').val(), "and");        
                offlineChildDataSource.filter(filters);
                
                offlineChildDataSource.fetch(function() {
                    var entity = offlineChildDataSource.at(0);
                    
                    entity.set("Birthdate",$('[name="ChildBirthdateView"]').val());
                    entity.set("LastName",$('[name="ChildLastNameView"]').val());
                    entity.set("FirstName",$('[name="ChildFirstNameView"]').val());
                    entity.set("Exitdate",$('[name="ChildExitdateView"]').val());
                    entity.set("ExitReason",$('[name="ChildExitReasonView"]').val());
                    entity.set("MotherLastName",$('[name="ChildMotherLastNameView"]').val());
                    entity.set("SOSChildID",$('[name="ChildSOSChildIDView"]').val());
                    entity.set("CaregiverID",$('[name="ChildCaregiverIDView"]').val());
                    
                    entity.set("DocumentNumber",$('[name="ChildDocumentNumberView"]').val());
                    entity.set("Gender",$('[name="ChildGenderView"]').val());
                    entity.set("NativeLanguage",$('[name="ChildNativeLanguageView"]').val());
                    entity.set("OriginPlaceFromParents",$('[name="ChildOriginPlaceFromParentsView"]').val());
                    entity.set("HasChildDevelopmentPlan",$('[name="ChildHasChildDevelopmentPlanView"]').is(":checked"));
                    entity.set("DateOfExpectedUpdate",$('[name="ChildDateOfExpectedUpdateView"]').val());
                    entity.set("DateOfStart",$('[name="ChildDateOfStartView"]').val());
                    entity.set("Nationality",$('[name="ChildNationalityView"]').val());
                    entity.set("GoesToEducationalCenterSOS",$('[name="ChildGoesToEducationalCenterSOSView"]').is(":checked"));
                    entity.set("NonSOSEducationalCenterName",$('[name="ChildNonSOSEducationalCenterNameView"]').val());
                    entity.set("CurrentEnrollment",$('[name="ChildCurrentEnrollmentView"]').is(":checked"));
                    entity.set("CurrentSchoolYear",$('[name="ChildCurrentSchoolYearView"]').val());
                    entity.set("DateOfLastMedicalControl",$('[name="ChildDateOfLastMedicalControlView"]').val());
                    entity.set("Disability",$('[name="ChildDisabilityView"]').is(":checked"));
                    entity.set("NutritionalStatus",$('[name="ChildNutritionalStatusView"]').val());
                    entity.set("HasMedicalCare",$('[name="ChildHasMedicalCareView"]').is(":checked"));
                    entity.set("HasHIV",$('[name="ChildHasHIVView"]').is(":checked"));
                    entity.set("TypeOfVaccination",GetComboBoxItemsAndConvertToJson("ChildTypeOfVaccinationView"));
					entity.set("TypeOfDisease",GetComboBoxItemsAndConvertToJson("ChildTypeOfDiseaseView"));
                    entity.set("ReasonForAdmission",$('[name="ChildReasonForAdmissionView"]').val());
                    entity.set("DetailsForAdmission",$('[name="ChildDetailsForAdmissionView"]').val());
                    entity.set("AdmissionProvidedBy",$('[name="ChildAdmissionProvidedByView"]').val());
                    entity.set("DocumentsForAdmission",GetComboBoxItemsAndConvertToJson("ChildDocumentsForAdmissionView"));
                    entity.set("RecordBeforeAdmission",GetComboBoxItemsAndConvertToJson("ChildRecordBeforeAdmissionView"));
                    entity.set("BiologicalSiblings",GetComboBoxItemsAndConvertToJson("ChildBiologicalSiblingsView"));
                    entity.set("ChildParticipation",GetComboBoxItemsAndConvertToJson("ChildChildParticipationView"));
                    entity.set("HasExitPlan",$('[name="ChildHasExitPlanView"]').is(":checked"));
                    entity.set("TypeOfEmployment",$('[name="ChildTypeOfEmploymentView"]').val());
                    entity.set("DetailsOfEmployment",$('[name="ChildDetailsOfEmploymentView"]').val());
                    entity.set("PsychosocialDevelopment",$('[name="ChildPsychosocialDevelopmentView"]').val());
                    entity.set("ChildAbuseReceived",$('[name="ChildChildAbuseReceivedView"]').is(":checked"));
                    entity.set("PsychosocialSupport",GetComboBoxItemsAndConvertToJson("ChildPsychosocialSupportView"));
                    entity.set("MedicalSupport",GetComboBoxItemsAndConvertToJson("ChildMedicalSupportView"));
                    entity.set("EducationalSupport",GetComboBoxItemsAndConvertToJson("ChildEducationalSupportView"));
                    entity.set("AdditionalSupport",GetComboBoxItemsAndConvertToJson("ChildAdditionalSupportView"));
                    
                    offlineChildDataSource.sync();
                    navigator.notification.alert("Se ha registrado correctamente en modo desconectado");
                });
            }
         },
         departChildSubmit: function(){
             	if (!navigator.onLine) {
                    navigator.notification.alert("Algunas opciones no podrán ser usadas en modo desconectado");
                    return;
                 }
             
             	childDataSource.filter({});
                childDataSource = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "Child"
                    },
    				serverFiltering: true,
    				filter: { field: 'SOSChildID', operator: 'eq', value: $('[name="ChildSOSChildIDView"]').val() }	
    			});    
                
                childDataSource.fetch(function() {
                    var entity = childDataSource.at(0);                    
                    entity.set("Status","0");
                    entity.set("ExitReason",$('[name="ChildExitReasonChild"]').val());
                    entity.set("Exitdate",new Date().toJSON().slice(0,10));
                    childDataSource.sync();
                	navigator.notification.alert("Se ha inactivado al niño correctamente");
                });
         },
         reactivateChildSubmit: function(){
             	if (!navigator.onLine) {
                    navigator.notification.alert("Algunas opciones no podrán ser usadas en modo desconectado");
                    return;
             	}
             
             	childDataSource.filter({});
                childDataSource = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "Child"
                    },
    				serverFiltering: true,
    				filter: { field: 'SOSChildID', operator: 'eq', value: $('[name="ChildSOSChildIDView"]').val() }	
    			});    
                
                childDataSource.fetch(function() {
                    var entity = childDataSource.at(0);                    
                    entity.set("Status","1");
                    entity.set("ReentryReason",$('[name="ChildReentryReasonChild"]').val());
                    entity.set("DateOfReentry",new Date().toJSON().slice(0,10));
                    childDataSource.sync();
                	navigator.notification.alert("Se ha reactivado al niño correctamente");
                });
         },
         initChildTransfer: function(){
             if (!navigator.onLine) {
            	navigator.notification.alert("Algunas opciones no podrán ser usadas en modo desconectado");
                return;
             }
             
             var programa = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "ProgrammeUnit"
                    },
    				serverFiltering: true,
                    serverSorting: true,
      				sort: { field: "Name", dir: "asc" }
    		});               
            
             $("#ChildddlProgramaChildTransfer").kendoDropDownList({
                        dataTextField: "Name",
                        dataValueField: "ProgrammeUnitID",
                        dataSource: programa
             });
             
             $("#ChildddlProgramaChildTransfer").data("kendoDropDownList").bind("dataBound", function(e) {
                this.trigger("change");    			
			 });
             
             $("#ChildddlProgramaChildTransfer").data("kendoDropDownList").bind("change", function(){
                var casa = new kendo.data.DataSource({
                        type: "everlive",
                        transport: {
                            typeName: "House"
                        },
                        serverFiltering: true,
                        serverSorting: true,
                        sort: { field: "NameOrNumber", dir: "asc" },
                        filter: { field: 'ProgrammeUnitID', operator: 'eq', value: $("#ChildddlProgramaChildTransfer").val() }	
                });               

                 $("#ChildddlCasaChildTransfer").kendoDropDownList({
                            dataTextField: "NameOrNumber",
                            dataValueField: "SOSHouseID",
                            dataSource: casa
                 }); 
                 
                 $("#ChildddlCasaChildTransfer").data("kendoDropDownList").bind("dataBound", function(e) {
                    this.trigger("change");    			
                 });
                 
                 $("#ChildddlCasaChildTransfer").data("kendoDropDownList").bind("change", function(){
                    var cuidador = new kendo.data.DataSource({
                            type: "everlive",
                            transport: {
                                typeName: "CareGiver"
                            },
                            serverFiltering: true,
                            serverSorting: true,
                            sort: { field: "LastName", dir: "asc" },
                            filter: { field: 'SOSHouseID', operator: 'eq', value: $("#ChildddlCasaChildTransfer").val() }	
                    });               

                     $("#ChildddlCuidadorChildTransfer").kendoDropDownList({
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
                if (!navigator.onLine) {
                    navigator.notification.alert("Algunas opciones no podrán ser usadas en modo desconectado");
                    return;
                }
             
                if(validateNullValues($("#ChildddlCuidadorChildTransfer").val()) == ""){
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
    				filter: { field: 'SOSChildID', operator: 'eq', value: $('[name="ChildSOSChildIDView"]').val() }	
    			});    
                
                childDataSource.fetch(function() {
                    var entity = childDataSource.at(0);                    
                    entity.set("CaregiverID", $('[name="ChildddlCuidadorChildTransfer"]').val());
                    entity.set("TransferReason",$('[name="ChildTransferReasonChild"]').val());
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
			if(validateNullValues($('[name="FollowSOSChildIDView"]').val()) == "" || validateNullValues($('[name="FollowSOSChildIDView"]').val()).length != 8){
                navigator.notification.alert("El código de niño es obligatorio y ser de 8 caracteres");
				return;
        	}
            
            trackingDataSource.filter({});
            offlineDataSource.filter({});
            
            var filters = [];
            filters = UpdateSearchFilters(filters, "SOSChildID", "eq", $('[name="FollowSOSChildIDView"]').val(), "and");        
             
			var datasource = trackingDataSource;
             
            if (!navigator.onLine) { 
                navigator.notification.alert("Algunas opciones no podrán ser usadas en modo desconectado");
                datasource = offlineDataSource; 
            }          
            
            datasource.filter({});
            datasource.filter(filters);  
            //#if (SOSFollowID == null) {# #=''# #} else {##=SOSFollowID##}#        
            $("#trackViewList").kendoMobileListView({
                dataSource: datasource,                
                template: "Fecha de Inicio: #: kendo.toString(StartDate, 'yyyy/MM/dd' ) #,  Fecha de Fin: #: kendo.toString(EndDate, 'yyyy/MM/dd' ) # <a href='javascript:SwitchTab(\"Follow\",\"View\",\"#: SOSFollowID #\", \"\", \"\", \"#if (SOSChildID == null) {# #=''# #} else {##=SOSChildID##}#\")'>Visualizar</a>",                
                dataBound: function () {
                    if (this.dataSource.total() == 0) 
                        $("#trackViewList").html('<li>No hay resultados.</li>');
                }
            });
        },
        searchChildByFilters: function () {

			$('[name="FollowchildID"]').attr('readonly', true);

            if (!navigator.onLine) {
                    navigator.notification.alert("No hay conexion a Internet. Ingresará el código de niño manualmente");
					SwitchTab("Follow","Add","", "", "","");
					$('[name="FollowchildID"]').removeAttr('readonly');	
                    return;
            }
            
            childDataSource.filter({});
            offlineChildDataSource.filter({});
            
            var filters = [];
            var datasource = childDataSource;
             
            if (!navigator.onLine) { datasource = offlineChildDataSource; }          
            
            //Implementing for filtering by textbox values (missing the motherlastname)
            //http://www.telerik.com/forums/multiple-filters-on-datasource
            
            var opt1 = validateNullValues($('[name="FollowfirstNameSearch"]').val());
            var opt2 = validateNullValues($('[name="FollowlastNameSearch"]').val());
            var opt3 = validateNullValues($('[name="FollowmotherNameSearch"]').val());
            
            datasource.filter([
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
                dataSource: datasource,
                template: "#: LastName #, #: FirstName # <a href='javascript:SwitchTab(\"Follow\",\"Add\",\"\", \"#if (FirstName == null) {# #=''# #} else {# #=FirstName# #}#\", \"#if (LastName == null) {# #=''# #} else {# #=LastName# #}#\",\"#if (SOSChildID == null) {# #=''# #} else {# #=SOSChildID# #}#\")'>Seguir</a>",                
                dataBound: function () {
                    if (this.dataSource.total() == 0) 
                        $("#trackAddList").html('<li>No hay resultados.</li>');
                }
            });            
        },
        addTrackingSubmit: function () {
			
			if(validateNullValues($('[name="FollowchildID"]').val()) == "" || validateNullValues($('[name="FollowchildID"]').val()).length != 8){
                navigator.notification.alert("El código de niño es obligatorio y ser de 8 caracteres");
                return;
        	}
            
            if(validateNullValues($('[name="FollowstartDate"]').val()) == ""){
                navigator.notification.alert("Fecha de inicio es obligatorio");
                return;
        	}
                        
            if(validateNullValues($('[name="FollowendDate"]').val()) == ""){
                navigator.notification.alert("Fecha de fin es obligatorio");
                return;
        	}
            
            if(validateNullValues($('[name="FollowEnoughWorkIncome"]').val()) == ""){
                navigator.notification.alert("Es ingreso suficiente de trabajo es obligatorio");
                return;
        	}
            
            if(validateNullValues($('[name="FollowMaritalStatus"]').val()) == ""){
                navigator.notification.alert("El estado civil es obligatorio");
                return;
        	}
            
            if(validateNullValues($('[name="FollowSatisfactionInProfessionalDev"]').val()) == ""){
                navigator.notification.alert("La satisfacción de desarrollo profesional es obligatorio");
                return;
        	}
            
            if(validateNullValues($('[name="FollowWorkCondition"]').val()) == ""){
                navigator.notification.alert("La condición de trabajo es obligatorio");
                return;
        	}
            
            if(!compareDates($('[name="FollowstartDate"]').val(), $('[name="FollowendDate"]').val()))
            {
                navigator.notification.alert("La fecha de inicio debe ser menor a la fecha de fin");
                return;  
            }
                        
            if (navigator.onLine) 
            {
                trackingDataSource.add({
                    SOSFollowID: "F" + randomIntFromInterval(1000000,9999999),
                    SOSChildID: $('[name="FollowchildID"]').val(),
                    StartDate: $('[name="FollowstartDate"]').val(),
                    EndDate: $('[name="FollowendDate"]').val(),
                    Phone: $('[name="Followphone"]').val(),
                    EmailAddress: $('[name="Followemail"]').val(),
                    AgeWhenFirstChild: $('[name="FollowageWhenHasFirstChild"]').val(),
                    ChildrenNumber: $('[name="FollowchildrenNumber"]').val(),
                    LegalGuardian: $('[name="FollowlegalGuardian"]').val(),
                    SiblingsOutsideSOS: $('[name="FollowsiblingsOutsideSOS"]').val(),
                    HomeType: $('[name="FollowhostageType"]').val(),
                    HomePlace: $('[name="FollowhomePlace"]').val(),
                    HomeComments: $('[name="FollowhostageComments"]').val(),
                    HomeImprovementsComments: $('[name="FollowhostageImproveComments"]').val(),
                    HomeEducationCenterNoSOS: $('[name="FolloweducationalCenterNoSOS"]').val(),
                    CurrentSchoolLevel: $('[name="FollowcurrentEnrollment"]').val(),
                    EducationCurrentEnrollment: $('[name="FolloweducationCurrentEnrollment"]').val(),
                    EducationStudyStart: $('[name="FolloweducationStudyStart"]').val(),
                    EducationSpecialityName: $('[name="FollowspecialityName"]').val(),
                    EducationSpecialitySemester: $('[name="FollowspecialitySemester"]').val(),
                    WorkIncomeType: $('[name="FollowsourceOfIncome"]').val(),
                    WorkType: $('[name="FollowtypeOfEmployment"]').val(),
                    WorkCurrency: $('[name="FollowworkCurrency"]').val(),
                    WorkSpeacialityRelated: $('[name="FollowworkRelatedWithSpeciality"]').val(),
                    WorkSector: $('[name="FollowareaOfWork"]').val(),
                    WorkMonthsContinuity: $('[name="FollowcontinueWorkinMonths"]').val(),
                    WorkMonthlyIncome: $('[name="FollowincomeMonthly"]').val(),
                    WorkMonthsUnemployed: $('[name="FollowmonthsUnemployee"]').val(),
                    HealthHasDisabilities: $('[name="FollowhasDisability"]').is(":checked"),
                    HealthHowDisabilityAffects: $('[name="FollowaffectsInDailyLife"]').val(),
                    HealthDisabilityComments: $('[name="FollowcommentsAboutHandicap"]').val(),
                    MaritalStatus:$('[name="FollowMaritalStatus"]').val(),
                    SatisfactionInProfessionalDev:$('[name="FollowSatisfactionInProfessionalDev"]').val(),
                    WorkCondition:$('[name="FollowWorkCondition"]').val(),
                    EnoughWorkIncome:$('[name="FollowEnoughWorkIncome"]').val()
                });
                trackingDataSource.sync();
                navigator.notification.alert("Se ha registrado correctamente");

            } else {
                offlineDataSource.online(false);

                offlineDataSource.add({
                    SOSFollowID: "F" + randomIntFromInterval(1000000,9999999),
                    SOSChildID: $('[name="FollowchildID"]').val(),
                    StartDate: $('[name="FollowstartDate"]').val(),
                    EndDate: $('[name="FollowendDate"]').val(),
                    Phone: $('[name="Followphone"]').val(),
                    EmailAddress: $('[name="Followemail"]').val(),
                    AgeWhenFirstChild: $('[name="FollowageWhenHasFirstChild"]').val(),
                    ChildrenNumber: $('[name="FollowchildrenNumber"]').val(),
                    LegalGuardian: $('[name="FollowlegalGuardian"]').val(),
                    SiblingsOutsideSOS: $('[name="FollowsiblingsOutsideSOS"]').val(),
                    HomeType: $('[name="FollowhostageType"]').val(),
                    HomePlace: $('[name="FollowhomePlace"]').val(),
                    HomeComments: $('[name="FollowhostageComments"]').val(),
                    HomeImprovementsComments: $('[name="FollowhostageImproveComments"]').val(),
                    HomeEducationCenterNoSOS: $('[name="FolloweducationalCenterNoSOS"]').val(),
                    CurrentSchoolLevel: $('[name="FollowcurrentEnrollment"]').val(),
                    EducationCurrentEnrollment: $('[name="FolloweducationCurrentEnrollment"]').val(),
                    EducationStudyStart: $('[name="FolloweducationStudyStart"]').val(),
                    EducationSpecialityName: $('[name="FollowspecialityName"]').val(),
                    EducationSpecialitySemester: $('[name="FollowspecialitySemester"]').val(),
                    WorkIncomeType: $('[name="FollowsourceOfIncome"]').val(),
                    WorkType: $('[name="FollowtypeOfEmployment"]').val(),
                    WorkCurrency: $('[name="FollowworkCurrency"]').val(),
                    WorkSpeacialityRelated: $('[name="FollowworkRelatedWithSpeciality"]').val(),
                    WorkSector: $('[name="FollowareaOfWork"]').val(),
                    WorkMonthsContinuity: $('[name="FollowcontinueWorkinMonths"]').val(),
                    WorkMonthlyIncome: $('[name="FollowincomeMonthly"]').val(),
                    WorkMonthsUnemployed: $('[name="FollowmonthsUnemployee"]').val(),
                    HealthHasDisabilities: $('[name="FollowhasDisability"]').is(":checked"),
                    HealthHowDisabilityAffects: $('[name="FollowaffectsInDailyLife"]').val(),
                    HealthDisabilityComments: $('[name="FollowcommentsAboutHandicap"]').val(),
                    MaritalStatus:$('[name="FollowMaritalStatus"]').val(),
                    SatisfactionInProfessionalDev:$('[name="FollowSatisfactionInProfessionalDev"]').val(),
                    WorkCondition:$('[name="FollowWorkCondition"]').val(),
                    EnoughWorkIncome:$('[name="FollowEnoughWorkIncome"]').val()
                });
                offlineDataSource.sync();
                navigator.notification.alert("Se ha registrado correctamente en modo desconectado");
            }
        },
        getTrackingByID: function (e) {
            var followID = e.view.params.id;
            
            if(followID == null)
                return;
            
            offlineDataSource.filter({});
            trackingDataSource.filter({});
            
            var filters = [];
            //filters = UpdateSearchFilters(filters, "SOSFollowID", "eq", "20480167", "and");        
            filters = UpdateSearchFilters(filters, "SOSFollowID", "eq", "F0480167", "and");        
             
			var datasource = trackingDataSource;
            var childID = "";
            if (!navigator.onLine) { 
                datasource = offlineDataSource; 
                navigator.notification.alert("Se realizará la búsqueda desconectada");
            }          
            
            datasource.filter({});
            datasource.filter(filters);  
                        
            datasource.fetch(function() {
  				var child = datasource.at(0);
                childID = child.get("SOSChildID");
                $('[name="FollowSOSFollowIDView"]').val(child.get("SOSFollowID"));
  				$('[name="FollowchildIDView"]').val(child.get("SOSChildID"));
                $('[name="FollowstartDateView"]').val(kendo.toString(child.get("StartDate"), "yyyy-MM-dd"));
                $('[name="FollowendDateView"]').val(kendo.toString(child.get("EndDate"), "yyyy-MM-dd"));
                
                $('[name="FollowphoneView"]').val(child.get("Phone"));
                $('[name="FollowemailView"]').val(child.get("EmailAddress"));
                $('[name="FollowageWhenHasFirstChildView"]').val(child.get("AgeWhenFirstChild"));
                $('[name="FollowchildrenNumberView"]').val(child.get("ChildrenNumber"));
                $('[name="FollowlegalGuardianView"]').val(child.get("LegalGuardian"));
                
                $('[name="FollowsiblingsOutsideSOSView"]').val(child.get("SiblingsOutsideSOS"));
                $('[name="FollowhostageTypeView"]').val(child.get("HomeType"));
                $('[name="FollowhomePlaceView"]').val(child.get("HomePlace"));
                $('[name="FollowhostageCommentsView"]').val(child.get("HomeComments"));
                $('[name="FollowhostageImproveCommentsView"]').val(child.get("HomeImprovementsComments"));
                $('[name="FolloweducationalCenterNoSOSView"]').val(child.get("HomeEducationCenterNoSOS"));
                
                $('[name="FollowcurrentEnrollmentView"]').val(child.get("CurrentSchoolLevel"));
                $('[name="FolloweducationCurrentEnrollmentView"]').val(child.get("EducationCurrentEnrollment"));
                $('[name="FolloweducationStudyStartView"]').val(kendo.toString(child.get("EducationStudyStart"), "yyyy-MM-dd"));
                $('[name="FollowspecialityNameView"]').val(child.get("EducationSpecialityName"));
                $('[name="FollowspecialitySemesterView"]').val(child.get("EducationSpecialitySemester"));
                $('[name="FollowsourceOfIncomeView"]').val(child.get("WorkIncomeType"));
                
                $('[name="FollowtypeOfEmploymentView"]').val(child.get("WorkType"));
                $('[name="FollowworkCurrencyView"]').val(child.get("WorkCurrency"));
                $('[name="FollowworkRelatedWithSpecialityView"]').val(child.get("WorkSpeacialityRelated"));
                $('[name="FollowareaOfWorkView"]').val(child.get("WorkSector"));
                $('[name="FollowcontinueWorkinMonthsView"]').val(child.get("WorkMonthsContinuity"));
                $('[name="FollowincomeMonthlyView"]').val(child.get("WorkMonthlyIncome"));
                
                $('[name="FollowmonthsUnemployeeView"]').val(child.get("WorkMonthsUnemployed"));
                if(child.get("HealthHasDisabilities") == true) $('[name="FollowhasDisability"]').attr('checked', true);
                $('[name="FollowaffectsInDailyLifeView"]').val(child.get("HealthHowDisabilityAffects"));
                $('[name="FollowcommentsAboutHandicapView"]').val(child.get("HealthDisabilityComments"));  
                
                $('[name="FollowMaritalStatusView"]').val(child.get("MaritalStatus"));
                $('[name="FollowSatisfactionInProfessionalDevView"]').val(child.get("SatisfactionInProfessionalDev"));
                $('[name="FollowWorkConditionView"]').val(child.get("WorkCondition"));
                $('[name="FollowEnoughWorkIncomeView"]').val(child.get("EnoughWorkIncome"));

                if(childID != "")
                {
                    childDataSource.filter({});
                    offlineChildDataSource.filter({});

                    filters = [];
                    filters = UpdateSearchFilters(filters, "SOSChildID", "eq", childID, "and");        

                    var datasourceCh = childDataSource;

                    if (!navigator.onLine) { datasourceCh = offlineChildDataSource; }          

                    datasourceCh.filter({});
                    datasourceCh.filter(filters);  

                    datasourceCh.fetch(function() 
                    {
                        var child = datasourceCh.at(0);
                        $('[name="FollowchildIDView"]').val(child.get("SOSChildID"));
                        $('[name="FollowfirstNameView"]').val(child.get("FirstName"));
                        $('[name="FollowsurNameView"]').val(child.get("LastName"));
                    });    
                }
			});
        }
    });

    window.APP.models.synchro = kendo.observable({
        init: function () { 
			$("#FollowlistView").html("");
            $("#FollowlistViewChild").html("");
            $("#FollowlistViewCaregiver").html("");
            $("#FollowlistViewHouse").html("");
            
            if (navigator.onLine) {

                var sLocalStorage = localStorage.getItem("tracking-offline");
                var jLocalStorage = JSON.parse(sLocalStorage);
				
                var localStorageDataSource = new kendo.data.DataSource({
                    data: jLocalStorage
                });

                $("#FollowlistView").kendoMobileListView({
                    dataSource: localStorageDataSource,
                    template: "Seguimiento: #: StartDate # - #: EndDate # - #: SOSChildID #"
                });
                
                sLocalStorage = localStorage.getItem("house-offline");
                jLocalStorage = JSON.parse(sLocalStorage);

                localStorageDataSource = new kendo.data.DataSource({
                    data: jLocalStorage
                });

                $("#FollowlistViewHouse").kendoMobileListView({
                    dataSource: localStorageDataSource,
                    template: "Hogar: #: NameOrNumber # - #: Address # - #: SOSHouseID #"
                });
                
                sLocalStorage = localStorage.getItem("caregiver-offline");
                jLocalStorage = JSON.parse(sLocalStorage);

                localStorageDataSource = new kendo.data.DataSource({
                    data: jLocalStorage
                });

                $("#FollowlistViewCaregiver").kendoMobileListView({
                    dataSource: localStorageDataSource,
                    template: "Cuidador: #: FirstName # - #: LastName # - #: CaregiverID #"
                });
                
                sLocalStorage = localStorage.getItem("child-offline");
                jLocalStorage = JSON.parse(sLocalStorage);

                localStorageDataSource = new kendo.data.DataSource({
                    data: jLocalStorage
                });

                $("#FollowlistViewChild").kendoMobileListView({
                    dataSource: localStorageDataSource,
                    template: "Niño: #: FirstName # - #: LastName # - #: SOSChildID #"
                });
            }
            else 
            {
                navigator.notification.alert("No se ha detectado una conexion activa a internet");
            }
        },
        submitFollow: function () { 
			if (navigator.onLine) {

                var sLocalStorage = localStorage.getItem("tracking-offline");
                var jLocalStorage = JSON.parse(sLocalStorage);

                var localStorageDataSource = new kendo.data.DataSource({
                    data: jLocalStorage
                });

                $("#FollowlistView").kendoMobileListView({
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
                $("#FollowlistView").html("");
                navigator.notification.alert("Sincronizacion finalizada de Seguimiento!!!");
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

                $("#FollowlistViewHouse").kendoMobileListView({
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
	            $("#FollowlistViewHouse").html("");
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

                $("#FollowlistViewCaregiver").kendoMobileListView({
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
				
            	$("#FollowlistViewCaregiver").html("");
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

                $("#FollowlistViewChild").kendoMobileListView({
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

            	$("#FollowlistViewChild").html("");
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