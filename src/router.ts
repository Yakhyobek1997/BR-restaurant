import  express  from 'express';
const router = express.Router() // router variablni xosil qilamiz va (Router methodni chaqiramiz)
import memberController from './controllers/member.contoller';

router.get('/',memberController.goHome)

router.get('/login',memberController.getLogin)

router.get('/signup',memberController.getSignup)

export default router