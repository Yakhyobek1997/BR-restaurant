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

class OrderService {
  private readonly orderModel = OrderModel;
  private readonly orderItemModel = OrderItemModel;
  private readonly memberService = new MemberService();


constructor() {
    this.orderModel = OrderModel
    this.orderItemModel = OrderItemModel
    this.memberService = new MemberService()
}


  // CREATE ORDER
  public async createOrder(
    member: Member,
    input: OrderItemInput[]
  ): Promise<Order> {
    const memberId = shapeIntoMongooseObjectId(member._id);

    const amount = input.reduce((sum, item) => {
      return sum + item.itemQuantity * item.itemPrice;
    }, 0);
    const delivery = amount < 100 ? 5 : 0;

    try {
      const created = await this.orderModel.create({
        orderTotal: amount + delivery,
        orderDelivery: delivery,
        memberId,
        orderStatus: OrderStatus.PAUSE,
      });

      const newOrder: Order = created.toObject(); // toObject for typing
      const orderId = new Types.ObjectId(newOrder._id.toString());
      await this.recordOrderItem(orderId, input);

      return newOrder;
    } catch (err) {
      console.log("Error, createOrder:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  // RECORD ORDER ITEMS
  private async recordOrderItem(
    orderId: Types.ObjectId,
    input: OrderItemInput[]
  ): Promise<void> {
    const insertList = input.map((item) => ({
      itemQuantity: item.itemQuantity,
      itemPrice: item.itemPrice,
      orderId,
      productId: shapeIntoMongooseObjectId(item.productId),
    }));

    await this.orderItemModel.insertMany(insertList);
    console.log("Order items inserted:", insertList.length);
  }

  // GET USER ORDERS
  public async getMyOrders(
    member: Member,
    inquiry: OrderInquiry
  ): Promise<Order[]> {
    const memberId = shapeIntoMongooseObjectId(member._id);

    const pipeline: PipelineStage[] = [
      { $match: { memberId, orderStatus: inquiry.orderStatus } },
      { $sort: { updatedAt: -1 } },
      { $skip: (inquiry.page - 1) * inquiry.limit },
      { $limit: inquiry.limit },
      {
        $lookup: {
          from: "orderitems",
          localField: "_id",
          foreignField: "orderId",
          as: "orderItems",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "orderItems.productId",
          foreignField: "_id",
          as: "productData",
        },
      },
    ];

    const result = await this.orderModel.aggregate(pipeline).exec();

    if (!result || result.length === 0) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    }

    return result as Order[];
  }

  // UPDATE ORDER STATUS
  public async updateOrder(
    member: Member,
    input: OrderUpdateInput
  ): Promise<Order> {
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