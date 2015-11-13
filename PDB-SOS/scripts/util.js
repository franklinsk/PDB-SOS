function validateNullValues(variable){
	if (variable === undefined || variable === null) {
    	return "";
	}
    return variable;
}

function switchTab(tabID, tabName, val, firstName, lastName){
    	var tabStrip = $("#" + tabID).data("kendoMobileTabStrip");
        tabStrip.switchTo("#" +tabName);
    	app.navigate("#" + tabName + "?id=" + val, "slide");
		
    	//fails when try to filter by GUID, best option would be number or string
        $('[name="childID"]').val(val);
        $('[name="firstName"]').val(firstName);
        $('[name="surName"]').val(lastName);
    	
    	$('[name="btnBackAddTracking"]').show();
    	$('[name="btnSaveAddTracking"]').show();
}

function redirect(view, val){
    app.navigate("views/" + view + ".html?id=" + val, "slide");    
}