import { processTask } from './lib/processor.mjs';
import logger, { DaLogger } from '@hvu/dalogger';

/*
 ** Each main() execution will log all entries under the same trace key.
 ** The logger trace key will be auto-generated.
 */
async function main() {
  DaLogger.register('cronjob-single-trace-key');
  const tasks = [];
  for (let i = 1; i <= 2; i++) {
    tasks.push({ id: i });
  }

  for (const task of tasks) {
    // Process
    await processTask(task);
    logger().info('Task processed', task);
  }
}

main();
