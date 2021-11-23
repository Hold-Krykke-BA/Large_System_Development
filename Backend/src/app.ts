require('dotenv').config();
import express from "express";
import path from "path";
import cors from "cors";

const app = express()
app.use(cors());

app.use(express.static(path.join(process.cwd(), "public")))

app.use("/", (req, res, next) => {
  console.log('app.ts is logging requests:', req.url)
  next()
})
app.use(express.json())
let userAPIRouter = require('./Routes/userRoutes');
let courseAPIRouter = require('./Routes/courseRoutes');



const PORT = process.env.PORT || 3333;
const server = app.listen(PORT)
console.log(`Server started, listening on port: ${PORT}`)
module.exports.server = server;