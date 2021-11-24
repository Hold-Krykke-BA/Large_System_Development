import express from "express";
import connection from "../Services/databaseService"
const router = express.Router();
import UserService from "../Services/userService"

(async function setup() {
  const client = await connection();
  await UserService.setDatabase(client)
})()

router.post('/add', async function (req, res, next) {
  try {
    let newUser = req.body;
    const status = await UserService.addUser(newUser)
    res.json({ status })
  } catch (err) {
    next(err);
  }
})

router.get('/all', async function (req: any, res, next) {
  try {
    const users = await UserService.getAllUsers();
    res.json(users);
  } catch (err) {
    next(err)
  }
});

router.get('/:userID', async function (req: any, res, next) {
  try {
    const userID = req.params.userID;
    const user = await UserService.getUser(userID);
    res.json(user);
  } catch (err) {
    next(err)
  }
});

router.delete('/remove/:userID', async function (req: any, res, next) {
  try {
    const userID = req.params.userID;
    const user = await UserService.deleteUser(userID);
    res.json(user);
  } catch (err) {
    next(err)
  }
});

module.exports = router;