type Listener = () => void

class TokenEventEmitter {
  private listeners: Listener[] = []

  subscribe(listener: Listener) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  emit() {
    this.listeners.forEach((listener) => listener())
  }
}

export const tokenEventEmitter = new TokenEventEmitter()
