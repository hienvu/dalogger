## DEMO

Each request will have a unique trace key across multiple APIs during a sequence of requests, aka microservices.

### How to run

Install

```
npm i
```

Run the server:

```
node server.mjs
```

then try these scenarios:

1. Using `ab` to simulate unique concurrent requests:

```
ab -n 10 -c 10 http://localhost:3000/
```

There should be 10 unique request entries:

```
cat /tmp/dalogger-demo-express.log | sed -E 's/.*"dalogger-trace-key":"([^"]*)".*/\1/' | sort | uniq | wc -l
```

2. A sequence of requests across multiple APIs:

```
curl -H 'dalogger-trace-key: chained-trace-key' http://localhost:3000/ &
curl -H 'dalogger-trace-key: chained-trace-key' http://localhost:3000/ &
curl -H 'dalogger-trace-key: chained-trace-key' http://localhost:3000/
```

And this is what the log entries will look like:

```
grep chained-trace-key /tmp/dalogger-demo-express.log
```