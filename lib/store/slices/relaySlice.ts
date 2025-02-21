import { StateCreator } from 'zustand';
import { Relay } from '@/lib/types';

export interface RelaySlice {
  relays: Relay[];
  updateRelay: (nodeId: string, relayId: number, updates: Partial<Relay>) => void;
}

export const createRelaySlice: StateCreator<RelaySlice> = (set) => ({
  relays: [],
  updateRelay: (nodeId, relayId, updates) =>
    set((state) => ({
      relays: state.relays.map((relay) =>
        relay.id === relayId ? { ...relay, ...updates } : relay
      ),
    })),
});