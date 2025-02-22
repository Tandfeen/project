import { MeshNode } from "../types";

export const calculateSignalQuality = (rssi: number): number => {
  // Convert RSSI to percentage (typical RSSI range: -100 to -50)
  const minRSSI = -100;
  const maxRSSI = -50;
  const quality = Math.min(100, Math.max(0, 
    ((rssi - minRSSI) / (maxRSSI - minRSSI)) * 100
  ));
  return Math.round(quality);
};

export const estimateDistance = (rssi: number, environment: 'indoor' | 'outdoor' | 'mixed' = 'mixed'): number => {
  // Advanced distance estimation using environment-aware path loss model
  const referenceDistance = 1; // meters
  const referenceRSSI = -40; // RSSI at reference distance in ideal conditions
  
  // Environment-specific path loss exponents
  const pathLossExponents = {
    indoor: {
      clear: 2.0,  // Open office
      obstructed: 3.5, // With walls/furniture
      heavy: 4.5   // Many obstacles
    },
    outdoor: {
      clear: 2.0,  // Line of sight
      suburban: 2.7, // Light obstacles
      urban: 3.0    // Buildings
    },
    mixed: 3.0     // Average for mixed environments
  };

  // Adjust for environmental factors
  let pathLossExponent;
  let environmentalFactor = 1;
  
  switch(environment) {
    case 'indoor':
      // Assume more obstacles if signal is weaker
      pathLossExponent = rssi < -70 ? pathLossExponents.indoor.heavy :
                        rssi < -60 ? pathLossExponents.indoor.obstructed :
                        pathLossExponents.indoor.clear;
      environmentalFactor = 0.8; // Account for reflections
      break;
      
    case 'outdoor':
      // Adjust based on signal strength indicating obstacles
      pathLossExponent = rssi < -75 ? pathLossExponents.outdoor.urban :
                        rssi < -65 ? pathLossExponents.outdoor.suburban :
                        pathLossExponents.outdoor.clear;
      environmentalFactor = 1.2; // Account for free space
      break;
      
    default: // mixed
      pathLossExponent = pathLossExponents.mixed;
      environmentalFactor = 1;
  }

  // Calculate distance using log-distance path loss model with corrections
  const distance = Math.pow(10, (referenceRSSI - rssi) / (10 * pathLossExponent));
  
  // Apply environmental correction and limit reasonable range
  const correctedDistance = Math.min(1000, Math.max(0.1, distance * environmentalFactor));
  
  return Number(correctedDistance.toFixed(2));
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
  nodes: MeshNode[]
): string[] => {
  // Create graph representation with weights based on signal quality
  const graph: Record<string, Record<string, number>> = {};
  const distances: Record<string, number> = {};
  const previous: Record<string, string> = {};
  const unvisited = new Set<string>();

  // Initialize graph structure
  nodes.forEach(node => {
    graph[node.id] = {};
    distances[node.id] = Infinity;
    unvisited.add(node.id);
  });

  // Build connections with weights based on RSSI and signal strength
  nodes.forEach(node => {
    nodes.forEach(neighbor => {
      if (node.id !== neighbor.id) {
        const distance = Math.abs(node.rssi - neighbor.rssi);
        const signalQuality = (node.signalStrength + neighbor.signalStrength) / 2;
        const weight = distance / signalQuality;
        if (weight < 100) { // Only connect nodes with reasonable signal quality
          graph[node.id][neighbor.id] = weight;
        }
      }
    });
  });

  distances[source] = 0;

  while (unvisited.size > 0) {
    // Find unvisited node with minimum distance
    let current = Array.from(unvisited).reduce((min, node) => 
      distances[node] < distances[min] ? node : min
    );

    if (current === target) break;

    unvisited.delete(current);

    // Update distances to neighbors
    for (const neighbor in graph[current]) {
      const alt = distances[current] + graph[current][neighbor];
      if (alt < distances[neighbor]) {
        distances[neighbor] = alt;
        previous[neighbor] = current;
      }
    }
  }

  // Reconstruct path
  const path: string[] = [];
  let current = target;

  if (previous[current] || current === source) {
    while (current) {
      path.unshift(current);
      current = previous[current];
    }
  }

  return path;
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