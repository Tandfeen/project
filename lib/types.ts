export interface Relay {
  id: number;
  name: string;
  status: 'ready' | 'fired' | 'staged' | 'timer';
  timeLeft?: number;
  voltage: number;
  current: number;
  temperature: number;
  lastFired?: string;
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
}

export interface Sequence {
  id: string;
  name: string;
  steps: {
    relayId: number;
    nodeId: string;
    delay: number;
  }[];
}

export interface SystemMetrics {
  cpu: number;
  memory: number;
  temperature: number;
  battery: number;
  signalStrength: number;
  uptime: number;
}

export interface StagedRelay {
  id: string;
  relayId: number;
  nodeId: string;
  delay: number;
  status: 'pending' | 'active' | 'completed';
}

