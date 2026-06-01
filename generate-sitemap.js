const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.spicybeautybyt.com';
const EXCLUDED = ['404.html'];

function getHtmlFiles(dir, base = '') {
  let urls = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      urls = urls.concat(getHtmlFiles(path.join(dir, entry.name), base + '/' + entry.name));
    } else if (entry.name.endsWith('.html') && !EXCLUDED.includes(entry.name)) {
      let url = base + '/' + entry.name.replace('.html', '').replace('/index', '');
      if (url === '/index') url = '';
      urls.push(BASE_URL + url);
    }
  }
  return urls;
}

const urls = getHtmlFiles('.');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${url === BASE_URL ? '1.0' : url.includes('/blog/') ? '0.7' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync('sitemap.xml', sitemap);
console.log(`✅ sitemap.xml généré avec ${urls.length} URLs`);
