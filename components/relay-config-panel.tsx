"use client";

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { motion } from 'framer-motion';
import { Settings, Save, RotateCcw } from 'lucide-react';
import { useWebSocket } from "@/lib/websocket";

interface RelayConfig {
  id: number;
  name: string;
  safetyDelay: number;
  maxTemperature: number;
  autoReset: boolean;
  voltage: number;
  currentLimit: number;
}

export function RelayConfigPanel() {
  const [configs, setConfigs] = useState<RelayConfig[]>(
    Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      name: `Relay ${i + 1}`,
      safetyDelay: 3,
      maxTemperature: 85,
      autoReset: false,
      voltage: 12,
      currentLimit: 10
    }))
  );
  
  const { toast } = useToast();
  const { sendMessage } = useWebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost/ws");

  const handleConfigUpdate = (id: number, updates: Partial<RelayConfig>) => {
    setConfigs(prev => prev.map(config => 
      config.id === id ? { ...config, ...updates } : config
    ));
  };

  const handleSave = (config: RelayConfig) => {
    sendMessage('update_relay_config', config);
    toast({
      title: "Configuration Saved",
      description: `Settings for ${config.name} have been updated.`,
    });
  };

  const handleReset = (id: number) => {
    const defaultConfig = {
      safetyDelay: 3,
      maxTemperature: 85,
      autoReset: false,
      voltage: 12,
      currentLimit: 10
    };
    
    handleConfigUpdate(id, defaultConfig);
    sendMessage('reset_relay_config', { id });
    toast({
      title: "Configuration Reset",
      description: `Settings for Relay ${id} have been reset to defaults.`,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {configs.map((config) => (
        <motion.div
          key={config.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6 glass-effect">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-neon-purple" />
                <h3 className="text-lg font-semibold">{config.name}</h3>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleReset(config.id)}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleSave(config)}
                >
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Safety Delay (seconds)</Label>
                <Slider
                  value={[config.safetyDelay]}
                  onValueChange={([value]) => 
                    handleConfigUpdate(config.id, { safetyDelay: value })
                  }
                  min={0}
                  max={10}
                  step={0.5}
                />
              </div>

              <div className="space-y-2">
                <Label>Max Temperature (°C)</Label>
                <Slider
                  value={[config.maxTemperature]}
                  onValueChange={([value]) => 
                    handleConfigUpdate(config.id, { maxTemperature: value })
                  }
                  min={50}
                  max={120}
                />
              </div>

              <div className="space-y-2">
                <Label>Operating Voltage (V)</Label>
                <Input
                  type="number"
                  value={config.voltage}
                  onChange={(e) => 
                    handleConfigUpdate(config.id, { 
                      voltage: parseFloat(e.target.value) 
                    })
                  }
                  min={5}
                  max={24}
                  step={0.1}
                />
              </div>

              <div className="space-y-2">
                <Label>Current Limit (A)</Label>
                <Input
                  type="number"
                  value={config.currentLimit}
                  onChange={(e) => 
                    handleConfigUpdate(config.id, { 
                      currentLimit: parseFloat(e.target.value) 
                    })
                  }
                  min={1}
                  max={20}
                  step={0.1}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Auto Reset</Label>
                <Switch
                  checked={config.autoReset}
                  onCheckedChange={(checked) => 
                    handleConfigUpdate(config.id, { autoReset: checked })
                  }
                />
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}