// Architecture pattern : MVC,DI MVP
// MVC = MODEL View Controller
// Design pattern: Middleware,Decorate


// .env faylidagi o'zgaruvchilarni import qilish
// uchun 'dotenv' modulini import qilyapmiz
// va .env fayldan konfiguratsiyani o'qiymiz.
import dotenv from "dotenv";
dotenv.config();

// Mongoose modulini import qilamiz. 
// Bu modul MongoDB bilan ishlash uchun kerak.
import mongoose from "mongoose";

// app faylni import qilamiz. app 
// HTTP serverni ishga tushiruvchi asosiy Express ilova.
import app from "./app";

// MongoDBga ulanishni amalga oshiramiz.
//  Bu ulanishni 'process.env.MONGO_URL' 
// orqali konfiguratsiya qilyapmiz.
// .env faylida MONGO_URL degan ulanishni 
// aniqlovchi o'zgaruvchi bo'lishi kerak.
mongoose
  .connect(process.env.MONGO_URL as string, {})
  .then(() => {
    console.log("MongoDB connection succeed");
     // MongoDBga ulanish muvaffaqiyatli 
     // amalga oshirilganligini konsolga chiqaramiz.

    // PORTni .env fayldan olamiz, agar PORT 
    // o'zgaruvchisi mavjud bo'lmasa, u holda 
    // standart 3003 port ishlatiladi.
    const PORT = process.env.PORT ?? 3003;
    app.listen(PORT, function () {
      console.info(`The server is running successfully on port: ${PORT}`); 
      // Server muvaffaqiyatli ishga tushganligi haqida konsolga yozamiz.
      console.info(`Admin project on http://localhost:${PORT}/admin \n`);
       // Admin panelning URL manzili haqida ma'lumot.
    });
  })
  .catch((err) => console.log("ERROR on connection MongoDB", err)); 
  // Agar MongoDBga ulanishda xatolik yuz bersa, uni konsolda ko'rsatiladi.
