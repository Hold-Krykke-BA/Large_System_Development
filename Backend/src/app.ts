require('dotenv').config();
import express from 'express';
import path from 'path';
import cors from 'cors';
import connection from './Services/databaseService';
import UserService from './Services/userService';
import CourseService from './Services/courseService';
import AttendanceCheckService from './Services/attendanceCheckService';
import WhitelistService from './Services/whitelistService';
import { ValidationError } from './Errors/validationError';
import passport from 'passport';
import passportLocal from './Util/passportSetup';
import IUser from './Models/IUser';
import { AuthorizationError } from './Errors/AuthorizationError';
import { jwtAuthPayload } from './Util/Types';
import { useAuthorization } from './Util/useAuthorization';
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const tokenExpirationInSeconds = Number(process.env.TOKEN_EXPIRATION);

(async function setup() {
  const client = await connection();
  await UserService.setDatabase(client);
  await CourseService.setDatabase(client);
  await AttendanceCheckService.setDatabase(client);
  await WhitelistService.setDatabase(client);
})();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var requestIp = require('request-ip');
app.use(requestIp.mw());
app.use(cors());
passportLocal();
app.use(passport.initialize());
app.set('trust proxy', true);

app.use(express.static(path.join(process.cwd(), 'public')));

app.get('/', (req, res, next) => res.send('<h1> Hello World </h1>'));

app.use('/', (req, res, next) => {
  console.log('app.ts is logging requests:', req.url);
  next();
});

app.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (error: Error, user: any) => {
    if (error || !user) {
      res.status(400).json({ error });
      return;
    }
    const payload: jwtAuthPayload = { userID: user.userID, isTeacher: user.isTeacher };
    req.login(payload, { session: false }, (error) => {
      if (error) {
        res.status(400).send({ error });
      }
      const token = jwt.sign(payload, process.env.SECRET, {
        expiresIn: tokenExpirationInSeconds,
      });
      res.status(200).send({
        token: token,
      });
    });
  })(req, res);
});

app.use(express.json());

let userAPIRouter = require('./Routes/userRoutes');
let courseAPIRouter = require('./Routes/courseRoutes');
let attendanceCheckAPIRouter = require('./Routes/attendanceCheckRoutes');
let whitelistAPIRouter = require('./Routes/whitelistRoutes');

app.use('/rolecall/users', useAuthorization, userAPIRouter);
app.use('/rolecall/courses', useAuthorization, courseAPIRouter);
app.use('/rolecall/attendance', useAuthorization, attendanceCheckAPIRouter);
app.use('/rolecall/whitelist', useAuthorization, whitelistAPIRouter);

app.use(function (req, res, next) {
  if (req.originalUrl.startsWith('/rolecall')) {
    res.status(404).json({ code: 404, msg: `this API does not contain ${req.originalUrl}` });
  }
  next();
});

app.use(function (err: any, req: any, res: any, next: Function) {
  if (err instanceof ValidationError) {
    const e = <ValidationError>err;
    return res.status(e.errorCode).send({ code: e.errorCode, message: e.message });
  } else if (err instanceof AuthorizationError) {
    const e = <AuthorizationError>err;
    return res.status(e.errorCode).send({ code: e.errorCode, message: e.message });
  }
  next(err);
});

const PORT = process.env.PORT || 3333;
const server = app.listen(PORT);

console.log(`Server started, listening on port: ${PORT}`);
module.exports.server = server;
