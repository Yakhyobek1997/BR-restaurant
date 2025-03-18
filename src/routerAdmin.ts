import  express  from 'express';
import restaurantController from './controllers/restaurant.controller';
const routerAdmin = express.Router() // router variablni xosil qilamiz va (Router methodni chaqiramiz)
// import restaurantController from './controllers/member.contoller';

routerAdmin.get('/',restaurantController.goHome)
routerAdmin.get('/login',restaurantController.getLogin)
routerAdmin.get('/signup',restaurantController.getSignup)

export default routerAdmin