# Claude CLI Setup Guide

This guide covers how to install and configure the Claude CLI (officially called "Claude Code") for AI-assisted development.

## Installation

Choose one of the following installation methods:

### Via curl (Recommended)

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

This is the recommended method as it handles all dependencies and configuration automatically.

### Via Homebrew (macOS)

```bash
brew install --cask claude-code
```

### Via npm

Requires Node.js 18 or newer:

```bash
npm install -g @anthropic-ai/claude-code
```

> **Note**: Do not use `sudo` with `npm install -g` as this can lead to permission issues and security vulnerabilities.

## Authentication

After installation, authenticate with your Anthropic account:

```bash
claude
```

This will open your browser and prompt you to log in. You can authenticate using either:
- **Claude.ai account** (recommended for subscription plans)
- **Claude Console account** (for API access with pre-paid credits)

Your credentials will be stored for future use.

## API Key Configuration (Optional)

If you prefer to use API keys instead of browser authentication:

1. **Set as environment variable:**
   ```bash
   export ANTHROPIC_API_KEY="your-api-key-here"
   ```

2. **Add to shell profile** (for persistence):
   
   For Zsh:
   ```bash
   echo 'export ANTHROPIC_API_KEY="your-api-key-here"' >> ~/.zshrc
   source ~/.zshrc
   ```
   
   For Bash:
   ```bash
   echo 'export ANTHROPIC_API_KEY="your-api-key-here"' >> ~/.bashrc
   source ~/.bashrc
   ```

## System Requirements

- **OS**: macOS 10.15+, Ubuntu 20.04+/Debian 10+, or Windows 10+ (with WSL)
- **RAM**: Minimum 4GB
- **Node.js**: 18+ (for npm installation)
- **Shell**: Works best with Bash, Zsh, or Fish
- **Network**: Active internet connection required

## Usage with This Template

Once installed and authenticated, you can use Claude CLI for AI-assisted development:

1. Navigate to your project directory
2. Run `claude` to start an AI-assisted session
3. Use the slash commands defined in `.claude/commands/` for structured workflows


## Troubleshooting

### Permission Errors with npm

If you encounter permission errors with npm global installation, configure a user-local npm directory instead of using `sudo`.

### Authentication Issues

If authentication fails, ensure:
- You're in an Anthropic-supported country
- You have an active internet connection
- Your browser allows pop-ups from claude.ai

## Further Reading

- [Official Claude Code Documentation](https://claude.ai)
- [Anthropic API Documentation](https://docs.anthropic.com)
