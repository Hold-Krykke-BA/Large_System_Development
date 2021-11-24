require('dotenv').config();
import express from "express";
import path from "path";
import cors from "cors";

const app = express()
app.use(cors());

app.use(express.static(path.join(process.cwd(), "public")))

app.use('/', (req, res, next) => {
  console.log('app.ts is logging requests:', req.url)
  next()
})
app.use(express.json())
let userAPIRouter = require('./Routes/userRoutes');
let courseAPIRouter = require('./Routes/courseRoutes');
let attendanceCheckAPIRouter = require('./Routes/attendanceCheckRoutes');
let whitelistAPIRouter = require('./Routes/whitelistRoutes');

app.use('/rolecall/users', userAPIRouter);
app.use('/rolecall/courses', courseAPIRouter);
app.use('/rolecall/attendance', attendanceCheckAPIRouter);
app.use('/rolecall/whitelist', whitelistAPIRouter);

app.use(function (req, res, next) {
  if (req.originalUrl.startsWith("/rolecall")) {
    res.status(404).json({ code: 404, msg: `this API does not contain ${req.originalUrl}` })
  }
  next()
})

const PORT = process.env.PORT || 3333;
const server = app.listen(PORT)
console.log(`Server started, listening on port: ${PORT}`)
module.exports.server = server;