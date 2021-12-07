import express, { NextFunction } from 'express';
import { AuthorizationError } from '../Errors/AuthorizationError';
const router = express.Router();
import WhitelistService from '../Services/whitelistService';
import checkIP from '../Util/checkIP';
import { AuthRequest } from '../Util/Types';

/**
 * Requires teacher for all routes
 */
router.use((req: AuthRequest, res: any, next: NextFunction) => {
	if (!req.token?.isTeacher) {
		const err = new AuthorizationError('Unauthorized (4)', 403);
		return next(err);
	} else {
		next();
	}
});

router.get('/', async function (req: any, res, next) {
	try {
		const whitelist = await WhitelistService.getWhitelist();
		console.log((await checkIP(req)) == true);
		res.json(whitelist);
	} catch (err) {
		next(err);
	}
});

router.put('/addip', async function (req, res, next) {
	try {
		let newIP = req.body.ip;
		const status = await WhitelistService.addToWhitelist(newIP);
		res.json({ status });
	} catch (err) {
		next(err);
	}
});

router.delete('/removeip/:ip', async function (req, res, next) {
	try {
		let ip = req.params.ip;
		const status = await WhitelistService.removeFromWhitelist(ip);
		res.json({ status });
	} catch (err) {
		next(err);
	}
});

module.exports = router;
