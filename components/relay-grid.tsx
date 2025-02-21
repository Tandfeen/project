"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RelayTimer } from "@/components/relay-timer";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useWebSocket } from "@/lib/websocket";
import { Badge } from "@/components/ui/badge";
import { Power, Timer, AlertTriangle } from 'lucide-react';
import { Relay } from "@/lib/types";
import { WS_URL } from "@/lib/constants";

export function RelayGrid() {
  const [relays, setRelays] = useState<Relay[]>(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      name: `Relay ${i + 1}`,
      status: "ready",
      voltage: 12,
      current: 0,
      temperature: 25,
    }))
  );
  const [showTimer, setShowTimer] = useState<number | null>(null);
  const [selectedRelay, setSelectedRelay] = useState<Relay | null>(null);
  const { toast } = useToast();
  const { sendMessage, lastMessage } = useWebSocket(WS_URL);

  useEffect(() => {
    if (lastMessage?.type === 'relay_update') {
      setRelays(prev => prev.map(relay => 
        relay.id === lastMessage.data.id ? { ...relay, ...lastMessage.data } : relay
      ));
    }
  }, [lastMessage]);

  const getStatusClass = useCallback((status: Relay["status"]) => {
    switch (status) {
      case "ready": return "relay-ready";
      case "fired": return "relay-fired";
      case "staged": return "relay-staged";
      case "timer": return "relay-timer";
      default: return "";
    }
  }, []);

  const handleFire = useCallback((relay: Relay) => {
    if (relay.status === "fired") {
      toast({
        title: "Error",
        description: "This relay has already been fired.",
        variant: "destructive",
      });
      return;
    }
    setShowTimer(relay.id);
    setSelectedRelay(relay);
  }, [toast]);

  const handlePrime = useCallback((relayId: number) => {
    sendMessage('prime_relay', { id: relayId });
    setRelays(prev =>
      prev.map(r =>
        r.id === relayId ? { ...r, status: "ready" } : r
      )
    );
    toast({
      title: "Success",
      description: `Relay ${relayId} has been primed and is ready to fire.`,
    });
  }, [sendMessage, toast]);

  const handleTimerFire = useCallback((time: number) => {
    if (showTimer && selectedRelay) {
      sendMessage('fire_relay', { id: showTimer, delay: time });
      setRelays(prev =>
        prev.map(r =>
          r.id === showTimer
            ? { ...r, status: "fired", timeLeft: time, lastFired: new Date().toLocaleTimeString() }
            : r
        )
      );
      setShowTimer(null);
      setSelectedRelay(null);
      toast({
        title: "Success",
        description: `Relay ${showTimer} will fire in ${time} seconds.`,
      });
    }
  }, [showTimer, selectedRelay, sendMessage, toast]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {relays.map((relay) => (
          <motion.div
            key={relay.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, delay: relay.id * 0.1 }}
            className="group"
          >
            <Card className={`p-6 ${getStatusClass(relay.status)} transition-all duration-300 hover:scale-[1.02]`}>
              <motion.div 
                className="space-y-4"
                initial={false}
                animate={{ scale: relay.status === "timer" ? [1, 1.02, 1] : 1 }}
                transition={{ duration: 0.5, repeat: relay.status === "timer" ? Infinity : 0 }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold">{relay.name}</h3>
                    <Badge 
                      variant={relay.status === "ready" ? "success" : relay.status === "fired" ? "destructive" : "warning"}
                      className="mt-2"
                    >
                      {relay.status.toUpperCase()}
                    </Badge>
                  </div>
                  <motion.div 
                    className={`h-4 w-4 rounded-full ${
                      relay.status === "ready" ? "bg-neon-green" : 
                      relay.status === "fired" ? "bg-neon-red" : 
                      "bg-neon-yellow"
                    }`}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>
                    <p>Voltage</p>
                    <p className="font-medium text-foreground">{relay.voltage}V</p>
                  </div>
                  <div>
                    <p>Current</p>
                    <p className="font-medium text-foreground">{relay.current}A</p>
                  </div>
                  <div>
                    <p>Temperature</p>
                    <p className="font-medium text-foreground">{relay.temperature ?? 'N/A'}°C</p>
                  </div>
                  <div>
                    <p>Last Fired</p>
                    <p className="font-medium text-foreground">{relay.lastFired || 'Never'}</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 group-hover:border-neon-purple transition-colors"
                    onClick={() => handleFire(relay)}
                    disabled={relay.status === "fired"}
                  >
                    <Power className="mr-2 h-4 w-4" />
                    Fire
                  </Button>
                  {relay.status === "fired" && (
                    <Button
                      variant="outline"
                      className="flex-1 group-hover:border-neon-green transition-colors"
                      onClick={() => handlePrime(relay.id)}
                    >
                      <Timer className="mr-2 h-4 w-4" />
                      Prime
                    </Button>
                  )}
                </div>

                {(relay.temperature ?? 0) > 50 && (
                  <div className="mt-2 flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm">High temperature warning</span>
                  </div>
                )}
              </motion.div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      <RelayTimer
        open={showTimer !== null}
        onClose={() => {
          setShowTimer(null);
          setSelectedRelay(null);
        }}
        onFire={handleTimerFire}
        relay={selectedRelay}
      />
    </div>
  );
}
