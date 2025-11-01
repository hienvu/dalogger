## DEMO

Each htttp-agent (axios) will uniquely log with its own trace key, using child logger.

### How to run

Install

```
npm i

# Optional, making local installed "tsx" command available:
export PATH=node_modules/.bin:$PATH
```

then try these scenarios:

1. Using config file, default provider: `pino`

```
tsx index.ts
```

2. Override config file default provider from `pino` to `winston`:

```
DA_LOGGER_PROVIDER=winston tsx index.ts
```

3. Specific environment config:

```
NODE_ENV=winston tsx index.ts
```
