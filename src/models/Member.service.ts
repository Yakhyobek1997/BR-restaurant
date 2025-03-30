import MemberModel from "../schema/Member.model";
import { LoginInput, Member, MemberInput } from "../libs/types/member";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { MemberType } from "../libs/enums/member.enum";
import bcrypt from "bcryptjs";
import mongoose from 'mongoose';

class MemberService {
  private readonly memberModel: typeof MemberModel;

  constructor() {
    this.memberModel = MemberModel;
  }

  /* ===============================
     SPA uchun SIGNUP
     =============================== */
     public async signup(input: MemberInput): Promise<Member> {
      const salt = await bcrypt.genSalt(); // Parolni shifrlash uchun tuz (salt) yaratish
      input.memberPassword = await bcrypt.hash(input.memberPassword, salt); // Foydalanuvchi parolini tuz bilan shifrlash
  
      try {
        const result = await this.memberModel.create(input); // Yangi foydalanuvchini yaratish
        result.memberPassword = ""; // Javobda parolni bo‘sh qilib qo‘yish
        return result.toObject() as Member; // Natijani oddiy obyekt sifatida qaytarish
      } catch (err) {
        console.error("Error, model: signUp", err); // Xatoni konsolga chiqarish
        throw new Errors(HttpCode.BAD_REQUEST, Message.USED_NICK_PHONE); // Xatolikni tashlash
      }
    }

  /* ===============================
     SPA uchun LOGIN
     =============================== */
     public async login(input: LoginInput): Promise<Member> {
      const member = await this.memberModel
        .findOne({ memberNick: input.memberNick }, { memberNick: 1, memberPassword: 1 })
        .exec(); // Foydalanuvchini taxallus bo‘yicha topish
  
      if (!member) {
        throw new Errors(HttpCode.NOT_FOUND, Message.NOT_MEMBER_NICK); 
        // Agar foydalanuvchi topilmasa, xatolik tashlash
      }
  
      const isMatch = await bcrypt.compare(input.memberPassword, member.memberPassword); 
      // Parollarni solishtirish
      if (!isMatch) {
        throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD); 
        // Agar parol mos kelmasa, xatolik tashlash
      }
  
      const fullMember = await this.memberModel
        .findById(member._id)
        .lean<Member & { _id: mongoose.Types.ObjectId }>()
        .exec(); // To‘liq foydalanuvchi ma'lumotlarini olish
  
      if (!fullMember) {
        throw new Errors(HttpCode.NOT_FOUND, Message.NOT_MEMBER_NICK); 
        // Agar foydalanuvchi topilmasa, xatolik tashlash
      }
  
      return fullMember; // Foydalanuvchi ma'lumotlarini qaytarish
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
        // RegExp yordamida izlash.
        .select("+memberPassword") 
        // Explicit ravishda parolni so'rovga qo'shamiz (parol default bo'yicha qaytmaydi).
        .exec(); // So'rovni bajarish.

    if (!member) {
        // Agar foydalanuvchi topilmasa.
        throw new Errors(HttpCode.NOT_FOUND, Message.NOT_MEMBER_NICK); 
        // Maxsus xato chiqaramiz.
    }

    // 2. Foydalanuvchi parolini tekshirish.
    const isMatch = await bcrypt
    .compare(input.memberPassword, member.memberPassword); 
    // Parolni hash bilan solishtirish.
    if (!isMatch) {
        // Agar parol mos kelmasa.
        throw new Errors(HttpCode.UNAUTHORIZED,
           Message.WRONG_PASSWORD); // Maxsus xato chiqaramiz.
    }

    // 3. To‘liq foydalanuvchi ma'lumotlarini olish uchun ID bo‘yicha qayta qidiramiz.
    const fullMember = await this.memberModel.findById(member._id).exec(); // ID orqali to'liq foydalanuvchini qidiramiz.
    if (!fullMember) {
        // Agar ma'lumot topilmasa.
        throw new Errors(HttpCode.NOT_FOUND, Message.MEMBER_NOT_FOUND); // Maxsus xato chiqaramiz.
    }

    return fullMember.toObject() as Member; // Topilgan foydalanuvchi ma'lumotlarini "toObject()" orqali qaytaramiz.
}



  
  
}

export default MemberService; 





