import { processTask } from './lib/processor.mjs';
import logger from '@hvu/dalogger';

/*
 ** Each main() execution will log all entries under the sake trace key.
 ** The logger trace key will be auto-generated.
 */
function main() {
  const tasks = [];
  for (let i = 1; i <= 2; i++) {
    tasks.push({ id: i });
  }

  for (const task of tasks) {
    // Process
    processTask(task);
    logger().info('Task processed', task);
  }
}

main();
