export const WS_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost/ws";
export const RECONNECT_INTERVAL = 1000;
export const HEARTBEAT_INTERVAL = 5000;

export const ESP_STATUS = {
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  ERROR: 'error',
} as const;

export type ESPStatus = typeof ESP_STATUS[keyof typeof ESP_STATUS];