import { ProductCollection } from "./../libs/enums/product.enum";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { T } from "../libs/types/common";
import { Request, Response } from "express";
import ProductService from "../models/Product.service";
import { AdminRequest, ExtendedRequest } from "../libs/types/member";
import { ProductInput, ProductInquiry } from "../libs/types/product";
import mongoose from "mongoose";
type ObjectId = mongoose.Types.ObjectId;
const productService = new ProductService();

const productController: T = {};

/* SPA */

productController.getProducts = async (req: Request, res: Response) => {
  try {
    console.log("getProducts");

    const { page, limit, order, productCollection, search } = req.query; // distraction
// Kiirib kevotkan requestni ichidagi queryni Distraction
// qilib uni ichidagi malumotlarni ayirvommiz

    const inquiry: ProductInquiry = { // ProductInqery objectini
  // pasdan proportylari kevotti
      order: String(order),
      page: Number(page),
      limit: Number(limit), 
      // keyin oxirda inquiry ga tenglavommiz
    };

    if (
      typeof productCollection === "string" && // product collection malumoti
      // kirib kevotkan bosa
      Object.values(ProductCollection).includes(productCollection as ProductCollection)
    ) {
      inquiry.productCollection = productCollection as ProductCollection;
      // inqueryni boyitvommiz
    }

    if (search) { // search malumoti kirib kevotkan bo'lsa
      inquiry.search = String(search); // inquiry ni search ni boyitommiz
    }

    const result = await productService.getProducts(inquiry);
    // productService objectni .getProducts methodga inquiry ni argument sifatida berib

    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error in getProducts:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};


productController.getProduct = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("getProduct");// getProduct ni log qivommiz
    const { id } = req.params; // Distract

    const memberId = req.member?._id ?? null,
// req.member? ning id si yoki null olib memberIdga tenglavommiz
        result = await productService.getProduct(memberId, id);
// productService methodni chaqirib memberId, id argument sifatida path qilib
// natijani kutib resultga tengladik
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, getProduct:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};



productController.getAllProducts = async (req: Request, res: Response) => {
  try {
    console.log("getAllProducts");
    const data = await productService.getAllProducts();
    console.log("data:", data);
    res.render("products", { products: data });
  } catch (err) {
    console.log("Error in getAllProducts:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

productController.createNewProduct = async (
  req: AdminRequest,
  res: Response
) => {
  try {
    console.log("createNewProduct");
    if (!req.files?.length)
      throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.CREATE_FAILED);

    const data: ProductInput = req.body;
    data.productImages = req.files?.map((ele) => {
      return ele.path.replace(/\\/g, "/");
    });

    await productService.createNewProduct(data);

    res.send(
      `<script> alert("Sucessful creation!"); window.location.replace('/admin/product/all') </script>`
    );
  } catch (err) {
    console.log("Error, createNewProduct:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      `<script> alert("${message}"); window.location.replace('/admin/product/all') </script>`
    );
  }
};

productController.updateChosenProduct = async (req: Request, res: Response) => {
  try {
    console.log("updateChosenProduct");
    const id = req.params.id;
    const result = await productService.updateChosenProduct(id, req.body);

    res.status(HttpCode.OK).json({ data: result });
  } catch (err) {
    console.log("Error in updateChosenProduct:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export default productController;
