"use client";

import { useState } from "react";
import { RelayGrid } from "@/components/relay-grid";
import { StagerPanel } from "@/components/stager-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NetworkDiagnostics } from "@/components/network-diagnostics";
import { SystemStatus } from "@/components/system-status";
import { MeshNetworkMap } from "@/components/mesh-network-map";
import { PerformanceMonitor } from "@/components/performance-monitor";
import { StagedRelay, Sequence } from "@/lib/types";

export default function Home() {
  const [sequence, setSequence] = useState<Sequence>({
    id: '1',
    name: 'Default Sequence',
    steps: []
  });
  const [currentNode, setCurrentNode] = useState<string | undefined>(undefined);

  const updateSequence = (newSteps: StagedRelay[]) => {
    setSequence(prev => ({
      ...prev,
      steps: newSteps.map(step => ({
        relayId: step.relayId,
        nodeId: step.nodeId,
        delay: step.delay
      }))
    }));
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <header className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          Relay Control System
        </h1>
        <SystemStatus />
      </header>
      
      <Tabs defaultValue="control" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 h-auto">
          <TabsTrigger value="control">Control Panel</TabsTrigger>
          <TabsTrigger value="stager">Sequence Stager</TabsTrigger>
          <TabsTrigger value="mesh">Mesh Network</TabsTrigger>
          <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="control" className="space-y-4">
          <RelayGrid />
          <PerformanceMonitor />
        </TabsContent>
        
        <TabsContent value="stager" className="space-y-4">
          <StagerPanel 
            sequence={sequence}
            setSequence={updateSequence}
            setCurrentNode={setCurrentNode}
          />
        </TabsContent>
        
        <TabsContent value="mesh" className="space-y-4">
          <MeshNetworkMap />
        </TabsContent>
        
        <TabsContent value="diagnostics" className="space-y-4">
          <NetworkDiagnostics />
        </TabsContent>
      </Tabs>
    </div>
  );
}

