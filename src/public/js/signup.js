console.log("Signup frontend javascript file");


$(function (){})

function validateSignupForm() {
    
    const memberNick = $(".member-nick").val()
    const memberPhone = $(".member-phone").val()
    const memberPassword = $(".member-password").val()
    const confirmPassword = $(".confirm-password").val()
    
    if (memberNick === "" || memberPhone === "" || memberPassword === ""
        || confirmPassword === ""
     ) {
        alert("Please fill in all fields!")
        return false
     }

     if(memberPassword !== confirmPassword) {
        alert("Passwords do not match, please cheeck again!")
        return false
     }
}