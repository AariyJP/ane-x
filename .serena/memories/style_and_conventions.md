# Style and Conventions

**Code Style & Patterns:**
1. **ES Modules**: Since `package.json` specifies `"type": "module"`, all relative imports in TypeScript files must include the `.js` extension (e.g., `import { execute as x } from "./commands/x.js";`). This is crucial to avoid "module not found" errors when executed.
2. **Indentation & Formatting**: The code generally uses 4 spaces for indentation (some variations exist, but 4 is the standard based on the `src/index.ts` file).
3. **Environment Variables**: Heavily relies on `.env` files for configuration. Make sure to reference `process.env.VARIABLE_NAME` and handle empty states (like `|| ""`).
4. **Error Handling**: Uses `async/await` and wraps asynchronous functions where necessary. It has global handlers for `uncaughtException` and `unhandledRejection` at the top of the entry point to prevent complete crashes.
5. **Discord Handlers**: Command registration is conditionally run (if `process.env.D_REGISTER_COMMANDS === "true"`), and interaction routing is currently done using a `switch (interaction.commandName)` statement inside `Events.InteractionCreate`.
6. **Japanese Responses**: All user-facing strings, Discord bot replies, logging, and error messages must be in Japanese.