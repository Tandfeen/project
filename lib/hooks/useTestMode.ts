"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CONFIG } from '../config';
import { useToast } from '@/components/ui/use-toast';
import { useEffect } from 'react';
import {
  generateMockMetrics,
  generateMockNode,
  generateMockRelay,
  generateMockSequence,
  generateMockNetworkConfig,
  generateMockSecurityConfig,
} from '../test/mockDataGenerators';
import {
  simulateLatency, // Callable function for simulating latency
  simulateFailure,
  simulateNetworkConditions,
  simulateDeviceErrors,
} from '../test/simulators';
import { getMockResponse } from '../test/mockResponses';

interface TestModeState {
  enabled: boolean;
  debugMode: boolean;
  simulateErrors: boolean;
  latencyEnabled: boolean; // Renamed from `simulateLatency` for clarity
  toggleTestMode: () => void;
  toggleDebugMode: () => void;
  toggleErrorSimulation: () => void;
  toggleLatencySimulation: () => void;
}

const useTestModeStore = create<TestModeState>()(
  persist(
    (set) => ({
      enabled: CONFIG.TEST_MODE.ENABLED,
      debugMode: false,
      simulateErrors: true,
      latencyEnabled: true, // Updated to match the new name
      toggleTestMode: () => set((state) => ({ enabled: !state.enabled })),
      toggleDebugMode: () => set((state) => ({ debugMode: !state.debugMode })),
      toggleErrorSimulation: () => set((state) => ({ simulateErrors: !state.simulateErrors })),
      toggleLatencySimulation: () => set((state) => ({ latencyEnabled: !state.latencyEnabled })), // Updated name
    }),
    {
      name: 'relay-controller-test-mode',
    }
  )
);

export function useTestMode() {
  const {
    enabled,
    debugMode,
    simulateErrors,
    latencyEnabled, // Updated to use the renamed state
    toggleTestMode,
    toggleDebugMode,
    toggleErrorSimulation,
    toggleLatencySimulation,
  } = useTestModeStore();

  const { toast } = useToast();

  useEffect(() => {
    if (enabled) {
      toast({
        title: 'Test Mode Enabled',
        description: 'Using simulated data for testing purposes.',
        duration: 3000,
      });
    } else {
      toast({
        title: 'Test Mode Disabled',
        description: 'Using real device data.',
        duration: 3000,
      });
    }
  }, [enabled, toast]);

  const handleSimulatedOperation = async (operation: string) => {
    if (latencyEnabled) {
      await simulateLatency(); // Call the simulator's function
    }

    if (simulateErrors && simulateFailure()) {
      const error = simulateDeviceErrors();
      if (error) {
        throw new Error(`Simulated error during ${operation}: ${error.type}`);
      }
    }

    if (debugMode) {
      const conditions = simulateNetworkConditions();
      console.debug(`Network conditions during ${operation}:`, conditions);
    }
  };

  return {
    enabled,
    debugMode,
    simulateErrors,
    simulateLatency: simulateLatency, // Provide the callable simulator function
    latencyEnabled, // Return the state variable for clarity
    toggleTestMode,
    toggleDebugMode,
    toggleErrorSimulation,
    toggleLatencySimulation,
    handleSimulatedOperation,
    getMockData: {
      relay: generateMockRelay,
      node: generateMockNode,
      metrics: generateMockMetrics,
      sequence: generateMockSequence,
      networkConfig: generateMockNetworkConfig,
      securityConfig: generateMockSecurityConfig,
    },
    getMockResponse,
  };
}
