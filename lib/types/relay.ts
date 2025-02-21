export interface Relay {
    id: number;
    name: string;
    status: 'ready' | 'fired' | 'staged' | 'timer';
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
  
  export interface RelayConfig {
    id: number;
    name: string;
    safetyDelay: number;
    maxTemperature: number;
    autoReset: boolean;
    voltage: number;
    currentLimit: number;
  }
  
  export interface RelayStatus {
    id: number;
    status: Relay['status'];
    timeLeft?: number;
    lastFired?: string;
  }