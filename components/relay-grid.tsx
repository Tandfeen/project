"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RelayTimer } from "@/components/relay-timer";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useWebSocket } from "@/lib/websocket";
import { Badge } from "@/components/ui/badge";
import { Power, Timer, AlertTriangle, ChevronDown, ChevronUp, Server } from 'lucide-react';
import { Relay, MeshNode } from "@/lib/types";
import { WS_URL } from "@/lib/constants";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface RelayGroupProps {
  node: MeshNode;
  onFire: (relay: Relay) => void;
  onPrime: (relayId: number) => void;
}

function RelayGroup({ node, onFire, onPrime }: RelayGroupProps) {
  const [isOpen, setIsOpen] = useState(true);
  
  const getStatusClass = useCallback((status: Relay["status"]) => {
    switch (status) {
      case "ready": return "relay-ready";
      case "fired": return "relay-fired";
      case "staged": return "relay-staged";
      case "timer": return "relay-timer";
      default: return "";
    }
  }, []);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="p-4 glass-effect">
        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted/10 rounded-lg transition-colors">
          <div className="flex items-center gap-3">
            <Server className="h-5 w-5 text-neon-purple" />
            <div>
              <h3 className="text-lg font-semibold">{node.name}</h3>
              <p className="text-sm text-muted-foreground">
                {node.relays.length} Relays • Signal: {node.signalStrength}% • Battery: {node.batteryLevel}%
              </p>
            </div>
          </div>
          {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </CollapsibleTrigger>

        <CollapsibleContent className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {node.relays.map((relay) => (
              <motion.div
                key={relay.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="group"
              >
                <Card className={`p-4 ${getStatusClass(relay.status)} transition-all duration-300 hover:scale-[1.02]`}>
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-semibold">{relay.name}</h4>
                        <Badge 
                          variant={relay.status === "ready" ? "success" : relay.status === "fired" ? "destructive" : "warning"}
                          className="mt-1"
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
                        <p className="font-medium text-foreground">{relay.temperature}°C</p>
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
                        onClick={() => onFire(relay)}
                        disabled={relay.status === "fired"}
                      >
                        <Power className="mr-2 h-4 w-4" />
                        Fire
                      </Button>
                      {relay.status === "fired" && (
                        <Button
                          variant="outline"
                          className="flex-1 group-hover:border-neon-green transition-colors"
                          onClick={() => onPrime(relay.id)}
                        >
                          <Timer className="mr-2 h-4 w-4" />
                          Prime
                        </Button>
                      )}
                    </div>

                    {(relay.temperature ?? 0) > 50 && (
                      <div className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm">High temperature warning</span>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

export function RelayGrid() {
  const [nodes, setNodes] = useState<MeshNode[]>(() => [{
    id: 'default_node',
    name: 'Main Controller',
    rssi: -50,
    status: 'active',
    relays: Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      name: `Relay ${i + 1}`,
      status: "ready",
      voltage: 12,
      current: 0,
      temperature: 25,
      safetyDelay: 3,
      maxTemperature: 85,
      autoReset: false,
      currentLimit: 10
    })),
    batteryLevel: 100,
    signalStrength: 95,
    lastSeen: new Date(),
    position: { x: 400, y: 300 },
    meshRole: 'root',
    firmwareVersion: '1.0.0',
    ipAddress: '192.168.4.1',
    macAddress: '00:11:22:33:44:55'
  }]);
  const [showTimer, setShowTimer] = useState<number | null>(null);
  const [selectedRelay, setSelectedRelay] = useState<Relay | null>(null);
  const { toast } = useToast();
  const { sendMessage, message: lastMessage } = useWebSocket(WS_URL);

  useEffect(() => {
    if (lastMessage?.type === 'relay_update') {
      setNodes(prev => prev.map(node => ({
        ...node,
        relays: node.relays.map(relay => 
          relay.id === lastMessage.data.id ? { ...relay, ...lastMessage.data } : relay
        )
      })));
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
    setNodes(prev => prev.map(node => ({
      ...node,
      relays: node.relays.map(r =>
        r.id === relayId ? { ...r, status: "ready" } : r
      )
    })));
    toast({
      title: "Success",
      description: `Relay ${relayId} has been primed and is ready to fire.`,
    });
  }, [sendMessage, toast]);

  const handleTimerFire = useCallback((time: number) => {
    if (showTimer && selectedRelay) {
      sendMessage('fire_relay', { id: showTimer, delay: time });
      setNodes(prev => prev.map(node => ({
        ...node,
        relays: node.relays.map(r =>
          r.id === showTimer
            ? { ...r, status: "fired", timeLeft: time, lastFired: new Date().toLocaleTimeString() }
            : r
        )
      })));
      setShowTimer(null);
      setSelectedRelay(null);
      toast({
        title: "Success",
        description: `Relay ${showTimer} will fire in ${time} seconds.`,
      });
    }
  }, [showTimer, selectedRelay, sendMessage, toast]);

  return (
    <div className="space-y-6">
      {nodes.map((node) => (
        <RelayGroup
          key={node.id}
          node={node}
          onFire={handleFire}
          onPrime={handlePrime}
        />
      ))}

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
