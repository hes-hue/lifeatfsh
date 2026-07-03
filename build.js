const fs = require('fs');
const path = require('path');
const DATA = require('./src/data.js');

const rootHtmlPath = path.join(__dirname, 'index.html');
const templateHtml = fs.readFileSync(rootHtmlPath, 'utf8');

// Function to generate SEO customized templates
function generateSubpageHtml(key, profile) {
  let subpage = templateHtml;

  // 1. Adjust asset paths to absolute root paths for multi-level routing support
  subpage = subpage.replace('href="src/styles.css?v=1.0.10"', 'href="/src/styles.css?v=1.0.10"');
  subpage = subpage.replace('src="src/data.js?v=1.0.10"', 'src="/src/data.js?v=1.0.10"');
  subpage = subpage.replace('src="src/main.js?v=1.0.10"', 'src="/src/main.js?v=1.0.10"');

  // 2. Insert the current profile bootstrap flag before main.js
  const scriptInsertion = `
  <script>
    window.CURRENT_PROFILE = "${key}";
  </script>
  <script src="/src/main.js?v=1.0.10"></script>`;
  subpage = subpage.replace('<script src="/src/main.js?v=1.0.10"></script>', scriptInsertion);

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
async function run() {
  console.log('🚀 FSH Static Builder starting...');

  // 1. Generate profiles
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

  // 2. Generate Twibbon pages
  console.log('🚀 Starting Twibbon static page compilation...');
  const twibbonMainDir = path.join(__dirname, 'twibbon');
  if (!fs.existsSync(twibbonMainDir)) {
    fs.mkdirSync(twibbonMainDir, { recursive: true });
    console.log('📁 Created folder: /twibbon');
  }

  // Generate main /twibbon/index.html
  let twibbonHtml = templateHtml;
  twibbonHtml = twibbonHtml.replace('href="src/styles.css?v=1.0.10"', 'href="/src/styles.css?v=1.0.10"');
  twibbonHtml = twibbonHtml.replace('src="src/data.js?v=1.0.10"', 'src="/src/data.js?v=1.0.10"');
  twibbonHtml = twibbonHtml.replace('src="src/main.js?v=1.0.10"', 'src="/src/main.js?v=1.0.10"');

  const mainTitle = 'Galeri Twibbon Resmi - FSH UIN SGD';
  const mainDesc = 'Pilih bingkai resmi Fakultas Syariah dan Hukum UIN Sunan Gunung Djati Bandung untuk memasang foto profil Anda secara gratis.';
  twibbonHtml = twibbonHtml.replace(/Life at FSH - Fakultas Syariah & Hukum UIN SGD/g, mainTitle);
  twibbonHtml = twibbonHtml.replace(/Portal Quicklink & Informasi Akademik Fakultas Syariah dan Hukum UIN Sunan Gunung Djati Bandung. Layanan satu pintu bagi mahasiswa, dosen, dan staf./g, mainDesc);

  fs.writeFileSync(path.join(twibbonMainDir, 'index.html'), twibbonHtml, 'utf8');
  console.log('📄 Generated: /twibbon/index.html');

  // Fetch active campaigns from Supabase and pre-generate static pages
  const SUPABASE_URL = "https://sjrztdksdxwrbjgqfkbr.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqcnp0ZGtzZHh3cmJqZ3Fma2JyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5MDE3NjgsImV4cCI6MjA5ODQ3Nzc2OH0.4pmQv_KNvMJ2CPa4V1Poz12SzuBc7iRBxMXfQG-mghY";

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/twibbon_campaigns?status=eq.active&select=*`, {
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (res.ok) {
      const campaigns = await res.json();
      for (const c of campaigns) {
        const campDir = path.join(twibbonMainDir, c.slug);
        if (!fs.existsSync(campDir)) {
          fs.mkdirSync(campDir, { recursive: true });
          console.log(`📁 Created folder: /twibbon/${c.slug}`);
        }

        let campHtml = templateHtml;
        campHtml = campHtml.replace('href="src/styles.css?v=1.0.10"', 'href="/src/styles.css?v=1.0.10"');
        campHtml = campHtml.replace('src="src/data.js?v=1.0.10"', 'src="/src/data.js?v=1.0.10"');
        campHtml = campHtml.replace('src="src/main.js?v=1.0.10"', 'src="/src/main.js?v=1.0.10"');

        const campTitle = `${c.title} - Twibbon FSH UIN SGD`;
        const campDesc = c.description ? `${c.description.substring(0, 150)}...` : 'Pasang bingkai foto profil resmi Anda secara online gratis.';
        campHtml = campHtml.replace(/Life at FSH - Fakultas Syariah & Hukum UIN SGD/g, campTitle);
        campHtml = campHtml.replace(/Portal Quicklink & Informasi Akademik Fakultas Syariah dan Hukum UIN Sunan Gunung Djati Bandung. Layanan satu pintu bagi mahasiswa, dosen, dan staf./g, campDesc);

        fs.writeFileSync(path.join(campDir, 'index.html'), campHtml, 'utf8');
        console.log(`📄 Generated: /twibbon/${c.slug}/index.html`);
      }
    }
  } catch (err) {
    console.error('⚠️ Warning: Failed to pre-render dynamic Twibbon campaign pages:', err.message);
  }

  console.log('✅ FSH Static Builder completed successfully!');
}

run();
