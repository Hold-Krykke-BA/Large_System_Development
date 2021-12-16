import express, { NextFunction } from 'express';
import { AuthorizationError } from '../Errors/AuthorizationError';
import IUser from '../Models/IUser';
const router = express.Router();
import UserService from '../Services/userService';
import { AuthRequest } from '../Util/Types';

const authIsTeacher = (req: AuthRequest, res: any, next: NextFunction) => {
	if (!req.token?.isTeacher) {
		const err = new AuthorizationError('Unauthorized (3)', 403);
		return next(err);
	} else {
		next();
	}
};

router.post('/add', authIsTeacher, async (req, res, next) => {
	try {
		let newUser = req.body;
		const status = await UserService.addUser(newUser);
		res.json({ status });
	} catch (err) {
		next(err);
	}
});

router.get('/all', authIsTeacher, async (req: any, res, next) => {
	try {
		const users = await UserService.getAllUsers();
		res.json(users);
	} catch (err) {
		next(err);
	}
});

router.get('/:userID', async (req: AuthRequest, res, next) => {
	try {
		const userID = req.params.userID;
		const user: IUser = await UserService.getUser(userID);

		//Check if user (student) is user
		if (!req.token?.isTeacher) {
			const isUser = user.userID === req.token?.userID;
			if (!isUser) {
				const err = new AuthorizationError('Unauthorized (3.5)', 403);
				return next(err);
			}
		}
		res.json(user);
	} catch (err) {
		next(err);
	}
});

router.delete('/remove/:userID', authIsTeacher, async (req: any, res, next) => {
	try {
		const userID = req.params.userID;
		const user = await UserService.deleteUser(userID);
		res.json(user);
	} catch (err) {
		next(err);
	}
});

module.exports = router;
