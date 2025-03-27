import { T } from "../libs/types/common";
import { Request, Response } from "express";
import MemberService from "../models/Member.service";
import { AdminRequest, LoginInput, MemberInput } from "../libs/types/member";
import { MemberType } from "../libs/enums/member.enum";
import session from "express-session";


// MemberService instansiyasi
const memberService = new MemberService();

// Controller obyekti
const restaurantController: T = {};

// === GET: Home sahifa ===
restaurantController.goHome = (req: Request, res: Response) => {
  try {
    console.log("goHome"); // Log
    res.render("home");    // views/home.ejs sahifasini render qiladi
  } catch (err) {
    console.log("Error, goHome", err); // Xatolik bo‘lsa logga yoziladi
  }
};

// === GET: Login sahifa ===
restaurantController.getLogin = (req: Request, res: Response) => {
  try {
    res.render("login"); // views/login.ejs sahifasini ko‘rsatadi
  } catch (err) {
    console.log("Error, getLogin", err);
  }
};

// === GET: Signup sahifa ===
restaurantController.getSignup = (req: Request, res: Response) => {
  try {
    res.render("signup"); // views/signup.ejs sahifasini ko‘rsatadi
  } catch (err) {
    console.log("Error, getSignup", err);
  }
};

// === POST: Signup (SSR) ===
restaurantController.processSignup = async (req: AdminRequest, res: Response) => {
  try {
    console.log("Process Signup");
    console.log("body", req.body);

    const newMember: MemberInput = req.body; // req.body dan member ma’lumotlari olinadi
    newMember.memberType = MemberType.RESTAURANT; // memberType ni RESTAURANT qilib beramiz

    const result = await memberService.processSignup(newMember); // DB ga yozamiz
    // TO DO: Sessions Auth
    req.session.member = result
    req.session.save(function() {
      res.send(result)
    })

  } catch (err) {
    console.log("Error, process Signup:", err); // Xatolik logi
    res.send(err); // Xatolikni yuboramiz
  }
};

// === POST: Login (SSR) ===
restaurantController.processLogin = async (req: AdminRequest, res: Response) => {
  try {
    console.log("Process login");
    console.log("body", req.body);

    const input: LoginInput = req.body; // Login ma’lumotlarini olamiz
    const result = await memberService.processLogin(input); // Login tekshiriladi

    req.session.member = result
    req.session.save(function() {
      res.send(result)
    })

  } catch (err) {
    console.log("Error, Proccess Login:", err); // Xatolik logi
    res.send(err); // Xatolikni yuboramiz
  }
};

export default restaurantController; // Controller eksport qilinadi (router.ts uchun)
