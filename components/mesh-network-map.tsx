"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWebSocket } from "@/lib/websocket";
import { Network, Wifi, Activity, Zap } from 'lucide-react';

interface MeshNode {
  id: string;
  name: string;
  rssi: number;
  status: "active" | "inactive";
  relays: number[];
  batteryLevel: number;
  signalStrength: number;
  lastSeen: Date;
  position: { x: number; y: number };
}

export function MeshNetworkMap() {
  const [nodes, setNodes] = useState<MeshNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { sendMessage, lastMessage } = useWebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost/ws");

  useEffect(() => {
    if (lastMessage?.type === 'mesh_update') {
      setNodes(lastMessage.data.nodes);
    }
  }, [lastMessage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections between nodes
    ctx.strokeStyle = 'rgba(180, 0, 255, 0.2)';
    ctx.lineWidth = 2;

    nodes.forEach((node) => {
      nodes.forEach((otherNode) => {
        if (node.id !== otherNode.id) {
          ctx.beginPath();
          ctx.moveTo(node.position.x, node.position.y);
          ctx.lineTo(otherNode.position.x, otherNode.position.y);
          ctx.stroke();

          // Draw signal strength indicator
          const midX = (node.position.x + otherNode.position.x) / 2;
          const midY = (node.position.y + otherNode.position.y) / 2;
          const signalStrength = Math.min(node.signalStrength, otherNode.signalStrength);
          
          ctx.fillStyle = `rgba(180, 0, 255, ${signalStrength / 100})`;
          ctx.beginPath();
          ctx.arc(midX, midY, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    });
  }, [nodes]);

  return (
    <div className="relative h-[600px] rounded-lg overflow-hidden glass-effect p-6">
      <div className="absolute inset-0">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ filter: 'blur(1px)' }}
        />
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Network className="h-5 w-5 text-neon-purple" />
            <h2 className="text-xl font-bold">Mesh Network Topology</h2>
          </div>
          <Badge variant="outline" className="animate-pulse">
            {nodes.length} Active Nodes
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {nodes.map((node) => (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <Card
                  className={`p-4 mesh-node cursor-pointer ${
                    selectedNode === node.id ? 'ring-2 ring-neon-purple' : ''
                  }`}
                  onClick={() => setSelectedNode(node.id)}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{node.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          ID: {node.id}
                        </p>
                      </div>
                      <Badge
                        variant={node.status === 'active' ? 'success' : 'destructive'}
                        className="animate-glow"
                      >
                        {node.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Wifi className="h-4 w-4 text-neon-purple" />
                        <span>{node.rssi} dBm</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-neon-green" />
                        <span>{node.relays.length} Relays</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-neon-yellow" />
                        <span>{node.batteryLevel}%</span>
                      </div>
                    </div>

                    {selectedNode === node.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pt-2 border-t"
                      >
                        <p className="text-sm text-muted-foreground">
                          Last seen: {new Date(node.lastSeen).toLocaleString()}
                        </p>
                        <div className="mt-2">
                          <p className="text-sm font-medium">Connected Relays:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {node.relays.map((relay) => (
                              <Badge key={relay} variant="outline">
                                Relay {relay}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}