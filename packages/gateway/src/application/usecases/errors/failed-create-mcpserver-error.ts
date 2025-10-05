export class FailedCreateMcpServerError extends Error implements UsecaseError {
    constructor () {
      super("Failed to create McpServer")
      this.name = 'FailedCreateMcpServerError'
    }
  }