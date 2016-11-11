var campus ;
var buildingLists = {};

$(function(){
    $.get("https://owlrepair-148215.appspot.com/api/campus/getAll",function(data,status){
        console.log(data);
        campus = data;
        var optionsString = "<option hidden >Select Campus</option>";
        $.each(campus,function(key,value){
            optionsString += "<option value='"+value[0].CAMPUS_ID+"'>"+value[0].CAMPUS_DESC+"</option>";
        });
        $("#campusSelect").html(optionsString);
    });
});

$("#campusSelect").change(function(){
        var selectedCampus =  parseInt($("#campusSelect").val());
      $.post("https://owlrepair-148215.appspot.com/api/building/getAllForCampus",selectedCampus,function(data,status){
        console.log(data);
          buildingLists[selectedCampus] = data;
          console.log(buildingLists);
        var optionsString = "<option hidden >Select Building</option>";
        $.each(buildingLists[selectedCampus],function(key,value){
            if( value.length>0){
            optionsString += "<option value='"+value[0].BUILDING_ID+"'>"+value[0].BUILDING_DESC+"</option>";
            }
        });
        $("#buildingSelect").html(optionsString);
    });
});