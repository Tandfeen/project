"use client";

import { Card } from "@/components/ui/card";
import { Battery, ThermometerSun, Clock } from "lucide-react";
import { useEffect, useState } from "react";

export function SystemStatus() {
  const [uptime, setUptime] = useState(0);
  const [temperature, setTemperature] = useState(25);
  const [battery, setBattery] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setUptime((prev) => prev + 1);
      setTemperature(25 + Math.random() * 5);
      setBattery((prev) => Math.max(0, prev - 0.01));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-4 flex items-center gap-4">
        <Clock className="h-5 w-5 text-neon-blue" />
        <div>
          <p className="text-sm text-muted-foreground">Uptime</p>
          <p className="font-medium">{formatUptime(uptime)}</p>
        </div>
      </Card>

      <Card className="p-4 flex items-center gap-4">
        <ThermometerSun className="h-5 w-5 text-neon-yellow" />
        <div>
          <p className="text-sm text-muted-foreground">Temperature</p>
          <p className="font-medium">{temperature.toFixed(1)}°C</p>
        </div>
      </Card>

      <Card className="p-4 flex items-center gap-4">
        <Battery className="h-5 w-5 text-neon-green" />
        <div>
          <p className="text-sm text-muted-foreground">Battery</p>
          <p className="font-medium">{battery.toFixed(1)}%</p>
        </div>
      </Card>
    </div>
  );
}