// usecases/errors/invalid-credentials-error.ts

export class InvalidOrExpiredTokenError extends Error implements UsecaseError {
  constructor() {
    super("Invalid or expired token");
    this.name = "InvalidOrExpiredTokenError";
  }
}
