import express from "express";
const router = express.Router();
import WhitelistService from "../Services/whitelistService"

router.post('/', async function (req, res, next) {
  try {
    let newCourse = req.body;
    const status = await WhitelistService.getWhitelist();
    res.json({ status })
  } catch (err) {
    next(err);
  }
})

module.exports = router;