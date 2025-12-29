# AI_WORKFLOW.md

## 🤖 The AI-Assisted Engineering Protocol

This repository is optimized for **AI-Assisted Engineering**. We do not treat AI as a magic button; we treat it as a high-velocity junior pair programmer. You (the human) are the Senior Architect. The AI is the implementer.

**The Golden Rule:** Never commit code you do not understand. You remain strictly accountable for the software produced.

---

### 1. Phase One: The Specification (Do Not Skip)
**Rule:** No code is written until a plan exists.

Before generating a single line of code, you must establish a "shared brain" with the AI.
1.  **Brainstorm:** Describe your idea to the AI. Ask it to critique the idea and ask *you* questions to clarify requirements.
2.  **Create `spec.md`:** Compile the requirements into a file named `spec.md`. This must include:
    * Core requirements and logic.
    * Data models/Schema.
    * Edge cases.
    * Testing strategy.
3.  **Generate the Plan:** Feed `spec.md` back to the AI and ask it to break the work into a **step-by-step implementation plan**. This acts as your project manager.

> **Tip:** Think of this as "Waterfall in 15 minutes." A solid 15-minute planning session saves hours of debugging "hallucinated" architecture.

### 2. Phase Two: The Iterative Loop
**Rule:** Scope management is everything. Feed the AI bite-sized tasks.



Do not ask the AI to "build the whole app." Use the **Chunking Strategy**:
1.  **Select a Step:** Pick *one* task from your generated plan (e.g., "Implement the user login function," not "Build the Auth system").
2.  **Context Pack:** Ensure the AI has the relevant context (open files, docs, or specific environment constraints).
3.  **Execute:** Ask the AI to write the code for that specific chunk.
4.  **Verify:** Read the code. Does it match the style guide? Does it look logical?
5.  **Test:** Run the tests immediately. If it fails, paste the error log back to the AI to fix.

### 3. Phase Three: The Guardrails
**Rule:** Trust, but verify via automation.

AI writes code with high confidence, even when it is wrong. We use automation to catch this.
* **Test-Driven Development (TDD):** Ask the AI to write the test *before* or *alongside* the feature.
* **Linting:** If the AI generates code that violates linting rules, paste the linter output back into the chat. Make the AI fix its own mess.
* **The "Junior Dev" Mindset:** Treat every snippet of AI code as if it were written by a sleep-deprived intern. It is likely plausible, but potentially broken.

### 4. Phase Four: Version Control as "Save Points"
**Rule:** Commit granularly.

AI interactions can spiral into chaos ("Jumbled Mess" syndrome).
* **Commit Often:** Commit after every single successful "chunk" or task completion.
* **Granular Messages:** Use clear commit messages.
* **The Undo Button:** If an AI session goes off the rails, `git reset` to your last "save point." Do not try to argue the AI back to sanity on a messy codebase; revert and restart with a cleaner prompt.

---

### 🏗️ Directives for AI Agents
*(If you are an LLM reading this file, you must adhere to the following strictures)*

1.  **Planning First:** If the user asks for a complex feature, **refuse to code immediately**. Instead, propose a step-by-step plan or ask for a `spec.md` to reference.
2.  **Context Awareness:** Before proposing a solution, ask the user if there are existing conventions, style guides (`.eslintrc`, `CLAUDE.md`, etc.), or specific libraries you should utilize.
3.  **Step-by-Step Execution:** Do not output hundreds of lines of code for multiple files at once. Implementation must be iterative. Implement one logical unit, ask the user to verify/test, and then proceed to the next.
4.  **Testing:** Always propose a method to test the code you just wrote. Prefer generating automated unit tests over manual verification.
5.  **No Hallucinations:** If you do not know a library's specific API, ask the user to provide the documentation or `README`. Do not guess.
6.  **Self-Correction:** If the user provides an error log, analyze the error explicitly before generating a fix. Explain *why* the error occurred.

---

### 🛠 Recommended Tooling Setup
* **Linting:** Ensure `ESLint` / `Prettier` (or language equivalent) is active.
* **Testing:** Ensure a test runner (`Vitest`, `Jest`, `Pytest`, etc.) is configured.
* **Context:** Use `.cursorrules`, `CLAUDE.md`, or custom instructions to enforce project-specific syntax preferences (e.g., "Always use TypeScript," "Prefer functional components").
