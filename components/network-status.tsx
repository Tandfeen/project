"use client";

import { useEffect } from "react";
import { Signal, SignalHigh, SignalMedium, SignalLow } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWebSocket } from "@/lib/websocket";
import { ESP_STATUS } from "@/lib/constants";
import { useStore } from "@/lib/store";

export function NetworkStatus() {
  const { status } = useWebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost/ws");
  const systemMetrics = useStore((state) => state.systemMetrics);

  const SignalIcon = () => {
    if (status !== ESP_STATUS.CONNECTED) {
      return <Signal className="h-4 w-4 text-destructive" />;
    }
    
    const strength = systemMetrics.signalStrength;
    if (strength > 75) {
      return <SignalHigh className="h-4 w-4 text-neon-green" />;
    } else if (strength > 50) {
      return <SignalHigh className="h-4 w-4 text-neon-blue" />;
    } else if (strength > 25) {
      return <SignalMedium className="h-4 w-4 text-neon-yellow" />;
    } else {
      return <SignalLow className="h-4 w-4 text-neon-red" />;
    }
  };

  return (
    <div className="flex items-center gap-2">
      <SignalIcon />
      <span
        className={cn(
          "text-sm",
          status === ESP_STATUS.CONNECTED ? "text-foreground" : "text-destructive"
        )}
      >
        {status === ESP_STATUS.CONNECTED 
          ? `${systemMetrics.signalStrength}%` 
          : status}
      </span>
    </div>
  );
}