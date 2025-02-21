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
  Shield,
  Key,
  Lock,
  UserCheck,
  AlertTriangle
} from "lucide-react";
import { z } from "zod";

const securitySchema = z.object({
  adminPassword: z.string().min(8, "Password must be at least 8 characters"),
  encryptionKey: z.string().min(16, "Encryption key must be at least 16 characters"),
  twoFactorEnabled: z.boolean(),
  autoLockTimeout: z.number().min(0).max(60),
  requirePinForFiring: z.boolean(),
  firingPin: z.string().length(6, "PIN must be 6 digits"),
});

type SecurityConfig = z.infer<typeof securitySchema>;

export function SecuritySettings() {
  const [config, setConfig] = useState<SecurityConfig>({
    adminPassword: "",
    encryptionKey: "",
    twoFactorEnabled: false,
    autoLockTimeout: 5,
    requirePinForFiring: true,
    firingPin: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof SecurityConfig, string>>>({});
  const { sendMessage } = useWebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost/ws");
  const { toast } = useToast();

  const validateConfig = () => {
    try {
      securitySchema.parse(config);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: typeof errors = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof SecurityConfig] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSave = async () => {
    if (!validateConfig()) {
      toast({
        title: "Validation Error",
        description: "Please check the form for errors.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      sendMessage("update_security_config", config);
      toast({
        title: "Settings Saved",
        description: "Security configuration has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update security configuration.",
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
            <Key className="h-5 w-5 text-neon-purple" />
            <h3 className="text-lg font-semibold">Access Control</h3>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adminPassword">Admin Password</Label>
            <Input
              id="adminPassword"
              type="password"
              value={config.adminPassword}
              onChange={(e) => setConfig({ ...config, adminPassword: e.target.value })}
              className={errors.adminPassword ? "border-red-500" : ""}
            />
            {errors.adminPassword && (
              <p className="text-sm text-red-500">{errors.adminPassword}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="encryptionKey">Encryption Key</Label>
            <Input
              id="encryptionKey"
              type="password"
              value={config.encryptionKey}
              onChange={(e) => setConfig({ ...config, encryptionKey: e.target.value })}
              className={errors.encryptionKey ? "border-red-500" : ""}
            />
            {errors.encryptionKey && (
              <p className="text-sm text-red-500">{errors.encryptionKey}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="twoFactorEnabled">Two-Factor Authentication</Label>
            <Switch
              id="twoFactorEnabled"
              checked={config.twoFactorEnabled}
              onCheckedChange={(checked) => 
                setConfig({ ...config, twoFactorEnabled: checked })
              }
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-neon-purple" />
            <h3 className="text-lg font-semibold">Safety Controls</h3>
          </div>

          <div className="space-y-2">
            <Label htmlFor="autoLockTimeout">Auto-Lock Timeout (minutes)</Label>
            <Input
              id="autoLockTimeout"
              type="number"
              min={0}
              max={60}
              value={config.autoLockTimeout}
              onChange={(e) => 
                setConfig({ ...config, autoLockTimeout: parseInt(e.target.value) })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="requirePinForFiring">Require PIN for Firing</Label>
            <Switch
              id="requirePinForFiring"
              checked={config.requirePinForFiring}
              onCheckedChange={(checked) => 
                setConfig({ ...config, requirePinForFiring: checked })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="firingPin">Firing PIN</Label>
            <Input
              id="firingPin"
              type="password"
              maxLength={6}
              value={config.firingPin}
              onChange={(e) => setConfig({ ...config, firingPin: e.target.value })}
              disabled={!config.requirePinForFiring}
              className={errors.firingPin ? "border-red-500" : ""}
            />
            {errors.firingPin && (
              <p className="text-sm text-red-500">{errors.firingPin}</p>
            )}
          </div>
        </div>
      </motion.div>

      <div className="pt-4 border-t border-border">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          <p className="text-sm text-muted-foreground">
            Changing security settings will require re-authentication and may temporarily
            disconnect mesh network nodes.
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