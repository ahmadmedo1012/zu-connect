import { io, Socket } from "socket.io-client";

class AdminSocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<(...args: any[]) => void>> = new Map();
  private _connected = false;
  private _onConnectionChange?: (connected: boolean) => void;

  get connected() { return this._connected; }

  onConnectionChange(cb: (connected: boolean) => void) {
    this._onConnectionChange = cb;
  }

  connect(token: string) {
    if (this.socket?.connected) return;

    this.socket = io("/admin", {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 30000,
      randomizationFactor: 0.5,
    });

    this.socket.on("connect", () => {
      this._connected = true;
      this._onConnectionChange?.(true);
    });

    this.socket.on("disconnect", () => {
      this._connected = false;
      this._onConnectionChange?.(false);
    });

    this.socket.on("connect_error", () => {
      this._connected = false;
      this._onConnectionChange?.(false);
    });

    for (const [event, handlers] of this.listeners) {
      for (const handler of handlers) {
        this.socket.on(event, handler as any);
      }
    }
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
    this._connected = false;
    this._onConnectionChange?.(false);
  }

  on(event: string, handler: (...args: any[]) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
    this.socket?.on(event, handler as any);
    return () => this.off(event, handler);
  }

  off(event: string, handler: (...args: any[]) => void) {
    this.listeners.get(event)?.delete(handler);
    this.socket?.off(event, handler as any);
  }

  emit(event: string, data?: any) {
    this.socket?.emit(event, data);
  }
}

export const adminSocket = new AdminSocketService();
