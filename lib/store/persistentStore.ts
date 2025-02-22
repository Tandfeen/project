"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CONFIG } from '../config';
import type { Relay, MeshNode, Sequence, SystemMetrics } from '../types';

interface PersistentState {
  relays: Relay[];
  meshNodes: MeshNode[];
  sequences: Sequence[];
  lastKnownMetrics: SystemMetrics;
  setRelays: (relays: Relay[]) => void;
  updateRelay: (id: number, updates: Partial<Relay>) => void;
  setMeshNodes: (nodes: MeshNode[]) => void;
  updateMeshNode: (id: string, updates: Partial<MeshNode>) => void;
  setSequences: (sequences: Sequence[]) => void;
  updateSequence: (id: string, updates: Partial<Sequence>) => void;
  setLastKnownMetrics: (metrics: SystemMetrics) => void;
}

export const usePersistentStore = create<PersistentState>()(
  persist(
    (set) => ({
      relays: Array.from({ length: CONFIG.DEVICE.MAX_RELAYS }, (_, i) => ({
        id: i + 1,
        name: `Relay ${i + 1}`,
        status: 'ready',
        voltage: 12,
        current: 0,
        temperature: 25,
        lastFired: undefined,
        safetyDelay: 3,
        maxTemperature: 85,
        autoReset: false,
        currentLimit: 10
      })),
      meshNodes: [],
      sequences: [],
      lastKnownMetrics: {
        cpu: 0,
        memory: 0,
        temperature: 25,
        battery: 100,
        signalStrength: 0,
        uptime: 0,
        networkLoad: 0,
        meshQuality: 0,
        packetLoss: 0,
        latency: 0
      },
      setRelays: (relays) => set({ relays }),
      updateRelay: (id, updates) => set((state) => ({
        relays: state.relays.map((relay) =>
          relay.id === id ? { ...relay, ...updates } : relay
        ),
      })),
      setMeshNodes: (nodes) => set({ meshNodes: nodes }),
      updateMeshNode: (id, updates) => set((state) => ({
        meshNodes: state.meshNodes.map((node) =>
          node.id === id ? { ...node, ...updates } : node
        ),
      })),
      setSequences: (sequences) => set({ sequences }),
      updateSequence: (id, updates) => set((state) => ({
        sequences: state.sequences.map((seq) =>
          seq.id === id ? { ...seq, ...updates } : seq
        ),
      })),
      setLastKnownMetrics: (metrics) => set({ lastKnownMetrics: metrics }),
    }),
    {
      name: 'relay-controller-storage',
      storage: {
        getItem: (name) => {
          try {
            const value = localStorage.getItem(name);
            return value ? JSON.parse(value) : null;
          } catch {
            // Fallback for when localStorage is not available (ESP32)
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, JSON.stringify(value));
          } catch {
            // Silently fail if localStorage is not available
          }
        },
        removeItem: (name) => {
          try {
            localStorage.removeItem(name);
          } catch {
            // Silently fail if localStorage is not available
          }
        },
      },
    }
  )
);