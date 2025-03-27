import { T } from "../libs/types/common";
import { Request, Response } from "express";
import MemberService from "../models/Member.service";
import { AdminRequest, LoginInput, MemberInput } from "../libs/types/member";
import { MemberType } from "../libs/enums/member.enum";
import session from "express-session";
import Errors, { Message } from "../libs/Errors"


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
    res.redirect("/admin")
  }
};

// === POST: Signup (SSR) ===
restaurantController.processSignup = async (
  req: AdminRequest,
  res: Response
) => {
  try {
    console.log("processSignup");

    const newMember: MemberInput = req.body; // Formadan kelgan ma’lumotlar
    newMember.memberType = MemberType.RESTAURANT; // Foydalanuvchini tipini belgilyapmiz

    const result = await memberService.processSignup(newMember); // Service orqali ro‘yxatga olish

    req.session.member = result; // Foydalanuvchini sessiyaga yozamiz
    req.session.save(function () {
      res.send(result); // Javob qaytaramiz
    });
    
  } catch (err) {
    console.log("Error, processSignup:", err);

    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;

    res.send(`
      <script>
        alert("${message}");
        window.location.replace('/admin/signup');
      </script>
    `);
  }
};


// === POST: Login (SSR) ===
restaurantController.processLogin = async (
  req: AdminRequest,
  res: Response
) => {
  try {
    console.log("processLogin");

    const input: LoginInput = req.body; // Foydalanuvchidan kelgan login ma’lumotlari
    const result = await memberService.processLogin(input); // Service orqali login tekshiruvi
    console.log("Login input:", req.body);

    req.session.member = result; // Session'ga foydalanuvchini saqlaymiz
    req.session.save(function () {
      res.send(result); // Foydalanuvchini qaytaramiz
    });

  } catch (err) {
    console.log("Error, processLogin:", err);

    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;

    res.send(`
      <script>
        alert("${message}");
        window.location.replace('/admin/login');
      </script>
    `);
  }
};

restaurantController.logout = async (
  req: AdminRequest,
  res: Response
) => {
  try {
      console.log("logout");
      req.session.destroy(function () {
        res.redirect("/admin")
      })
  } catch (err) {
      console.log("Error, logout:", err);
      res.redirect("/admin");
  }
};


restaurantController.checkAuthSession = async (
  req: AdminRequest,
  res: Response
) => {
  try {
      console.log("checkAuthSession");
      if (req.session?.member) 
          res.send(`<script> alert("${req.session.member.memberNick}") </script>`);
      else 
          res.send(`<script> alert("${Message.NOT_AUTHENTICATED}") </script>`);
  } catch (err) {
      console.log("Error, checkAuthSession:", err);
      res.send(err);
  }
};

export default restaurantController;
