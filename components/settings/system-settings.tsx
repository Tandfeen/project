"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useWebSocket } from "@/lib/websocket";
import { motion } from "framer-motion";
import {
  Save,
  RefreshCw,
  Cpu,
  Battery,
  ThermometerSun,
  Clock,
  AlertTriangle,
  BarChart3
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface SystemConfig {
  cpuFrequency: number;
  deepSleepEnabled: boolean;
  sleepThreshold: number;
  fanControlEnabled: boolean;
  fanThreshold: number;
  loggingEnabled: boolean;
  logRetentionDays: number;
  performanceMode: 'balanced' | 'performance' | 'powersave';
}

interface PerformanceData {
  timestamp: number;
  cpu: number;
  temperature: number;
  memory: number;
}

export function SystemSettings() {
  const [config, setConfig] = useState<SystemConfig>({
    cpuFrequency: 240,
    deepSleepEnabled: true,
    sleepThreshold: 30,
    fanControlEnabled: true,
    fanThreshold: 50,
    loggingEnabled: true,
    logRetentionDays: 7,
    performanceMode: 'balanced'
  });

  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { sendMessage } = useWebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost/ws");
  const { toast } = useToast();

  const handleSave = async () => {
    setIsLoading(true);
    try {
      sendMessage("update_system_config", config);
      toast({
        title: "Settings Saved",
        description: "System configuration has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update system configuration.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-neon-purple" />
            <h3 className="text-lg font-semibold">Performance Settings</h3>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpuFrequency">CPU Frequency (MHz)</Label>
            <Input
              id="cpuFrequency"
              type="number"
              min={80}
              max={240}
              step={10}
              value={config.cpuFrequency}
              onChange={(e) => 
                setConfig({ ...config, cpuFrequency: parseInt(e.target.value) })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Performance Mode</Label>
            <div className="grid grid-cols-3 gap-2">
              {['balanced', 'performance', 'powersave'].map((mode) => (
                <Button
                  key={mode}
                  variant={config.performanceMode === mode ? "default" : "outline"}
                  onClick={() => 
                    setConfig({ ...config, performanceMode: mode as SystemConfig['performanceMode'] })
                  }
                  className="capitalize"
                >
                  {mode}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Battery className="h-5 w-5 text-neon-purple" />
            <h3 className="text-lg font-semibold">Power Management</h3>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="deepSleepEnabled">Deep Sleep Mode</Label>
            <Switch
              id="deepSleepEnabled"
              checked={config.deepSleepEnabled}
              onCheckedChange={(checked) => 
                setConfig({ ...config, deepSleepEnabled: checked })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sleepThreshold">Sleep Threshold (minutes)</Label>
            <Input
              id="sleepThreshold"
              type="number"
              min={1}
              max={60}
              value={config.sleepThreshold}
              onChange={(e) => 
                setConfig({ ...config, sleepThreshold: parseInt(e.target.value) })
              }
              disabled={!config.deepSleepEnabled}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ThermometerSun className="h-5 w-5 text-neon-purple" />
            <h3 className="text-lg font-semibold">Thermal Management</h3>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="fanControlEnabled">Automatic Fan Control</Label>
            <Switch
              id="fanControlEnabled"
              checked={config.fanControlEnabled}
              onCheckedChange={(checked) => 
                setConfig({ ...config, fanControlEnabled: checked })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fanThreshold">Fan Threshold (°C)</Label>
            <Input
              id="fanThreshold"
              type="number"
              min={30}
              max={80}
              value={config.fanThreshold}
              onChange={(e) => 
                setConfig({ ...config, fanThreshold: parseInt(e.target.value) })
              }
              disabled={!config.fanControlEnabled}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-neon-purple" />
            <h3 className="text-lg font-semibold">System Logging</h3>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="loggingEnabled">Enable System Logging</Label>
            <Switch
              id="loggingEnabled"
              checked={config.loggingEnabled}
              onCheckedChange={(checked) => 
                setConfig({ ...config, loggingEnabled: checked })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logRetentionDays">Log Retention (days)</Label>
            <Input
              id="logRetentionDays"
              type="number"
              min={1}
              max={30}
              value={config.logRetentionDays}
              onChange={(e) => 
                setConfig({ ...config, logRetentionDays: parseInt(e.target.value) })
              }
              disabled={!config.loggingEnabled}
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-neon-purple" />
          <h3 className="text-lg font-semibold">Performance Monitoring</h3>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => new Date(value).toLocaleTimeString()}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleString()}
                contentStyle={{ background: 'rgba(0, 0, 0, 0.8)', border: 'none' }}
              />
              <Line 
                type="monotone" 
                dataKey="cpu" 
                stroke="#b400ff" 
                name="CPU Usage"
              />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="#ff0033" 
                name="Temperature"
              />
              <Line 
                type="monotone" 
                dataKey="memory" 
                stroke="#00f3ff" 
                name="Memory Usage"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="pt-4 border-t border-border">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          <p className="text-sm text-muted-foreground">
            Some settings may require a system restart to take effect. Ensure all
            operations are complete before applying changes.
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
    </div>
  );
}