var app; // store a reference to the application object that will be created  later on so that we can use it if need be

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
    	tabStrip.switchTo("#General" + type);
    	app.navigate("#General" + type + "?id=" + SOSHouseID, "slide");    	
    
    	$('[name="houseID"]').val(SOSHouseID);
        $('[name="houseName"]').val(name);
        $('[name="address"]').val(address);    	    
    	$('[name="programmeUnitID"]').val(programmeUnitID);    	        	
            
    	$('[name="btnBack' + type + 'House"]').show();
    	$('[name="btnSave' + type + 'House"]').show();
}


function redirect(val){
    app.navigate("views/ViewTracking.html?id=" + val, "slide");    
}
    