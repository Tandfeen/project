export interface Sequence {
    id: string;
    name: string;
    steps: SequenceStep[];
    created: string;
    lastRun: string | null;
    status: 'ready' | 'running' | 'completed' | 'error';
  }
  
  export interface SequenceStep {
    relayId: number;
    nodeId: string;
    delay: number;
  }
  
  export interface StagedRelay {
    id: string;
    relayId: number;
    nodeId: string;
    delay: number;
    status: 'pending' | 'active' | 'completed';
  }