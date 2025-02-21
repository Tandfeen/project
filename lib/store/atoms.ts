import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { Relay, MeshNode, Sequence, SystemMetrics } from '../types';

export const relaysAtom = atomWithStorage<Relay[]>('relays', []);
export const meshNodesAtom = atomWithStorage<MeshNode[]>('meshNodes', []);
export const sequencesAtom = atomWithStorage<Sequence[]>('sequences', []);
export const selectedNodeAtom = atom<string | null>(null);
export const activeSequenceAtom = atom<string | null>(null);
export const systemMetricsAtom = atomWithStorage<SystemMetrics>('systemMetrics', {
  cpu: 0,
  memory: 0,
  temperature: 0,
  battery: 100,
  signalStrength: 0,
  uptime: 0,
});

export const connectionStatusAtom = atom('disconnected');