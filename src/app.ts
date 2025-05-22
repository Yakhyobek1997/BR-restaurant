import cors from "cors";

import express from "express";
import path from "path";
import router from "./router";
import routerAdmin from "./router-admin";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { MORGAN_FORMAT } from "./libs/config";

import session from "express-session";
// Sessiya boshqaruvi uchun modulni import qilamiz.
import ConnectMongoDB from "connect-mongodb-session";
import { T } from "./libs/types/common";
// Sessiyalarni MongoDB'ga ulash uchun modul.

const MongoDBStore = ConnectMongoDB(session);

const store = new MongoDBStore({
  uri: String(process.env.MONGO_URL),

  collection: "sessions",
});

// 1-ENTRANCE
const app = express();
console.log("__dirname:", __dirname, "public");

app.use(express.static(path.join(__dirname, "public"))); //
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("./uploads"));
app.use(express.json()); // res api uchun xizmat qiladi
app.use(cors({ credentials: true,  origin: true }));
app.use(cookieParser()); // Kirib kelyotkan cookilarni pares qiladi
app.use(morgan(MORGAN_FORMAT));

/** 2-SESSIONS **/

app.use(
  session({
    secret: String(process.env.SESSION_SECRET),
    cookie: {
      maxAge: 1000 * 3600 * 6, // Cookie yaroqlilik muddati: 10 sek
    },
    store: store,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(function (req, res, next) {
  const sessionInstance = req.session as T;
  res.locals.member = sessionInstance.member;
  next();
});

// 3-VIEWS expr appning settinglari.
// BSR quriloykanda ejs orqali qurilmoqda
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// 4-Routers
//BSSR: EJS backenda front end qurish
app.use("/admin", routerAdmin);
app.use("/", router); // REACT: SPA: React rest.api server sifatida ishlatamiz
// (Middleware design pattern)
// kelyotgan zapros router ga yubor

export default app;

//SPA (Single-Page Application) — bu
// dasturlashda ishlatiladigan
// veb-application arxitekturasi.
