class Lock {
  private isLocked = false;

  
  async acquire() {
    while (this.isLocked) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    this.isLocked = true;
  }

  
  release() {
    this.isLocked = false;
  }
}


export const initializationLock = new Lock();