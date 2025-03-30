// React

import  express  from 'express';
const router = express.Router() // router variablni xosil qilamiz va (Router methodni chaqiramiz)
import memberController from './controllers/member.contoller';
import mongoose from 'mongoose';
mongoose.set('strictQuery', true);


router.post('/login', memberController.login);

// /login linyasiga POST so‘rovi yuborilganda,
// memberControllerdagi login funksiyasini chaqiradi. 
// Bu funksiya foydalanuvchini tizimga kirishini boshqaradi.


router.post('/signup',memberController.signup)

// /signup linega POST sorovi yuborilganda, 
// memberControllerdagi signup funksiyasini chaqiradi. 
// Bu funksiya yangi userlani ro‘yxatdan o‘tkazishni boshqaradi.​



export default router

