import { z } from 'zod';

export const networkConfigSchema = z.object({
  ssid: z.string().min(1).max(32),
  channel: z.number().min(1).max(13),
  txPower: z.number().min(0).max(20),
  meshEnabled: z.boolean(),
  meshChannel: z.number().min(1).max(13),
  meshPassword: z.string().min(8).optional(),
});

export const relayConfigSchema = z.object({
  id: z.number(),
  name: z.string(),
  safetyDelay: z.number().min(0),
  maxTemperature: z.number().min(50).max(120),
  autoReset: z.boolean(),
  voltage: z.number().min(5).max(24),
  currentLimit: z.number().min(1).max(20),
});

export const sequenceStepSchema = z.object({
  relayId: z.number(),
  nodeId: z.string(),
  delay: z.number().min(0),
});

export const sequenceSchema = z.object({
  id: z.string(),
  name: z.string(),
  steps: z.array(sequenceStepSchema),
});

export type NetworkConfig = z.infer<typeof networkConfigSchema>;
export type RelayConfig = z.infer<typeof relayConfigSchema>;
export type SequenceStep = z.infer<typeof sequenceStepSchema>;
export type Sequence = z.infer<typeof sequenceSchema>;