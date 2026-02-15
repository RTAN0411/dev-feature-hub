import fs from "fs-extra";
import path from "path";
import { glob } from "glob";
import OpenAI  from "openai";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { createPrompt } from "./common/feature-prompt.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const FEATURE_FOLDER = path.join(__dirname, "feature-templates");
const OUTPUT_FOLDER = path.join(__dirname, "feature-tasks");

// Ensure output folder exists
fs.ensureDirSync(OUTPUT_FOLDER);

// Helper to read all .md files
const getMarkdownFiles = (): string[] =>
  glob.sync(`${FEATURE_FOLDER}/**/*.md`);


// Generate tasks for a single file
async function generateTasksForFile(filePath: string) {
  const content = await fs.readFile(filePath, "utf-8");
  const prompt = createPrompt(content);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 800,
    });

    const text = response.choices?.[0]?.message?.content?.trim() ?? "{}";
    const fileName = path.basename(filePath, ".md") + "-azure-tasks.json";
    const outputPath = path.join(OUTPUT_FOLDER, fileName);

    // Try parsing JSON, fallback to raw text if invalid
    try {
      const parsed = JSON.parse(text);
      await fs.writeJson(outputPath, parsed, { spaces: 2 });
    } catch (err) {
      console.error(`❌ Failed to parse JSON for ${filePath}. Saving raw output.`);
      await fs.writeFile(outputPath, text);
    }

    console.log(`✅ Azure DevOps tasks generated for: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error generating tasks for ${filePath}`, error);
  }
}

// Main function
async function main() {
  const files = getMarkdownFiles();
  console.log(`Found ${files.length} feature files.`);

  for (const file of files) {
    await generateTasksForFile(file);
  }

  console.log("🎯 All Azure DevOps tasks generated!");
}

main();
