## DEMO

Each task is uniquely logged with its own trace key.

### How to run

Install

```
npm i
```

then try these scenarios:

1. Using config file, default provider: pino

```
node main.mjs
```

2. Override config file default provider from `pino` to `winston`:

```
DA_LOGGER_PROVIDER=winston node main.mjs
```
