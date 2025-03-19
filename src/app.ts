// Backend server qurvommiz (Express orqali)

import express from "express" // making database server
import path from "path"
import router from "./router"
import routerAdmin from "./router-admin"
import morgan from "morgan"
import { MORGAN_FORMAT } from "./libs/config"


// 1-ENTRANCE

// 1-ENTRANCE
const app = express(); 
console.log("__dirname:", __dirname, "public");

app.use(express.static(path.join(__dirname, "public"))); 
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.use(morgan(MORGAN_FORMAT))

// 2-SESSIONS
// 3-VIEWS

// 3-VIEWS
app.set('views', path.join(__dirname, "views")); 
app.set('view engine', "ejs"); 

// 4-Routers
//BSSR: EJS backenda front end qurish
app.use('/admin', routerAdmin); // EJS admin uchun
app.use('/',router) // REACT: SPA: React rest.api server sifatida ishlatamiz
// (Middleware design pattern)
// kelyotgan zapros router ga yubor

export default app

//SPA (Single-Page Application) — bu 
// dasturlashda ishlatiladigan 
// veb-application arxitekturasi.