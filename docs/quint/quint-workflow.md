# Quint Workflow (not implemented yet)

This template is designed to work seamlessly with the [Quint Code](https://github.com/m0n0x41d/quint-code) philosophy.

## The Cycle

1. **Abduction (Hypothesize)**
   - Before coding, think of multiple ways to solve the problem.
   - Document these in `.quint/knowledge` or use the `quint-code` CLI.

2. **Deduction (Verify Logic)**
   - Check if your hypotheses are logically sound.
   - Do they violate constraints (security, performance, etc.)?

3. **Induction (Validate with Evidence)**
   - Write tests (`src/*.test.ts`).
   - Run benchmarks if necessary.
   - The existence of passing tests acts as "Evidence" in the Quint framework.

## Directory Structure

- `.quint/knowledge`: Store your hypotheses and models here.
- `.quint/evidence`: Store logs, test results, or manual validation records.
- `.quint/decisions`: Store your final decisions (ADRs).

## Further Reading

- [Effective Quint Code Usage Guide](./quint-best-practices.md): Learn how to prompt AI effectively and maintain decision hygiene.
