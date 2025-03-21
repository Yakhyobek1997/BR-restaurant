import { Request, Response } from "express";
import { MemberInput, LoginInput } from "../libs/types/member";
import { MemberType } from "../libs/enums/member.enum";
import MemberService from "../models/Member.service";

// Controller obyekti
const restaurantController: { [key: string]: any } = {};

// Bosh sahifa
restaurantController.goHome = (req: Request, res: Response) => {
    res.send("Home Page");
};

// Login sahifasi (GET)
restaurantController.getLogin = (req: Request, res: Response) => {
    res.send("Login Page");
};

// Signup sahifasi (GET)
restaurantController.getSignup = (req: Request, res: Response) => {
    res.send("Signup Page");
};

// Login (POST)
restaurantController.processLogin = async (req: Request, res: Response) => {
    try {
        console.log("processLogin - request body:", req.body);

        const input: LoginInput = req.body;
        const memberService = new MemberService();
        const result = await memberService.processLogin(input);

        res.status(200).json(result);
    } catch (err: any) {
        console.error("Error in processLogin:", err);

        res.status(err.code || 500).json({
            code: err.code || 500,
            message: err.message || "An unexpected error occurred"
        });
    }
};

// Signup (POST)
restaurantController.processSignup = async (req: Request, res: Response) => {
    try {
        console.log("processSignup - request body:", req.body);

        const newMember: MemberInput = req.body;
        newMember.memberType = MemberType.RESTAURANT;

        const memberService = new MemberService();
        const result = await memberService.processSignup(newMember); 

        res.status(201).json(result);
    } catch (err: any) {
        console.error("Error in processSignup:", err);

        res.status(err.code || 500).json({
            code: err.code || 500,
            message: err.message || "An unexpected error occurred"
        });
    }
};

export default restaurantController;
