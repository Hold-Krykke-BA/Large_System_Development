import IUser from '../Models/IUser';
import UserService from '../Services/userService';
const path = require('path')
require('dotenv').config({ path: path.join(process.cwd(), '.env') })
var passport = require('passport');
var LocalStrategy = require('passport-local');


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

// // ************************************************************************************
// export default function passportLocal() {
//   passport.use(new LocalStrategy.Strategy((userID: string, password: string, done: any) => {
//     console.log("local", userID, password)
//     return done(null, { id: 1, username: "sam" })
//   }))

//   passport.serializeUser((user: IUser, done: any) => {
//     done(null, user);
//   });

//   passport.deserializeUser((userID: string, done: any) => {
//     done(null, userID);
//   });
// }
// //**************************************************************************************

export default function passportLocal() {
  console.log('default')
  passport.use(new LocalStrategy(
    async function (userID: string, password: string, done: any) {
      console.log('inner function')
      if (userID && password && await UserService.checkUser(userID, password)) {
        console.log('in if')
        const user = await UserService.getUser(userID);
        return done(null, user);
      } else {
        console.log('in else')
        return done('Incorrect userID or password');
      }
    }))

  passport.serializeUser((user: IUser, done: any) => {
    done(null, user);
  });

  passport.deserializeUser((userID: string, done: any) => {
    done(null, userID);
  });
}




// export default function passportLocal() {
//   console.log('hitting passportLocal')
//   passport.use(new LocalStrategy({ userID: 'userID', password: 'password' },
//     async function (userID: string, password: string, done: any) {
//       //(async (userID: string, password: string) => {
//       console.log('before try ************')
//       try {
//         console.log('in try ************')
//         console.log('userID', userID)
//         console.log('password', password)
//         if (userID && password && await UserService.checkUser(userID, password)) {
//           const user = await UserService.getUser(userID);
//           return done(null, user);
//         } else {
//           return done('Incorrect userID or password');
//         }
//       } catch (error) {
//         done(error);
//       }
//     }));



//   passport.serializeUser((user: IUser, done: any) => {
//     done(null, user);
//   });

//   passport.deserializeUser((userID: string, done: any) => {
//     done(null, userID);
//   });
// };


