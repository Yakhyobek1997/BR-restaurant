import MemberModel from "../schema/Member.model";
import { LoginInput, Member, MemberInput } from "../libs/types/member";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { MemberType } from "../libs/enums/member.enum";
import bcrypt from "bcryptjs";
import mongoose from 'mongoose';

class MemberService {
  private readonly memberModel: typeof MemberModel;
  // memberModel bu MongoDB model (Member collection), class ichida foydalaniladi

  constructor() {
    this.memberModel = MemberModel;
    // Konstruktor orqali modelni classga biriktirayapmiz
  }

  /* ===============================
     SPA uchun SIGNUP
     =============================== */
  public async signup(input: MemberInput): Promise<Member> {
    const salt = await bcrypt.genSalt(); 
    // Parolni xavfsiz saqlash uchun "salt" hosil qilinadi (random tuz)

    input.memberPassword = await bcrypt.hash(input.memberPassword, salt); 
    // Parol hashlanadi (kodlanadi)

    try {
        const result = await this.memberModel.create(input); 
        // Yangi member (user) MongoDBga yoziladi

        result.memberPassword = ""; 
        // Parolni API javobdan olib tashlaymiz (yashirish)

        return result.toObject() as Member; 
        // Mongoose hujjatini oddiy obyektga o‘tkazamiz va type cast qilamiz
    } catch (err) {
        console.error("Error, model: signUp", err); 
        // Xatolik bo‘lsa logga yoziladi

        throw new Errors(HttpCode.BAD_REQUEST, Message.USED_NICK_PHONE); 
        // Custom xatolik otiladi
    }
  }

  /* ===============================
     SPA uchun LOGIN
     =============================== */
  public async login(input: LoginInput): Promise<Member> {
    const member = await this.memberModel
      .findOne({ memberNick: input.memberNick }, { memberNick: 1, memberPassword: 1 })
      .exec(); 
    // memberNick bo‘yicha faqat nick va password maydonlarini olish

    if (!member) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NOT_MEMBER_NICK);
      // Agar topilmasa — custom xatolik otiladi
    }

    const isMatch = await bcrypt.compare(input.memberPassword, member.memberPassword); 
    // Kiritilgan parol bilan DBdagi hash parolni solishtirish

    if (!isMatch) {
      throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);
      // Agar parollar mos kelmasa — xato
    }

    const fullMember = await this.memberModel
      .findById(member._id)
      .lean<Member & { _id: mongoose.Types.ObjectId }>()
      .exec(); 
    // Foydalanuvchining to‘liq ma’lumotlarini olish uchun ID bo‘yicha topiladi

    if (!fullMember) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NOT_MEMBER_NICK);
      // Agar topilmasa — yana xato otiladi
    }

    return fullMember; 
    // To‘liq user qaytariladi (lean obyekt)
  }

  /*===============================
     SSR uchun SIGNUP
    =============================== */
  public async processSignup(input: MemberInput): Promise<Member> {
    const exist = await this.memberModel
      .findOne({ memberType: MemberType.RESTAURANT }) 
      .exec(); 
    // restaurant tipidagi member allaqachon bor-yo‘qligini tekshirish

    console.log("exist", exist); 

    if (exist) 
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED); 
      // Bor bo‘lsa — yaratishga ruxsat yo‘q

    const salt = await bcrypt.genSalt(); 
    input.memberPassword = await bcrypt.hash(input.memberPassword, salt); 
    // Parol hashlanadi

    try {
      const result = await this.memberModel.create(input); 
      result.memberPassword = ""; 
      // Parolni olib tashlash

      return result as unknown as Member; 
      // TypeScriptga bu Member tipida deb ko‘rsatamiz
    } catch (err) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
      // Agar yozishda xato bo‘lsa — xato otamiz
    }
  }

  /* ===============================
     SSR uchun LOGIN
     =============================== */
  public async processLogin(input: LoginInput): Promise<Member> {
    try {
        const member = await this.login(input); 
        // Avval login metodini ishlatamiz (SPA login'dan qayta foydalanish)

        const fullMember = await this.memberModel.findById(member._id).exec(); 
        // member._id bo‘yicha to‘liq hujjat olinadi

        if (!fullMember) {
            throw new Errors(HttpCode.NOT_FOUND, Message.MEMBER_NOT_FOUND); 
            // Topilmasa — xatolik otamiz
        }

        return fullMember.toObject() as Member; 
        // Mongoose hujjatini oddiy JS obyektga o‘tkazib, Member tipida qaytaramiz
    } catch (err) {
        console.error("Process Login Error:", err); 
        throw err; // Xatoni qayta tashlaymiz
    }
  }
}

export default MemberService; 





