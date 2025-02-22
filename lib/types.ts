export interface Relay {
  id: number;
  name: string;
  status: 'ready' | 'firing' | 'error' | 'disabled' | 'timer' | 'fired' | 'staged';
  timeLeft?: number;
  voltage: number;
  current: number;
  temperature: number;
  lastFired?: string;
  safetyDelay: number;
  maxTemperature: number;
  autoReset: boolean;
  currentLimit: number;
}

export interface MeshNode {
  id: string;
  name: string;
  rssi: number;
  status: 'active' | 'inactive';
  relays: Relay[];
  batteryLevel: number;
  signalStrength: number;
  lastSeen: Date;
  position: { x: number; y: number };
  meshRole: 'root' | 'node';
  firmwareVersion: string;
  ipAddress: string;
  macAddress: string;
}

export interface Sequence {
  id: string;
  name: string;
  steps: {
    relayId: number;
    nodeId: string;
    delay: number;
  }[];
  created: string;
  lastRun: string | null;
  status: 'ready' | 'running' | 'completed' | 'error';
}

export interface SystemMetrics {
  cpu: number;
  memory: number;
  temperature: number;
  battery: number;
  signalStrength: number;
  uptime: number;
  networkLoad: number;
  meshQuality: number;
  packetLoss: number;
  latency: number;
}

export interface StagedRelay {
  id: string;
  relayId: number;
  nodeId: string;
  delay: number;
  status: 'pending' | 'active' | 'completed';
}

export interface NetworkConfig {
  ssid: string;
  channel: number;
  txPower: number;
  meshEnabled: boolean;
  meshChannel: number;
  meshPassword: string;
  maxConnections: number;
  routingEnabled: boolean;
  powerSaving: boolean;
  autoReconnect: boolean;
  signalStrengthThreshold: number;
}

export interface SecurityConfig {
  adminPassword: string;
  encryptionKey: string;
  twoFactorEnabled: boolean;
  autoLockTimeout: number;
  requirePinForFiring: boolean;
  firingPin: string;
  lastAccess: string;
  accessLog: string[];
  securityLevel: 'high' | 'medium' | 'low';
  failedAttempts: number;
}

