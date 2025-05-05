import { Types } from "mongoose";
import { ViewGroup } from "../../libs/enums/view.enum";

export interface View {
  _id: Types.ObjectId;
  memberId: Types.ObjectId;
  viewRefId: Types.ObjectId;
  viewGroup: ViewGroup;
  createdAt: Date;
  updatedAt: Date;
}

export interface ViewInput {
  memberId: Types.ObjectId;
  viewRefId: Types.ObjectId;
  viewGroup: ViewGroup; 
}