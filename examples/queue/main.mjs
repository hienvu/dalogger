import { processTask } from './lib/processor.mjs';
import { AsyncLocalStorage } from 'async_hooks';
import logger, { DaLogger } from '@hvu/dalogger';

/*
 **  Each task will be uniquely logged based on its async run.
 **  Each task will randomly fail to simulate error scenarios.
 */
function main() {
  const tasks = [];
  for (let i = 1; i <= 10; i++) {
    tasks.push({ id: i });
  }

  for (const task of tasks) {
    const asyncLocalStorage = new AsyncLocalStorage();
    asyncLocalStorage.run({ traceKey: task.id }, () => {
      // Setup
      DaLogger.register(asyncLocalStorage);

      // Process
      processTask(task);
      logger().info('Task processed', task);

      // Cleanup
      DaLogger.unregister();
    });
  }
}

main();
