export class EmailAlreadyExistsError extends Error implements UsecaseError {
    constructor () {
      super('Mail already exists.')
      this.name = 'EmailAlreadyExistsError'
    }
  }