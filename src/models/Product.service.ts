import { LoginInput } from './../libs/types/member';
import ProductModel from "../schema/Product.model"
import { Product, ProductInput, ProductUpdateInput } from '../libs/types/product';
import { HttpCode } from '../libs/Errors';
import Errors from '../libs/Errors';
import { Message } from '../libs/Errors';
import { shapeIntoMongooseObjectId } from '../libs/config';

class ProductService {
 private readonly productModel

 constructor() {
    this.productModel = ProductModel
 }

 /* SPA */


 /* SSR */

 public async getAllProducts(
  
): Promise<Product[]> {
  const result = await this.productModel
    .find()
    .exec();
    
  if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

  const plainResult = result.map((doc) => doc.toObject() as Product);

  return plainResult;
}


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

 public async updateChosenProduct(
  id: string,
  input: ProductUpdateInput
): Promise<Product> {
  id = shapeIntoMongooseObjectId(id);
  const result = await this.productModel
    .findOneAndUpdate({ _id: id }, input, { new: true })
    .exec();
    
  if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);

  return result.toObject() as Product;

}



}
export default ProductService