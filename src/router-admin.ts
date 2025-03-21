import  express  from 'express';
import restaurantController from './controllers/restaurant.controller';
const routerAdmin = express.Router() // router variablni xosil qilamiz va (Router methodni chaqiramiz)
// import restaurantController from './controllers/member.contoller';

routerAdmin.get('/',restaurantController.goHome)

routerAdmin.get('/login',restaurantController.getLogin)

routerAdmin.post('/login', restaurantController.processLogin);

routerAdmin.get('/signup',restaurantController.getSignup)
.post("/signup", restaurantController.processSignup)

/** Product */
/** User */


export default routerAdmin