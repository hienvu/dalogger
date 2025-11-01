# SYNOPSIS

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

1. `logger()` is an object, refer to [DaLoggerAbstractLogger](/src/supported-loggers/logger-interface.ts) for its methods.

2. `DaLogger` is a class, refer to [here](/src/da-logger.ts) for its *static* methods.

