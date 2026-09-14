import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== 'index.html');
console.log(`Found ${files.length} HTML files:`);

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : 'Bristol Hearing Loss Initiative';
  const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
  const desc = descMatch ? descMatch[1].trim() : '';
  const bodyMatch = content.match(/<body([^>]*)>/i);
  const bodyAttr = bodyMatch ? bodyMatch[1] : '';
  const classMatch = bodyAttr.match(/class=["']([^"']*)["']/i);
  const bodyClass = classMatch ? classMatch[1].trim() : 'premium-white-theme';
  
  // Check for inline scripts
  const inlineScripts = [];
  const scriptRegex = /<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = scriptRegex.exec(content)) !== null) {
    if (match[1].trim()) {
      inlineScripts.push(match[1].trim().substring(0, 50).replace(/\n/g, ' '));
    }
  }

  // Check for styles
  const styles = [];
  const styleRegex = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
  while ((match = styleRegex.exec(content)) !== null) {
    styles.push(match[1].length);
  }

  console.log(`${file}:
  Title: ${title}
  Desc: ${desc.substring(0, 40)}...
  BodyClass: ${bodyClass}
  Styles: ${styles.length} blocks (${styles.join(', ')} bytes)
  Inline Scripts: ${inlineScripts.length} (${inlineScripts.join(' | ')})
`);
});
