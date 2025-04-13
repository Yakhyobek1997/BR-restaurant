console.log("Users frontend javascript file");

$(function () {
    $(".member-status").on("change", function (e) {
    // $(".member-status") → classi 'member-status' bo‘lgan barcha elementlarni tanlaydi
    // .on("change", ...) → event listener, select/input qiymati o‘zgartirilganda ishga tushadi
    // function(e) → callback function, e bu yerda event obyekti
      const id = e.target.id;
    // e.target → hodisa sodir bo‘lgan element (ya’ni, select)
    // .id → elementning id attribute qiymati olinmoqda
    // Misol: <select id="abc123" class="member-status">
      console.log("id:", id);
  
      const memberStatus = $(`#${id}.member-status`).val();
 //  literal orqali id va class asosida element tanlanyapti
    // $(`#abc123.member-status`) → select elementni topadi
    // .val() → uning hozirgi tanlangan qiymatini olib keladi
      console.log("memberStatus:", memberStatus);
  
      axios
        .post("/admin/user/edit", {
          _id: id,
          memberStatus: memberStatus,
        })
     // axios.post → bu HTTP POST so‘rov yuboradi
      // "/admin/user/edit" → serverdagi endpoint
      // body sifatida {_id: id, memberStatus: memberStatus} uzatilmoqda
        .then((response) => {
    // Agar POST so‘rov muvaffaqiyatli bo‘lsa
          console.log("response:", response);
          const result = response.data;
          if (result.data) {
            console.log("User updated!");
            $(".member-status").blur();
    //  // Barcha .member-status elementlardan fokusni olib tashlaydi (visual)
          } else alert("User update failed!");
        })
        .catch((err) => {
// Agar axios so‘rovda xatolik yuz bersa
          console.log(err);
          alert("User update failed!");
        });
    });
  });
  
  