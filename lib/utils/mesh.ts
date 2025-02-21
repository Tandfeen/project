export const calculateSignalQuality = (rssi: number): number => {
  // Convert RSSI to percentage (typical RSSI range: -100 to -50)
  const minRSSI = -100;
  const maxRSSI = -50;
  const quality = Math.min(100, Math.max(0, 
    ((rssi - minRSSI) / (maxRSSI - minRSSI)) * 100
  ));
  return Math.round(quality);
};

export const estimateDistance = (rssi: number): number => {
  // Simple distance estimation based on RSSI
  // Using the log-distance path loss model
  const referenceRSSI = -50; // RSSI at 1 meter
  const pathLossExponent = 2.7; // Typical value for indoor environments
  
  return Math.pow(10, (referenceRSSI - rssi) / (10 * pathLossExponent));
};

export const optimizeNetworkTopology = (nodes: any[]): any[] => {
  // Sort nodes by signal strength and connections
  return nodes.sort((a, b) => {
    const aScore = a.signalStrength + (a.connections.length * 10);
    const bScore = b.signalStrength + (b.connections.length * 10);
    return bScore - aScore;
  });
};

export const findOptimalRoute = (
  source: string,
  target: string,
  nodes: any[]
): string[] => {
  // Implement Dijkstra's algorithm for finding the optimal route
  // between two nodes in the mesh network
  // This is a simplified version - you'd want to consider signal strength,
  // hop count, and other factors in a real implementation
  return [];
};

export const calculateNetworkHealth = (nodes: any[]): {
  overall: number;
  connectivity: number;
  stability: number;
} => {
  const connectivity = nodes.reduce((acc, node) => 
    acc + (node.status === 'active' ? 1 : 0), 0) / nodes.length * 100;

  const stability = nodes.reduce((acc, node) => 
    acc + node.signalStrength, 0) / nodes.length;

  const overall = (connectivity + stability) / 2;

  return {
    overall: Math.round(overall),
    connectivity: Math.round(connectivity),
    stability: Math.round(stability)
  };
};