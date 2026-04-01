// ✅ Auto-fixed by code-review-agent v0.1.0
// Issues resolved: 4
// Original file: demo\run-demo.js
// Fixed on: 2024-07-30

import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

// -- Config ------------------------------------------------
const MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-3-flash',
];

// -- Helpers ----------------------------------------------

/**
 * Safely reads a file synchronously, exiting the process if it fails.
 * Use for critical configuration files.
 * @param {string} filePath - The path to the file.
 * @param {string} encoding - The file encoding.
 * @returns {string} The file content.
 */
function safeReadCriticalFileSync(filePath, encoding = 'utf8') {
  try {
    return fs.readFileSync(filePath, encoding);
  } catch (error) {
    console.error(`❌ CRITICAL ERROR: Failed to read "${filePath}". Ensure the file exists and is readable.`);
    console.error(error.message);
    process.exit(1); // Exit because this is a critical configuration file
  }
}

/**
 * Safely writes a file synchronously, logging an error if it fails.
 * @param {string} filePath - The path to the file.
 * @param {string} data - The data to write.
 * @param {string} encoding - The file encoding.
 * @returns {boolean} True if write was successful, false otherwise.
 */
function safeWriteFileSync(filePath, data, encoding = 'utf8') {
  try {
    fs.writeFileSync(filePath, data, encoding);
    return true;
  } catch (error) {
    console.error(`❌ ERROR: Failed to write file "${filePath}".`);
    console.error(error.message);
    return false;
  }
}

function getAllFiles(dir, ext = '.js') {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).flatMap((f) => {
    const full = path.join(dir, f);
    return fs.statSync(full).isDirectory()
      ? getAllFiles(full, ext)
      : full.endsWith(ext) ? [full] : [];
  });
}

async function callGemini(prompt, systemInstr) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: systemInstr
      });
      const result = await model.generateContent(prompt);
      console.log(`✅ Using: ${modelName}`);
      return result.response.text();
    } catch (e) {
      console.log(`⚠️  ${modelName} failed, trying next...`);
    }
  }
  throw new Error('All models failed.');
}

// -- Load agent files -------------------------------------
const agentRoot = path.resolve('.');

// Use safeReadCriticalFileSync for core files
const soul = safeReadCriticalFileSync(path.join(agentRoot, 'SOUL.md'), 'utf8');
const rules = safeReadCriticalFileSync(path.join(agentRoot, 'RULES.md'), 'utf8');

const skills = ['review-code', 'check-standards', 'suggest-fixes', 'security-audit', 'auto-fix']
  .map((s) => {
    const p = path.join(agentRoot, 'skills', s, 'SKILL.md');
    // Ensure read operations for skills are also robust
    if (fs.existsSync(p)) {
      try {
        return fs.readFileSync(p, 'utf8');
      } catch (error) {
        console.warn(`⚠️  Warning: Failed to read skill file "${p}". It will be skipped.`);
        console.warn(error.message);
        return '';
      }
    }
    return '';
  })
  .join('\n\n');

const systemPrompt = `${soul}\n\n---\n\n${rules}\n\n---\n\n## Skills\n\n${skills}`;

// -- Main --------------------------------------------------
const targetArg = process.argv[2];
const filesToReview = targetArg
  ? [targetArg]
  : getAllFiles(path.join(agentRoot, 'demo'));

console.log('\n🤖 CodeReview Agent starting...');
console.log(`📄 Reviewing ${filesToReview.length} file(s)\n`);
console.log('─'.repeat(60));

const timestamp = new Date().toISOString().split('T')[0];
const allReviews = [];
let totalIssues = 0;
let totalScore = 0;
let reviewedFilesCount = 0; // Track actual files successfully reviewed for average score

for (const filePath of filesToReview) {
  let code;
  try {
    code = fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`❌ ERROR: Failed to read file "${filePath}". Skipping review for this file.`);
    console.error(error.message);
    continue; // Continue to the next file if this one can't be read
  }

  const relPath = path.relative(agentRoot, filePath);
  console.log(`\n🔍 Reviewing: ${relPath}`);
  console.log('─'.repeat(60));

  const reviewPrompt = `
Use your review-code, check-standards, and security-audit skills on this file.

File: ${relPath}
\`\`\`javascript
${code}
\`\`\`

After the review, output a severity score in this EXACT format:
## Overall Grade: [A/B/C/D/F] ([0-100]/100)
Reason: [one line]

Scoring guide:
- A (90-100): Production ready, no significant issues
- B (75-89):  Minor issues only
- C (60-74):  Moderate issues, needs work
- D (40-59):  Serious issues present
- F (0-39):   Critical vulnerabilities found
`;

  const review = await callGemini(reviewPrompt, systemPrompt);
  console.log('\n' + review);

  const gradeMatch = review.match(/Overall Grade:\s*([A-F])\s*\((\d+)\/100\)/);
  const grade = gradeMatch ? gradeMatch[1] : 'N/A';
  const score = gradeMatch ? parseInt(gradeMatch[2], 10) : 0;
  totalScore += score;
  reviewedFilesCount++;

  const issueCount = (review.match(/\[BUG\]|\[SECURITY\]|\[STYLE\]|\[PERFORMANCE\]/g) || []).length;
  totalIssues += issueCount;

  console.log(`\n🔧 Generating auto-fix for ${relPath}...`);
  const fixPrompt = `
Use your auto-fix skill. Here is the original code:

File: ${relPath}
\`\`\`javascript
${code}
\`\`\`

Here are the review findings:
${review}

Generate the COMPLETE fixed JavaScript file.
Start directly with the fix header comment, then the fixed code.
Do not wrap in markdown code blocks.
`;

  const fixed = await callGemini(fixPrompt, systemPrompt);
  const fixedPath = filePath.replace('.js', '.fixed.js');
  if (safeWriteFileSync(fixedPath, fixed)) { // Use safeWriteFileSync
    console.log(`✅ Fixed file saved: ${path.relative(agentRoot, fixedPath)}`);
  } else {
    console.error(`❌ Failed to save fixed file for ${relPath}.`);
  }

  allReviews.push({ file: relPath, grade, score, issueCount, review });
}

const avgScore = reviewedFilesCount > 0 ? Math.round(totalScore / reviewedFilesCount) : 0;
const avgGrade = avgScore >= 90 ? 'A' : avgScore >= 75 ? 'B' : avgScore >= 60 ? 'C' : avgScore >= 40 ? 'D' : 'F';

const report = `# 🤖 Code Review Report
**Date:** ${timestamp}
**Agent:** code-review-agent v0.1.0
**Files Reviewed:** ${reviewedFilesCount}
**Total Issues Found:** ${totalIssues}
**Overall Codebase Grade:** ${avgGrade} (${avgScore}/100)

---

${allReviews.map((r) => `## ${r.file}
**Grade:** ${r.grade} (${r.score}/100) | **Issues:** ${r.issueCount}

${r.review}

---`).join('\n\n')}

*Generated by code-review-agent - a GitAgent standard AI agent*
`;

const reportPath = path.join(agentRoot, 'demo', `REVIEW-${timestamp}.md`);
if (safeWriteFileSync(reportPath, report)) { // Use safeWriteFileSync
  console.log('\n' + '═'.repeat(60));
  console.log('📊 SUMMARY');
  console.log('═'.repeat(60));
  allReviews.forEach((r) => console.log(`  ${r.file.padEnd(30)} Grade: ${r.grade}  Issues: ${r.issueCount}`));
  console.log('─'.repeat(60));
  console.log(`  Overall Codebase Grade: ${avgGrade} (${avgScore}/100)`);
  console.log(`  Total Issues Found:     ${totalIssues}`);
  console.log('═'.repeat(60));
  console.log(`\n📝 Full report: demo/REVIEW-${timestamp}.md`);
  console.log('✅ Review complete.\n');
} else {
  console.error('\n❌ CRITICAL: Failed to write the final review report.');
  console.log('Review process completed with errors. Check console for details.');
}