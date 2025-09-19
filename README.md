# MindMap Electron (ChatGPT Mind-Map UI)

An Electron + React app that turns your first query into a mind map using OpenAI Structured Outputs. Only top-level topics render first; click a node to expand subtopics; double-click a node to open a detail panel.

## Features
- Electron main holds your API key (safe from the renderer)
- OpenAI Responses API with JSON Schema (hard-typed, no brittle parsing)
- React Flow for the mind-map canvas
- Progressive expansion (level-by-level)
- Detail panel with concise markdown + facts

## Setup
1. **Clone & install**
   ```bash
   pnpm i   # or npm i / yarn
   ```
2. **Env**
   ```bash
   cp .env.example .env
   # put your OpenAI key:
   # OPENAI_API_KEY=sk-...
   ```
3. **Run**
   ```bash
   pnpm dev
   ```
   This launches the renderer dev server and opens Electron.

4. **Build**
   ```bash
   pnpm build
   pnpm preview  # run packaged preview
   ```

## Usage
- Type a question in the top bar and hit **Map**.
- Click a node → expands with direct children.
- Double-click a node → see a concise detail panel.

## Notes
- Model: `gpt-4.1-mini` (cheap/fast). Swap to a larger model if needed.
- Layout: current layout is simple “lanes by level”. Drop in a DAG/radial layout later if you prefer.
- Costs: expansion calls are kept ≤ ~500 tokens; init generates ~5–9 topics.

## Security
- The API key lives only in the main process (`src/main/index.ts`).
- The renderer talks to main via IPC exposed in `src/preload/index.ts` as `window.ai`.

## Customize
- **Prompting rules**: edit `src/main/prompts.ts`
- **Schema**: edit `src/main/schema.ts` (must stay in sync with UI)
- **Detail panel markdown**: tweak the very small renderer-side Markdown helper or replace with a proper markdown renderer.

## Keyboard Tips
- **Enter** in the input → Generate map
- **Click node** → Expand subtopics
- **Double-click node** → Load details

## Troubleshooting
- If you see `OPENAI_API_KEY missing`, ensure `.env` exists and you restarted dev.
- On corporate networks, you may need to allow outbound `https://api.openai.com`.

MIT © you
