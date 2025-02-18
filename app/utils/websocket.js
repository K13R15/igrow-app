class WebSocketManager {
  constructor() {
    this.ws = null;
    this.listeners = new Set();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 5000;
    this.wsUrl = "ws://192.168.50.19/ws";
  }

  connect() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.notifyListeners("connected");
      return;
    }

    try {
      console.log(`Attempting to connect to ${this.wsUrl}`);
      this.ws = new WebSocket(this.wsUrl);

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Received WebSocket data:", data);
          this.notifyListeners("data", data);
        } catch (error) {
          console.error("WebSocket message parse error:", error);
          this.notifyListeners("error", { type: "parseError", error });
        }
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error.message || "Unknown error");
        this.notifyListeners("error", {
          type: "connectionError",
          error: error.message || "Failed to connect to sensor",
        });
      };

      this.ws.onclose = (event) => {
        console.log(
          "WebSocket closed with code:",
          event.code,
          "reason:",
          event.reason
        );
        this.notifyListeners("disconnected", {
          code: event.code,
          reason: event.reason,
        });
        if (event.code !== 1000) {
          this.handleReconnect();
        }
      };

      this.ws.onopen = () => {
        console.log("WebSocket connected successfully to", this.wsUrl);
        this.reconnectAttempts = 0;
        this.notifyListeners("connected");
      };
    } catch (error) {
      console.error("WebSocket connection error:", error.message);
      this.handleReconnect();
    }
  }

  updateUrl(newUrl) {
    this.wsUrl = newUrl;
    if (this.ws) {
      this.ws.close();
      this.connect();
    }
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay =
        this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1);
      console.log(
        `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms...`
      );
      setTimeout(() => this.connect(), delay);
    } else {
      console.error("Max reconnection attempts reached");
      this.notifyListeners("maxRetriesReached");
    }
  }

  addListener(callback) {
    this.listeners.add(callback);
    if (!this.ws) this.connect();
  }

  removeListener(callback) {
    this.listeners.delete(callback);
  }

  notifyListeners(type, data) {
    this.listeners.forEach((listener) => listener(type, data));
  }

  disconnect() {
    if (this.ws) {
      this.ws.close(1000, "Normal closure");
      this.ws = null;
    }
  }
}

const wsManager = new WebSocketManager();

// Add a development helper to expose the manager globally for debugging
if (process.env.NODE_ENV === "development") {
  window._wsManager = wsManager;
}

export { wsManager, WebSocketManager };
