import { T } from "../libs/types/common";
import { Request, Response, NextFunction } from "express";
import MemberService from "../models/Member.service";
import { AdminRequest, LoginInput, MemberInput } from "../libs/types/member";
import { MemberType } from "../libs/enums/member.enum";
import Errors, { HttpCode, Message } from "../libs/Errors"



const memberService = new MemberService(); 
const restaurantController: T = {}; 

// === GET: Home sahifa ===
restaurantController.goHome = (req: Request, res: Response) => {
  try {
    console.log("goHome"); 
    res.render("home"); 
  } catch (err) {
    console.log("Error, goHome", err); 
  }
};

// === GET: Login sahifa ===
restaurantController.getLogin = (req: Request, res: Response) => {
  try {
    res.render("login"); 
    // Login sahifasini (views/login.ejs) render qilamiz
  } catch (err) {
    console.log("Error, getLogin", err); 
    // Xatolik logi
  }
};

// === GET: Signup sahifa ===
restaurantController.getSignup = (req: Request, res: Response) => {
  try {
    res.render("signup"); 
    // Ro‘yxatdan o‘tish sahifasini (views/signup.ejs) render qilamiz
  } catch (err) {
    console.log("Error, getSignup", err); 
    // Xatolik logi
    res.redirect("/admin"); 
    // Xatolik bo‘lsa admin sahifasiga qaytariladi
  }
};

// === POST: Signup (SSR) ===
restaurantController.processSignup = async (
  req: AdminRequest,
  res: Response
) => {
  try {
    console.log("processSignup");
    const file = req.file;
    if (!file)
      throw new Errors(HttpCode.BAD_REQUEST, Message.SOMETHING_WENT_WRONG);

    const newMember: MemberInput = req.body;
    newMember.memberImage = file?.path;
    newMember.memberType = MemberType.RESTAURANT;
    const result = await memberService.processSignup(newMember);

    req.session.member = result;
    req.session.save(function () {
      res.redirect("/admin/product/all");
    });
  } catch (err) {
    console.log("Error, processSignup:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(`
      <script>
        alert("${message}");
        window.location.replace('/admin/signup')
      </script>
    `);
  }
};


// === POST: Login (SSR) ===
restaurantController.processLogin = async (
  req: AdminRequest, // AdminRequest turidagi req
  res: Response
) => {
  try {
    console.log("processLogin");

    const input: LoginInput = req.body; 
    const result = await memberService.processLogin(input); 
    console.log("Login input:", req.body);

    req.session.member = result; 
    req.session.save(function () {
      res.redirect("/admin/product/all");
    });

  } catch (err) {
    console.log("Error, processLogin:", err);

    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG; // Xatolik xabari
    res.send(`
      <script>
        alert("${message}");
        window.location.replace('/admin/login');
      </script>
    `);
  }
};

// === GET: Logout (Sessiyani tugatish) ===
restaurantController.logout = async (req: AdminRequest, res: Response) => {
  try {
    console.log("logout"); 
    req.session.destroy(function () {
      res.redirect("/admin"); 
    });
  } catch (err) {
    console.log("Error, logout:", err); 
    res.redirect("/admin");
  }
};

// === GET: Autentifikatsiya sessiyasini tekshirish ===
restaurantController.checkAuthSession = async (req: AdminRequest, res: Response) => {
  try {
    console.log("checkAuthSession");
    if (req.session?.member) 
      res.send(`<script> alert("${req.session.member.memberNick}") </script>`)
    else 
      res.send(`<script> alert("${Message.NOT_AUTHENTICATED}") </script>`);
  } catch (err) {
    console.log("Error, checkAuthSession:", err);
    res.send(err);
  }
};

restaurantController.verifyRestaurant = (
  req: AdminRequest,
  res: Response,
  next: NextFunction
) => {

    if (req.session?.member?.memberType === MemberType.RESTAURANT) {
      req.member = req.session.member;
      next()
    } else {
      const message = Message.NOT_AUTHENTICATED
      res.send(`<script> alert("${message}") window.location.replace('/admin/login'); </script>`);
    }
};

export default restaurantController; 

