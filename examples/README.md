Each example is designed to demonstrate a usage pattern.

## SYNOPSIS

TypeScript & ECMAScript:

```
import logger, { DaLogger } from '@hvu/dalogger';
```

CommonJS:
```
const {logger, DaLogger} = require('@hvu/dalogger');
```

The usage patterns:

1. At the begining of each main processing run:

```
// setup tracing for this async run:
DaLogger.register('trace-key');

// all logger() calls within each async function will use the same tracing key 'trace-key'
await someAsyncFunctionA();
await someAsyncFunctionB();
await Promise.all([
    someAsyncFunctionC(),
    someAsyncFunctionB()
]);
```

2. Uniquely trace per async invocation:

```
DaLogger.run(
    async (): Promise<void> => {...},   // callback function
    'trace-key-1'                       // all logger() calls will use 'trace-key-1' as trace key
);
```

## API

1. `logger()` returns an async-context based object, refer to [DaLoggerAbstractLogger](/src/supported-loggers/logger-interface.ts) for its methods.

```
// Logging
logger().debug('a', { b: 'c' });
logger().error(new Error('an error'));

// Child logging - note: will only exist within the scope it was created, refer to http-agent example:
const childLogger = logger().createChild('trace-key-child');
childLogger.debug('a', { b: 'c' });
```

2. `DaLogger` is a class, refer to [here](/src/da-logger.ts) for its *static* methods.

```
// Two main methods to start tracing:
DaLogger.register();
DaLogger.run(callback, 'trace-key');
```

