---
name: token-optimizer-hygiene
description: Enforce extreme token efficiency, prevent unnecessary code generation, strip dead/duplicate code, and keep conversations compact. Use when writing, refactoring, or reviewing code.
---

# Token Optimizer & Code Hygiene

Use this skill to save LLM tokens and eliminate useless/bloated code (*dead code, repetitive boilerplate, over-engineering*).

## 1. Token Preservation Protocol
- **Diff-First Outputs**: Never reprint entire 300-line files if only 5 lines change. Provide concise, targeted replacements or precise instructions.
- **No Lecture / No Fluff**: Skip theoretical explanations unless explicitly asked. State what was changed in 1-2 bullet points.
- **Context Compaction Awareness**: If conversation history grows dense with logs or multiple iterations, prompt the user to run `/compact`.

## 2. Anti-Bloat & Dead Code Rules
- **No Duplicate Utility Functions**: Always check if JavaScript/TypeScript/Python standard libraries or existing project dependencies already provide the helper function before inventing a new one.
- **No Premature Abstraction**: Do not create interfaces, factory patterns, or adapter layers for single-use logic. Keep code flat and direct.
- **Dead Code Pruning**:
  - Flag or delete unused imports, commented-out dead blocks, and orphaned variables.
  - Reject bloated CSS/styling classes that have zero visual effect.
- **Single Responsibility per Function**: Keep functions small, testable, and focused.

