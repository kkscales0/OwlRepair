function uploadImage(input) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();
        
        reader.onload = function (e) {
            image.setAttribute('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
};

$("#imageUpload").change(function(){
    uploadImage(this);
});

$("#image").on("click",function() {
    $("#imageUpload").click();
});