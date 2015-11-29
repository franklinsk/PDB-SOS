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

function searchCodeInArray(entityArray, ID, type){
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

function searchProgrammeUnitNameBySOSChildID(SOSChildID){
    var caregiverID = searchCodeInArray(childValues, SOSChildID, "");
    var houseID = searchCodeInArray(caregiverValues, caregiverID, "");
    var programmeunitID = searchCodeInArray(houseValues, houseID, "");
    var programmeunitName = searchCodeInArray(programmeunitValues, programmeunitID, "Name");    
    
    return programmeunitName;
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
                ID: entity.get("SOSChildID")
            });
		}  	                
    });
}

function testSearch()
{
    alert(searchProgrammeUnitNameBySOSChildID("00224466"));
}

//PDF Export
//http://www.telerik.com/forums/kendo-mobile-export-to-pdf
function onGridViewShow(){   
    if (!navigator.onLine) { 
    	navigator.notification.alert("Algunas opciones no podrán ser usadas en modo desconectado");
        return;
    }          
    
    var satisfactionLevel = ["Muy Contento", "Contento", "Descontento", "Muy Descontento"];
    var workCondition = ["Dependiente", "Independiente"];
    var enoughWorkIncome = ["Si fácilmente", "Si me las arreglo", "Es difícil", "Es imposible", "No sabe"];
    
    generateMaritalStatusReport();
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

var pdfFileName = "MyPdf.pdf";

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
								     fileSystem.root.getFile(pdfFileName, options,
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