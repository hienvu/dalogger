import { processTask } from './lib/processor.mjs';
import logger, { DaLogger } from '@hvu/dalogger';
import express from 'express';
import console from 'node:console';

/**
 * IMPORTANT NOTE:
 * 
 * Express will manage the async context so explicit use of AsyncLocalStorage is not required.
 * We will simply supply the trace key to the logger() function via DaLogger.register()
 * and call DaLogger.unregister() when the request is complete
 * - this is a contrive example, real world should leverage middleware.
 * 
 */

const app = express();
app.get('/', (req, res) => {
  const traceKey = req.headers['dalogger-trace-key'];

  // Start - setup trace
  DaLogger.register(traceKey);

  processTask({reqId: logger().traceKey()});
  logger().info('Request processed');
  res.send('Hello World');

  // End - cleanup
  DaLogger.unregister();
});

console.log('try this command: ab -n 10 -c 10 http://localhost:3000/');

app.listen(3000);
