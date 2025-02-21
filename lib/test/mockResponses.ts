import { 
    generateMockMetrics, 
    generateMockNode, 
    generateMockRelay,
    generateMockSequence,
    generateMockNetworkConfig,
    generateMockSecurityConfig
  } from './mockDataGenerators';
  import { CONFIG } from '../config';
  import type { WebSocketMessage } from '../types/websocket';
  
  export const getMockResponse = (type: string, data?: any): WebSocketMessage => {
    const baseResponse = {
      type,
      timestamp: Date.now(),
    };
  
    switch (type) {
      case 'systemMetrics':
        return {
          ...baseResponse,
          data: generateMockMetrics()
        };
  
      case 'meshUpdate':
        return {
          ...baseResponse,
          data: Array.from(
            { length: 3 }, 
            (_, i) => generateMockNode(i + 1)
          )
        };
  
      case 'relayUpdate':
        return {
          ...baseResponse,
          data: generateMockRelay(data?.id || 1)
        };
  
      case 'sequenceUpdate':
        return {
          ...baseResponse,
          data: generateMockSequence()
        };
  
      case 'networkConfig':
        return {
          ...baseResponse,
          data: generateMockNetworkConfig()
        };
  
      case 'securityConfig':
        return {
          ...baseResponse,
          data: generateMockSecurityConfig()
        };
  
      case 'error':
        return {
          ...baseResponse,
          data: {
            code: data?.code || 500,
            message: data?.message || 'An unexpected error occurred'
          }
        };
  
      default:
        return {
          ...baseResponse,
          data: null
        };
    }
  };