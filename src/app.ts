import express from "express" // making database server
import path from "path"
import router from "./router"

// 1-ENTRANCE

// 1-ENTRANCE
const app = express(); // `express` funksiyasini chaqirish orqali yangi ilova yaratiladi va `app` o'zgaruvchisiga saqlanadi.
console.log("__dirname:", __dirname, "public"); 

app.use(express.static(path.join(__dirname, "public"))); // `path.join(__dirname, "public")` orqali to'liq yo'l hosil qilinadi va `express.static` yordamida "public" katalogidagi statik fayllar ishlatilvotti.
app.use(express.urlencoded({ extended: true })); // `express.urlencoded` bodi-parser middleware yordamida URL kodlangan ma'lumotlarni olishga imkon beradi.
app.use(express.json()); // `express.json` bodi-parser middleware yordamida JSON formatdagi ma'lumotlarni olishga imkon beradi.
// Body-parser orqali HTTP so'rovlaridagi bodi (request body) ma'lumotlarini
// 2-SESSIONS
// 3-VIEWS

// 3-VIEWS
app.set('views', path.join(__dirname, "views")); // `path.join(__dirname, "views")` orqali "views" to'liq yo'lini hosil qiladi va bu yo'lni ko'rinishlar katalogi sifatida belgilaydi.
app.set('view engine', "ejs"); // `EJS` (Embedded JavaScript) ni ko'rinishlar (view) shablon dvigati sifatida belgilaydi.

// 4-Routers
app.use('/',router)// (Middleware design pattern)
// kelyotgan zapros router ga yubor

export default app