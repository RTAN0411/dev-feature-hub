# Dev Feature Hub

Dev Feature Hub turns feature markdown into:

1. prompt files for manual AI use, and
2. structured Azure DevOps-style tasks generated via OpenAI.

## What this project does

- Reads feature markdown files from `src/inputs` (manual flow) and `src/task-breakdown/feature-templates` (automated flow).
- Builds reusable AI prompts using `src/task-breakdown/common/feature-prompt.ts`.
- Generates manual prompt text files into `src/outputs/prompts`.
- Generates AI task breakdown JSON files into `src/task-breakdown/feature-tasks`.

## Requirements

- Node.js 20+ (tested with Node 22)
- npm
- OpenAI API key (for AI task generation only)

## Install

```bash
npm install
```

## Environment variables

Create a `.env` file in the project root:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

> `OPENAI_API_KEY` is required for `generate:ai-tasks`.

## Project structure

```text
src/
  inputs/                # Input feature markdown files (*.md)
  outputs/
    prompts/             # Output from manual prompt generator
  task-breakdown/
    manual-task-breakdown.ts
    automated-task-breakdown.ts
    feature-templates/   # Input for automated AI task generator
    feature-tasks/       # Output from automated AI task generator
    common/
      feature-prompt.ts
```

## Available scripts

### Generate manual prompts

```bash
npm run generate:manual-prompts
```

Reads markdown files in `src/inputs` and writes `*-prompt.txt` files to `src/outputs/prompts`.

### Generate AI task breakdowns

```bash
npm run generate:ai-tasks
```

Reads markdown from `src/task-breakdown/feature-templates`, sends prompts to OpenAI, and writes `*-azure-tasks.json` files to `src/task-breakdown/feature-tasks`.

### Development and maintenance

```bash
npm run dev
npm run lint
npm run format
```

## Typical workflow

1. Add or update feature markdown files in `src/inputs` for manual prompt generation.
2. Add or update feature markdown files in `src/task-breakdown/feature-templates` for automated AI task generation.
3. Run `npm run generate:manual-prompts` to produce prompt files.
4. Run `npm run generate:ai-tasks` to produce JSON task output.
5. Review output in `src/outputs/prompts` and `src/task-breakdown/feature-tasks`.

## Notes

- You may see Node warnings related to `--loader ts-node/esm`; these are currently non-blocking.
- If OpenAI returns non-JSON content, the script falls back to saving raw text output.

## Troubleshooting

### `ERR_UNKNOWN_FILE_EXTENSION: .ts`

Use the provided npm scripts (they already run Node with the `ts-node` ESM loader):

```bash
npm run generate:manual-prompts
npm run generate:ai-tasks
```

### `Cannot find module ... feature-prompt`

Ensure ESM import paths include `.js` in TypeScript source imports when using `ts-node/esm`, for example:

```ts
import { createPrompt } from "./common/feature-prompt.js";
```

### OpenAI authentication errors

Check that `.env` exists and `OPENAI_API_KEY` is valid.
