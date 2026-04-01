import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load .env file if it exists
const envPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const [key, value] = line.split('=');
    if (key && value && !process.env[key]) {
      process.env[key] = value.trim();
    }
  });
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const agentRoot = path.join(__dirname, '..');

// Load agent files
const soul = fs.readFileSync(path.join(agentRoot, 'SOUL.md'), 'utf8');
const rules = fs.readFileSync(path.join(agentRoot, 'RULES.md'), 'utf8');
const reviewSkill = fs.readFileSync(path.join(agentRoot, 'skills', 'review-code', 'SKILL.md'), 'utf8');
const standardsSkill = fs.readFileSync(path.join(agentRoot, 'skills', 'check-standards', 'SKILL.md'), 'utf8');
const fixesSkill = fs.readFileSync(path.join(agentRoot, 'skills', 'suggest-fixes', 'SKILL.md'), 'utf8');
const badCode = fs.readFileSync(path.join(__dirname, 'bad-code.js'), 'utf8');

// Build system prompt from agent files
const systemPrompt = `${soul}\n\n---\n\n${rules}\n\n---\n\n## Skills Available\n\n### Skill: review-code\n${reviewSkill}\n\n### Skill: check-standards\n${standardsSkill}\n\n### Skill: suggest-fixes\n${fixesSkill}`;

// Check for API key
if (!process.env.GEMINI_API_KEY) {
  console.error('❌ Error: GEMINI_API_KEY environment variable is not set.');
  console.error('\nTo use this demo:');
  console.error('  1. Get your Gemini API key from https://aistudio.google.com/app/apikey');
  console.error('  2. Copy your key');
  console.error('  3. Set the environment variable:');
  console.error('     - Windows (PowerShell): $env:GEMINI_API_KEY="your-key"');
  console.error('     - Windows (CMD): set GEMINI_API_KEY=your-key');
  console.error('     - macOS/Linux: export GEMINI_API_KEY=your-key');
  console.error('  4. Re-run: node demo/run-demo.js\n');
  process.exit(1);
}

console.log('🤖 CodeReview Agent starting...\n');
console.log('📄 Reviewing: demo/bad-code.js\n');
console.log('─'.repeat(60) + '\n');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const modelCandidates = ['gemini-2.5-flash', 'gemini-2.5-flash-preview-04-17'];

let textOutput = null;
for (const modelName of modelCandidates) {
  console.log(`Trying model: ${modelName}`);
  try {
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: systemPrompt
    });

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Review this code using your review-code, check-standards, and suggest-fixes skills:\n\n\`\`\`javascript\n${badCode}\n\`\`\``
            }
          ]
        }
      ],
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7
      }
    });

    textOutput = result.response.text();
    if (textOutput) {
      console.log(`✅ Using: ${modelName}\n`);
      break;
    }
    console.log('⚠️ Empty response from model.\n');
  } catch (err) {
    console.log(`⚠️ Error: ${err.message}\n`);
  }
}

if (textOutput) {
  console.log(textOutput);
  console.log('\n' + '─'.repeat(60));
  console.log('✅ Review complete.');
} else {
  console.error('❌ All models failed.');
  process.exit(1);
}