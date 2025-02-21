"use client";

import { useEffect } from 'react';
import { usePersistentStore } from '../store/persistentStore';
import { useWebSocket } from '../websocket';
import { useTestMode } from './useTestMode';

export function useStateSync() {
  const { enabled: testModeEnabled } = useTestMode();
  const { status } = useWebSocket();
  const {
    relays,
    meshNodes,
    sequences,
    lastKnownMetrics,
    setRelays,
    setMeshNodes,
    setSequences,
    setLastKnownMetrics
  } = usePersistentStore();

  // Sync state with ESP32 on reconnection
  useEffect(() => {
    if (status === 'connected' && !testModeEnabled) {
      // Send current state to ESP32
      fetch('http://192.168.4.1/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          relays,
          meshNodes,
          sequences,
          lastKnownMetrics
        })
      }).catch(() => {
        // Silently fail if fetch is not available
      });
    }
  }, [status, testModeEnabled, relays, meshNodes, sequences, lastKnownMetrics]);

  return {
    relays,
    meshNodes,
    sequences,
    lastKnownMetrics,
    setRelays,
    setMeshNodes,
    setSequences,
    setLastKnownMetrics
  };
}