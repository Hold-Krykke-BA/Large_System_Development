import { RequestHandler } from 'express';
import { AuthorizationError } from '../Errors/AuthorizationError';
import { AuthRequest, jwtAuthPayload } from './Types';
const jwt = require('jsonwebtoken');

/**
 * Checks for the JWT to be placed in the Authorization header as so:
 *
 * `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
 *
 */
export const useAuthorization: RequestHandler = (req: AuthRequest, res, next) => {
	const authHeader = req.headers.authorization;

	if (authHeader) {
		const encryptedToken = authHeader.split(' ')[1]; //split from "Bearer <token>"
		// console.log('encryptedToken', encryptedToken);

		jwt.verify(encryptedToken, process.env.SECRET, (_err: Error, decoded: jwtAuthPayload) => {
			// console.log('decodedToken', decoded);
			if (_err) {
				console.error('Authorization error', _err);
				const err = new AuthorizationError('Token invalid: ' + _err.message , 403);
				return next(err);
			}

			req.token = decoded;
			next();
		});
	} else {
		const err = new AuthorizationError('Missing Authorization header', 400);
		return next(err);
	}
};
