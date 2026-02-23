# Project Overview
**Purpose:**
A Discord bot that integrates with the X (formerly Twitter) API. It handles authentication and OAuth1 interactions with X directly from Discord, using slash commands like `/register`, `/oauth1`, `/verify1`, and `/x`. It allows specific users to interact with X services through the bot.

**Tech Stack:**
- **Language:** TypeScript
- **Runtime:** Node.js (configured as an ESM project via `"type": "module"` in `package.json`)
- **Libraries/Dependencies:**
  - `discord.js` (Discord API wrapper)
  - `twitter-api-v2` (X API interaction)
  - `dotenv` (environment variables management)
  - `nodemon`, `ts-node`, `typescript` (dev dependencies)

**Codebase Structure:**
- `src/index.ts`: The main entrypoint of the bot. It initializes both the X client and Discord client, sets up event listeners, and routes Discord interactions.
- `src/commands/`: Contains the command logic.
  - `builder.ts`: Contains the definitions (using `SlashCommandBuilder`) for the commands.
  - `x.ts`: Contains the specific execution logic for the `/x` command.
  - `utility/`: Contains other helper features or utility logic.
- `dist/`: The compiled output directory for TypeScript compilation.
- `Dockerfile` & `compose.yaml`: Used for containerization.
- `.env`: Holds necessary secrets (Discord tokens, X tokens).