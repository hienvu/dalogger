# DaLogger

## Overview

DaLogger is a lightweight, distributed-first logging utility designed for modern microservices.
It automatically correlates trace keys across services and functions, ensuring every log entry is
linked to its originating request — making debugging in distributed environments fast, consistent,
and infrastructure-agnostic.

> **Distributed-first logging. No trail, no tale.**

Refer to [examples](/examples) for some usage patterns.

---

## Motivation

### The Problem: Lost in the Logs

A user reports: _"Checkout failed."_

Where do you start? That single failure involves logs from multiple services:

```
Orders Service → Payment Service → Inventory Service → Shipping Service
```

Each service logs independently. Without trace correlation, you're:

- Grep’ing timestamps across services hoping they line up
- Guessing which errors belong to which request
- Spending hours reconstructing what should take seconds

**Example (Without DaLogger):**

```
# Orders Service
[10:32:15] INFO: Processing order #12345
[10:32:18] INFO: Calling payment service

# Payment Service
[10:32:16] INFO: Validating card ending in 4242
[10:32:17] ERROR: Payment declined - insufficient funds

# Inventory Service
[10:32:16] INFO: Reserving item SKU-789
[10:32:19] INFO: Reservation released
```

**Which payment failure caused which order to fail?**  
You can’t tell.

---

### The Solution: Automatic Trace Correlation

DaLogger tags every log from the same request with a unique trace key:

```
# Orders Service
[10:32:15] INFO (trace-abc-123): Processing order #12345
[10:32:18] INFO (trace-abc-123): Calling payment service

# Payment Service
[10:32:16] INFO (trace-abc-123): Validating card ending in 4242
[10:32:17] ERROR (trace-abc-123): Payment declined - insufficient funds

# Inventory Service
[10:32:16] INFO (trace-abc-123): Reserving item SKU-789
[10:32:19] INFO (trace-abc-123): Reservation released
```

**Query in your log aggregator:**

```
trace-abc-123
```

**Result:** Complete request lifecycle across all services ✅

---

## How It Works

DaLogger automatically creates and propagates a `traceKey` across services and modules, so every log line is correlated without manual effort.

### 1. Entry Point (Orders Service)

```typescript
DaLogger.register(); // Auto-generates trace-abc-123

logger().info('Processing order');

// Forward trace to downstream service
await fetch('/payment', {
  headers: { 'x-trace-key': logger().traceKey() },
});
```

### 2. Downstream Service (Payment Service)

```typescript
const traceKey = req.headers['x-trace-key'];
DaLogger.register(traceKey); // Reuses trace-abc-123

logger().info('Validating card'); // Auto-tagged
```

### 3. Your Modules (Zero Trace Awareness)

```typescript
// inventory-module.ts
import logger from 'dalogger';

export function reserveItem(sku: string) {
  logger().info(`Reserving ${sku}`); // Trace key added automatically
}
```

No prop-drilling.  
No manual trace management.  
**Just works.**

---

## What DaLogger Does (and Doesn’t Do)

✅ **DaLogger Provides:**

- Automatic trace key generation and propagation
- Thin wrapper around Pino/Winston (no lock-in)

❌ **DaLogger is NOT:**

- A log aggregator (use AWS CloudWatch / GCP Log Explorer / etc.)
- A new logger implementation (uses Pino/Winston under the hood)
- A monitoring system (use your aggregator’s alerting features)

**DaLogger ensures your logs can be correlated.**  
Your aggregator handles searching, filtering, and alerting.

---

## Why Two Loggers? (Pino vs Winston)

DaLogger supports both because different environments demand different trade-offs.

### 🏎️ Pino: Speed Over Guarantees

**Performance:** 5–10× faster than Winston (async I/O via worker threads)

**Reliability Caveat:** In short-lived serverless functions (e.g., AWS Lambda, Cloud Functions),  
logs may not flush before termination — especially with:

- Async transports (`pino-http-send`, remote syslog)
- Network-based destinations
- File streams that buffer

This behavior has been observed in production when functions terminate before worker threads complete writes.

**Best For:** Long-running containers (ECS, Kubernetes, Cloud Run, App Engine)  
where process lifetime ≫ log flush time.

---

### 🛡️ Winston: Reliability Over Speed

**Performance:** 5–10× slower than Pino (synchronous I/O on the main thread)

**Reliability:** Guarantees delivery in serverless — all writes complete before function returns,  
so logs aren’t lost to premature termination.

**Best For:** Serverless (Lambda, Cloud Functions) or any environment where  
delivery certainty matters more than throughput.

---

## Design Philosophy: “No Trail, No Tale”

Without proper breadcrumbs (trace keys), your logs can’t tell the complete story.

DaLogger ensures every log entry leaves a trail that connects back to the original request —  
making distributed debugging **deterministic**, not guesswork.

> **Distributed-first logging. No trail, no tale.**
