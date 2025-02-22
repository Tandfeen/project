"use client";

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { usePersistentStore } from '@/lib/store/persistentStore';
import { useTestMode } from '@/lib/hooks/useTestMode';
import { AlertTriangle } from 'lucide-react';

export function StateRecoveryDialog() {
  const [open, setOpen] = useState(false);
  const { enabled: testModeEnabled } = useTestMode();
  const { relays, sequences } = usePersistentStore();

  useEffect(() => {
    // Only show recovery dialog if we have saved state and not in test mode
    if (!testModeEnabled && (relays.some(r => r.status !== 'ready') || sequences.length > 0)) {
      setOpen(true);
    }
  }, [testModeEnabled, relays, sequences]);

  const handleRecover = () => {
    // State is already loaded from persistent storage
    setOpen(false);
  };

  const handleReset = () => {
    // Reset to default state
    usePersistentStore.getState().setRelays(
      Array.from({ length: 6 }, (_, i) => ({
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
      }))
    );
    usePersistentStore.getState().setSequences([]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Recover Previous State
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-muted-foreground mb-4">
            Previous relay states and sequences were found. Would you like to recover them?
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleReset}>
              Reset to Default
            </Button>
            <Button onClick={handleRecover}>
              Recover State
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}