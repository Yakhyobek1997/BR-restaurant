import MemberModel from "../schema/Member.model";
import { LoginInput, Member, MemberInput } from "../libs/types/member";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { MemberType } from "../libs/enums/member.enum";
import bcrypt from "bcryptjs";

class MemberService {
    private readonly memberModel;

    constructor() {
        this.memberModel = MemberModel;
    }


    public async processSignup(input: MemberInput): Promise<Member> {

        const exist = await this.memberModel
            .findOne({ memberType: MemberType.RESTAURANT })
            .exec();
        
        if (exist) {
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        }

        const salt = await bcrypt.genSalt(10);
        input.memberPassword = await bcrypt.hash(input.memberPassword, salt);

        try {
         
            const result = await this.memberModel.create(input);

           
            result.memberPassword = "";

            return result.toObject() as Member;
        } catch (err) {
            console.error("Signup Error:", err);
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        }
    }

    // Tizimga kirish (Login)
    public async processLogin(input: LoginInput): Promise<Member> {
        try {
       
            const member = await this.memberModel
                .findOne({ memberNick: input.memberNick })
                .select("+memberPassword") 
                .exec();

            if (!member) {
                throw new Errors(HttpCode.NOT_FOUND, Message.NOT_MEMBER_NICK);
            }

            const isMatch = await bcrypt.compare(input.memberPassword, member.memberPassword);
            if (!isMatch) {
                throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);
            }

         
            member.memberPassword = "";

            return member.toObject() as Member;
        } catch (err) {
            console.error("Login Error:", err);
            throw err;
        }
    }
}

export default MemberService;



