import { HttpCode, Message } from "../libs/Errors";
import Errors from "../libs/Errors";
import { View, ViewInput } from "../libs/types/view";
import ViewModel from "../schema/View.model";

class ViewService {
    private readonly viewModel;
  
    constructor() {
      this.viewModel = ViewModel;
    }
  
    // Define
    public async checkViewExistence(input: ViewInput): Promise<View | null> {
    // checkViewExistence asyn method va uni 1 ta parametr bor input digan
    // O'zida Promise View va null ni qaytaradi
      const result = await this.viewModel // viewModel schema modelni
        .findOne({ memberId: input.memberId, viewRefId: input.viewRefId })
    // findOne static methodni chaqirib, unga bitta argument berib execute qilib
    // undan qaytkanni resultga tenglaashtirganmiz
        .exec();
  
      return result ? result.toObject() as View : null;
    }
  
    public async insertMemberView(input: ViewInput): Promise<View> {
 // insertMemberView public async method xisoblanadi
 // bitta parametr qabulqilb Promise ga qaytarvotti
      try {
        const doc = await this.viewModel.create(input);
    // viewModel schema modelni call qilib 
    // unga create static sifatida chaqirib unga input argument sifatiga berdik
        return doc.toObject() as View;
      } catch (err) {
        console.log("ERROR, model:insertMemberView:", err);
        throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
      }
    }
  }
  

export default ViewService;



