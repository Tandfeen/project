"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useWebSocket } from "@/lib/websocket";
import { 
  Save,
  RefreshCw,
  Wifi,
  Network,
  Signal
} from "lucide-react";

interface NetworkConfig {
  ssid: string;
  channel: number;
  txPower: number;
  meshEnabled: boolean;
  meshChannel: number;
  meshPassword: string;
}

export function NetworkSettings() {
  const [config, setConfig] = useState<NetworkConfig>({
    ssid: "RelayController",
    channel: 1,
    txPower: 20,
    meshEnabled: true,
    meshChannel: 6,
    meshPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { sendMessage } = useWebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost/ws");
  const { toast } = useToast();

  const handleSave = async () => {
    setIsLoading(true);
    try {
      sendMessage("update_network_config", config);
      toast({
        title: "Settings Saved",
        description: "Network configuration has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update network configuration.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Wifi className="h-5 w-5 text-neon-purple" />
            <h3 className="text-lg font-semibold">Access Point Settings</h3>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ssid">SSID</Label>
            <Input
              id="ssid"
              value={config.ssid}
              onChange={(e) => setConfig({ ...config, ssid: e.target.value })}
              placeholder="Enter SSID"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="channel">Channel</Label>
            <Input
              id="channel"
              type="number"
              min={1}
              max={13}
              value={config.channel}
              onChange={(e) => 
                setConfig({ ...config, channel: parseInt(e.target.value) })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="txPower">TX Power (dBm)</Label>
            <Input
              id="txPower"
              type="number"
              min={0}
              max={20}
              value={config.txPower}
              onChange={(e) => 
                setConfig({ ...config, txPower: parseInt(e.target.value) })
              }
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Network className="h-5 w-5 text-neon-purple" />
            <h3 className="text-lg font-semibold">Mesh Network Settings</h3>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="meshEnabled">Enable Mesh Networking</Label>
            <Switch
              id="meshEnabled"
              checked={config.meshEnabled}
              onCheckedChange={(checked) => 
                setConfig({ ...config, meshEnabled: checked })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meshChannel">Mesh Channel</Label>
            <Input
              id="meshChannel"
              type="number"
              min={1}
              max={13}
              value={config.meshChannel}
              onChange={(e) => 
                setConfig({ ...config, meshChannel: parseInt(e.target.value) })
              }
              disabled={!config.meshEnabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meshPassword">Mesh Network Password</Label>
            <Input
              id="meshPassword"
              type="password"
              value={config.meshPassword}
              onChange={(e) => 
                setConfig({ ...config, meshPassword: e.target.value })
              }
              disabled={!config.meshEnabled}
              placeholder="Enter mesh network password"
            />
          </div>
        </div>
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