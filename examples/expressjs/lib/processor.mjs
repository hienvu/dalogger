import logger from '@hvu/dalogger';
import { processA } from './module-a.mjs';
import { processB } from './module-b.mjs';

export function processTask(task) {
  try {
    processA(task);
    processB(task);
  } catch (error) {
    logger().error(error);
  }
}
