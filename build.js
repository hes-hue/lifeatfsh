const fs = require('fs');
const path = require('path');
const DATA = require('./src/data.js');

const rootHtmlPath = path.join(__dirname, 'index.html');
const templateHtml = fs.readFileSync(rootHtmlPath, 'utf8');

// Function to generate SEO customized templates
function generateSubpageHtml(key, profile) {
  let subpage = templateHtml;

  // 1. Adjust asset paths to absolute root paths for multi-level routing support
  subpage = subpage.replace('href="src/styles.css?v=1.0.5"', 'href="/src/styles.css?v=1.0.5"');
  subpage = subpage.replace('src="src/data.js?v=1.0.5"', 'src="/src/data.js?v=1.0.5"');
  subpage = subpage.replace('src="src/main.js?v=1.0.5"', 'src="/src/main.js?v=1.0.5"');

  // 2. Insert the current profile bootstrap flag before main.js
  const scriptInsertion = `
  <script>
    window.CURRENT_PROFILE = "${key}";
  </script>
  <script src="/src/main.js?v=1.0.5"></script>`;
  subpage = subpage.replace('<script src="/src/main.js?v=1.0.5"></script>', scriptInsertion);

  // 3. Customize SEO Title & Meta tags
  const defaultTitle = 'Life at FSH - Fakultas Syariah & Hukum UIN SGD';
  const customTitle = `${profile.title} - FSH UIN SGD`;
  subpage = subpage.replace(new RegExp(defaultTitle, 'g'), customTitle);

  // Customize description
  const defaultDesc = 'Portal Quicklink & Informasi Akademik Fakultas Syariah dan Hukum UIN Sunan Gunung Djati Bandung. Layanan satu pintu bagi mahasiswa, dosen, staf.';
  const customDesc = `${profile.bio.substring(0, 150)}... Portal quicklinks & layanan mandiri.`;
  subpage = subpage.replace(new RegExp(defaultDesc, 'g'), customDesc);

  return subpage;
}

// Main compiler loop
console.log('🚀 FSH Static Builder starting...');

Object.keys(DATA.profiles).forEach(key => {
  // Skip the root 'fsh' folder generation (it is served directly by index.html in the root)
  if (key === 'fsh') return;

  const profile = DATA.profiles[key];
  const dirPath = path.join(__dirname, key);

  // Create directory if it doesn't exist
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created folder: /${key}`);
  }

  const fileContent = generateSubpageHtml(key, profile);
  const filePath = path.join(dirPath, 'index.html');
  
  fs.writeFileSync(filePath, fileContent, 'utf8');
  console.log(`📄 Generated subpage: /${key}/index.html`);
});

console.log('✅ FSH Static Builder completed successfully!');
