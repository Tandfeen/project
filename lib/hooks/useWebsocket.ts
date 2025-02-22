"use client";

import { useEffect, useCallback, useRef, useState } from 'react';
import { useTestMode } from './useTestMode';

interface WebSocketMessage {
  type: string;
  payload: any;
}

export function useWebSocket(url: string) {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const ws = useRef<WebSocket | null>(null);
  const { enabled: testModeEnabled, handleSimulatedOperation } = useTestMode();
  
  const connect = useCallback(() => {
    if (testModeEnabled) {
      setStatus('connected');
      return;
    }

    try {
      ws.current = new WebSocket(url);
      setStatus('connecting');

      ws.current.onopen = () => {
        setStatus('connected');
      };

      ws.current.onclose = () => {
        setStatus('disconnected');
        // Attempt to reconnect after 5 seconds
        setTimeout(connect, 5000);
      };

      ws.current.onerror = () => {
        setStatus('disconnected');
      };

    } catch (error) {
      setStatus('disconnected');
      console.error('WebSocket connection error:', error);
    }
  }, [url, testModeEnabled]);

  useEffect(() => {
    connect();
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connect]);

  const sendMessage = useCallback(async (type: string, payload: any) => {
    if (testModeEnabled) {
      await handleSimulatedOperation(type);
      return;
    }

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type,
        payload
      };
      ws.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }, [testModeEnabled, handleSimulatedOperation]);

  return {
    status,
    isConnected: status === 'connected',
    sendMessage
  };
}
