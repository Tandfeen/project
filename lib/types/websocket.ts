export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
  nodeId?: string;
}

export interface WebSocketError {
  code: number;
  message: string;
}

export type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export interface HeartbeatMessage {
  type: 'heartbeat';
  timestamp: number;
}

export interface SystemMetricsMessage {
  type: 'systemMetrics';
  data: {
    cpu: number;
    memory: number;
    temperature: number;
    battery: number;
    signalStrength: number;
    uptime: number;
  };
  timestamp: number;
}

export interface MeshUpdateMessage {
  type: 'meshUpdate';
  nodeId: string;
  data: {
    id: string;
    name: string;
    rssi: number;
    status: 'active' | 'inactive';
    batteryLevel: number;
    signalStrength: number;
    lastSeen: Date;
    position: { x: number; y: number };
  };
  timestamp: number;
}

export interface RelayUpdateMessage {
  type: 'relayUpdate';
  nodeId: string;
  data: {
    id: number;
    status: 'ready' | 'fired' | 'staged' | 'timer';
    timeLeft?: number;
    voltage: number;
    current: number;
    temperature: number;
    lastFired?: string;
  };
  timestamp: number;
}

export interface SequenceUpdateMessage {
  type: 'sequenceUpdate';
  data: {
    id: string;
    name: string;
    steps: Array<{
      relayId: number;
      nodeId: string;
      delay: number;
    }>;
  };
  timestamp: number;
}