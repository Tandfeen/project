"use client";

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from 'framer-motion';
import { 
  Activity, 
  Battery, 
  Cpu, 
  ThermometerSun,
  Signal,
  Clock
} from 'lucide-react';
import { useWebSocket } from "@/lib/websocket";

interface SystemMetrics {
  cpu: number;
  memory: number;
  temperature: number;
  battery: number;
  signalStrength: number;
  uptime: number;
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 0,
    memory: 0,
    temperature: 0,
    battery: 100,
    signalStrength: 0,
    uptime: 0
  });

  const { message: lastMessage } = useWebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost/ws");

  useEffect(() => {
    if (lastMessage?.type === 'system_metrics') {
      setMetrics(lastMessage.data);
    }
  }, [lastMessage]);

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const getProgressColor = (value: number, type: keyof SystemMetrics) => {
    if (type === 'temperature' && value > 70) return 'text-neon-red';
    if (type === 'battery' && value < 20) return 'text-neon-red';
    if (value > 80) return 'text-neon-yellow';
    return 'text-neon-green';
  };

  return (
    <Card className="p-6 glass-effect">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Activity className="h-5 w-5 text-neon-purple" />
        System Performance
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(metrics).map(([key, value]) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {key === 'cpu' && <Cpu className="h-4 w-4" />}
                  {key === 'battery' && <Battery className="h-4 w-4" />}
                  {key === 'temperature' && <ThermometerSun className="h-4 w-4" />}
                  {key === 'signalStrength' && <Signal className="h-4 w-4" />}
                  {key === 'uptime' && <Clock className="h-4 w-4" />}
                  <span className="font-medium capitalize">{key}</span>
                </div>
                <span className={`text-sm ${getProgressColor(value, key as keyof SystemMetrics)}`}>
                  {key === 'uptime' ? formatUptime(value) :
                   key === 'temperature' ? `${value}°C` :
                   `${value}%`}
                </span>
              </div>

              {key !== 'uptime' && (
                <Progress 
                  value={value} 
                  className={`h-2 ${getProgressColor(value, key as keyof SystemMetrics)}`}
                />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}