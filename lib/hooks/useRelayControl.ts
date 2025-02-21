"use client";

import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { relaysAtom } from '../store/atoms';
import { useWebSocket } from '../websocket';
import { useToast } from '@/components/ui/use-toast';

export function useRelayControl() {
  const { sendMessage, isConnected } = useWebSocket();
  const [relays, setRelays] = useAtom(relaysAtom);
  const { toast } = useToast();

  const fireRelay = useCallback((relayId: number, delay: number = 0) => {
    if (!isConnected) {
      toast({
        title: "Connection Error",
        description: "Not connected to relay controller",
        variant: "destructive"
      });
      return;
    }

    sendMessage('fire_relay', { id: relayId, delay });
    setRelays(prev => prev.map(relay => 
      relay.id === relayId 
        ? { 
            ...relay, 
            status: delay > 0 ? 'timer' : 'fired',
            timeLeft: delay,
            lastFired: new Date().toISOString()
          } 
        : relay
    ));
  }, [isConnected, sendMessage, setRelays, toast]);

  const primeRelay = useCallback((relayId: number) => {
    if (!isConnected) {
      toast({
        title: "Connection Error",
        description: "Not connected to relay controller",
        variant: "destructive"
      });
      return;
    }

    sendMessage('prime_relay', { id: relayId });
    setRelays(prev => prev.map(relay => 
      relay.id === relayId 
        ? { ...relay, status: 'ready' }
        : relay
    ));
  }, [isConnected, sendMessage, setRelays, toast]);

  const stageRelay = useCallback((relayId: number) => {
    if (!isConnected) {
      toast({
        title: "Connection Error",
        description: "Not connected to relay controller",
        variant: "destructive"
      });
      return;
    }

    sendMessage('stage_relay', { id: relayId });
    setRelays(prev => prev.map(relay => 
      relay.id === relayId 
        ? { ...relay, status: 'staged' }
        : relay
    ));
  }, [isConnected, sendMessage, setRelays, toast]);

  return {
    fireRelay,
    primeRelay,
    stageRelay,
    relays
  };
}