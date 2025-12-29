# AI POC Git Template

A structured, opinionated Git template for building AI Proof of Concepts (POCs) with rigorous reasoning and guard rails.

## Features


- **Strict Guard Rails**: Pre-configured ESLint, Prettier, and TypeScript settings to ensure code quality.
- **AI-Ready**: Includes `.cursor/rules` and prompts to guide AI assistants (Cursor, Windsurf, etc.) to follow TDD and strict reasoning.
- **Test-Driven**: Vitest setup out of the box with examples.

## Getting Started

### Prerequisites

- Node.js (Latest LTS)
- `nvm` (Node Version Manager)
- `npm` or `bun`

### Installation

1. **Create Repository**
   - Go here: `https://github.com/TheCollectingGroup/use-aI-template`
   - Click "Use this template" to create a new repository.
   - Clone the new repository to your local machine
      - `git clone git@github.com:TheCollectingGroup/{your-repo-name}.git`

2. **Setup Node**
   ```bash
   nvm install
   ```
   or
   ```bash
   nvm use
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Scaffold Framework (Optional)**
   
   To initialize a Next.js or React Native project:
   ```bash
   npm run scaffold
   ```
   
   This will:
   - Initialize your chosen framework (Next.js or React Native)
   - Add framework-specific Cursor rules
   - Create CLAUDE.md with architecture guidance
   - Generate docker-compose.yml (Next.js only)

5. **Start Docker (Optional)**
   ```bash
   npm run docker:dev
   ```


### Optional: Claude CLI

For AI-assisted development with Claude CLI, see the [Claude CLI Setup Guide](docs/claude-cli-setup.md).




## Workflow

1. **Hypothesize**: Use `.cursor/commands/architecture-review.md` to reason about your problem.
2. **Implement**: Write tests first (see `.cursor/commands/generate-test.md`), then implementing code.
3. **Verify**: Run `npm run verify` to lint, type-check, and test.

## Commands

- `npm test`: Run tests with Vitest.
- `npm run lint`: Lint code with ESLint.
- `npm run format`: Format code with Prettier.
- `npm run verify`: Run all checks (Types, Lint, Test).
