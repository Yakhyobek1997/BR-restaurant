// build controllers by objects
import { T } from "../libs/types/common"
import { Request, Response } from "express"

const memberController: T = {}
memberController.goHome = (req: Request, res: Response ) =>{
    try {
        res.send("Home Page")
    } catch (err) {
        console.log("Error, goHome:",err)
    }
}


memberController.getLogin = (req: Request, res: Response ) =>{
    try {
        res.send('Login Page')
    } catch (err) {
        console.log("Error, getLogin:",err)
    }
}

memberController.getSignup = (req: Request, res: Response ) =>{
    try {
        res.send('Signup Page')
    } catch (err) {
        console.log("Error, Signup:",err)
    }
}


// routerda call qilamiz
export default memberController