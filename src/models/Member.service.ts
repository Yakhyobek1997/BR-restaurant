import MemberModel from "../schema/Member.model";
import { Member, MemberInput } from "../libs/types/member";
import Errors, { HttpCode } from "../libs/Errors";

class MemberService {
    private readonly memberModel = MemberModel;

    public async processSignup(input: MemberInput): Promise<Member> {
        const exist = await this.memberModel.findOne({
            $or: [{ memberNick: input.memberNick }, { memberPhone: input.memberPhone }]
        }).exec();

        if (exist) throw new Errors(HttpCode.BAD_REQUEST, "Username yoki telefon raqami allaqachon mavjud!");

        const result = await this.memberModel.create(input);
        result.memberPassword = "";
        return result;
    }
}

export default MemberService;


