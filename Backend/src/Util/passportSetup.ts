import IUser from '../Models/IUser';
import UserService from '../Services/userService';
const path = require('path')
require('dotenv').config({ path: path.join(process.cwd(), '.env') })
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


// export default function passportLocal() {
//   passport.use(new LocalStrategy({ userIDField: 'userID', passwordField: 'password' },
//     async function (userID: string, password: string, done: any) {
//       try {
//         if (userID && password && await UserService.checkUser(userID, password)) {
//           const user = await UserService.getUser(userID);
//           return done(null, user);
//         } else {
//           return done('Incorrect userID or password');
//         }
//       } catch (error) {
//         done(error);
//       }
//     })
//   );

export default function passportLocal() {
  passport.use(new LocalStrategy(async (userID: string, password: string, done: any) => {
    try {
      if (userID && password && await UserService.checkUser(userID, password)) {
        const user = await UserService.getUser(userID);
        return done(null, user);
      } else {
        return done('Incorrect userID or password');
      }
    } catch (error) {
      done(error);
    }
  }));



  passport.serializeUser((user: IUser, done: any) => {
    done(null, user);
  });

  passport.deserializeUser((userID: string, done: any) => {
    done(null, userID);
  });
};


