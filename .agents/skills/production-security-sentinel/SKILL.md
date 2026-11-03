---
name: production-security-sentinel
description: Deep security audit for zero data leakage, OWASP Top 10 mitigation, secret scanning, safe public deployment, and production resilience. Use when reviewing code, endpoints, environment configs, or prepping for production.
---

# Production Security Sentinel & Resilience

Use this skill before deploying to public environments or when reviewing critical code paths.

## 1. Zero Secret Leakage (Pre-Public Check)
- **Hardcoded Secret Scan**: Strictly scan for exposed API keys, tokens, JWT secrets, database connection strings, or private keys in source files.
- **Git Hygiene**: Verify `.gitignore` covers `.env`, `.env.local`, `.env.production`, credentials, private keys, and build artifacts.
- **Client vs Server Exposure**: Ensure server-only environment variables are never bundled into client-side code (e.g. Next.js `NEXT_PUBLIC_` or Vite `VITE_` prefix misuse).

## 2. OWASP Top 10 Safeguards
- **Injection Protection**: Parameterized queries / ORM usage only. Zero raw SQL concatenations or unescaped shell commands.
- **Cross-Site Scripting (XSS)**: Sanitize HTML user input; avoid raw `dangerouslySetInnerHTML` or `v-html` unless strictly sanitized.
- **CORS & Headers**: Strict CORS origin whitelisting; implement modern security headers (`Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`).
- **Auth & Authorization**: Validate session/token on the server for EVERY protected route or mutation, never relying solely on client state.

## 3. System Survival & High Availability (Production Resilience)
- **Defensive Error Handling**: Catch and handle exceptions gracefully. Never leak raw stack traces or internal database errors to end-users.
- **Rate Limiting & DoS Protection**: Check for rate-limiting on sensitive endpoints (login, forgot-password, contact forms, AI proxy endpoints).
- **Graceful Timeouts**: Always attach timeouts and abort signals to external API fetch calls to avoid zombie hanging threads.

