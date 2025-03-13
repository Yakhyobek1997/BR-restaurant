import express from "express"
import path from "path"

// 1-ENTRANCE

const app = express()
console.log("__dirname:",__dirname)
app.use(express.static(path.join()))


// 2-SESSIONS
// 3-ENTRANCE
// 4-ENTRANCE

export default app