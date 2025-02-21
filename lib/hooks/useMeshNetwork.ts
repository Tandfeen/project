"use client";

import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { meshNodesAtom, selectedNodeAtom } from '../store/atoms';
import { useWebSocket } from '../websocket';
import { useToast } from '@/components/ui/use-toast';
import type { MeshNode } from '../types';

export function useMeshNetwork() {
  const { sendMessage, isConnected } = useWebSocket();
  const [nodes, setNodes] = useAtom(meshNodesAtom);
  const [selectedNode, setSelectedNode] = useAtom(selectedNodeAtom);
  const { toast } = useToast();

  const scanNetwork = useCallback(() => {
    if (!isConnected) {
      toast({
        title: "Connection Error",
        description: "Not connected to mesh network",
        variant: "destructive"
      });
      return;
    }

    sendMessage('scan_network', {});
    toast({
      title: "Network Scan",
      description: "Scanning for mesh nodes...",
    });
  }, [isConnected, sendMessage, toast]);

  const connectToNode = useCallback((nodeId: string) => {
    if (!isConnected) {
      toast({
        title: "Connection Error",
        description: "Not connected to mesh network",
        variant: "destructive"
      });
      return;
    }

    sendMessage('connect_node', { id: nodeId });
    setSelectedNode(nodeId);
  }, [isConnected, sendMessage, setSelectedNode, toast]);

  const updateNodeConfig = useCallback((nodeId: string, config: Partial<MeshNode>) => {
    if (!isConnected) {
      toast({
        title: "Connection Error",
        description: "Not connected to mesh network",
        variant: "destructive"
      });
      return;
    }

    sendMessage('update_node_config', { id: nodeId, config });
    setNodes(prev => prev.map(node => 
      node.id === nodeId 
        ? { ...node, ...config }
        : node
    ));
  }, [isConnected, sendMessage, setNodes, toast]);

  return {
    nodes,
    selectedNode,
    scanNetwork,
    connectToNode,
    updateNodeConfig
  };
}