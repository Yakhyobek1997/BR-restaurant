import { Request, Response } from "express";
import { MemberInput, LoginInput, Member } from "../libs/types/member";
import MemberService from "../models/Member.service";
import { T } from "../libs/types/common";
import Errors from "../libs/Errors";

// MemberService klassidan bitta obyekt hosil qilayapmiz, backenddagi user bilan ishlash uchun
const memberService = new MemberService();

// memberController degan bo‘sh obyekt yaratyapmiz, unga quyida signup, login funksiyalarini biriktiramiz
const memberController: T = {}; 

// ============================
// SIGNUP HANDLER
// ============================
memberController.signup = async (req: Request, res: Response) => {
  try {
    console.log("Signup"); 
    // Log: frontenddan signup so‘rovi keldi

    const input: MemberInput = req.body; 
    // Foydalanuvchidan kelgan ma’lumotlar – req.body orqali olinadi, va MemberInput turida

    const result: Member = await memberService.signup(input); 
    // MemberService ichidagi signup funksiyasiga input beramiz va result olamiz

    res.json({ member: result }); 
    // JSON formatda frontendga qaytariladi
  } catch (err) {
    console.log("Error in Signup:", err); 
    // Xatolik bo‘lsa konsolga chiqaramiz

    if (err instanceof Errors) 
      res.status(err.code).json(err); 
      // Agar bu custom Errors klassidan bo‘lsa – status code va xabar bilan qaytaramiz
    else 
      res.status(Errors.standard.code).json(Errors.standard); 
      // Boshqa xatoliklar uchun default error javobi qaytadi
  }
};


// ============================
// LOGIN HANDLER
// ============================

memberController.login = async (req: Request, res: Response) => {
  try {
    console.log("Login"); 
    // Log: login so‘rovi keldi

    const input: LoginInput = req.body; 
    // req.body orqali kelgan login ma’lumotlarini LoginInput tipida olamiz

    const result: Member = await memberService.login(input); 
    // MemberService ichidagi login funksiyasini chaqiramiz

    res.json({ member: result }); 
    // Natijani (member obyektini) JSON formatda frontendga qaytaramiz
  } catch (err) {
    console.log("Error in Login:", err); 
    // Agar xatolik bo‘lsa konsolga chiqaramiz

    if (err instanceof Errors) 
      res.status(err.code).json(err); 
      // Biz yozgan Errors klassidan bo‘lsa – mos status va xabar bilan qaytaramiz
    else 
      res.status(Errors.standard.code).json(Errors.standard); 
      // Bo‘lmasa, umumiy (standard) error qaytariladi
  }
};

export default memberController; 
// memberController obyektini tashqariga eksport qilamiz – routing faylda ishlatish uchun



