import { MemberUpdateInput } from "./../libs/types/member";
import Errors, { HttpCode, Message } from "./../libs/Errors";
import { NextFunction, Request, Response } from "express";
import {
  MemberInput,
  LoginInput,
  Member,
  ExtendedRequest,
} from "../libs/types/member";
import MemberService from "../models/Member.service";
import { T } from "../libs/types/common";
import AuthService from "../models/Auth.service";
import { AUTH_TIMER } from "../libs/config";

// MemberService klassidan bitta obyekt hosil 
// qilayapmiz, backenddagi user bilan ishlash uchun

const memberService = new MemberService();
const authService = new AuthService();

// memberController degan bo‘sh obyekt yaratyapmiz, 
// unga quyida signup, login funksiyalarini biriktiramiz
const memberController: T = {};

memberController.getRestaurant = async (req: Request, res: Response) => {
  try {
    console.log("getRestaurant");
    const result = await memberService.getRestaurant();
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error in getRestaurant:", err);

    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

// ============================
// SIGNUP HANDLER
// ============================
memberController.signup = async (req: Request, res: Response) => {
  try {
    console.log("Signup");
    const input: MemberInput = req.body;
    const result: Member = await memberService.signup(input);
    const token = await authService.createToken(result);
    res.cookie("accessToken", token, {
      maxAge: AUTH_TIMER * 3600 * 1000,
      httpOnly: false,
    });

    res.status(HttpCode.CREATED).json({ member: result, accessToken: token });
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
    res.cookie("accessToken", token, {
      maxAge: AUTH_TIMER * 3600 * 1000,
      httpOnly: false,
    });

    res.status(HttpCode.OK).json({ member: result, accessToken: token });
  } catch (err) {
    console.log("Error, login:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

memberController.logout = (req: ExtendedRequest, res: Response) => {
  try {
    console.log("logout");
    res.cookie("accessToken", null, { maxAge: 0, httpOnly: true });
    res.status(HttpCode.OK).json({ logout: true });
  } catch (err) {
    console.log("Error, logout:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

memberController.getMemberDetail = async (
  req: ExtendedRequest,
  res: Response
) => {
  try {
    console.log("getMemberDetail");
    const result = await memberService.getMemberDetail(req.member);

    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, getMemberDetail:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

memberController.updateMember = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("updateMember");
    const input: MemberUpdateInput = req.body;
    if (req.file) input.memberImage = req.file.path.replace(/\\/g, "/");

    const result = await memberService.updateMember(req.member, input);
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, getMemberDetail:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

memberController.getTopUsers = async (req: Request, res: Response) => {
  try {
    console.log("getTopUsers"); // print out qilish uchun log qivotti
    const result = await memberService.getTopUsers();
    // memberservise objectni gettop user methodini call qilib

    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, getTopUsers:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};



/*Middleware mantigi bo‘lib, userni autentifikatsiyadan o'tganligini tekshiradi */

// MemberCon ichida verifyAuth degan method bor, bu asynxron methoddir, unda await bolganligi uchun
memberController.verifyAuth = async (
// keyn 3 ta parametr qabul qiladi.
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => { // keyn ikta block bor try vacatch
  try {
    const token = req.cookies["accessToken"];
  // Birinchi  req.cookies["accessToken"] orqali token olinmoqda,
  // req objecti orqali cookie ichidan olib token nomli variablega saqlavommiz
  if (token) req.member = await authService.checkAuth(token);
  // token bo'lsa authService degan servis obyektining checkAuth degan asynchronous methodi chaqirilmoqda.
 // keyn bu methodga argument sifatida token yuborilmoqda 
    if (!req.member) // agar req.member bo'lmasa
      throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);
  // HttpCode.UNAUTHORIZED (bu 401 status kodi bo‘ladi);
    next(); // keyingi middle warega o'tadi
  } catch (err) { 
    console.log("Error, verifyAuth:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};


/* Kirib kevotkan REQ larni kimligini tekshiradi */
memberController.retrieveAuth = async ( // buyerda U asinxron (async) await ishlatadi.
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let member = null;
    const token = req.cookies["accessToken"];// req cokines ichida accessTokenni tekshiradi
    // agar token mavjud bolsa payloadni await qilib memberga yuklab beradi
    if (token) member = await authService.checkAuth(token)
// authService.checkAuth(token) orqali token dekodlanib, member aniqlanmoqda.
    if (!member)
      throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);

    res.status(HttpCode.OK).json({ member: member });
    next();
  } catch (err) {
      // Xatolik consolega log qilinadi.  
    console.log("Error, retrieveAuth:", err);

    next();
  }
};

export default memberController;
// memberController obyektini tashqariga eksport qilamiz – routing faylda ishlatish uchun
