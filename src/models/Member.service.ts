import MemberModel from "../schema/Member.model";
import { LoginInput, Member, MemberInput } from "../libs/types/member";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { MemberType } from "../libs/enums/member.enum";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

class MemberService {
  private readonly memberModel: typeof MemberModel;

  constructor() {
    this.memberModel = MemberModel;
  }

  /* ===============================
     SPA uchun SIGNUP
     =============================== */
  public async signup(input: MemberInput): Promise<Member> {
    const salt = await bcrypt.genSalt();
    input.memberPassword = await bcrypt.hash(input.memberPassword, salt);

    try {
      const result = await this.memberModel.create(input);
      result.memberPassword = "";
      return result.toObject() as Member;
    } catch (err) {
      console.error("Error, model: signUp", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.USED_NICK_PHONE);
    }
  }

  /* ===============================
     SPA uchun LOGIN
     =============================== */
  public async login(input: LoginInput): Promise<Member> {
    const member = await this.memberModel
      .findOne(
        { memberNick: input.memberNick },
        { memberNick: 1, memberPassword: 1 }
      )
      .exec();

    if (!member) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NOT_MEMBER_NICK);
    }

    const isMatch = await bcrypt.compare(
      input.memberPassword,
      member.memberPassword
    );

    if (!isMatch) {
      throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);
    }

    const fullMember = await this.memberModel
      .findById(member._id)
      .lean<Member & { _id: mongoose.Types.ObjectId }>()
      .exec();

    if (!fullMember) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NOT_MEMBER_NICK);
    }

    return fullMember;
  }

  /*===============================
     SSR uchun SIGNUP
    =============================== */
  public async processSignup(input: MemberInput): Promise<Member> {
    // 1. RESTAURANT turidagi foydalanuvchining mavjudligini tekshirish
    const exist = await this.memberModel
      .findOne({ memberType: MemberType.RESTAURANT })
      .exec();
    if (exist) throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);

    // 2. Parolni xesh qilish uchun tuzuvchi yaratish
    const salt = await bcrypt.genSalt();
    input.memberPassword = await bcrypt.hash(input.memberPassword, salt);

    // 3. Yangi foydalanuvchini yaratish
    try {
      const result = await this.memberModel.create(input);
      result.memberPassword = "";
      return result as unknown as Member;
    } catch (err) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  public async processLogin(input: LoginInput): Promise<Member> {
    // 1. Foydalanuvchini taxallus (nickname) bo‘yicha qidirish, kichik-bosh harf sezgir emas (case-insensitive).
    const member = await this.memberModel
      .findOne({ memberNick: new RegExp(`^${input.memberNick}$`, "i") })

      .select("+memberPassword")

      .exec(); // So'rovni bajarish.

    if (!member) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NOT_MEMBER_NICK);
    }

    // 2. Foydalanuvchi parolini tekshirish.
    const isMatch = await bcrypt.compare(
      input.memberPassword,
      member.memberPassword
    );

    if (!isMatch) {
      throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);
    }

    // 3. To‘liq foydalanuvchi ma'lumotlarini olish uchun ID bo‘yicha qayta qidiramiz.
    const fullMember = await this.memberModel.findById(member._id).exec();
    if (!fullMember) {
      // Agar ma'lumot topilmasa.
      throw new Errors(HttpCode.NOT_FOUND, Message.MEMBER_NOT_FOUND);
    }

    return fullMember.toObject() as Member;
  }
}

export default MemberService;
