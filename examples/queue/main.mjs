import { processTask } from './lib/processor.mjs';
import logger, { DaLogger } from '@hvu/dalogger';

/*
 **  Each task will use its supplied trace key.
 **  Each task will randomly fail to simulate error scenarios.
 */
async function main() {
  const tasks = [];
  for (let i = 1; i <= 3; i++) {
    tasks.push({ id: i });
  }

  for (const task of tasks) {
    await DaLogger.run(async () => {
      await processTask(task);
      logger().info('Task processed', task);
    }, `trace-key-${task.id}`);
  }
}

main();
