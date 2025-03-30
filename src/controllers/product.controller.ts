import Errors from "../libs/Errors"
import { T } from "../libs/types/common"
import { Request, Response } from "express";
import ProductService from "../models/Product.service";
import { AdminRequest } from "../libs/types/member"

const productService = new ProductService()

const productController: T = {}

productController.getAllProducts = async (req: Request, res: Response) => {

    try {
      console.log("getAllProducts"); 
      res.render("products")
    } catch (err) {
      console.log("Error in getAllProducts:", err); 
      if (err instanceof Errors) 
        res.status(err.code).json(err); 
      else 
        res.status(Errors.standard.code).json(Errors.standard); 
    }
  };

  productController.createNewProduct = async (req: Request, res: Response) => {

    try {
      console.log("createNewProducts"); 
      res.send('DONE')
    } catch (err) {
      console.log("Error in createNewProduct:", err); 
      if (err instanceof Errors) 
        res.status(err.code).json(err); 
      else 
        res.status(Errors.standard.code).json(Errors.standard); 
    }
  };

  productController.updateChosenProduct = async (req: Request, res: Response) => {

    try {
      console.log("updateChosenProduct"); 

    } catch (err) {
      console.log("Error in updateChosenProduct:", err); 
      if (err instanceof Errors) 
        res.status(err.code).json(err); 
      else 
        res.status(Errors.standard.code).json(Errors.standard); 
    }
  };


export default productController