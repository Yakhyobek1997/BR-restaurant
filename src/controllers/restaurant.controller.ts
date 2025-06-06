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
/* 1) Endi restaurant controler objectni go home methodini yasab ogamiz
ichida ikta parametr kevotti req va res */

// 2) Keyin arrow function bo'votti ichida try catch blockidan foydalanvommiz*/
try {
// 3) try blockni ichidan goHome methodini consolga chiqarvommiz
    console.log("goHome");

    res.render("home"); 
// 4) res render qilib home methodini ichidan home sahifaini render qivommiz
  
// 5) homega borishda xatolik bolsa catch blogi ishga tushadi
} catch (err) {

    console.log("Error, goHome", err); 
  }
};

// === GET: Login sahifa ===
restaurantController.getLogin = (req: Request, res: Response) => {
// 1) RC objecnti get login metodini yasavoldik ichida 2 ta parametr bor req va res
// ichida 2 ta blocki bor tr va catch
try {
// 2) Try blockida login methodini render qilib consolga chiqarvommiz.
    res.render("login"); 
  } catch (err) {
// 3) Keyn login methodi render bolgan vaqtda error bolsa
// catch blogi ishga tushadi.
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
//1) RestaruantConstroller objetni processLogin degan methodimiz bor
// Va iichida 2 ta parametr qabul qilgan req va res
  req: AdminRequest, // AdminRequest turidagi req
  res: Response

  // 2) Keyn try va catch blogimiz bor 
) => {
  try {
    console.log("processLogin");
// Tryda birinchi shu processLogin methodiga kelib log qiladi
    const input: LoginInput = req.body;
// Keyin req.body ni LoginInput interfazega tenglavommiz
    const result = await memberService.processLogin(input); 
// MemberServise objectni uni keyn procces login methodini call qilib inputni 
// ichiga argument sifatida berdik
// undan qaytkan resultni await orqali kutib olib const resulttga tenglavolik
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


restaurantController.getUsers = async (req: Request, res: Response) => {
  try {
    console.log("getUsers");
    const result = await memberService.getUsers()
    console.log("result",result)

    res.render("users",{users: result})
  } catch (err) {
    console.log("Error, getUsers", err); 
    res.redirect("/admin/login")
  }
};


restaurantController.updateChosenUser = async (req: Request, res: Response) => {
  try {
    console.log("updateChosenUser");
    const result = await memberService.updateChosenUser(req.body)

    res.status(HttpCode.OK).json({ data: result})
  } catch (err) {
    console.log("Error, updateChosenUser", err);
    if (err instanceof Errors) res.status(err.code).json(err)
      else res.status(Errors.standard.code).json(Errors.standard)
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

