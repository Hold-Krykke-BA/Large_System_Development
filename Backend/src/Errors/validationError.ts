class ValidationError extends Error {
  constructor(msg: string, public errorCode?: number) {
    super(msg)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError)
    }
    this.name = 'ValidationError'
    this.errorCode = errorCode || 500;
  }
}
export { ValidationError }