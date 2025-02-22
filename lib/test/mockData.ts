import { CONFIG } from '../config';
import type { MeshNode, Relay, SystemMetrics } from '../types';

export const generateMockRelay = (id: number): Relay => ({
  id,
  name: `Relay ${id}`,
  status: 'ready',
  voltage: 12 + Math.random() * 0.5,
  current: Math.random() * 0.1,
  temperature: 25 + Math.random() * 10,
  lastFired: undefined,
  safetyDelay: 3,
  maxTemperature: 85,
  autoReset: false,
  currentLimit: 10
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
    relays: Array.from({ length: CONFIG.DEVICE.MAX_RELAYS }, (_, i) => generateMockRelay(i + 1)),
    batteryLevel: 60 + Math.random() * 40,
    signalStrength: 70 + Math.random() * 30,
    lastSeen: new Date(),
    position,
    meshRole: Math.random() > 0.7 ? 'root' : 'node',
    firmwareVersion: CONFIG.DEVICE.FIRMWARE_VERSION,
    ipAddress: `192.168.4.${id}`,
    macAddress: Array.from({ length: 6 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(':')
  };
};

export const generateMockMetrics = (): SystemMetrics => ({
  cpu: 20 + Math.random() * 40,
  memory: 30 + Math.random() * 30,
  temperature: 25 + Math.random() * 15,
  battery: 80 + Math.random() * 20,
  signalStrength: 75 + Math.random() * 25,
  uptime: Math.floor(Date.now() / 1000),
  networkLoad: Math.random() * 100,
  meshQuality: 70 + Math.random() * 30,
  packetLoss: Math.random() * 2,
  latency: 10 + Math.random() * 20
});