var campus ;
var buildingLists = {};

$(function(){
    $.get("https://owlrepair-148215.appspot.com/api/campus/getAll",function(data,status){
        campus = data.CAMPUSES;
        console.log(campus);
        var optionsString = "<option hidden >Select Campus</option>";
        $.each(campus,function(key,value){
            optionsString += "<option value='"+value.CAMPUS_ID+"'>"+value.CAMPUS_DESC+"</option>";
        });
        $("#campusSelect").html(optionsString);
    });
});

$("#campusSelect").change(function(){
        var selectedCampus =  parseInt($("#campusSelect").val());
      $.post("https://owlrepair-148215.appspot.com/api/building/getAllForCampus",{ campusId: selectedCampus},function(data,status){
          buildingLists[selectedCampus] = data.BUILDINGS;
          console.log(buildingLists);
        var optionsString = "<option hidden >Select Building</option>";
        $.each(buildingLists[selectedCampus],function(key,value){
            optionsString += "<option value='"+value.BUILDING_ID+"'>"+value.BUILDING_DESC+"</option>";          
        });
        $("#buildingSelect").html(optionsString);
    });
});