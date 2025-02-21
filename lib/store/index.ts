import create from 'zustand/vanilla';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MeshSlice, createMeshSlice } from './slices/meshSlice';
import { RelaySlice, createRelaySlice } from './slices/relaySlice';
import { SequenceSlice, createSequenceSlice } from './slices/sequenceSlice';
import { MetricsSlice, createMetricsSlice } from './slices/metricsSlice';

export type StoreState = MeshSlice & RelaySlice & SequenceSlice & MetricsSlice;

export const store = create<StoreState>()(
  persist(
    (...a) => ({
      ...createMeshSlice(...a),
      ...createRelaySlice(...a),
      ...createSequenceSlice(...a),
      ...createMetricsSlice(...a),
    }),
    {
      name: 'relay-control-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useStore = store;