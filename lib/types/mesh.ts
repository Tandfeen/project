export interface MeshNode {
    id: string;
    name: string;
    rssi: number;
    status: 'active' | 'inactive';
    relays: number[];
    batteryLevel: number;
    signalStrength: number;
    lastSeen: Date;
    position: { x: number; y: number };
    meshRole: 'root' | 'node' | 'leaf';
    firmwareVersion: string;
    ipAddress: string;
    macAddress: string;
  }
  
  export interface MeshNetwork {
    nodes: MeshNode[];
    connections: MeshConnection[];
    topology: MeshTopology;
  }
  
  export interface MeshConnection {
    source: string;
    target: string;
    rssi: number;
    quality: number;
  }
  
  export interface MeshTopology {
    root: string;
    layers: string[][];
    routes: Record<string, string[]>;
  }