var app; // store a reference to the application object that will be created  later on so that we can use it if need be

function GetComboBoxItemsAndConvertToJson(type) {
    var details = [];
           
	$("#" + type + "Values option").each(function(){
			var item = $(this);
            details.push({ "value" : item.val(), "text"  : item.text() });
    });
           
    return JSON.stringify(details);    
}

function SetComboBoxItemsAndConvertJsonToArray(myJsonString, type){
    var array = JSON.parse(myJsonString);
	$("#" + type + "Values").html("");
	$.each(array, function(text,value) {
    	$("#" + type + "Values").append($("<option></option>").attr("value",value.value).text(value.text));               
	});              
}

function UpdateSearchFilters(filters, field, operator, value, logic) {
        var newFilter = { field: field, operator: operator, value: value };
 
        if (filters.length == 0) {
            filters.push(newFilter);
        }
        else {
            var isNew = true;
            var index = 0;
 
            for (index = 0; index < filters.length; index++) {
                if (filters[index].field == field && filters[index].operator == operator) {
                    isNew = false;
                    break;
                }
            }
 
            if (isNew) {
                filters.push(newFilter);
            }
            else {
                filters[index] = newFilter;
            }
        }
 
        return filters;
}

function validateNullValues(variable){
	if (variable === undefined || variable === null) {
    	return "";
	}
    return variable;
}

function switchTab(type, childID, firstName, lastName){    	
		var tabStrip = $("#tabstrip" + type + "FollowUp").data("kendoMobileTabStrip");
    	//fails when try to filter by GUID, best option would be number or string        
    	tabStrip.switchTo("#General" + type);
    	app.navigate("#General" + type + "?id=" + childID, "slide");    	
    
    	$('[name="childID"]').val(childID);
        $('[name="firstName"]').val(firstName);
        $('[name="surName"]').val(lastName);
    	
    	$('[name="btnBack' + type + 'Tracking"]').show();
    	$('[name="btnSave' + type + 'Tracking"]').show();
}

function newSwitchTab(type, SOSHouseID, address, name, programmeUnitID){    	
		var tabStrip = $("#tabstrip" + type + "House").data("kendoMobileTabStrip");
    	//fails when try to filter by GUID, best option would be number or string        
    	tabStrip.switchTo("#GeneralHouse" + type);
    	app.navigate("#GeneralHouse" + type + "?id=" + SOSHouseID, "slide");    	
    
    	var sufix = "View";
    
    	if(type=="Add")
            sufix="";
    
    	$('[name="SOSHouseID' + sufix + '"]').val(SOSHouseID);
        $('[name="NameOrNumber' + sufix + '"]').val(name);
        $('[name="Address' + sufix + '"]').val(address);    	    
    	$('[name="ProgrammeUnitID' + sufix + '"]').val(programmeUnitID);    	        	
            
    	$('[name="btnBack' + type + 'House"]').show();
    	$('[name="btnSave' + type + 'House"]').show();
}

function newSwitchCaregiverTab(type, ID, name, surname, houseID){    	
		var tabStrip = $("#tabstrip" + type + "Caregiver").data("kendoMobileTabStrip");
    	//fails when try to filter by GUID, best option would be number or string        
    	tabStrip.switchTo("#GeneralCaregiver" + type);
    	app.navigate("#GeneralCaregiver" + type + "?id=" + ID, "slide");    	
    
    	var sufix = "View";
    
    	if(type=="Add")
            sufix="";
    
    	$('[name="SOSHouseID' + sufix + '"]').val(houseID);
        $('[name="FirstName' + sufix + '"]').val(name);
        $('[name="LastName' + sufix + '"]').val(surname);    	    
    	$('[name="CaregiverID' + sufix + '"]').val(ID);    	        	
            
    	$('[name="btnBack' + type + 'Caregiver"]').show();
    	$('[name="btnSave' + type + 'Caregiver"]').show();
}

function optCaregiverTab(type, ID){    	
		var tabStrip = $("#tabstripViewCaregiver").data("kendoMobileTabStrip");
    	
    	tabStrip.switchTo("#Caregiver" + type);
    	app.navigate("#Caregiver" + type + "?id=" + ID, "slide");    	
    
    	$('[name="btnDepartCaregiver"]').hide();
        $('[name="btnReactivateCaregiver"]').hide();
        $('[name="btnTransferCaregiver"]').hide();    
        $('[name="btnBackViewCaregiver"]').show();
        $('[name="btnSaveViewCaregiver"]').hide();
    
        $('[name="btn' + type + 'Caregiver"]').show();    
    	$('[name="CaregiverIDView"]').val(ID);    	        	
}

function optEntityTab(entity, type, ID){    	
		var tabStrip = $("#tabstripView" + entity).data("kendoMobileTabStrip");
    	
    	tabStrip.switchTo("#" + entity + type);
    	app.navigate("#" + entity + type + "?id=" + ID, "slide");    	
    
    	$('[name="btnDepart' + entity + '"]').hide();
        $('[name="btnReactivate' + entity + '"]').hide();
    
    	if(entity != "House")
        	$('[name="btnTransfer' + entity + '"]').hide();    
    
        $('[name="btnBackView' + entity + '"]').show();
        $('[name="btnSaveView' + entity + '"]').hide();
    
        $('[name="btn' + type + entity + '"]').show();   
    
    	var prefixSOS = "SOS";
    	if(entity=="Caregiver")
            prefixSOS = "";
    
    	$('[name="' + prefixSOS + entity + 'IDView"]').val(ID);    	        	
}


function newSwitchChildTab(type, ID, name, surname, caregiverID){    	
		var tabStrip = $("#tabstrip" + type + "Child").data("kendoMobileTabStrip");
    	//fails when try to filter by GUID, best option would be number or string        
    	tabStrip.switchTo("#GeneralChild" + type);
    	app.navigate("#GeneralChild" + type + "?id=" + ID, "slide");    	
    
    	var sufix = "View";
    
    	if(type=="Add")
            sufix="";
    
    	$('[name="SOSChildID' + sufix + '"]').val(ID);
        $('[name="FirstName' + sufix + '"]').val(name);
        $('[name="LastName' + sufix + '"]').val(surname);    	    
    	$('[name="CaregiverID' + sufix + '"]').val(caregiverID);    	        	
            
    	$('[name="btnBack' + type + 'Child"]').show();
    	$('[name="btnSave' + type + 'Child"]').show();
}

function redirect(val){
    app.navigate("views/ViewTracking.html?id=" + val, "slide");    
}
    