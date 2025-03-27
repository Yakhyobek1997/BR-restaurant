// React

import  express  from 'express';
const router = express.Router() // router variablni xosil qilamiz va (Router methodni chaqiramiz)
import memberController from './controllers/member.contoller';
import mongoose from 'mongoose';
mongoose.set('strictQuery', true);


router.post('/login', memberController.login);
router.post('/signup',memberController.signup)


export default router

