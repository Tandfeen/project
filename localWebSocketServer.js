const WebSocket = require('ws');
const os = require('os'); // For system metrics

// Constants
const PORT = 81;

// Create the WebSocket Server
const server = new WebSocket.Server({ port: PORT });
console.log(`[${new Date().toISOString()}] WebSocket server running on ws://localhost:${PORT}/ws`);

// Track connected clients
const clients = new Set();

// Function for structured logging
const log = (message, type = 'INFO') => {
  console.log(`[${new Date().toISOString()}] [${type}] ${message}`);
};

// Function to fetch real system metrics
const getSystemMetrics = () => {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const memoryUsage = ((totalMemory - freeMemory) / totalMemory) * 100;

  return {
    cpuLoad: getCPULoad(), // Custom function below
    memoryUsage: memoryUsage.toFixed(2),
    uptime: os.uptime(),
  };
};

// Calculate CPU Load
const getCPULoad = () => {
  const cpus = os.cpus();

  const idle = cpus.reduce((total, cpu) => total + cpu.times.idle, 0);
  const total = cpus.reduce(
    (total, cpu) =>
      total +
      cpu.times.user +
      cpu.times.nice +
      cpu.times.sys +
      cpu.times.idle +
      cpu.times.irq,
    0
  );

  return (((total - idle) / total) * 100).toFixed(2);
};

// WebSocket Server Events
server.on('connection', (socket) => {
  log('New client connected');
  clients.add(socket);

  // Handle incoming messages
  socket.on('message', (message) => {
    log(`Message received: ${message}`);
    try {
      const parsedMessage = JSON.parse(message);

      // Respond to specific message types
      switch (parsedMessage.type) {
        case 'systemMetrics':
          socket.send(
            JSON.stringify({
              type: 'systemMetrics',
              data: getSystemMetrics(),
            })
          );
          break;

        case 'meshUpdate':
          // Simulated mesh data
          socket.send(
            JSON.stringify({
              type: 'meshUpdate',
              data: [{ id: 1, name: 'Node1' }, { id: 2, name: 'Node2' }],
            })
          );
          break;

        case 'relayUpdate':
          // Simulated relay data
          socket.send(
            JSON.stringify({
              type: 'relayUpdate',
              data: [{ id: 1, state: 'ON' }, { id: 2, state: 'OFF' }],
            })
          );
          break;

        case 'sequenceUpdate':
          // Simulated sequence data
          socket.send(
            JSON.stringify({
              type: 'sequenceUpdate',
              data: [{ id: 1, steps: 10 }, { id: 2, steps: 15 }],
            })
          );
          break;

        default:
          log(`Unknown message type: ${parsedMessage.type}`, 'WARNING');
          socket.send(
            JSON.stringify({
              type: 'error',
              message: 'Unknown message type',
            })
          );
      }
    } catch (error) {
      log(`Invalid message format: ${error.message}`, 'ERROR');
      socket.send(
        JSON.stringify({
          type: 'error',
          message: 'Invalid message format. Expected JSON.',
        })
      );
    }
  });

  // Handle client disconnect
  socket.on('close', () => {
    log('Client disconnected');
    clients.delete(socket);
  });

  // Handle socket errors
  socket.on('error', (error) => {
    log(`Socket error: ${error.message}`, 'ERROR');
  });
});

// Graceful shutdown handling
const shutdown = () => {
  log('Server shutting down...', 'INFO');
  server.close(() => {
    log('WebSocket server closed', 'INFO');
    process.exit(0);
  });

  // Close all active connections
  clients.forEach((client) => client.close());
};

// Listen for termination signals
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
