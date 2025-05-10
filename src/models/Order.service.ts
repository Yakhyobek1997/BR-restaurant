import {
  Order,
  OrderInquiry,
  OrderItemInput,
  OrderUpdateInput,
} from "../libs/types/order";
import { Member } from "../libs/types/member";
import OrderModel from "../schema/Order.model";
import OrderItemModel from "../schema/OrderItem.model";
import { shapeIntoMongooseObjectId } from "../libs/config";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { PipelineStage, Types } from "mongoose";
import MemberService from "./Member.service";
import { OrderStatus } from "../libs/enums/order.enum";

class OrderService { // OrderService klassi ichida
//  orderModel, orderItemModel, va memberService 
// degan obyektlar private readonly sifatida belgilavommiz 
  private readonly orderModel = OrderModel;
  private readonly orderItemModel = OrderItemModel;
  private readonly memberService = new MemberService();
  // bu yerda memberService dan yangi Object yaratilvotti


constructor() { // Bu Contstructor metodi parametr omagan
  // va ichida 3 ta obejct bor
    this.orderModel = OrderModel // DB bilan ishlash uchun
    this.orderItemModel = OrderItemModel // DB bilan ishlash uchun
    this.memberService = new MemberService()
// memberService esa boshqa classdan olingan obyekt bo'lib,
//  user/member bilan ishlaydigan metodlarni chaqirish uchun kerak bo‘ladi
}


  // CREATE ORDER
  public async createOrder(
    member: Member, // parametr
    input: OrderItemInput[] // parametr
  ): Promise<Order> { // method (return type: Order)
    const memberId = shapeIntoMongooseObjectId(member._id);
// member ni ichidagi Id dan qabul qivommiz,shaping qilib memberId ga tenglashtirdik
    const amount = input.reduce((sum, item) => {
// amount constantani xosil qilib input arrayni reduce methodi orqali
// dastafkani umumiy narxini xisoblimiz
      return sum + item.itemQuantity * item.itemPrice;
    }, 0);
    const delivery = amount < 100 ? 5 : 0; 
  // 100 ga teng yoki oshiq bolsa dastafka teikng qilib

    try {  // order Schema modeldan foydalanib
      const created = await this.orderModel.create({
         // create static method
        orderTotal: amount + delivery, 
        //orderTotal teng boladi  amount + deliver ga
        orderDelivery: delivery, 
        // orderDelivery ni  delivery ga tenglashtirdik
        memberId,
        orderStatus: OrderStatus.PAUSE, //
      });
// Create bo'lganda order qaytish kerak
      const newOrder: Order = created.toObject();
    // 
      const orderId = new Types.ObjectId(newOrder._id.toString());
      await this.recordOrderItem(orderId, input);

      return newOrder;
    } catch (err) {
      console.log("Error, createOrder:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  // RECORD ORDER ITEMS
// Orderga aloqador bolgan itemlarni record qil
  private async recordOrderItem(
    orderId: Types.ObjectId, //orderId ni ObjectId ga tegishlikan
    input: OrderItemInput[] // Array , OrderItemInput dan tashklik topkan qildik
  ): Promise<void> {
    const insertList = input.map((item) => ({
 // Kirib kegan inputni map itiration methoddan fodyalan
      itemQuantity: item.itemQuantity,
      itemPrice: item.itemPrice,
      orderId,
      productId: shapeIntoMongooseObjectId(item.productId),
    }));

    await this.orderItemModel.insertMany(insertList); 
    // oderItemModel foydalanib creation amalga oshiramiz
    console.log("Order items inserted:", insertList.length);
  }

  // GET USER ORDERS
  public async getMyOrders(
    member: Member,
    inquiry: OrderInquiry
  ): Promise<Order[]> { //Promise Order[] massivini qaytaradi (async)
    const memberId = shapeIntoMongooseObjectId(member._id);
   //  member._id ni ObjectId formatga o‘tkazyapmiz.

    const pipeline: PipelineStage[] = [
    // MongoDB aggregate() ichiga kiritiladigan pipeline array yaratyapmiz.
      { $match: { memberId, orderStatus: inquiry.orderStatus } },
    // MemberId va orderStatus mos tushadigan orderlarni olamiz
      { $sort: { updatedAt: -1 } },
    // $sort — orderlarni oxirgi yangilangan vaqt bo‘yicha kamayish tartibida saralaydi
      { $skip: (inquiry.page - 1) * inquiry.limit },
    // $skip  (pagination): Nechta hujjatni o‘tkazib yuborish kerakligini hisoblaydi
      { $limit: inquiry.limit },
    // $limit   inquiry ga limit berib sahifada nechta orderlgini ko'ratamiz
      {
        $lookup: { // Har bir order uchun orderItems larni qo‘shib beradi
          from: "orderitems",
          localField: "_id",
          foreignField: "orderId",
          as: "orderItems",
        },
      },
      {
        $lookup: { // $lookup, lekin bu safar products collection bilan:
          from: "products",
          localField: "orderItems.productId",
          foreignField: "_id",
          as: "productData",
        },
      },
    ];

    const result = await this.orderModel.aggregate(pipeline).exec();
    // orderModel ni ichidan aggregate methodni ishlatib pipeline ni argum qib berdik
    // exec qilib lutib resultga tengladik


    if (!result || result.length === 0) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    }

    return result as Order[];
  }

  // UPDATE ORDER STATUS
  public async updateOrder(
    member: Member,
    input: OrderUpdateInput
  ): Promise<Order> { // Bu metod Promise<Order> tipidagi 
  // natijani  ya’ni yangilangan orderni qaytaradi.
    // Bu yerda uchta local Variable e'lon qivommiz
    const memberId = shapeIntoMongooseObjectId(member._id),
      orderId = shapeIntoMongooseObjectId(input.orderId),
      orderStatus = input.orderStatus;

    const result = await this.orderModel
      .findOneAndUpdate(
        {
          memberId: memberId,
          _id: orderId,
        },
        { orderStatus: orderStatus },
        { new: true }
      )
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);

    if (orderStatus === OrderStatus.PROCESS) {
      await this.memberService.addUserPoint(member, 1)
    }
  return result.toObject() as Order; 
  }
}

export default OrderService;

// return result.toObject() as Order; 