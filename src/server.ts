// Architecture pattern : MVC,DI MVP
// MVC = MODEL View Controller
// Design pattern: Middleware,Decorate

import dotenv from "dotenv"
dotenv.config() // dot envdan cofnvig methodni execution qilamiz

console.log("PORT:",process.env.PORT)
console.log("MONGO_URL:",process.env.MONGO_URL)