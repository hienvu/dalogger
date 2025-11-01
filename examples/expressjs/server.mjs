import { processTask } from './lib/processor.mjs';
import logger, { DaLogger } from '@hvu/dalogger';
import express from 'express';

const app = express();

// start the trace via middleware
app.use((req, res, next) => {
  const traceKey = req.headers['dalogger-trace-key'];
  // Start - setup trace
  DaLogger.register(traceKey);
  next();
});

app.get('/', async (req, res) => {
  await processTask({ reqId: logger().traceKey() });
  logger().info('Request processed');
  res.send('Hello World');
});

console.info('try this command: ab -n 5 -c 5 http://localhost:3000/');

app.listen(3000);
