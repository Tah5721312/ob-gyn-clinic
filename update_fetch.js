const fs = require('fs');
const path = require('path');

/**
 * Script to recursively update all `fetch()` calls to `apiFetch()`
 * and add the necessary import.
 */

const walk = (dir, fileList = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walk(filePath, fileList);
    } else {
      if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
};

const srcDir = path.join(__dirname, 'src');
const files = walk(srcDir);

files.forEach(file => {
  // Skip the api definition file itself to avoid recursion/errors
  if (file.includes('src\\lib\\api.ts') || file.includes('src/lib/api.ts')) return;

  let content = fs.readFileSync(file, 'utf8');
  const originalContent = content;

  // Skip if already has apiFetch to avoid double processing or conflicts
  // But allow checking if fetch is still lingering
  if (!content.includes('fetch(')) return;

  // Replace fetch(url, options) with apiFetch(url, options)
  // Regex looks for 'fetch' word boundary not preceded by dot (to avoid someObject.fetch)
  // We exclude apiFetch itself by checking !content.includes('apiFetch(') ? No, we might have mixed usage.
  // The replace:
  content = content.replace(/(?<!\.)\bfetch\(/g, 'apiFetch(');

  if (content !== originalContent) {
    // Add import if not present
    if (!content.includes('import { apiFetch } from "@/lib/api";') && !content.includes("import { apiFetch } from '@/lib/api';")) {

      // Strategy: Add after "use client"; if present, otherwise at top
      if (content.match(/^"use client";/)) {
        content = content.replace(/^"use client";(\s*)/, '"use client";$1import { apiFetch } from "@/lib/api";\n');
      } else {
        content = 'import { apiFetch } from "@/lib/api";\n' + content;
      }
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated: ${file}`);
  }
});

// ==========================================
// كيفية تشغيل هذا الملف:
// 1. تأكد من وجود Node.js مثبت.
// 2. افتح التيرمينال في مجلد المشروع.
// 3. اكتب الأمر التالي:
//    node update_fetch.js
// ==========================================
