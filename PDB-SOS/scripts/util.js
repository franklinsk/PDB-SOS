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

function redirect(val){
    app.navigate("views/ViewTracking.html?id=" + val, "slide");    
}
    