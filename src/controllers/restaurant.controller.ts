import { Member } from './../libs/types/member';
// build controllers by objects
import { Request, Response } from "express"
import { T } from "../libs/types/common"
import MemberService from "../models/Member.service"
import { LoginInput, MemberInput } from "../../src/libs/types/member"
import { MemberType } from "../../src/libs/enums/member.enum"


// import MemberService from "../models/member.service" 

const restaurantController: T = {}
restaurantController.goHome = (req: Request, res: Response ) =>{
    try {
        res.send("Home Page")
    } catch (err) {
        console.log("Error, goHome:",err)
    }
}


restaurantController.getLogin = (req: Request, res: Response ) =>{
    try {
        res.send('Login Page')
    } catch (err) {
        console.log("Error, getLogin:",err)
    }
}

restaurantController.getSignup = (req: Request, res: Response ) => {
    try {
        res.send('Signup Page')
    } catch (err) {
        console.log("Error, Signup:",err)
    }
}


restaurantController.processLogin = async (req: Request, res: Response ) =>{
    try {
        console.log("processLogin")
        console.log("body:",req.body)
        const input: LoginInput = req.body

        const memberService = new MemberService()
        const result = await memberService.processLogin(input)
        res.send(result)
    } catch (err) {
        console.log("Error, Login:",err)
        res.send(err)
    }
}


restaurantController.processSignup = async (req: Request, res: Response) => {
    try {
        console.log("processSignup");

        const newMember: MemberInput = req.body;
        newMember.memberType = MemberType.RESTAURANT;

        const memberService = new MemberService();
        const result = await memberService.processSignup(newMember);

        res.send(result);
    } catch (err) {
        console.log("Error, processSignup:", err);
        res.send(err);
    }
}


// routerda call qilamiz
export default restaurantController