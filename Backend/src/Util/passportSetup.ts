import IUser from '../Models/IUser';
import UserService from '../Services/userService';
const path = require('path')
require('dotenv').config({ path: path.join(process.cwd(), '.env') })
const passport = require('passport');
const LocalStrategy = require('passport-local');


export default function passportLocal() {
  passport.use(new LocalStrategy({ usernameField: 'userID', passwordField: 'password' },
    async function (userID: string, password: string, done: any) {
      try {
        if (userID && password && await UserService.checkUser(userID, password)) {
          const user = await UserService.getUser(userID);
          return done(null, user);
        } else {
          return done('Incorrect useremail / password');
        }
      } catch (error) {
        done(error);
      }
    })
  );

  passport.serializeUser((user: IUser, done: any) => {
    done(null, user);
  });

  passport.deserializeUser((userID: string, done: any) => {
    done(null, userID);
  });
};


