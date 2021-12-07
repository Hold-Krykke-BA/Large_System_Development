class AuthorizationError extends Error {
	constructor(msg: string, public errorCode?: number) {
		super(msg);
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, AuthorizationError);
		}
		this.name = 'AuthorizationError';
		this.errorCode = errorCode || 400;
	}
}
export { AuthorizationError };
