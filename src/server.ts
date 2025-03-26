// Architecture pattern : MVC,DI MVP
// MVC = MODEL View Controller
// Design pattern: Middleware,Decorate


// 1)________Mongoose connection

import dotenv from "dotenv" // (env variable)
// externel package (node package manager orqali install qildik)
dotenv.config() // dot envdan cofnvig methodni execution qilamiz

import mongoose from "mongoose" // external package
import app from "./app"


mongoose //
.connect(process.env.MONGO_URL as string, {})
// assynch methodni chaqirib
.then((data) => {
    console.log('MongoDb connection succeed')
    const PORT = process.env.PORT ?? 3003  
    app.listen(PORT,function () { 
        console.log(`the server is running succesfully on port ${PORT}`)
    })
})
.catch(err => console.log("ERROR on connection MongoDB",err))