export class InvalidPasswordError extends Error implements DomainError {
    constructor (password: string) {
      super(`The password is invalid.`)
      this.name = 'InvalidNameError'
    }
  }