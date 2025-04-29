import { Request, Response } from "express";
import { MemberInput, LoginInput, Member } from "../libs/types/member";
import MemberService from "../models/Member.service";
import { T } from "../libs/types/common";
import Errors from "../libs/Errors";
import AuthService from "../models/Auth.service";
import { token } from "morgan";

// MemberService klassidan bitta obyekt hosil qilayapmiz, backenddagi user bilan ishlash uchun
const memberService = new MemberService();
const authService = new AuthService();

// memberController degan bo‘sh obyekt yaratyapmiz, unga quyida signup, login funksiyalarini biriktiramiz
const memberController: T = {};

// ============================
// SIGNUP HANDLER
// ============================
memberController.signup = async (req: Request, res: Response) => {
  try {
    console.log("Signup");
    const input: MemberInput = req.body;
    const result: Member = await memberService.signup(input);
    const token = await authService.createToken(result)


    res.json({ member: result });
  } catch (err) {
    console.log("Error in Signup:", err);

    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

// ============================
// LOGIN HANDLER
// ============================

memberController.login = async (req: Request, res: Response) => {
  try {
    console.log("login");
    const input: LoginInput = req.body,
      result = await memberService.login(input),
      token = await authService.createToken(result);
    console.log("token=>", token);
    // TODO: TOKENS AUTHENTICATION

    res.json({ member: result });
  } catch (err) {
    console.log("Error, login:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export default memberController;
// memberController obyektini tashqariga eksport qilamiz – routing faylda ishlatish uchun
