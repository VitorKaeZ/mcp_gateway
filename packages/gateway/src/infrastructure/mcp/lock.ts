// packages/gateway/src/infrastructure/mcp/lock.ts

class Lock {
  private isLocked = false;

  /**
   * Adquire o lock. Se o lock já estiver ativo, espera em pequenos
   * intervalos até ser libertado.
   */
  async acquire() {
    while (this.isLocked) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    // Ativa o lock para impedir que outros processos entrem.
    this.isLocked = true;
  }

  /**
   * Liberta o lock, permitindo que outros processos o adquiram.
   */
  release() {
    this.isLocked = false;
  }
}

// Exporta uma única instância do lock para ser usada em toda a aplicação.
export const initializationLock = new Lock();
