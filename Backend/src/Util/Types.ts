import { Request } from 'express';

/**
 * Auth payload typically seen in tokens
 */
export type jwtAuthPayload = {
	userID: string;
	isTeacher: boolean;
};

/**
 * Auth Request that extends Express' default Request for adding token to the request object
 */
export interface AuthRequest extends Request {
	token?: jwtAuthPayload;
}
