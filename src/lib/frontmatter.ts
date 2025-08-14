import fs from 'fs';

export interface Frontmatter {
  title?: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
  description?: string;
  keywords?: string[];
}

export function getGitLastModified(filePath: string): string | undefined {
  try {
    const { execSync } = require('child_process');
    const iso = execSync(`git log -1 --pretty=format:%cI -- "${filePath}"`, { stdio: ['ignore','pipe','ignore'] }).toString().trim();
    return iso || undefined;
  } catch {
    return undefined;
  }
}

export function parseFrontmatter(raw: string): { frontmatter: Frontmatter; body: string } {
  let block = '';
  let body = raw;
  if (raw.startsWith('---')) {
    const end = raw.indexOf('\n---', 3);
    if (end !== -1) {
      block = raw.slice(3, end).trim();
      body = raw.slice(end + 4).replace(/^\n+/, '');
    }
  } else {
    // Support comment wrapped frontmatter: /* --- ... --- */
    const m = raw.match(/\/\*\s*---([\s\S]*?)---\s*\*\//);
    if (m) {
      block = m[1].trim();
    }
  }
  if (!block) return { frontmatter: {}, body };
  const fm: Frontmatter = {};
  block.split(/\r?\n/).forEach(line => {
    const m = line.match(/^(\w+):\s*(.*)$/);
    if (!m) return;
    const key = m[1];
    let val: any = m[2].trim();
    if (val.startsWith('[') && val.endsWith(']')) {
  val = val.slice(1,-1).split(',').map((v: string) => v.trim().replace(/^"|"$/g,''));
    } else {
      val = val.replace(/^"|"$/g,'');
    }
    (fm as any)[key] = val;
  });
  if (fm.datePublished && !fm.dateModified) fm.dateModified = fm.datePublished;
  return { frontmatter: fm, body };
}

export function readFileWithFrontmatter(path: string) {
  const raw = fs.readFileSync(path, 'utf8');
  return parseFrontmatter(raw);
}
