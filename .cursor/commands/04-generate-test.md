# Prompt: Generate Unit Test

**Context**: I need a robust unit test for the attached code/requirement using Vitest.

**Instructions**:
1. Import `vi`, `describe`, `it`, `expect` from `vitest`.
2. Cover happy paths.
3. Cover edge cases (null inputs, empty arrays, limits).
4. Cover error states (mock throwing errors if applicable).
5. Ensure types are correct.

**Output Format**:
```typescript
import { describe, it, expect, vi } from 'vitest';
import { functionName } from './file';

describe('functionName', () => {
  it('should return expected value for valid input', () => {
    // ...
  });
});
```
