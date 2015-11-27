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
    if(myJsonString.trim() == "")
        return;
    
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

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

function hideTabControls(entity, action){
    //alert("hideTabControls");
    $("#tabstrip" + action + entity).hide();
    $('[name="btnBack' + action + entity + '"]').hide();
    $('[name="btnSave' + action + entity + '"]').hide();
    $('[name="btnDepart' + entity + '"]').hide();
    $('[name="btnReactivate' + entity + '"]').hide();
    
    if(entity != "House")
    	$('[name="btnTransfer' + entity + '"]').hide();    
    
}

function optEntityTab(entity, type, ID){    	
    	//alert("optEntityTab");
		var tabStrip = $("#tabstripView" + entity).data("kendoMobileTabStrip");
    	$("#tabstripView" + entity).show();
    
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

function SwitchTab(entity, type, ID, name, surname, parentID){    	
    	//alert("SwitchTab");
    	var tabStrip = $("#tabstrip" + type + entity).data("kendoMobileTabStrip");
    	$("#tabstrip" + type + entity).show();
    	//fails when try to filter by GUID, best option would be number or string        
    	tabStrip.switchTo("#General" + entity + type);
    	app.navigate("#General" + entity + type + "?id=" + ID, "slide");    	
    
    	var sufix = "View";
    
    	if(type=="Add")
            sufix="";    
    	
    	if(entity == "Follow")
        {
    		$('[name="childID"]').val(parentID);
        	$('[name="firstName"]').val(name);
        	$('[name="surName"]').val(surname);
    	}
    
    	if(entity == "Child")
        {
            $('[name="SOSChildID' + sufix + '"]').val(ID);
            $('[name="FirstName' + sufix + '"]').val(name);
            $('[name="LastName' + sufix + '"]').val(surname);    	    
            $('[name="CaregiverID' + sufix + '"]').val(parentID);    	        	
        }
    
    	if(entity == "Caregiver")
        {
            $('[name="CaregiverID' + sufix + '"]').val(ID);             
            $('[name="FirstName' + sufix + '"]').val(name);
            $('[name="LastName' + sufix + '"]').val(surname);    	                
            $('[name="SOSHouseID' + sufix + '"]').val(parentID);
        }
    
    	if(entity == "House")
        {
            $('[name="SOSHouseID' + sufix + '"]').val(ID);
            $('[name="Address' + sufix + '"]').val(name);    	    
            $('[name="NameOrNumber' + sufix + '"]').val(surname);
            $('[name="ProgrammeUnitID' + sufix + '"]').val(parentID);    	        	
        }
    
    	$('[name="btnBack' + type + entity + '"]').show();
    	$('[name="btnSave' + type + entity + '"]').show();    	
}

function redirect(val){
    app.navigate("views/ViewTracking.html?id=" + val, "slide");    
}
    