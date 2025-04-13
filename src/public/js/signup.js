console.log("Signup frontend javascript file");

$(function () {
/* $ jQueryning objecti Argument sifatida 
function uzatilmoqda. 
 Ya’ni page to‘liq yuklangandan keyin ichidagi kodlar ishga tushadi.*/
  const fileTarget = $(".file-box .upload-hidden");
/* file-box ichida joylashgan upload-hidden elementni 
tanlamoqda. fileTarget degan value sifatida saqlanmoqda.*/
  let filename;
// filename degan o‘zgaruvchi e’lon qilinmoqda

  fileTarget.on("change", function () {
/* fileTarget elementi ustida
.on() nomli method chaqirilmoqda. "change" bu event type,
ya’ni foydalanuvchi fayl yuklaganda ishga
tushadi.*/

    if (window.FileReader) {
/*window global objectni FileReader propertysi.
fayl o'qivotti*/
      const uploadFile = $(this)[0].files[0];
/* 
$(this)[0] — bu jQuery elementdan DOM elementga o‘tilmoqda.
 .files[0] orqali yuklangan birinchi fayl obyekti 
 olib uploadFile degan valuega saqlanmoqda.*/
      console.log(uploadFile);
      const fileType = uploadFile.type;
/*uploadFile objectdan .type property, 
u faylning formatini aniqlid */
      console.log(fileType);

      const validImageType = ["image/jpg", "image/jpeg", "image/png"];
// validImageType array value 
      if (!validImageType.includes(fileType)) {
        alert("Please insert only jpg, jpeg, png files onlny");
/*includes() methdi u fileType orqali shu ro‘yxat 
ichidami, deb tekshiradi. Agar yo‘q bo‘lsa, 
alert() orqali ogohlantirish ko‘rsatilmoqda.*/

      } else {
        if (uploadFile) {
          console.log(URL.createObjectURL(uploadFile));
          $(".upload-img-frame")
            .attr("src", URL.createObjectURL(uploadFile))
            .addClass("success");
        }
/*$(".upload-img-frame") DOM elementga murojaat qilmoqda.
.attr("src", ...) bu elementning src atr
URL.createObjectURL(...) bu browser API orqali, 
yuklangan faylga vaqtinchalik ko‘rinish beradi.
.addClass("success") elementga CSS class qo‘shmoqda.

*/
        filename = $(this)[0].files[0].name;
// yuklagan fileni .name property orqali olib filename o‘zgaruvchiga yozadi
      }
      $(this).siblings(".upload-name").val(filename);
/*$(this) input element .siblings(".upload-name")uning yonidagi 
upload-name classli elementni topib
 .val(filename) orqali input qiymatini fayl nomi bilan yangilamoqda.*/
    }
  });
});

// Front end validateni signup qilish jarayoni

function validateSignupForm() {
//  Formani yuborishdan oldin  custom validator function.

  const memberNick = $(".member-nick").val(),
    memberPhone = $(".member-phone").val(),
    memberPassword = $(".member-password").val(),
    confirmPassword = $(".confirm-password").val();
// .val() jQuery methodi, inputlardagi qiymatlarni olib const o‘zgaruvchilarga yozmoqda.

  if (
    memberNick === "" || 
    memberPhone === "" ||
    memberPassword === "" ||
    confirmPassword === ""
  ) {
    alert("Please fill in all fields!");
    return false;
  }

  if (memberPassword !== confirmPassword) {
    alert("Passwords do not match, please cheeck again!");
    return false;
// Agar ikta password bir biriga teng bolmasa
  }

  const memberImage = $(".member-image").get(0).files[0]
/*memberImage variable elon qilib unga jquery orqali 
.member-image elementi yuklab, keyn get() methodi orqali DOM ga o'tvotti
.files[0] proporty orqali user tanlagan fayl olinmoqda*/
    ? $(".member-image").get(0).files[0].name
    : null;
// .name property’si — ya’ni fayl nomi
// olinib memberImage qiymatiga yoziladi.
// Agar hech qanday fayl tanlanmagan bo‘lsa, memberImage qiymati null bo‘ladi.

  if (!memberImage) {
    alert("Please upload an image!");
//  memberImage qiymatini inkor operator
//  agar ya’ni agar rasm yuklanmagan bo‘lsa, bu true bo‘ladi. 
    return false;
  }
}
