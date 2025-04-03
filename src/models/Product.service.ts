import { LoginInput } from './../libs/types/member';
import ProductModel from "../schema/Product.model"
import { Product, ProductInput } from '../libs/types/product';
import { HttpCode } from '../libs/Errors';
import Errors from '../libs/Errors';
import { Message } from '../libs/Errors';

class ProductService {
 private readonly productModel

 constructor() {
    this.productModel = ProductModel
 }

 /* SPA */


 /* SSR */

 public async createNewProduct(input: ProductInput): Promise<Product> {
   try {
      console.log("YUBORILGAN INPUT:", input);
       const newProduct = await this.productModel.create(input);
      return newProduct.toObject() as Product;;
   } catch (err) {
     console.error("Error, model:createNewProduct:", err);
     throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
   }
 }
 

}
export default ProductService