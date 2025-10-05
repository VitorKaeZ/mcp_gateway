export class FailedCreateTransportError extends Error implements UsecaseError {
    constructor () {
      super("Failed to create Transport")
      this.name = 'FailedCreateTransportError'
    }
  }