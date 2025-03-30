import express from "express" 
import path from "path" 
import router from "./router" 
import routerAdmin from "./router-admin" 
import morgan from "morgan" 
import { MORGAN_FORMAT } from "./libs/config"

import session from "express-session" 
// Sessiya boshqaruvi uchun modulni import qilamiz.
import ConnectMongoDB from "connect-mongodb-session"
import { T } from "./libs/types/common"
 // Sessiyalarni MongoDB'ga ulash uchun modul.

const MongoDBStore = ConnectMongoDB(session) 
// `connect-mongodb-session` orqali sessiya saqlash omborini yaratamiz.

// MongoDB'da sessiyalarni saqlash uchun `MongoDBStore` yaratiladi.
const store = new MongoDBStore({
    uri: String(process.env.MONGO_URL), 
    // MongoDB URL'ni `.env` faylidan olamiz.
    collection: "sessions", 
    // Sessiyalarni saqlash uchun 
    // "sessions" deb nomlangan kolleksiya ishlatiladi.
})

// 1-ENTRANCE
const app = express();
console.log("__dirname:", __dirname, "public"); 
// Katalog va `public` papkasi haqida ma'lumot chiqaramiz.

// Statik fayllarga xizmat ko'rsatish uchun katalogni belgilaymiz.
app.use(express.static(path.join(__dirname, "public"))); 

// Forma (form) ma'lumotlarini o'qishga imkon beradigan sozlama.
app.use(express.urlencoded({ extended: true })); 

// JSON formatidagi ma'lumotlarni qayta ishlash uchun middleware.
app.use(express.json());

// HTTP loglarini `morgan` yordamida yozish.
app.use(morgan(MORGAN_FORMAT));


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
  
app.use(function(req,res, next) {
 const sessionInstance = req.session as T
 res.locals.member = sessionInstance.member
 next()
})



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