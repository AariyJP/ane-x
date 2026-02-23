# Suggested Commands

**Developing & Building:**
- **Compile TypeScript**: `npx tsc`
- **Run the bot via ts-node (Development)**: `npx ts-node --esm src/index.ts`
- **Run using nodemon (Auto-restart on save)**: `npx nodemon --exec 'ts-node --esm' src/index.ts` or possibly a defined script if added.
- **Run the compiled code (Production)**: `node dist/index.js` (assuming `tsc` outputs to `dist/`).

**System Commands (Windows):**
Since the environment is Windows (PowerShell/CMD):
- Force UTF-8 encoding before any terminal execution to avoid Japanese Mojibake (corrupted text).
  - PowerShell: `[Console]::OutputEncoding = [System.Text.Encoding]::UTF8;`
  - CMD: `chcp 65001 > nul &&`
- File investigation commands: Use `Get-ChildItem` (or `ls`/`dir`), `Select-String` (instead of grep). Also, `type` or `cat` for viewing. (However, always prioritize MCP/IDE tools like `view_file` over CLI commands whenever possible).
- Git: Standard git commands can be used, but ensure they are signed from the current git config (`git commit -S`).