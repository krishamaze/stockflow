# StockFlow Agent Guide

## Project Overview
StockFlow is a Next.js-based inventory management system that uses Google Sheets as the backend data store and leverages OpenAI for smart product categorization.

## Workflow Rules for AI Contributors
- **Read First:** Before touching any code or docs, read this `AGENT.md` and then review any relevant files inside the `docs/` directory.
- **Documentation Sync:** Every code or content change must include updates to the relevant documentation files.
- **File Tracking:** When files are added, removed, or renamed, update `docs/FILE_INVENTORY.md` immediately.
- **Architecture Changes:** When system architecture or integrations change, update `docs/ARCHITECTURE.md` accordingly.
- **Context Maintenance:** Keep `docs/CONTEXT.md` up to date with business logic, rules, and key decisions.
- **Commit Messages:** Use the Conventional Commits format (e.g., `feat:`, `fix:`, `docs:`, `chore:`) for every commit.
- **Self-Awareness:** Verify that this `AGENT.md` is being followed before completing any task.

## Mandatory Post-Task Updates
After completing any task, automatically update the following files as applicable:
1. `docs/FILE_INVENTORY.md` if files were added, removed, or renamed.
2. `docs/ARCHITECTURE.md` if the system design changed.
3. `docs/CONTEXT.md` if business logic or requirements changed.
4. `CHANGELOG.md` with a summary of what was done.
5. This `AGENT.md` if the workflow itself improved or new guidance is needed.

Maintain clear, concise, actionable, current, and context-rich documentation at all times.
