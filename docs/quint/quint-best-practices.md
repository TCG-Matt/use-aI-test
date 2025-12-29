# Effective Quint Code Usage Guide

Quint Code is not just a directory structure; it is a **cognitive discipline** designed to prevent "Autopilot Bias"—the tendency to accept AI suggestions without critical scrutiny.

This guide explains how to use the framework effectively to build high-quality, auditable software.

## The Core Philosophy: Decision Hygiene

In the age of AI coding, the scarcity is not code; it is **verified truth**. An AI can generate 100 lines of plausible-looking code in seconds. Your job shifts from "writing code" to "validating reasoning."

**Quint Code formalizes this validation into three steps (ADI):**

1.  **Abduction (Hypothesize)**: Generate multiple possibilities.
2.  **Deduction (Verify Logic)**: Filter by logic and constraints.
3.  **Induction (Verify Reality)**: Filter by empirical evidence (tests).

---

## When to Use Quint Code

You do not need to use the full cycle for every line of code. Use the **"Door Test"**:

### 🚪 The One-Way Door (Heavy Use)
*Is this decision hard to reverse? Does it affect the system architecture?*
*   **Examples**: Choosing a database, designing an Auth flow, refactoring the core domain model.
*   **Action**: Full ADI cycle. Document in `.quint/knowledge`. Create ADR in `.quint/decisions`.

### 🚪 The Two-Way Door (Light Use)
*Is this easy to fix if wrong?*
*   **Examples**: Adding a utility function, tweaking CSS, writing a simple unit test.
*   **Action**: Mental ADI check. "Is there a better way? Does this match the type system?" No need for heavy documentation.

---

## Practical Workflow with AI

When working with an AI assistant (Cursor, Windsurf, or CLI), prompt it to follow the framework explicitly.

### Step 1: Force Divergence (Abduction)
Don't ask: *"How do I build X?"*
Ask: *"Propose 3 distinct architectural approaches to build X. List pros/cons for each."*

> **Goal**: Prevent the AI from locking onto the first (often most generic) pattern found in its training data.

### Step 2: Force Logic Checks (Deduction)
Don't ask: *"Does this look good?"*
Ask: *"Review plan B against our project constraints. Are there any type mismatches or security risks?"*

> **Goal**: Catch logical fallacies before writing a single line of code.

### Step 3: Force Tests as Evidence (Induction)
Don't ask: *"Write the code."*
Ask: *"Write a Vitest test case that proves Plan B satisfies the requirements. Then implement the code to pass it."*

> **Goal**: Ensure the code works in reality, not just in theory.

---

## Maintaining Your Knowledge Base

### Managing Epistemic Debt
Evidence decays. A benchmark run 6 months ago (L2 Evidence) helps less than a benchmark run today.
-   **L0 (Hypothesis)**: "I think Redis is faster." (Weak)
-   **L1 (Logically Sound)**: "Redis uses RAM, so it should be faster than Disk." (Better)
-   **L2 (Empirically Verified)**: "Benchmark `bm-01` shows Redis is 10ms faster for our payload." (Strong)

**Rule**: When refactoring, downgrade L2 claims to L0 until re-verified. Use `quint-code decay` (if installed) or manually check old assumptions.

---

## Cheat Sheet

| Stage | Question to Ask | Artifact Location |
| :--- | :--- | :--- |
| **Abduction** | "What are the alternatives?" | `.quint/knowledge/L0_hypotheses.md` |
| **Deduction** | "Is this logically sound?" | `.quint/knowledge/L1_verified.md` |
| **Induction** | "Does it work in reality?" | `.quint/evidence/test_results.md` |
| **Decision** | "What are we committing to?" | `.quint/decisions/ADR-001.md` |
