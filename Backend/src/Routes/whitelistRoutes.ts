import express from "express";
const router = express.Router();
import WhitelistService from "../Services/whitelistService"

router.get('/', async function (req: any, res, next) {
  try {
    const whitelist = await WhitelistService.getWhitelist();
    res.json(whitelist);
  } catch (err) {
    next(err)
  }
});

router.put('/addip', async function (req, res, next) {
  try {
    let newIP = req.body.ip;
    const status = await WhitelistService.addToWhitelist(newIP);
    res.json({ status })
  } catch (err) {
    next(err);
  }
})

router.delete('/removeip/:ip', async function (req, res, next) {
  try {
    let ip = req.params.ip
    const status = await WhitelistService.removeFromWhitelist(ip);
    res.json({ status })
  } catch (err) {
    next(err);
  }
})

module.exports = router;