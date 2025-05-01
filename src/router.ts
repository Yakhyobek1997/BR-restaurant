import express from "express";
const router = express.Router(); // router variablni xosil qilamiz va (Router methodni chaqiramiz)
import memberController from "./controllers/member.contoller";
import mongoose from "mongoose";
import uploader from "./libs/utils/uploader";
mongoose.set("strictQuery", true);

/* MEMBER */
router.post("/member/login", memberController.login);

// /login linyasiga POST so‘rovi yuborilganda,
// memberControllerdagi login funksiyasini chaqiradi.
// Bu funksiya foydalanuvchini tizimga kirishini boshqaradi.

router.post("/member/signup", memberController.signup);

// /signup linega POST sorovi yuborilganda,
// memberControllerdagi signup funksiyasini chaqiradi.
// Bu funksiya yangi userlani ro‘yxatdan o‘tkazishni boshqaradi.​

router.post(
  "/member/logout",
  memberController.verifyAuth,
  memberController.logout
);
router.get(
  "/member/detail",
  memberController.verifyAuth,
  memberController.getMemberDetail
);

router.post("/member/update",
    memberController.verifyAuth,
    uploader("members").single("memberImage"),
    memberController.updateMember
)

router.get("/member/top-users", memberController.getTopUsers)
/* PRODUCT */

/* Order */

export default router;
