---
number: 0005
title: Wrangler v3 lock (Node 20.8.0 breaks v4)
type: architecture
status: accepted
date: 2026-06-13
---

**Context:** Choosing the Cloudflare Pages deploy tool version at scaffold
time, before CI/CD existed.

**Options considered:**
(1) Wrangler v4 (latest at the time).
(2) Wrangler v3, pinned.

**Decision:** Option 2. Wrangler is locked to v3 (`wrangler@3`) across local
use and CI (`cloudflare/wrangler-action@v3`, `wranglerVersion: 3`).

**Reasoning:** Wrangler v4 has a known incompatibility with Node 20.8.0, the
Node version this project's tooling/CI standardized on. Locking to v3 avoids
an entire class of environment-mismatch failures rather than working around
them per-invocation.

**Consequences:** Any future Wrangler upgrade requires first resolving (or
confirming resolved) the v4/Node 20.8.0 incompatibility, and updating both
the local dev instructions and the `.github/workflows/deploy.yml` action
version together -- never one without the other, since a version mismatch
between local and CI would reintroduce "works on my machine" deploy bugs.

**Revisit when:** the Node runtime version used by this project's CI/build
moves off 20.8.0, or Cloudflare confirms the v4 incompatibility is fixed.

**Related:** [[0006-github-actions-deploy]]
