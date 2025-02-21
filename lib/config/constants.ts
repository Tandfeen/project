export const WS_URL = 'ws://192.168.4.1:81/ws';
export const RECONNECT_INTERVAL = 1000;
export const HEARTBEAT_INTERVAL = 5000;

export const ESP_STATUS = {
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  ERROR: 'error',
} as const;

export const DEVICE_CONFIG = {
  MAX_RELAYS: 6,
  MODEL: 'ESP-WROOM-32',
  FIRMWARE_VERSION: '1.0.0',
  MAX_MESH_NODES: 32,
  MAX_MESH_RANGE: 1000, // meters
  MESH: {
    CHANNEL: 1,
    PASSWORD: 'mesh_network_key',
    MAX_POWER: 20, // dBm
    MIN_RSSI: -85, // dBm
    REFRESH_RATE: 1000, // ms
  },
  RELAY: {
    MIN_FIRE_DELAY: 0.1, // seconds
    MAX_FIRE_DELAY: 10, // seconds
    SAFETY_TIMEOUT: 5000, // ms
    MAX_SEQUENCE_STEPS: 50,
  },
} as const;

export const TEST_MODE_CONFIG = {
  ENABLED: false,
  SIMULATE_LATENCY: true,
  MIN_LATENCY: 50, // ms
  MAX_LATENCY: 150, // ms
  FAILURE_RATE: 0.01, // 1% chance of simulated failures
  UPDATE_INTERVAL: 1000, // ms
} as const;