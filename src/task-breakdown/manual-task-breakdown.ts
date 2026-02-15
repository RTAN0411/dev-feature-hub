import fs from "fs-extra";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { createPrompt } from "./common/feature-prompt.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_FOLDER = path.join(__dirname, "../inputs");
const OUTPUT_FOLDER = path.join(__dirname, "../outputs/prompts");

// Ensure output folder exists
fs.ensureDirSync(OUTPUT_FOLDER);


// Helper to get all .md files in the input folder
const getMarkdownFiles = (): string[] =>
  fs.readdirSync(INPUT_FOLDER).filter(file => file.endsWith(".md"));

// Generate prompt for a single file
const generatePromptForFile = async (fileName: string) => {
  const filePath = path.join(INPUT_FOLDER, fileName);
  const content = await fs.readFile(filePath, "utf-8");

  const prompt = createPrompt(content);

  const outputFileName = fileName.replace(".md", "-prompt.txt");
  const outputPath = path.join(OUTPUT_FOLDER, outputFileName);

  await fs.writeFile(outputPath, prompt, "utf-8");

  console.log(`✅ Prompt generated: ${outputFileName}`);
};

// Main function
async function main() {
  const files = getMarkdownFiles();

  if (files.length === 0) {
    console.log("No Markdown files found in feature-templates folder.");
    return;
  }

  for (const file of files) {
    await generatePromptForFile(file);
  }

  console.log("🎯 All manual AI prompts generated in feature-prompts folder.");
}

main();
