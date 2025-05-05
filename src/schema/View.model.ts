import mongoose from "mongoose";
import { ViewGroup } from "../libs/enums/view.enum";

const ViewSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, required: true },
  viewRefId: { type: mongoose.Schema.Types.ObjectId, required: true },
  viewGroup: {
    type: String,
    enum: Object.values(ViewGroup),
    required: true
  }
}, { timestamps: true });

export default mongoose.model("View", ViewSchema);
