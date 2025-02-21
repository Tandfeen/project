import { CONFIG } from '../config';
import type { MeshNode, Relay, SystemMetrics } from '../types';

export const generateMockRelay = (id: number): Relay => ({
  id,
  name: `Relay ${id}`,
  status: 'ready',
  voltage: 12 + Math.random() * 0.5,
  current: Math.random() * 0.1,
  temperature: 25 + Math.random() * 10,
  lastFired: null
});

export const generateMockNode = (id: number): MeshNode => {
  const position = {
    x: 100 + Math.random() * 800,
    y: 100 + Math.random() * 400
  };

  return {
    id: `node_${id}`,
    name: `Mesh Node ${id}`,
    rssi: -50 - Math.random() * 30,
    status: Math.random() > 0.1 ? 'active' : 'inactive',
    relays: Array.from({ length: CONFIG.DEVICE.MAX_RELAYS }, (_, i) => i + 1),
    batteryLevel: 60 + Math.random() * 40,
    signalStrength: 70 + Math.random() * 30,
    lastSeen: new Date(),
    position
  };
};

export const generateMockMetrics = (): SystemMetrics => ({
  cpu: 20 + Math.random() * 40,
  memory: 30 + Math.random() * 30,
  temperature: 25 + Math.random() * 15,
  battery: 80 + Math.random() * 20,
  signalStrength: 75 + Math.random() * 25,
  uptime: Math.floor(Date.now() / 1000)
});