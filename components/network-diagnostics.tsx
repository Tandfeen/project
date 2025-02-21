"use client";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { RefreshCw, Wifi } from "lucide-react";

interface MeshNode {
  id: string;
  name: string;
  rssi: number;
  status: "connected" | "disconnected";
  lastSeen: string;
}

export function NetworkDiagnostics() {
  const [scanning, setScanning] = useState(false);
  const [nodes, setNodes] = useState<MeshNode[]>([
    {
      id: "1",
      name: "Main Controller",
      rssi: -55,
      status: "connected",
      lastSeen: "Now",
    },
    {
      id: "2",
      name: "Mesh Node 1",
      rssi: -65,
      status: "connected",
      lastSeen: "2s ago",
    },
    {
      id: "3",
      name: "Mesh Node 2",
      rssi: -75,
      status: "connected",
      lastSeen: "5s ago",
    },
    {
      id: "4",
      name: "Mesh Node 3",
      rssi: -120,
      status: "connected",
      lastSeen: "10s ago",
    },
  ]);
  const { toast } = useToast();

  const scanNetwork = () => {
    setScanning(true);
    toast({
      title: "Scanning Network",
      description: "Looking for mesh nodes...",
    });

    setTimeout(() => {
      setScanning(false);
      toast({
        title: "Scan Complete",
        description: "Found 3 mesh nodes in range.",
      });
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Network Diagnostics</h2>
        <Button onClick={scanNetwork} disabled={scanning}>
          {scanning ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wifi className="mr-2 h-4 w-4" />
          )}
          Scan Network
        </Button>
      </div>

      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Node Name</TableHead>
              <TableHead>Signal Strength</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Seen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {nodes.map((node) => (
              <TableRow key={node.id}>
                <TableCell className="font-medium">{node.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-16 rounded-full ${
                        node.rssi > -60
                          ? "bg-neon-green"
                          : node.rssi > -70
                          ? "bg-neon-blue"
                          : node.rssi > -80
                          ? "bg-neon-yellow"
                          : "bg-neon-red"
                      }`}
                    >
                      <div
                        className="h-full rounded-full bg-background/50"
                        style={{
                          width: `${Math.max(
                            0,
                            ((node.rssi + 100) / 60) * 100
                          )}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm">{node.rssi} dBm</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      node.status === "connected"
                        ? "bg-neon-green/20 text-neon-green"
                        : "bg-destructive/20 text-destructive"
                    }`}
                  >
                    {node.status}
                  </span>
                </TableCell>
                <TableCell>{node.lastSeen}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Mesh Network Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Network Type</span>
              <span className="font-medium">Mesh</span>
            </div>
            <div className="flex justify-between">
              <span>Active Nodes</span>
              <span className="font-medium">3</span>
            </div>
            <div className="flex justify-between">
              <span>Network Coverage</span>
              <span className="font-medium">85%</span>
            </div>
            <div className="flex justify-between">
              <span>Mesh Protocol</span>
              <span className="font-medium">ESP-MESH</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Average Latency</span>
              <span className="font-medium">15ms</span>
            </div>
            <div className="flex justify-between">
              <span>Packet Loss</span>
              <span className="font-medium">0.1%</span>
            </div>
            <div className="flex justify-between">
              <span>Network Load</span>
              <span className="font-medium">25%</span>
            </div>
            <div className="flex justify-between">
              <span>Uptime</span>
              <span className="font-medium">99.9%</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}