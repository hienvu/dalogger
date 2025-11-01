import logger from '@hvu/dalogger';
import { processC } from './module-c.mjs';

export async function processA(task) {
  logger().debug('A is processing', task);
  await processC(task);
}
