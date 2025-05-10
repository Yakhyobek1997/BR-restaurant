import Erros, { HttpCode, Message } from "../libs/Errors";
import ProductModel from "../schema/Product.model";
import {
  ProductInput,
  Product,
  ProductUpdateInput,
  ProductInquiry,
} from "../libs/types/product";
import { shapeIntoMongooseObjectId } from "../libs/config";
import { T } from "../libs/types/common";
import { ProductStatus } from "../libs/enums/product.enum";
import { ObjectId, Types } from "mongoose";
import ViewService from "./View.service";
import { ViewInput } from "../libs/types/view";
import { ViewGroup } from "../libs/enums/view.enum";
class ProductService {
  private readonly productModel;
  public viewService;

  constructor() {
    this.productModel = ProductModel;
    this.viewService = new ViewService();
  }
  /** SPA */

  public async getProducts(inquiry: ProductInquiry): Promise<Product[]> {
  // getProducts product asyn methodi bor ProductInquiry qabul qilib Promise<Product[]> ga qaytaradi
    const match: T = { productStatus: ProductStatus.PROCESS };
  // 

    if (inquiry.productCollection) // inquiry.productCollection bo'sa uni matchga tenglavommiz
      match.productCollection = inquiry.productCollection;

    if (inquiry.search) { // inquiry.search bo'sa 
      match.productName = { $regex: new RegExp(inquiry.search, "i") };
      // matchga tenglab keyin  $regex ni yaeratib :  ikta argument bor

    }
    const sort: T =
      inquiry.order === "productPrice" // inquery ni ichidagi order "productPrice" ga teng boplsa
      // dinamic key integration  
      ? { [inquiry.order]: 1 } // ascending holatta qilib ber
        : { [inquiry.order]: -1 }; // yoki descending, qilib Sort ga tengladik

    const result = await this.productModel
    // productModel Shema modelni ichida 
      .aggregate([ // bitta array berdik va uni 4 ta objecti kevotti
        { $match: match },
        { $sort: sort },
        { $skip: (inquiry.page * 1 - 1) * inquiry.limit },
      // $skip bu holatta doklani o'tkazib yubor qildik
        { $limit: inquiry.limit * 1 },
      // limit holatta bizga qancha dok kere bosa shuncha olib ber
      ])
      .exec(); // execute qilib kutib olib resultga tengladik

    if (!result) throw new Erros(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }

  public async getProduct(
    memberId: Types.ObjectId | null,
    id: string
  ): Promise<Product> {
    //  getProduct asy method, ikta parametrni qabul qivommiz
    const productId = shapeIntoMongooseObjectId(id);
    // producId ni shapeIntoMongooseObjectId da create qilingan id tengladik
    let result = await this.productModel
      .findOne({
        // productModel findOne static methodni chaqirdik
        _id: productId, // bitta Id argumetni path qildik
        productStatus: ProductStatus.PROCESS,
        // keyn buyerdan PROCESS holatidegi ProductStatus ni olib ber divommiz
      })
      .exec();

    if (!result) throw new Erros(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    // agar result bo'masa o'zimiz yaratgan Errorni throw qivommiz
    if (memberId) {
      // agar member bo'ladigan bo'lsa, if ni ichidagi mantiqla ishga tushadi
      // 1) Member tomonidan view mavjudmi
      const input: ViewInput = {
        // object xosil qilib, keyn proportylani belgiladik
        memberId: memberId, // vular bir biriga teng
        viewRefId: productId,
        viewGroup: ViewGroup.PRODUCT,
        // viewGroup propotysi ViewGroup.PRODUCT
        // Keyn const input typega ViewInput sifatida bervommiz
      };
      const existView = await this.viewService.checkViewExistence(input);
      // viewServiceni checkViewExistence methodni chaqirib unga inputni
      // argument sifatida berib natijani kutib existView ga tenglavoldik

      console.log("exist:", !!existView);
      if (!existView) { // Agar view exist bo'lmasa
        // 2) View yaratvommiz
        console.log("planning to insert new view");
        await this.viewService.insertMemberView(input);
 // viewService objectni insertMemberView methodiga 
 // inputni argumetn qilib berik va kutib oldik

        // 3) Productni view statisticani yarattik
        result = await this.productModel.findByIdAndUpdate(
// productModel schema modelni findByIdAndUpdate static methodni chaqrib
// unga unga 3 ta arg bervommiz , va exec qiliub undan qaytkanni await ga tenglavommiz
          productId,
          { $inc: { productViews: +1 } }, // update
          { new: true } // option
        );
      }
    }

    return result?.toObject() as Product;
  }

  /** SSR */
  public async getAllProducts(): Promise<Product[]> {
    const result = await this.productModel.find().exec();
    if (!result) throw new Erros(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);

    return result.map((product) => product.toObject()) as Product[];
  }

  public async createNewProduct(input: ProductInput): Promise<Product> {
    try {
      const createdProduct = await this.productModel.create(input);
      return createdProduct.toObject() as Product;
    } catch (err) {
      console.error("Error, model:createNewProduct", err);
      throw new Erros(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
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
    if (!result) throw new Erros(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);

    return result as unknown as Product;
  }
}
export default ProductService;
