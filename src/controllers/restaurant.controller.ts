// build controllers by objects
import { Request, Response } from "express"
import { T } from "../libs/types/common"
import MemberService from "../models/Member.service"


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

restaurantController.getSignup = (req: Request, res: Response ) =>{
    try {
        res.send('Signup Page')
    } catch (err) {
        console.log("Error, Signup:",err)
    }
}


restaurantController.processLogin = (req: Request, res: Response ) =>{
    try {
        console.log("processLogin")
        res.send('Done')
    } catch (err) {
        console.log("Error, Login:",err)
    }
}


restaurantController.processSignup = (req: Request, res: Response ) =>{
    try {
        console.log("processSignup")
        res.send('Done')
    } catch (err) {
        console.log("Error, processSignup:",err)
    }
}


// routerda call qilamiz
export default restaurantController