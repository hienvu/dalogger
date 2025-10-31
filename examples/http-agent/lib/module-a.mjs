import logger from '@hvu/dalogger';
import { processC } from './module-c.mjs';

export function processA(task) {
  logger().debug('A is processing', task);
  processC(task);
}
