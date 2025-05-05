import ProductModel from "../schema/Product.model";
import {
  Product,
  ProductInput,
  ProductInquiry,
  ProductUpdateInput,
} from "../libs/types/product";
import { HttpCode } from "../libs/Errors";
import Errors from "../libs/Errors";
import { Message } from "../libs/Errors";
import { shapeIntoMongooseObjectId } from "../libs/config";
import { ProductStatus } from "../libs/enums/product.enum";
import { T } from "../libs/types/common";
import mongoose, { ObjectId } from "mongoose";
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

  /* SPA */
  public async getProducts(inquiry: ProductInquiry): Promise<Product[]> {
    const match: T = { productStatus: ProductStatus.PROCESS };
  
    if (inquiry.productCollection)
      match.productCollection = inquiry.productCollection;
  
    if (inquiry.search) {
      match.productName = { $regex: new RegExp(inquiry.search, "i") };
    }
  
    const sort: T =
      inquiry.order === "productPrice"
        ? { [inquiry.order]: 1 }
        : { [inquiry.order]: -1 };
  
    const result = await this.productModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        { $skip: (inquiry.page * 1 - 1) * inquiry.limit },
        { $limit: inquiry.limit * 1 },
      ])
      .exec();
  
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
  
    return result;
  }
  

  public async getProduct(
    memberId: mongoose.Types.ObjectId | null,
    id: string,
    status?: ProductStatus
  ): Promise<any> {
    const productId = shapeIntoMongooseObjectId(id);
  
    const query: any = { _id: productId };
    if (status) query.productStatus = status;
  
    console.log("QUERY:", query);
  
    let result = await this.productModel.findOne(query).exec();
  
    if (!result) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    }
  
    let viewed = false;
  
    if (memberId) {
      const input: ViewInput = {
        memberId,
        viewRefId: productId,
        viewGroup: ViewGroup.PRODUCT,
      };
  
      const existView = await this.viewService.checkViewExistence(input);
  
      if (!existView) {
        await this.viewService.insertMemberView(input);
  
        result = await this.productModel.findByIdAndUpdate(
          productId,
          { $inc: { productViews: 1 } },
          { new: true }
        ).exec();
  
        if (!result) {
          throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
        }
      } else {
        viewed = true;
      }
    }
  
    return {
      ...result.toObject(),
      viewer: {
        isLoggedIn: !!memberId,
        viewed: viewed,
      },
    };
  }
  
  

  /* SSR */

  public async getAllProducts(): Promise<Product[]> {
    const result = await this.productModel.find().exec();

    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    const plainResult = result.map((doc) => doc.toObject() as Product);

    return plainResult;
  }

  public async createNewProduct(input: ProductInput): Promise<Product> {
    try {
      console.log("YUBORILGAN INPUT:", input);
      const newProduct = await this.productModel.create(input);
      return newProduct.toObject() as Product;
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
export default ProductService;
