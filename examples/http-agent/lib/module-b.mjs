import logger from '@hvu/dalogger';

export function processB(task) {
  logger().debug('B is processing', task);
  if (Math.random(1)) {
    throw new Error('B failed');
  }
}
