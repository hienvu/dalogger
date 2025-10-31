import { processTask } from './lib/processor.mjs';
import logger, { DaLogger } from '@hvu/dalogger';
import express from 'express';
import console from 'node:console';

/**
 * NOTE:
 *
 * This is a contrive example, use asyncLocalStorage.run(), real world should leverage middleware.
 *
 */

const app = express();
app.get('/', async (req, res) => {
  const traceKey = req.headers['dalogger-trace-key'];

  // Start - setup trace
  DaLogger.register(traceKey);

  await processTask({ reqId: logger().traceKey() });
  logger().info('Request processed');
  res.send('Hello World');
});

console.log('try this command: ab -n 10 -c 10 http://localhost:3000/');

app.listen(3000);
