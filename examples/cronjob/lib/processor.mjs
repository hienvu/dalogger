import logger from '@hvu/dalogger';
import { processA } from './module-a.mjs';
import { processB } from './module-b.mjs';

export async function processTask(task) {
  try {
    await processA(task);
    processB(task);
  } catch (error) {
    logger().error(error);
  }
}
