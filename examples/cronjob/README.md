## DEMO

Log all entries under the same trace key

### How to run

Install

```
npm i
```

then try these scenarios, using `watch` to simulate cronjob:

1. Using config file, default provider: `winston`

```
watch -n 5 node main.mjs
```

2. Override config file default provider from `winston` to `pino`:

```
DA_LOGGER_PROVIDER=pino watch -n 5 node main.mjs
```

3. Specific environment config:

```
NODE_ENV=dev watch -n 5 node main.mjs
```

Finally try and inspect the log entries, replace `<TRACE_KEY>`:

```
grep <TRACE_KEY> /tmp/dalogger-winston.log
```
