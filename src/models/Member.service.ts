import MemberModel from "../schema/Member.model";
import { Member, MemberInput } from "../libs/types/member";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { MemberType } from "../libs/enums/member.enum";

class MemberService {
    private readonly memberModel;

    constructor() {
        this.memberModel = MemberModel;
    }

    public async processSignup(input: MemberInput): Promise<Member> {
        try {
            // Foydalanuvchi mavjudligini tekshiramiz (memberNick va memberPhone)
            const exist = await this.memberModel.findOne({
                $or: [
                    { memberNick: input.memberNick },
                    { memberPhone: input.memberPhone }
                ]
            }).exec();

            if (exist) {
                // Qaysi maydon aynan mavjudligini aniq qilib chiqaramiz
                if (exist.memberNick === input.memberNick) {
                    throw new Errors(HttpCode.BAD_REQUEST, `"${input.memberNick} allaqachon mavjud.`);
                }
                if (exist.memberPhone === input.memberPhone) {
                    throw new Errors(HttpCode.BAD_REQUEST, `${input.memberPhone} allaqachon mavjud.`);
                }
            }

            // Agar mavjud bo‘lmasa yaratamiz
            const result = await this.memberModel.create(input);

            // Parolni yashiramiz
            result.memberPassword = "";

            return result;
        } catch (err) {
            console.error("Xatolik, processSignup:", err);
            if (err instanceof Errors) {
                throw err; // Errors tipidagi xatoni qayta tashlaymiz
            } else {
                throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.CREATE_FAILED);
            }
        }
    }
}

export default MemberService;

