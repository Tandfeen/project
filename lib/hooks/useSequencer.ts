"use client";

import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { sequencesAtom, activeSequenceAtom } from '../store/atoms';
import { useWebSocket } from '../websocket';
import { useToast } from '@/components/ui/use-toast';
import type { Sequence } from '../types';

export function useSequencer() {
  const { sendMessage, isConnected } = useWebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost/ws");
  const [sequences, setSequences] = useAtom(sequencesAtom);
  const [activeSequence, setActiveSequence] = useAtom(activeSequenceAtom);
  const { toast } = useToast();

  const createSequence = useCallback((sequence: Omit<Sequence, 'id'>) => {
    const id = crypto.randomUUID();
    const newSequence = { ...sequence, id };
    
    setSequences(prev => [...prev, newSequence]);
    return id;
  }, [setSequences]);

  const updateSequence = useCallback((id: string, updates: Partial<Sequence>) => {
    setSequences(prev => prev.map(seq => 
      seq.id === id 
        ? { ...seq, ...updates }
        : seq
    ));
  }, [setSequences]);

  const deleteSequence = useCallback((id: string) => {
    setSequences(prev => prev.filter(seq => seq.id !== id));
    if (activeSequence === id) {
      setActiveSequence(null);
    }
  }, [setSequences, activeSequence, setActiveSequence]);

  const runSequence = useCallback((id: string) => {
    if (!isConnected) {
      toast({
        title: "Connection Error",
        description: "Not connected to relay controller",
        variant: "destructive"
      });
      return;
    }

    const sequence = sequences.find(seq => seq.id === id);
    if (!sequence) return;

    sendMessage('run_sequence', { sequence });
    setActiveSequence(id);
    
    toast({
      title: "Sequence Started",
      description: `Running sequence: ${sequence.name}`,
    });
  }, [isConnected, sendMessage, sequences, setActiveSequence, toast]);

  const stopSequence = useCallback(() => {
    if (!isConnected || !activeSequence) return;

    sendMessage('stop_sequence', {});
    setActiveSequence(null);
    
    toast({
      title: "Sequence Stopped",
      description: "The current sequence has been stopped",
    });
  }, [isConnected, sendMessage, activeSequence, setActiveSequence, toast]);

  return {
    sequences,
    activeSequence,
    createSequence,
    updateSequence,
    deleteSequence,
    runSequence,
    stopSequence
  };
}