var tracking;
var child;
var caregiver;
var house;
var programmeunit;

var programmeunitValues = [];
var houseValues = [];
var caregiverValues = [];
var childValues = [];

function initDatasourcesForReports()
{
    if (!navigator.onLine) { 
    	navigator.notification.alert("Algunas opciones no podrán ser usadas en modo desconectado");
        return;
    }          
    
    tracking = new kendo.data.DataSource({
        type: "everlive",
        transport: {
            typeName: "ChildTracking"
        },
		serverFiltering: true        
    });
       
    child = new kendo.data.DataSource({
        type: "everlive",
        transport: {
            typeName: "Child"
        },
		serverFiltering: true        
    });
    
    caregiver = new kendo.data.DataSource({
        type: "everlive",
        transport: {
            typeName: "CareGiver"
        },
		serverFiltering: true        
    });
    
    house = new kendo.data.DataSource({
        type: "everlive",
        transport: {
            typeName: "House"
        },
		serverFiltering: true        
    });
    
    programmeunit = new kendo.data.DataSource({
        type: "everlive",
        transport: {
            typeName: "ProgrammeUnit"
        },
		serverFiltering: true        
    });
    
    arraysOrgUnit();    
}

function arraysOrgUnit(){
    programmeunit.filter({});
    programmeunit.fetch(function() {
        programmeunitValues = [];        
  		var len = programmeunit.total();                
        for (var i = 0; i < len; i++) {
            var entity = programmeunit.at(i);
            programmeunitValues.push({
                ID: entity.get("ProgrammeUnitID"),
                Name: entity.get("Name")
            });
		}  	
    });
    
    house.filter({});
    house.fetch(function() {
        houseValues = [];        
  		var len = house.total();                
        for (var i = 0; i < len; i++) {
            var entity = house.at(i);
            houseValues.push({
                parentID: entity.get("ProgrammeUnitID"),
                Name: entity.get("NameOrNumber"),
                ID: entity.get("SOSHouseID")
            });
		}  	
    });
    
    caregiver.filter({});
    caregiver.fetch(function() {
        caregiverValues = [];        
  		var len = caregiver.total();                
        for (var i = 0; i < len; i++) {
            var entity = caregiver.at(i);
            caregiverValues.push({
                parentID: entity.get("SOSHouseID"),
                Name: entity.get("FirstName") + " " + entity.get("LastName"),
                ID: entity.get("CaregiverID")
            });
		}  	
    });
    
    child.filter({});
    child.fetch(function() {
        childValues = [];        
  		var len = child.total();                
        for (var i = 0; i < len; i++) {
            var entity = child.at(i);
            childValues.push({
                parentID: entity.get("CaregiverID"),
                Name: entity.get("FirstName") + " " + entity.get("LastName"),
                ID: entity.get("SOSChildID"),
                Gender: entity.get("Gender"),
                DateOfBirth: kendo.toString(entity.get("Birthdate"), "yyyy-MM-dd")
            });
		}  	                
    });
}

function searchCodeInArray(entityArray, ID, type)
{
    if(ID == "")
        return "";
    
    var parentID = "";
    for (var i=0; i<entityArray.length; i++) 
    {
        if (entityArray[i].ID == ID)
        {
            if(type == "")
            	parentID = entityArray[i].parentID;
            else
                parentID = entityArray[i].Name;                
            break;
        }
  	}
    return parentID;
}   

function searchGenderInArray(entityArray, ID)
{
    if(ID == "")
        return "";
    
    var GenderName = "";
    for (var i=0; i<entityArray.length; i++) 
    {
        if (entityArray[i].ID == ID)
        {
            GenderName = entityArray[i].Gender;               
            break;
        }
  	}
    
    if(GenderName == "1")
        GenderName = "Masculino";
    if(GenderName == "2")    
        GenderName = "Femenino";
    
    return GenderName;
}

function searchDateOfBirthInArray(entityArray, ID)
{
    if(ID == "")
        return "";
    
    var DateOfBirth = "";
    for (var i=0; i<entityArray.length; i++) 
    {
        if (entityArray[i].ID == ID)
        {
            DateOfBirth = entityArray[i].DateOfBirth;               
            break;
        }
  	}
    
    return DateOfBirth;
}

function searchProgrammeUnitNameBySOSChildID(SOSChildID){
    var caregiverID = searchCodeInArray(childValues, SOSChildID, "");    
    var houseID = searchCodeInArray(caregiverValues, caregiverID, "");
    var programmeunitID = searchCodeInArray(houseValues, houseID, "");
    var programmeunitName = searchCodeInArray(programmeunitValues, programmeunitID, "Name");    
    
    return programmeunitName;
}

function searchHouseNameBySOSChildID(SOSChildID){
    var caregiverID = searchCodeInArray(childValues, SOSChildID, "");    
    var houseID = searchCodeInArray(caregiverValues, caregiverID, "");
    var houseName = searchCodeInArray(houseValues, houseID, "Name");
    
    return houseName;
}

function getDateOfBirthBySOSChildID(SOSChildID){
    var dateofbirth = searchDateOfBirthInArray(childValues, SOSChildID);        
    return dateofbirth;
}

function getGenderBySOSChildID(SOSChildID){
    var genderName = searchGenderInArray(childValues, SOSChildID);        
    return genderName;
}

function checkDate(DateOfBirth, typeConsolidated)
{
    //typeConsolidated: 1 (less than), 2 (more than)
    //trackingArrayValues[i].DateOfBirth, typeConsolidated
    if(typeConsolidated == "1")
    {
    	if(getAge(DateOfBirth) <18)        
            return true;
        else
            return false;
    }
    
    if(typeConsolidated == "2")
    {
    	if(getAge(DateOfBirth) >= 18)        
            return true;
        else
            return false;
    }    
}

function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

function countRecordsSatisfaction(trackingArrayValues, ProgrammeUnitName, satisfactionValue){
    var valueSatisfaction = 0;     
    var totalValueSatisfaction = 0;     
    
    for (var i=0; i<trackingArrayValues.length; i++) 
    {
    	if (trackingArrayValues[i].ProgrammeUnitName == ProgrammeUnitName)
            totalValueSatisfaction = totalValueSatisfaction + 1;
        
    	if (trackingArrayValues[i].ProgrammeUnitName == ProgrammeUnitName && trackingArrayValues[i].Satisfaction == satisfactionValue)
            valueSatisfaction = valueSatisfaction + 1;            
    }
    
    if(totalValueSatisfaction == 0)
        return totalValueSatisfaction;
    else
     	return valueSatisfaction/totalValueSatisfaction;       
}

function countRecordsEnoughWork(trackingArrayValues, ProgrammeUnitName, enoughWorkValue, genderType){
    var valueEnoughWorkValue = 0;     
    var totalValueEnoughWorkValue = 0;     
    
    for (var i=0; i<trackingArrayValues.length; i++) 
    {
    	if (trackingArrayValues[i].ProgrammeUnitName == ProgrammeUnitName && trackingArrayValues[i].Gender == genderType)
            totalValueEnoughWorkValue = totalValueEnoughWorkValue + 1;
        
    	if (trackingArrayValues[i].ProgrammeUnitName == ProgrammeUnitName && trackingArrayValues[i].Gender == genderType && trackingArrayValues[i].EnoughWork == enoughWorkValue)
            valueEnoughWorkValue = valueEnoughWorkValue + 1;            
    }
    
    if(totalValueEnoughWorkValue == 0)
        return totalValueEnoughWorkValue;
    else
     	return valueEnoughWorkValue/totalValueEnoughWorkValue;       
}

//(arrChildTrackingValues, houseValues[i].Name, 1, 1)
function countRecordsConsolidated(trackingArrayValues, HouseName, typeConsolidated, gender){
    //typeConsolidated: 1 (less than), 2 (more than)
    //gender: 1 male 2 female 3 total
    
    var valueConsolidated = 0;     
    var totalValueConsolidated = 0;     
    
    for (var i=0; i<trackingArrayValues.length; i++) 
    {
    	if (trackingArrayValues[i].HouseName == HouseName && checkDate(trackingArrayValues[i].DateOfBirth, typeConsolidated) == true)
            totalValueConsolidated = totalValueConsolidated + 1;
        
        if(gender == "1")
        	if (trackingArrayValues[i].HouseName == HouseName && trackingArrayValues[i].Gender == "Masculino" && checkDate(trackingArrayValues[i].DateOfBirth, typeConsolidated) == true)
            	valueConsolidated = valueConsolidated + 1;                    
        
        if(gender == "2")
        	if (trackingArrayValues[i].HouseName == HouseName && trackingArrayValues[i].Gender == "Femenino" && checkDate(trackingArrayValues[i].DateOfBirth, typeConsolidated) == true)
            	valueConsolidated = valueConsolidated + 1;                    
        
        if(gender == "3")
        	valueConsolidated = totalValueConsolidated;
    }
    
    if(totalValueConsolidated == 0)
        return totalValueConsolidated;
    else
     	return valueConsolidated/totalValueConsolidated;       
}

//PDF Export
//http://www.telerik.com/forums/kendo-mobile-export-to-pdf
function onGridViewShowMaritalStatus(){   
    if (!navigator.onLine) { 
    	navigator.notification.alert("Algunas opciones no podrán ser usadas en modo desconectado");
        return;
    }          
    
    generateMaritalStatusReport();
}

function onGridViewShowSatisfaction(){   
    if (!navigator.onLine) { 
    	navigator.notification.alert("Algunas opciones no podrán ser usadas en modo desconectado");
        return;
    }          
    
    generateSatisfactionReport();
}

function onGridViewShowWorkCondition(){   
    if (!navigator.onLine) { 
    	navigator.notification.alert("Algunas opciones no podrán ser usadas en modo desconectado");
        return;
    }          
    
    generateWorkConditionReport();
}

function onGridViewShowEnoughMoney(){   
    if (!navigator.onLine) { 
    	navigator.notification.alert("Algunas opciones no podrán ser usadas en modo desconectado");
        return;
    }          
    generateEnoughMoneyReport();
}

function onGridViewShowConsolidated(){   
    if (!navigator.onLine) { 
    	navigator.notification.alert("Algunas opciones no podrán ser usadas en modo desconectado");
        return;
    }       
    
    generateConsolidatedReport();
}

function generateMaritalStatusReport(){
    var maritalStatus = ["Soltero", "Casado", "Viudo", "Divorciado", "Conviviente", "Separado"];
    var maritalStatusValues = [0, 0, 0, 0, 0, 0];
    var maritalStatusTotal = 0;
	var arr = [];
    
    tracking.filter({});

    tracking.fetch(function() {
  		var len = tracking.total();
        maritalStatusTotal = len;
        
        for (var i = 0; i < len; i++) {
            var entity = tracking.at(i);
            var indexValue = entity.get("MaritalStatus") - 1;            
            maritalStatusValues[indexValue] = maritalStatusValues[indexValue] + 1;
		}  	
        
        for (var i = 0; i < maritalStatus.length; i++) {
            arr.push({
                typeName: maritalStatus[i],
                amount: kendo.toString(maritalStatusValues[i], "n2"),
                percentage: kendo.toString((maritalStatusValues[i])/maritalStatusTotal, "p")
            });
        }   

        var ds = new kendo.data.DataSource({ data: arr });
        //http://docs.telerik.com/kendo-ui/api/javascript/ui/grid?  	footerTemplate, headerTemplate
        $("#gridMaritalStatus").html("");
        $("#gridMaritalStatus").kendoGrid({
            dataSource: ds,
            toolbar: [{ 
                template: kendo.template($("#maritalStatusTemplate").html()) 
            }],
            columns: [
            {
                title: "Estado Civil de Jóvenes Independizados",
                columns: [
                    { title: "Estado Civil", width: 300},
                    { title: "Cantidad", width: 100},
                    { title: "Porcentaje", width: 100}            
                ]
            }],
            sortable: true,
            rowTemplate: kendo.template($("#rowTrackingTemplate").html()),
            mobile: true
        });
    });
}

function generateSatisfactionReport(){
    var satisfactionLevel = ["Muy Contento", "Contento", "Descontento", "Muy Descontento"];

    var satisfactionTotal = 0;
	var arr = [];
    var arrChildTrackingValues = [];
    tracking.filter({});

    tracking.fetch(function() {
  		var len = tracking.total();
        satisfactionTotal = len;
        
        for (var i = 0; i < len; i++) {
            var entity = tracking.at(i);
            
            arrChildTrackingValues.push({
                Satisfaction: entity.get("SatisfactionInProfessionalDev"),
                SOSChildID:  entity.get("SOSChildID"),
                ProgrammeUnitName: searchProgrammeUnitNameBySOSChildID(entity.get("SOSChildID").trim())
            });
		}  	
        
        for (var i = 0; i < programmeunitValues.length; i++) {
            arr.push({
                programmeUnitName: programmeunitValues[i].Name,
                VeryHappy: kendo.toString(countRecordsSatisfaction(arrChildTrackingValues, programmeunitValues[i].Name, 1), "p"),
                Happy: kendo.toString(countRecordsSatisfaction(arrChildTrackingValues, programmeunitValues[i].Name, 2), "p"),
                UnHappy: kendo.toString(countRecordsSatisfaction(arrChildTrackingValues, programmeunitValues[i].Name, 3), "p"),
                VeryUnHappy: kendo.toString(countRecordsSatisfaction(arrChildTrackingValues, programmeunitValues[i].Name, 4), "p"),
            });
        }   

        var ds = new kendo.data.DataSource({ data: arr });
        //http://docs.telerik.com/kendo-ui/api/javascript/ui/grid?  	footerTemplate, headerTemplate
        $("#gridSatisfaction").html("");
        $("#gridSatisfaction").kendoGrid({
            dataSource: ds,
            toolbar: [{ 
                template: kendo.template($("#satisfactionTemplate").html()) 
            }],
            columns: [
            {
                title: "Nivel de Satisfacción con su desarrollo profesional",
                columns: [
                    { title: "Programa", width: 300},
                    { title: "Muy Contento", width: 100},
                    { title: "Contento", width: 100},            
                    { title: "Descontento", width: 100},
                    { title: "Muy Descontento", width: 100}
                ]
            }],
            sortable: true,
            rowTemplate: kendo.template($("#rowSatisfactionTrackingTemplate").html()),
            mobile: true
        });
    });
}

function generateWorkConditionReport(){
    var workCondition = ["Dependiente", "Independiente"];
    var workConditionValues = [0, 0];
    var workConditionTotal = 0;
	var arr = [];
    
    tracking.filter({});

    tracking.fetch(function() {
  		var len = tracking.total();
        workConditionTotal = len;
        
        for (var i = 0; i < len; i++) {
            var entity = tracking.at(i);
            var indexValue = entity.get("WorkCondition") - 1;            
            workConditionValues[indexValue] = workConditionValues[indexValue] + 1;
		}  	
        
        for (var i = 0; i < workCondition.length; i++) {
            arr.push({
                typeName: workCondition[i],
                amount: kendo.toString(workConditionValues[i], "n2"),
                percentage: kendo.toString((workConditionValues[i])/workConditionTotal, "p")
            });
        }   

        var ds = new kendo.data.DataSource({ data: arr });
        //http://docs.telerik.com/kendo-ui/api/javascript/ui/grid?  	footerTemplate, headerTemplate
        $("#gridWorkCondition").html("");
        $("#gridWorkCondition").kendoGrid({
            dataSource: ds,
            toolbar: [{ 
                template: kendo.template($("#maritalStatusTemplate").html()) 
            }],
            columns: [
            {
                title: "Condición Laboral",
                columns: [
                    { title: "Condición Laboral", width: 300},
                    { title: "Cantidad", width: 100},
                    { title: "Porcentaje", width: 100}            
                ]
            }],
            sortable: true,
            rowTemplate: kendo.template($("#rowTrackingTemplate").html()),
            mobile: true
        });
    });
}

function generateEnoughMoneyReport(){
    var enoughWorkIncome = ["Si fácilmente", "Si me las arreglo", "Es difícil", "Es imposible", "No sabe"];
    
    var enoughWorkTotal = 0;
	var arr = [];
    var arrChildTrackingValues = [];
    tracking.filter({});

    tracking.fetch(function() {
  		var len = tracking.total();
        enoughWorkTotal = len;
        
        for (var i = 0; i < len; i++) {
            var entity = tracking.at(i);
            
            arrChildTrackingValues.push({
                EnoughWork: entity.get("EnoughWorkIncome"),
                SOSChildID:  entity.get("SOSChildID"),
                ProgrammeUnitName: searchProgrammeUnitNameBySOSChildID(entity.get("SOSChildID").trim()),
                Gender: getGenderBySOSChildID(entity.get("SOSChildID").trim())
            });
		}  	
        
        for (var i = 0; i < programmeunitValues.length; i++) {
            var gender = "Masculino";
            var genderType = "Masculino";
            
            if(i != 0)
            	gender = "";
            
            arr.push({
                gender: gender,
                programmeUnitName: programmeunitValues[i].Name,
                Easy: kendo.toString(countRecordsEnoughWork(arrChildTrackingValues, programmeunitValues[i].Name, 1, genderType), "p"),
                Could: kendo.toString(countRecordsEnoughWork(arrChildTrackingValues, programmeunitValues[i].Name, 2, genderType), "p"),
                IsDificult: kendo.toString(countRecordsEnoughWork(arrChildTrackingValues, programmeunitValues[i].Name, 3, genderType), "p"),
                Impossible: kendo.toString(countRecordsEnoughWork(arrChildTrackingValues, programmeunitValues[i].Name, 4, genderType), "p"),
                NotAnswer: kendo.toString(countRecordsEnoughWork(arrChildTrackingValues, programmeunitValues[i].Name, 5, genderType), "p")
            });
        }   
        
        for (var i = 0; i < programmeunitValues.length; i++) {
            var gender = "Femenino";
            var genderType = "Femenino";
            
            if(i != 0)
            	gender = "";
            
            arr.push({
                gender: gender,
                programmeUnitName: programmeunitValues[i].Name,
                Easy: kendo.toString(countRecordsEnoughWork(arrChildTrackingValues, programmeunitValues[i].Name, 1, genderType), "p"),
                Could: kendo.toString(countRecordsEnoughWork(arrChildTrackingValues, programmeunitValues[i].Name, 2, genderType), "p"),
                IsDificult: kendo.toString(countRecordsEnoughWork(arrChildTrackingValues, programmeunitValues[i].Name, 3, genderType), "p"),
                Impossible: kendo.toString(countRecordsEnoughWork(arrChildTrackingValues, programmeunitValues[i].Name, 4, genderType), "p"),
                NotAnswer: kendo.toString(countRecordsEnoughWork(arrChildTrackingValues, programmeunitValues[i].Name, 5, genderType), "p")
            });
        }   
                            
        var ds = new kendo.data.DataSource({ data: arr });
        //http://docs.telerik.com/kendo-ui/api/javascript/ui/grid?  	footerTemplate, headerTemplate
        $("#gridEnoughMoney").html("");
        $("#gridEnoughMoney").kendoGrid({
            dataSource: ds,
            toolbar: [{ 
                template: kendo.template($("#enoughMoneyTemplate").html()) 
            }],
            columns: [
            {
                title: "¿Le alcanza el dinero para vivir?",
                columns: [
                    { title: "Género", width: 200},
                    { title: "Programa", width: 200},
                    { title: "Si fácilmente", width: 100},
                    { title: "Si me las arreglo", width: 100},            
                    { title: "Es difícil", width: 100},
                    { title: "Es imposible", width: 100},
                	{ title: "No sabe", width: 100}
                ]
            }],           
            sortable: true,
            rowTemplate: kendo.template($("#rowEnoughMoneyTrackingTemplate").html()),
            mobile: true
        });
    });
}

function generateConsolidatedReport(){
    
    var arr = [];
    var arrChildTrackingValues = [];
    tracking.filter({});

    tracking.fetch(function() {
  		var len = tracking.total();
                
        for (var i = 0; i < len; i++) {
            var entity = tracking.at(i);
        	
            arrChildTrackingValues.push({
                SOSChildID:  entity.get("SOSChildID"),
                ProgrammeUnitName: searchProgrammeUnitNameBySOSChildID(entity.get("SOSChildID").trim()),
                HouseName: searchHouseNameBySOSChildID(entity.get("SOSChildID").trim()),
                DateOfBirth: getDateOfBirthBySOSChildID(entity.get("SOSChildID").trim()),
                Gender: getGenderBySOSChildID(entity.get("SOSChildID").trim())
            });
		}  	
        var count = 0;
        for (var i = 0; i < programmeunitValues.length; i++) {
            //another "for" to get all houses related to this PU ID
            count = 0;
            for(var j = 0; j < houseValues.length; j++)
            {
                if(programmeunitValues[i].ID == houseValues[j].parentID)
                {                    
                    var puName = programmeunitValues[i].Name;                    
                    if(count > 0) puName = "";
                    
                    arr.push({
                        programmeUnitName: puName,
                        houseName: houseValues[j].Name,
                        MaleChildLess18Years: kendo.toString(countRecordsConsolidated(arrChildTrackingValues, houseValues[j].Name, 1, 1), "p"),
                        FemaleChildLess18Years: kendo.toString(countRecordsConsolidated(arrChildTrackingValues, houseValues[j].Name, 1, 2), "p"),
                        TotalChildLess18Years: kendo.toString(countRecordsConsolidated(arrChildTrackingValues, houseValues[j].Name, 1, 3), "p"),
                        MaleChildMore18Years: kendo.toString(countRecordsConsolidated(arrChildTrackingValues, houseValues[j].Name, 2, 1), "p"),
                        FemaleChildMore18Years: kendo.toString(countRecordsConsolidated(arrChildTrackingValues, houseValues[j].Name, 2, 2), "p"),
                        TotalChildMore18Years: kendo.toString(countRecordsConsolidated(arrChildTrackingValues, houseValues[j].Name, 2, 3), "p")                        
                    });
                    count = count+1;
                }
            }                        
        }   
                            
        var ds = new kendo.data.DataSource({ data: arr });
        //http://docs.telerik.com/kendo-ui/api/javascript/ui/grid?  	footerTemplate, headerTemplate
        $("#gridConsolidated").html("");
        $("#gridConsolidated").kendoGrid({
            dataSource: ds,
            toolbar: [{ 
                template: kendo.template($("#consolidatedTemplate").html()) 
            }],
            columns: [
            {
                title: "Reporte Consolidado",
                columns: [
                    { title: "Programa", width: 200},
                    { title: "Hogar", width: 200},
                    { title: "Niños Hombres < 18 años", width: 100},
                    { title: "Niños Mujeres < 18 años", width: 100},            
                    { title: "Niños Total < 18 años", width: 100},
                    { title: "Niños Hombres >= 18 años", width: 100},
                    { title: "Niños Mujeres >= 18 años", width: 100},            
                    { title: "Niños Total >= 18 años", width: 100}
                ]
            }],           
            sortable: true,
            rowTemplate: kendo.template($("#rowConsolidatedTrackingTemplate").html()),
            mobile: true
        });
    });
}

var pdfFileName = "Reports.pdf";

function exportToPdf(elementID) {
    console.log("Export to PDF is starting...");
    kendo.drawing.drawDOM($(elementID))
           .then(function (group) {
               // Render the result as a PDF file
               return kendo.drawing.exportPDF(group, {
                   paperSize: "auto",
                   margin: { left: "1cm", top: "1cm", right: "1cm", bottom: "1cm" }
               });
           })
           .done(function (data) {
			    // save file locally 
                    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
								 function (fileSystem) {
								     var options = {
								         create: true,
								         exclusive: false
								     };
								     ////create a file in the file system of the device
								     fileSystem.root.getFile(randomIntFromInterval(10000000, 99999999) + pdfFileName, options,
															 function (fileEntry) {
															     fileEntry.createWriter(
																	 function (fileWriter) {
																	     var base64data = data.split(',')[1];
																	     //decode the base64 data
																	     var binary = atob(base64data);
																	     var len = binary.length;
																	     //create a Uint8Array 
																	     var bytes = new Uint8Array(len);
																	     for (var i = 0; i < len; i++) {
																	         bytes[i] = binary.charCodeAt(i);
																	     }
																	     //write the Uint8Array in the newly created image file
																	     fileWriter.write(bytes.buffer);

																	     setTimeout(function () {
																	         console.log("opening file");
																	         window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
																	             fileSystem.root.getFile(pdfFileName, null,
                                                                                                         function (fileEntry) {
                                                                                                             ///check if the file really exists using its native URL
                                                                                                             var windowTarget = device.platform.toLowerCase() === "ios" ? "_blank" : "_system";
                                                                                                             window.open(fileEntry.nativeURL, windowTarget);
                                                                                                         },
                                                                                                         function (error) {
                                                                                                             error.message = "Unable to get file entry for reading.";
                                                                                                             onError.call(that, error);
                                                                                                         });
																	         }, function (error) {
																	             error.message = "Request file system failed.";
                                                                                 alert(error);
																	         });

																	     }, 3000);
																	 },
																	 function (error) {
																	     error.message = "Unable to create file writer.";
                                                                         alert(error);
																	 });
															 },
															 function (error) {
															     error.message = "Failed creating file.";
															     alert(error);
															 });
								 },
								 function (error) {
								     error.message = "Request file system failed.";
								     alert(error);
								 });
           });
    return false;
}