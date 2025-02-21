"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  Info, 
  Book, 
  Shield, 
  Cpu, 
  Wifi, 
  Github,
  Mail
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Info className="h-6 w-6 text-neon-purple" />
        <h1 className="text-3xl font-bold tracking-tight neon-text">
          About Relay Control System
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6 h-full">
            <div className="flex items-center gap-2 mb-4">
              <Book className="h-5 w-5 text-neon-purple" />
              <h2 className="text-xl font-bold">Overview</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              The Relay Control System is a professional-grade mesh networking solution
              for controlling multiple relay nodes. Built with advanced features for
              reliable remote operation and real-time monitoring.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">ESP32 Based</Badge>
              <Badge variant="secondary">Mesh Network</Badge>
              <Badge variant="secondary">Real-time Control</Badge>
              <Badge variant="secondary">Sequence Staging</Badge>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="p-6 h-full">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-neon-purple" />
              <h2 className="text-xl font-bold">Security Features</h2>
            </div>
            <ul className="space-y-2 text-muted-foreground">
              <li>• End-to-end encryption for all communications</li>
              <li>• Secure mesh network protocol</li>
              <li>• Authentication and access control</li>
              <li>• Safety interlocks and fail-safes</li>
            </ul>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="p-6 h-full">
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="h-5 w-5 text-neon-purple" />
              <h2 className="text-xl font-bold">Technical Specifications</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Processor</p>
                <p className="font-medium">ESP32-WROOM-32</p>
              </div>
              <div>
                <p className="text-muted-foreground">Memory</p>
                <p className="font-medium">4MB Flash</p>
              </div>
              <div>
                <p className="text-muted-foreground">Relay Channels</p>
                <p className="font-medium">6 Independent</p>
              </div>
              <div>
                <p className="text-muted-foreground">Mesh Range</p>
                <p className="font-medium">Up to 1km LOS</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="p-6 h-full">
            <div className="flex items-center gap-2 mb-4">
              <Wifi className="h-5 w-5 text-neon-purple" />
              <h2 className="text-xl font-bold">Mesh Network</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Our advanced mesh networking technology enables seamless communication
              between relay nodes, extending range and reliability through intelligent
              routing and redundancy.
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Auto-discovery of nodes</li>
              <li>• Self-healing network topology</li>
              <li>• Real-time status monitoring</li>
              <li>• Optimized power management</li>
            </ul>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="h-5 w-5 text-neon-purple" />
            <h2 className="text-xl font-bold">Support & Resources</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Documentation</h3>
              <p className="text-muted-foreground">
                Comprehensive guides and API documentation available in our docs.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Technical Support</h3>
              <p className="text-muted-foreground">
                Professional support available through our support portal.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}