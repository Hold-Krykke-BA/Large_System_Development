import express from "express";
const router = express.Router();
import connection from "../Services/databaseService"
import UserService from "../Services/userService"

router.post('/', async function (req, res, next) {
  try {
    let newUser = req.body;
    newUser.role = "";
    const status = await UserService.addUser(newUser)
    res.json({ status })
  } catch (err) {
    next(err);
  }
})