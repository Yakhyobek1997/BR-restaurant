// Backend server qurvommiz (Express orqali)

import express from "express" // making database server
import path from "path"
import router from "./router"
import routerAdmin from "./router-admin"
import morgan from "morgan"
import { MORGAN_FORMAT } from "./libs/config"

import session from "express-session"
import ConnectMongoDB from "connect-mongodb-session"

const MongoDBStore =  ConnectMongoDB(session)

const store = new MongoDBStore({
    uri: String(process.env.MONGO_URL),
    collection: "sessions",
})


// 1-ENTRANCE
const app = express(); 
console.log("__dirname:", __dirname, "public");

app.use(express.static(path.join(__dirname, "public"))); 
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.use(morgan(MORGAN_FORMAT))

// 2-SESSIONS

/** 2-SESSIONS **/
app.use(
    session({
      secret: String(process.env.SESSION_SECRET),
      cookie: {
        maxAge: 1000 * 3600 * 6, // Cookie yaroqlilik muddati: 10 sek
      },
      store: store, // MongoDB sessiya saqlash joyi
      resave: true, // Sessiyalarni qayta saqlash (10:30 auth => 13:30 , 31 da yoqoladi)
      saveUninitialized: true // Bo'sh sessiyalarni saqlash
    })
  );
  


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