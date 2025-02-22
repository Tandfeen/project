"use client";

import { useEffect, useRef, useCallback, useState } from 'react';
import { useAtom } from 'jotai';
import { 
  connectionStatusAtom,
  systemMetricsAtom,
  meshNodesAtom,
  relaysAtom,
  sequencesAtom
} from './store/atoms';
import { produce } from 'immer';
import { useToast } from '@/components/ui/use-toast';
import { useTestMode } from './hooks/useTestMode';
import { CONFIG } from './config';

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
  nodeId?: string;
}

export function useWebSocket(p0: string) {
  const ws = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const heartbeatInterval = useRef<NodeJS.Timeout>();
  const [status, setStatus] = useAtom(connectionStatusAtom);
  const [, setSystemMetrics] = useAtom(systemMetricsAtom);
  const [, setMeshNodes] = useAtom(meshNodesAtom);
  const [, setRelays] = useAtom(relaysAtom);
  const [, setSequences] = useAtom(sequencesAtom);
  const { toast } = useToast();
  const { enabled: testModeEnabled, getMockData, simulateLatency } = useTestMode();
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);

  const connect = useCallback(async () => {
    if (ws.current?.readyState === WebSocket.OPEN) return;

    try {
      if (testModeEnabled) {
        // In test mode, we'll simulate the connection
        setStatus('connected');
        reconnectAttempts.current = 0;

        // Start mock data updates
        heartbeatInterval.current = setInterval(() => {
          setSystemMetrics(getMockData.metrics());
          setMeshNodes(prev => {
            const mockNodes = Array.from(
              { length: 3 }, 
              (_, i) => getMockData.node(i + 1)
            );
            return mockNodes;
          });
        }, CONFIG.TEST_MODE.UPDATE_INTERVAL);

        return;
      }

      // Real device connection
      const host = window.location.hostname === 'localhost' ? '192.168.4.1' : window.location.hostname;
      const wsUrl = `ws://${host}:${CONFIG.WEBSOCKET.PORT}/ws`;

      setStatus('connecting');
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        setStatus('connected');
        reconnectAttempts.current = 0;
        toast({
          title: "Connected",
          description: "Successfully connected to relay controller.",
        });

        // Start heartbeat for real connection
        heartbeatInterval.current = setInterval(() => {
          if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ type: 'heartbeat' }));
          }
        }, CONFIG.WEBSOCKET.HEARTBEAT_INTERVAL);
      };

      ws.current.onclose = () => {
        setStatus('disconnected');
        clearInterval(heartbeatInterval.current);

        if (reconnectAttempts.current < 5) {
          reconnectAttempts.current++;
          setTimeout(connect, CONFIG.WEBSOCKET.RECONNECT_DELAY * reconnectAttempts.current);
        } else {
          toast({
            title: "Connection Failed",
            description: "Unable to connect to relay controller after multiple attempts.",
            variant: "destructive",
          });
        }
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setStatus('error');
      };

      ws.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setLastMessage(message);
          
          switch (message.type) {
            case 'systemMetrics':
              setSystemMetrics(message.data);
              break;

            case 'meshUpdate':
              setMeshNodes(produce(draft => {
                const index = draft.findIndex((node: { id: string | undefined; }) => node.id === message.nodeId);
                if (index !== -1) {
                  draft[index] = { ...draft[index], ...message.data };
                } else {
                  draft.push(message.data);
                }
              }));
              break;

            case 'relayUpdate':
              setRelays(produce(draft => {
                const index = draft.findIndex((relay: { id: any; nodeId: string | undefined; }) => 
                  relay.id === message.data.id && 
                  relay.nodeId === message.nodeId
                );
                if (index !== -1) {
                  draft[index] = { ...draft[index], ...message.data };
                }
              }));
              break;

            case 'error':
              toast({
                title: "Error",
                description: message.data.message,
                variant: "destructive",
              });
              break;
          }
        } catch (error) {
          console.error('Failed to parse message:', error);
        }
      };
    } catch (error) {
      setStatus('error');
      setTimeout(connect, CONFIG.WEBSOCKET.RECONNECT_DELAY);
    }
  }, [testModeEnabled, setStatus, setSystemMetrics, setMeshNodes, setRelays, toast, getMockData]);

  useEffect(() => {
    connect();

    return () => {
      if (!testModeEnabled && ws.current) {
        ws.current.close();
      }
      clearInterval(heartbeatInterval.current);
    };
  }, [connect, testModeEnabled]);

  const sendMessage = useCallback(async (type: string, data: any) => {
    if (testModeEnabled) {
      await simulateLatency();
      // Handle mock responses based on message type
      switch (type) {
        case 'fire_relay':
          setRelays(produce(draft => {
            const index = draft.findIndex((r: { id: any; }) => r.id === data.id);
            if (index !== -1) {
              draft[index].status = 'fired';
              draft[index].lastFired = new Date().toISOString();
            }
          }));
          break;
        // Add other mock handlers as needed
      }
      return;
    }

    if (ws.current?.readyState === WebSocket.OPEN) {
      const message: Omit<WebSocketMessage, 'timestamp'> = {
        type,
        data,
      };
      ws.current.send(JSON.stringify(message));
    } else {
      toast({
        title: "Connection Error",
        description: "Not connected to relay controller. Please try again.",
        variant: "destructive",
      });
    }
  }, [testModeEnabled, simulateLatency, setRelays, toast]);

  return {
    status,
    sendMessage,
    isConnected: status === 'connected',
    message: lastMessage
  };
}