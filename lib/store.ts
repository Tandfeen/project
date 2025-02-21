import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Relay {
  id: number;
  name: string;
  status: 'ready' | 'fired' | 'staged' | 'timer';
  timeLeft?: number;
  voltage: number;
  current: number;
  temperature: number;
  lastFired?: string;
}

interface MeshNode {
  id: string;
  name: string;
  rssi: number;
  status: 'active' | 'inactive';
  relays: Relay[];
  batteryLevel: number;
  signalStrength: number;
  lastSeen: Date;
  position: { x: number; y: number };
}

interface Sequence {
  id: string;
  name: string;
  steps: {
    relayId: number;
    nodeId: string;
    delay: number;
  }[];
}

interface SystemState {
  relays: Relay[];
  meshNodes: MeshNode[];
  sequences: Sequence[];
  selectedNode: string | null;
  activeSequence: string | null;
  systemMetrics: {
    cpu: number;
    memory: number;
    temperature: number;
    battery: number;
    signalStrength: number;
    uptime: number;
  };
  updateRelay: (nodeId: string, relayId: number, updates: Partial<Relay>) => void;
  updateNode: (nodeId: string, updates: Partial<MeshNode>) => void;
  updateSequence: (sequenceId: string, updates: Partial<Sequence>) => void;
  setSelectedNode: (nodeId: string | null) => void;
  setActiveSequence: (sequenceId: string | null) => void;
  updateSystemMetrics: (metrics: Partial<SystemState['systemMetrics']>) => void;
}

export const useStore = create<SystemState>()(
  persist(
    (set) => ({
      relays: [],
      meshNodes: [],
      sequences: [],
      selectedNode: null,
      activeSequence: null,
      systemMetrics: {
        cpu: 0,
        memory: 0,
        temperature: 0,
        battery: 100,
        signalStrength: 0,
        uptime: 0,
      },
      updateRelay: (nodeId, relayId, updates) =>
        set((state) => ({
          meshNodes: state.meshNodes.map((node) =>
            node.id === nodeId
              ? {
                  ...node,
                  relays: node.relays.map((relay) =>
                    relay.id === relayId ? { ...relay, ...updates } : relay
                  ),
                }
              : node
          ),
        })),
      updateNode: (nodeId, updates) =>
        set((state) => ({
          meshNodes: state.meshNodes.map((node) =>
            node.id === nodeId ? { ...node, ...updates } : node
          ),
        })),
      updateSequence: (sequenceId, updates) =>
        set((state) => ({
          sequences: state.sequences.map((seq) =>
            seq.id === sequenceId ? { ...seq, ...updates } : seq
          ),
        })),
      setSelectedNode: (nodeId) =>
        set(() => ({
          selectedNode: nodeId,
        })),
      setActiveSequence: (sequenceId) =>
        set(() => ({
          activeSequence: sequenceId,
        })),
      updateSystemMetrics: (metrics) =>
        set((state) => ({
          systemMetrics: { ...state.systemMetrics, ...metrics },
        })),
    }),
    {
      name: 'relay-control-storage',
    }
  )
);