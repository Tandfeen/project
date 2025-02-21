import { CONFIG } from '../config';

export const simulateLatency = async () => {
  if (!CONFIG.TEST_MODE.SIMULATE_LATENCY) return;
  
  const latency = CONFIG.TEST_MODE.MIN_LATENCY + 
    Math.random() * (CONFIG.TEST_MODE.MAX_LATENCY - CONFIG.TEST_MODE.MIN_LATENCY);
  
  await new Promise(resolve => setTimeout(resolve, latency));
};

export const simulateFailure = () => {
  return Math.random() < CONFIG.TEST_MODE.FAILURE_RATE;
};

export const simulateNetworkConditions = () => {
  const conditions = {
    packetLoss: Math.random() * 0.02, // 0-2% packet loss
    jitter: Math.random() * 20, // 0-20ms jitter
    bandwidth: 1000000 - (Math.random() * 200000), // ~1Mbps with variation
    signalStrength: -50 - (Math.random() * 30) // -50 to -80 dBm
  };

  return conditions;
};

export const simulateDeviceErrors = () => {
  const errorTypes = [
    'connection_timeout',
    'authentication_failed',
    'relay_malfunction',
    'temperature_critical',
    'voltage_warning',
    'mesh_disconnected'
  ];

  if (Math.random() < 0.05) { // 5% chance of error
    return {
      type: errorTypes[Math.floor(Math.random() * errorTypes.length)],
      timestamp: Date.now()
    };
  }

  return null;
};