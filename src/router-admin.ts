import  express  from 'express';
import restaurantController from './controllers/restaurant.controller';
import productController from './controllers/product.controller';
const routerAdmin = express.Router(); // 'express.Router()' orqali yangi router obyektini yaratamiz va uni 'routerAdmin' o‘zgaruvchisiga saqlaymiz

// 'restaurantController' modulini import qilish
// import restaurantController from './controllers/member.controller';

// Bosh sahifaga GET so‘rovi uchun marshrut qo‘shish
routerAdmin.get('/', restaurantController.goHome); 
routerAdmin.get('/login', restaurantController.getLogin); 
routerAdmin.post('/login', restaurantController.processLogin); 
routerAdmin.get('/signup', restaurantController.getSignup) 
  .post('/signup', restaurantController.processSignup); 
routerAdmin.get('/logout', restaurantController.logout); 
routerAdmin.get('/check-me', restaurantController.checkAuthSession); 

/** Product */
routerAdmin.get('/product/all', productController.getAllProducts);
routerAdmin.post("/product/create",productController.createNewProduct)
routerAdmin.post("/product/:id",productController.updateChosenProduct)
/** User */


export default routerAdmin