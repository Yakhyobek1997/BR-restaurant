import express from "express";
const routerAdmin = express.Router(); // 'express.Router()' orqali yangi router obyektini yaratamiz va uni 'routerAdmin' o‘zgaruvchisiga saqlaymiz
import restaurantController from "./controllers/restaurant.controller";
import productController from "./controllers/product.controller";
import  makeUploader from "./libs/utils/uploader";

// 'restaurantController' modulini import qilish
// import restaurantController from './controllers/member.controller';

// Bosh sahifaga GET so‘rovi uchun marshrut qo‘shish
routerAdmin.get("/", restaurantController.goHome);
routerAdmin.get("/login", restaurantController.getLogin);
routerAdmin.post("/login", restaurantController.processLogin);
routerAdmin
  .get("/signup", restaurantController.getSignup)

  .post("/signup",makeUploader("members").single("memberImage"),
   restaurantController.processSignup);


routerAdmin.get("/logout", restaurantController.logout);
routerAdmin.get("/check-me", restaurantController.checkAuthSession);

/** Product */
routerAdmin.get(
  "/product/all",
  restaurantController.verifyRestaurant,
  productController.getAllProducts
);
routerAdmin.post(
    "/product/create",
    restaurantController.verifyRestaurant, 
    // uploadProductImage.single('productImage'),
    makeUploader("products").array("productImages",5),
    productController.createNewProduct);

    routerAdmin.post(
        "/product/:id", // bu yerda paramni qabul qivommiz mongodan
        restaurantController.verifyRestaurant, 
        productController.updateChosenProduct);


        /** User */

 routerAdmin.get("/user/all",restaurantController.verifyRestaurant, restaurantController.getUsers)
 routerAdmin.post("/user/edit",restaurantController.verifyRestaurant, restaurantController.updateChosenUser)
/*
 Bu yerda biz routerAdmin orqali /user/all va /user/edit endpointlarini aniqlayapmiz, 
 ya’ni admin panelda userlar bilan ishlashga mo‘ljallangan marshrutlar.
Birinchi marshrut — GET /user/all, bu endpointga so‘rov yuborilsa, avval 
restaurantController.verifyRestaurant ishlaydi — bu middleware function bo‘lib,
 foydalanuvchi mazkur restaurantga tegishli ekanini yoki admin ekanini tekshiradi.
Agar tekshiruvdan muvaffaqiyatli o‘tsa, keyin restaurantController.getUsers ishlaydi —
 bu controller method bo‘lib, u bazadan barcha foydalanuvchilarni olib, brauzerga qaytaradi.
Bu GET marshrut asosan ma’lumot olish uchun ishlatilad

*/



export default routerAdmin;
