"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, AlertTriangle } from 'lucide-react';
import type { Relay } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";

interface RelayTimerProps {
  open: boolean;
  onClose: () => void;
  onFire: (time: number) => void;
  relay: Relay | null;
}

export function RelayTimer({ open, onClose, onFire, relay }: RelayTimerProps) {
  const [time, setTime] = useState<number>(5);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(3);
  const { toast } = useToast();

  const handleClose = useCallback(() => {
    setIsConfirming(false);
    setCountdown(3);
    onClose();
  }, [onClose]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isConfirming && countdown > 0) {
      timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
    } else if (isConfirming && countdown === 0) {
      try {
        onFire(time);
        setIsConfirming(false);
        setCountdown(3);
      } catch (error) {
        console.error('Error firing relay:', error);
        toast({
          title: "Error",
          description: "Failed to fire relay. Please try again.",
          variant: "destructive",
        });
      }
    }
    return () => clearTimeout(timer);
  }, [isConfirming, countdown, time, onFire, toast]);

  const handleFire = useCallback(() => {
    if (!relay) {
      console.error('No relay selected');
      toast({
        title: "Error",
        description: "No relay selected. Please try again.",
        variant: "destructive",
      });
      return;
    }
    setIsConfirming(true);
  }, [relay, toast]);

  const handleTimeChange = useCallback((newTime: number[]) => {
    setTime(newTime[0]);
  }, []);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-[425px] glass-effect">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Timer className="h-6 w-6 text-neon-purple" />
            Set Timer for {relay?.name}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex items-center justify-center gap-8">
            <motion.div
              className="relative w-32 h-32"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence mode="wait">
                {isConfirming ? (
                  <motion.div
                    key="countdown"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.5, opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <span className="text-6xl font-bold text-neon-red">{countdown}</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="timer"
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl font-bold">{time}s</span>
                    </div>
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        className="text-muted stroke-current"
                        strokeWidth="4"
                        fill="transparent"
                        r="45"
                        cx="50"
                        cy="50"
                      />
                      <motion.circle
                        className="text-neon-purple stroke-current"
                        strokeWidth="4"
                        fill="transparent"
                        r="45"
                        cx="50"
                        cy="50"
                        strokeDasharray="283"
                        initial={{ strokeDashoffset: 283 }}
                        animate={{ 
                          strokeDashoffset: 283 - (time / 10) * 283,
                          transition: { duration: 0.3 }
                        }}
                      />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            <Slider
              orientation="vertical"
              min={1}
              max={10}
              step={0.5}
              value={[time]}
              onValueChange={handleTimeChange}
              className="h-32"
              disabled={isConfirming}
              aria-label="Set timer duration"
            />
          </div>

          {!isConfirming ? (
            <Button
              variant="destructive"
              onClick={handleFire}
              className="w-full relative overflow-hidden group"
              disabled={!relay}
            >
              <span className="relative z-10">Fire Relay</span>
              <motion.div
                className="absolute inset-0 bg-neon-red/20"
                initial={false}
                animate={{ 
                  scale: [1, 1.5],
                  opacity: [0.5, 0]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                }}
              />
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => {
                setIsConfirming(false);
                setCountdown(3);
              }}
              className="w-full"
            >
              Cancel
            </Button>
          )}

          <div className="text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-neon-yellow" />
              <span>Ensure all safety protocols are followed before firing.</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

