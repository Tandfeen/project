import { StateCreator } from 'zustand';
import { MeshNode } from '@/lib/types';

export interface MeshSlice {
  meshNodes: MeshNode[];
  selectedNode: string | null;
  updateNode: (nodeId: string, updates: Partial<MeshNode>) => void;
  setSelectedNode: (nodeId: string | null) => void;
}

export const createMeshSlice: StateCreator<MeshSlice> = (set) => ({
  meshNodes: [],
  selectedNode: null,
  updateNode: (nodeId, updates) =>
    set((state) => ({
      meshNodes: state.meshNodes.map((node) =>
        node.id === nodeId ? { ...node, ...updates } : node
      ),
    })),
  setSelectedNode: (nodeId) =>
    set(() => ({
      selectedNode: nodeId,
    })),
});