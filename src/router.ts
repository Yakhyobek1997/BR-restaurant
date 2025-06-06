import express from "express";
const router = express.Router(); // router variablni xosil qilamiz va (Router methodni chaqiramiz)
import memberController from "./controllers/member.contoller";
import mongoose from "mongoose";
import uploader from "./libs/utils/uploader";
import productController from "./controllers/product.controller";
import orderController from "./controllers/order.controller";
mongoose.set("strictQuery", true);

/* MEMBER */

router.get("/member/restaurant", memberController.getRestaurant);

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

router.post(
  "/member/update",
  memberController.verifyAuth,
  uploader("members").single("memberImage"),
  memberController.updateMember
);
router.get("/member/top-users", memberController.getTopUsers);

/* PRODUCT */

router.get("/product/all", productController.getProducts);

router.get(
  "/product/:id",
  memberController.retrieveAuth,
  productController.getProduct 
  // productCon Objectni getProduct methodga yuboradi
);

/* Order */

router.post(
// rest api methodi post
  "/order/create", // keyn order endpointga mueojat qilib
  memberController.verifyAuth, 
// birinchi auth bolgan usermi tekshiradi (login bolgan yoki yoqligini)
  orderController.createOrder 
// keyn login bogan bolsa orderc ni create order methodiga push qiladi
);

router.get( // rest api methodi get
  "/order/all",
  memberController.verifyAuth,
  orderController.getMyOrders
);

router.post( 
  "/order/update",
  memberController.verifyAuth,
  orderController.updateOrder
);
export default router;


// Retriever - Login bo'lsa reqni boyitadi
// Authent - Login bo'lganini tekshiradi loin bolmsagan bolsa o'tkazmayi
// Authora - Bunda huquni tekshiradi, Mumkin yoki mumkinmasligi