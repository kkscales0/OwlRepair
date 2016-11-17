$("#submitButton").click(function(){
        var userid = 1; // placeholder
        var campusid = parseInt($("#campusSelect").val());
        var buildingid = parseInt($("#buildingSelect").val());
        var locDesc = $("#locDetail").val();
        var catgoryid =  parseInt($("#categorySelect").val());
        var comments = $("#comments").val();
        var pubpriv = parseInt($("#visibilitySelect").val());
        var imagepath = " "; //placeholder
        console.log(userid);
        console.log(campusid);
        console.log(buildingid);
        console.log(locDesc);
        console.log(catgoryid);
        console.log(comments);
        console.log(pubpriv);
        console.log(imagepath);
    
       $.post("https://owlrepair-148215.appspot.com/api/request/submit",{ userId: userid, campusId: campusid, buildingId: buildingid, locationDesc: locDesc, categoryId: catgoryid ,desc: comments, imagePath: imagepath, public: pubpriv },function(data,status){
            alert(data.NEWID);
       });
});