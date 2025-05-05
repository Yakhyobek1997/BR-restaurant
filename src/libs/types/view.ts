import mongoose, { ObjectId } from "mongoose";
import { ViewGroup } from './../enums/view.enum';


export interface View {
    _id: mongoose.Types.ObjectId;
    ViewGroup: ViewGroup;
    memberId: ObjectId;
    viewRefId: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}


export interface ViewInput {
    memberId: mongoose.Types.ObjectId;
    viewRefId: mongoose.Types.ObjectId;
    viewGroup: ViewGroup; // ✅ to‘g‘ri nom
  }