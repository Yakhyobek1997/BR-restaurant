import { ExtendedRequest } from "../libs/types/member";
import { T } from "../libs/types/common";
import { Response } from "express";
import Errors, { HttpCode, Message } from "../libs/Errors";
import OrderService from "../models/Order.service";
import { OrderInquiry, OrderUpdateInput } from "../libs/types/order";
import { OrderStatus } from "../libs/enums/order.enum";

const orderService = new OrderService(); 
// OrderService moduldan instance olamiz

const orderController: T = {};

orderController.createOrder = async (req: ExtendedRequest, res: Response) => { 
  try {
    console.log("createOrder");
    const result = await orderService.createOrder(req.member, req.body);
// Bu yerda orderService obyektidagi createOrder() methodi chaqirilmoqda.
// req.member, req.body ikta argument bor va 
// createOrder() function order yaratadi, va natijani result ga qaytaradi.
    res.status(HttpCode.CREATED).json({ result });
// yaxshi o‘tsa, HTTP javobi qaytadi: 
// Status kodi: 201 Created (bu HttpCode.CREATED)

  } catch (err) {
    console.log("Error, createOrder:", err);
// try ichida xatolik bo‘lsa (validation, DB error)
// catch blokda ushlanadi va console.log() orqali konsolga chiqarilad
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

orderController.getMyOrders = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("getMyOrders");
    const { page, limit, orderStatus } = req.query; 
    // req ni query dan qabul qilib
    // keyn page, limit, va orderStatus 
    // qiymatlari URL query string'dan olinmoqda.
    const inquiry: OrderInquiry = {
       // inquiry ni xosilqilib typeni OrderInquiry bilan belgilabommiz 
      page: Number(page), 
      // page ni numberga wrap qivommiz
      limit: Number(limit),
      orderStatus: orderStatus as OrderStatus,
    };
    console.log("inquiry:", inquiry);
    const result = await orderService.getMyOrders(req.member, inquiry);
  // Bu yerda orderService — bu obyekt (odatda bu OrderService klassidan yaratilgan instans).
// Uning ichida getMyOrders() degan method bor.

    res.status(HttpCode.CREATED).json(result);
  } catch (err) {
    console.log("Error, getMyOrders:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

orderController.updateOrder = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("updateOrder");
    const input: OrderUpdateInput = req.body;
    const result = await orderService.updateOrder(req.member, input);

    res.status(HttpCode.CREATED).json(result);
  } catch (err) {
    console.log("Error, updateOrder:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export default orderController;

