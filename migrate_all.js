import fs from 'fs';
import path from 'path';

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== 'index.html');

console.log(`Starting migration for ${htmlFiles.length} files...`);

function cleanHtmlToAstro(filename, content) {
  // 1. Extract Title
  const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].replace(/&amp;/g, '&').replace(/"/g, '&quot;').trim() : 'Bristol Hearing Loss Initiative';

  // 2. Extract Description
  const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
  const description = descMatch ? descMatch[1].replace(/&amp;/g, '&').replace(/"/g, '&quot;').trim() : 'Hearing Loss Initiative Bristol - Community & Support Platform';

  // 3. Extract Body Class
  const bodyMatch = content.match(/<body([^>]*)>/i);
  const bodyAttr = bodyMatch ? bodyMatch[1] : '';
  const classMatch = bodyAttr.match(/class=["']([^"']*)["']/i);
  const bodyClass = classMatch ? classMatch[1].trim() : 'premium-white-theme';

  // 4. Extract all <style> blocks
  const styles = [];
  const styleRegex = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
  let sMatch;
  while ((sMatch = styleRegex.exec(content)) !== null) {
    if (sMatch[1].trim()) {
      let styleContent = sMatch[1].trim();
      // fix any relative URLs in styles
      styleContent = styleContent
        .replace(/url\((['"]?)(?:\.\/)?Contents\//g, 'url($1/Contents/')
        .replace(/url\((['"]?)styles\.css\1\)/g, 'url(/styles.css)');
      styles.push(styleContent);
    }
  }

  // 5. Extract body inner HTML
  const bodyStartIdx = content.indexOf('<body');
  const bodyCloseIdx = content.lastIndexOf('</body>');
  
  let bodyContent = '';
  if (bodyStartIdx !== -1 && bodyCloseIdx !== -1) {
    const startOfBodyInner = content.indexOf('>', bodyStartIdx) + 1;
    bodyContent = content.substring(startOfBodyInner, bodyCloseIdx).trim();
  } else {
    bodyContent = content;
  }

  // Remove skip-link if BaseLayout handles it
  bodyContent = bodyContent.replace(/<a\s+href=["']#main-content["']\s+class=["']skip-link["']>[\s\S]*?<\/a>/gi, '');
  
  // Remove script.js reference at end of body
  bodyContent = bodyContent.replace(/<script\s+src=["'](?:\.\/)?script\.js(?:\?[^"']*)?["'](?:\s+defer)?><\/script>/gi, '');

  // Remove any duplicated <style> tags from bodyContent that were extracted
  bodyContent = bodyContent.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');

  // Handle inline window.location references FIRST
  bodyContent = bodyContent
    .replace(/window\.location\.href\s*=\s*(['"])index\.html\1/gi, "window.location.href='/'")
    .replace(/window\.location\.href\s*=\s*(['"])path-([a-zA-Z0-9_-]+)\.html\1/gi, "window.location.href='/path-$2'")
    .replace(/window\.location\.href\s*=\s*(['"])portal\.html\1/gi, "window.location.href='/portal'")
    .replace(/window\.location\.href\s*=\s*(['"])chat\.html\1/gi, "window.location.href='/chat'")
    .replace(/window\.location\.href\s*=\s*(['"])venue-map\.html\1/gi, "window.location.href='/venue-map'");

  // 6. Rewrite HTML Links (using \bhref= to avoid matching window.location.href)
  bodyContent = bodyContent
    // Internal HTML links to Astro routes
    .replace(/\bhref=(["'])(?:\.\/)?index\.html(["'#?])/gi, 'href=$1/$2')
    .replace(/\bhref=(["'])(?:\.\/)?index\.html\1/gi, 'href="/"')
    .replace(/\bhref=(["'])(?:\.\/)?path-([a-zA-Z0-9_-]+)\.html(["'#?])/gi, 'href=$1/path-$2$3')
    .replace(/\bhref=(["'])(?:\.\/)?path-([a-zA-Z0-9_-]+)\.html\1/gi, 'href="/path-$2"')
    .replace(/\bhref=(["'])(?:\.\/)?chat\.html(["'#?])/gi, 'href=$1/chat$2')
    .replace(/\bhref=(["'])(?:\.\/)?chat\.html\1/gi, 'href="/chat"')
    .replace(/\bhref=(["'])(?:\.\/)?portal\.html(["'#?])/gi, 'href=$1/portal$2')
    .replace(/\bhref=(["'])(?:\.\/)?portal\.html\1/gi, 'href="/portal"')
    .replace(/\bhref=(["'])(?:\.\/)?venue-map\.html(["'#?])/gi, 'href=$1/venue-map$2')
    .replace(/\bhref=(["'])(?:\.\/)?venue-map\.html\1/gi, 'href="/venue-map"')
    .replace(/\bhref=(["'])(?:\.\/)?404\.html(["'#?])/gi, 'href=$1/404$2')
    .replace(/\bhref=(["'])(?:\.\/)?404\.html\1/gi, 'href="/404"')
    // Asset URLs
    .replace(/\bsrc=(["'])(?:\.\/)?Contents\//gi, 'src=$1/Contents/')
    .replace(/\bhref=(["'])(?:\.\/)?Contents\//gi, 'href=$1/Contents/')
    .replace(/\bposter=(["'])(?:\.\/)?Contents\//gi, 'poster=$1/Contents/')
    .replace(/\bdata-src=(["'])(?:\.\/)?Contents\//gi, 'data-src=$1/Contents/');

  // Make all <script> tags inside the body use `is:inline`
  bodyContent = bodyContent.replace(/<script\b(?![^>]*\bis:inline\b)([^>]*)>/gi, '<script is:inline$1>');

  // Build the Astro file content
  let astroCode = `---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout
  title="${title}"
  description="${description}"
  bodyClass="${bodyClass}"
>
`;

  if (styles.length > 0) {
    astroCode += `  <style is:global>\n${styles.map(s => '    ' + s.split('\n').join('\n    ')).join('\n\n')}\n  </style>\n\n`;
  }

  astroCode += `  ${bodyContent.split('\n').join('\n  ')}\n`;
  astroCode += `</BaseLayout>\n`;

  return astroCode;
}

// Convert all files
let count = 0;
htmlFiles.forEach(file => {
  const baseName = file.replace(/\.html$/, '');
  const targetPath = path.join('src', 'pages', `${baseName}.astro`);
  const rawHtml = fs.readFileSync(file, 'utf8');
  const astroCode = cleanHtmlToAstro(file, rawHtml);
  fs.writeFileSync(targetPath, astroCode, 'utf8');
  count++;
  console.log(`[${count}/${htmlFiles.length}] Migrated: ${file} -> ${targetPath}`);
});

console.log('Migration batch complete!');
