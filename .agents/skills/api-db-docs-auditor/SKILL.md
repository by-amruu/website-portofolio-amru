---
name: api-db-docs-auditor
description: Inspect database schemas, validate API contracts and endpoints, prevent N+1 queries, and generate clean production documentation. Use when testing APIs, auditing DB queries, or writing documentation.
---

# API, Database & Documentation Inspector

Use this skill to ensure fast, robust backend communication, clean database schemas, and crystal-clear documentation.

## 1. Database Health & Sanity
- **Schema & Normalization**: Verify primary keys, foreign key constraints, and sensible column types.
- **Index Audit**: Ensure columns frequently queried in `WHERE`, `ORDER BY`, or `JOIN` conditions have appropriate indexes.
- **N+1 Query Detection**: Audit data fetching layers for looping queries; enforce batching or eager loading (`include`/`join`).
- **Connection Safety**: Ensure connection pooling is configured properly and connections close gracefully.

## 2. API Contract & Reliability
- **HTTP Semantics**: Correct use of status codes (200, 201, 400, 401, 403, 404, 429, 500). Never return `200 OK` with an error body payload.
- **Input Validation**: Enforce schema validation (e.g. Zod, Joi, Pydantic) on request payloads before business logic execution.
- **Consistent Response Wrappers**: Standardize response formats (e.g. `{ data, error, meta }`).

## 3. High-Standard Documentation
- **Clear & Concise README**: Focus on setup in < 3 commands, environment variable specifications, and deployment steps.
- **API Spec / OpenAPI**: Maintain accurate request/response schema samples.
- **Architecture Decision Records (ADR)**: Document the "why" behind non-trivial technical choices.

