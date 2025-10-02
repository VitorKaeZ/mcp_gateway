// usecases/errors/invalid-credentials-error.ts

export class InvalidCredentialsError extends Error implements UsecaseError {
  constructor() {
    super("Invalid email or password");
    this.name = "InvalidCredentialsError";
  }
}
