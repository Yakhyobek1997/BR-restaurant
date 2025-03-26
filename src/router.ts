// React

import  express  from 'express';
const router = express.Router() // router variablni xosil qilamiz va (Router methodni chaqiramiz)
import memberController from './controllers/member.contoller';


router.post('/login', memberController.login);
router.post('/signup',memberController.signup)


export default router

