export const CONFIG = {
  DEVICE: {
    MAX_RELAYS: 6,
    MODEL: 'ESP-WROOM-32',
    FIRMWARE_VERSION: '1.0.0',
    MAX_MESH_NODES: 32,
    MAX_MESH_RANGE: 1000, // meters
  },
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
  WEBSOCKET: {
    PORT: 81,
    RECONNECT_DELAY: 1000,
    HEARTBEAT_INTERVAL: 5000,
  },
  TEST_MODE: {
    ENABLED: false, // Will be toggled via the UI
    SIMULATE_LATENCY: true,
    MIN_LATENCY: 50, // ms
    MAX_LATENCY: 150, // ms
    FAILURE_RATE: 0.01, // 1% chance of simulated failures
    UPDATE_INTERVAL: 1000, // ms
  }
} as const;