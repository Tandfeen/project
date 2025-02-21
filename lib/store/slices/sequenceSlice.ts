import { StateCreator } from 'zustand';
import { Sequence } from '@/lib/types';

export interface SequenceSlice {
  sequences: Sequence[];
  activeSequence: string | null;
  updateSequence: (sequenceId: string, updates: Partial<Sequence>) => void;
  setActiveSequence: (sequenceId: string | null) => void;
}

export const createSequenceSlice: StateCreator<SequenceSlice> = (set) => ({
  sequences: [],
  activeSequence: null,
  updateSequence: (sequenceId, updates) =>
    set((state) => ({
      sequences: state.sequences.map((seq) =>
        seq.id === sequenceId ? { ...seq, ...updates } : seq
      ),
    })),
  setActiveSequence: (sequenceId) =>
    set(() => ({
      activeSequence: sequenceId,
    })),
});