(function () {
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
        submit: function(){
            alert("en implementacion");
        },
        submitFollow: function(){
            alert("en implementacion");
        }
    });
});