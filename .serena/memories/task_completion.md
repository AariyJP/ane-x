# Task Completion Guidelines

**When a task is completed, ensure the following steps are performed before considering the task finalized:**

1. **Verify TypeScript Compilation**: Always verify your changes map to valid TypeScript. Run `npx tsc` or similar compilation validation to ensure there are no missing imports, type errors, or unhandled promise scenarios.
2. **ESM Import Validation**: Double-check that all newly added `import` statements and local project file paths end with the explicitly demanded `.js` extension, required by Node's `"type": "module"` mode setup.
3. **No Unintentional Breaking Changes**: If you've modified X or Discord logic, check if event listeners (`Commands.InteractionCreate`) were affected. Be sure to appropriately pass contexts (like the interaction itself) down to nested logic if shifted to a separate file (e.g., in `src/commands/...`).
4. **Git Commits (when asked)**: Always adhere to the `Conventional Commits` format if making commits.
   - Example: `feat: add new Twitter API integration` or `fix: handle null response from user`.
   - Remember to use the `-S` flag (`git commit -S -m ...`) so commits are signed, as per the user's explicit rules.
5. **No Leftover Debug/Comments Mode**: Avoid generating excessive comments inside your edited code unless implicitly required. Do not comment logic out; remove it safely if requested. Ensure any output interaction (Discord bot replies or GitHub interaction texts) are written strictly in Japanese.