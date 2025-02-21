import { StateCreator } from 'zustand';
import { SystemMetrics } from '@/lib/types';

export interface MetricsSlice {
  systemMetrics: SystemMetrics;
  updateSystemMetrics: (metrics: Partial<SystemMetrics>) => void;
}

export const createMetricsSlice: StateCreator<MetricsSlice> = (set) => ({
  systemMetrics: {
    cpu: 0,
    memory: 0,
    temperature: 0,
    battery: 100,
    signalStrength: 0,
    uptime: 0,
  },
  updateSystemMetrics: (metrics) =>
    set((state) => ({
      systemMetrics: { ...state.systemMetrics, ...metrics },
    })),
});