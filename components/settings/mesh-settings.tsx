"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useWebSocket } from "@/lib/websocket";
import { motion } from "framer-motion";
import {
  Network,
  Wifi,
  RefreshCw,
  Save,
  AlertTriangle,
  Signal
} from "lucide-react";

interface MeshConfig {
  nodeName: string;
  nodeRole: 'root' | 'node' | 'leaf';
  maxConnections: number;
  routingEnabled: boolean;
  powerSaving: boolean;
  autoReconnect: boolean;
  signalStrengthThreshold: number;
}

export function MeshSettings() {
  const [config, setConfig] = useState<MeshConfig>({
    nodeName: "RelayNode-1",
    nodeRole: 'node',
    maxConnections: 10,
    routingEnabled: true,
    powerSaving: true,
    autoReconnect: true,
    signalStrengthThreshold: -75
  });

  const [isLoading, setIsLoading] = useState(false);
  const { sendMessage } = useWebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost/ws");
  const { toast } = useToast();

  const handleSave = async () => {
    setIsLoading(true);
    try {
      sendMessage("update_mesh_config", config);
      toast({
        title: "Settings Saved",
        description: "Mesh network configuration has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update mesh configuration.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Network className="h-5 w-5 text-neon-purple" />
              <h3 className="text-lg font-semibold">Node Configuration</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nodeName">Node Name</Label>
                <Input
                  id="nodeName"
                  value={config.nodeName}
                  onChange={(e) => setConfig({ ...config, nodeName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Node Role</Label>
                <div className="grid grid-cols-3 gap-2">
                  {['root', 'node', 'leaf'].map((role) => (
                    <Button
                      key={role}
                      variant={config.nodeRole === role ? "default" : "outline"}
                      onClick={() => 
                        setConfig({ ...config, nodeRole: role as MeshConfig['nodeRole'] })
                      }
                      className="capitalize"
                    >
                      {role}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxConnections">Maximum Connections</Label>
                <Input
                  id="maxConnections"
                  type="number"
                  min={1}
                  max={30}
                  value={config.maxConnections}
                  onChange={(e) => 
                    setConfig({ ...config, maxConnections: parseInt(e.target.value) })
                  }
                />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Signal className="h-5 w-5 text-neon-purple" />
              <h3 className="text-lg font-semibold">Network Optimization</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="routingEnabled">Enable Routing</Label>
                <Switch
                  id="routingEnabled"
                  checked={config.routingEnabled}
                  onCheckedChange={(checked) => 
                    setConfig({ ...config, routingEnabled: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="powerSaving">Power Saving Mode</Label>
                <Switch
                  id="powerSaving"
                  checked={config.powerSaving}
                  onCheckedChange={(checked) => 
                    setConfig({ ...config, powerSaving: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="autoReconnect">Auto Reconnect</Label>
                <Switch
                  id="autoReconnect"
                  checked={config.autoReconnect}
                  onCheckedChange={(checked) => 
                    setConfig({ ...config, autoReconnect: checked })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signalStrengthThreshold">
                  Signal Strength Threshold (dBm)
                </Label>
                <Input
                  id="signalStrengthThreshold"
                  type="number"
                  min={-100}
                  max={-30}
                  value={config.signalStrengthThreshold}
                  onChange={(e) => 
                    setConfig({ 
                      ...config, 
                      signalStrengthThreshold: parseInt(e.target.value) 
                    })
                  }
                />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-5 w-5 text-yellow-500" />
        <p className="text-sm text-muted-foreground">
          Changes to mesh network settings may temporarily disrupt connectivity.
          Ensure all nodes are within range before applying changes.
        </p>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          disabled={isLoading}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset
        </Button>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>
    </div>
  );
}