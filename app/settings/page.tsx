"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RelayConfigPanel } from "@/components/relay-config-panel";
import { NetworkSettings } from "@/components/settings/network-settings";
import { SecuritySettings } from "@/components/settings/security-settings";
import { SystemSettings } from "@/components/settings/system-settings";
import { MeshSettings } from "@/components/settings/mesh-settings";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Shield, Network, Cpu } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("relays");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <SettingsIcon className="h-6 w-6 text-neon-purple" />
        <h1 className="text-3xl font-bold tracking-tight neon-text">
          System Settings
        </h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 h-auto">
          <TabsTrigger value="relays" className="py-2">
            Relay Configuration
          </TabsTrigger>
          <TabsTrigger value="network" className="py-2">
            Network Settings
          </TabsTrigger>
          <TabsTrigger value="security" className="py-2">
            Security
          </TabsTrigger>
          <TabsTrigger value="system" className="py-2">
            System
          </TabsTrigger>
        </TabsList>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <TabsContent value="relays" className="space-y-4">
            <Card className="p-6">
              <RelayConfigPanel />
            </Card>
          </TabsContent>

          <TabsContent value="network" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Network className="h-5 w-5 text-neon-purple" />
                <h2 className="text-2xl font-bold">Network Configuration</h2>
              </div>
              <NetworkSettings />
              <MeshSettings />
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="h-5 w-5 text-neon-purple" />
                <h2 className="text-2xl font-bold">Security Settings</h2>
              </div>
              <SecuritySettings />
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Cpu className="h-5 w-5 text-neon-purple" />
                <h2 className="text-2xl font-bold">System Configuration</h2>
              </div>
              <SystemSettings />
            </Card>
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  );
}