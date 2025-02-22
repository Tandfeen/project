"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTestMode } from "@/lib/hooks/useTestMode";
import { motion } from "framer-motion";
import { Beaker, Bug, Wifi, Clock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TestModeToggle() {
  const { 
    enabled, 
    debugMode,
    simulateErrors,
    latencyEnabled,
    toggleTestMode,
    toggleDebugMode,
    toggleErrorSimulation,
    toggleLatencySimulation
  } = useTestMode();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2"
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className={enabled ? "text-neon-purple" : ""}>
            <Beaker className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Test Mode Settings</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Beaker className="h-4 w-4" />
              <span>Test Mode</span>
            </div>
            <Switch
              checked={enabled}
              onCheckedChange={toggleTestMode}
              className="data-[state=checked]:bg-neon-purple"
            />
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bug className="h-4 w-4" />
              <span>Debug Mode</span>
            </div>
            <Switch
              checked={debugMode}
              onCheckedChange={toggleDebugMode}
              className="data-[state=checked]:bg-neon-purple"
              disabled={!enabled}
            />
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4" />
              <span>Simulate Errors</span>
            </div>
            <Switch
              checked={simulateErrors}
              onCheckedChange={toggleErrorSimulation}
              className="data-[state=checked]:bg-neon-purple"
              disabled={!enabled}
            />
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Simulate Latency</span>
            </div>
            <Switch
              checked={latencyEnabled}
              onCheckedChange={toggleLatencySimulation}
              className="data-[state=checked]:bg-neon-purple"
              disabled={!enabled}
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
}