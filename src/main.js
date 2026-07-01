// Wait until DOM is ready
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Initialize navigation & view state
  let currentTab = "home"; // 'home', 'prodi', 'directory', 'info'
  let activeProfile = null; // null for Hub, or string key ('hk', 'hes', etc.)
  
  // Elements
  const appViewport = document.getElementById("app-viewport");
  const tabItems = document.querySelectorAll(".nav-tab-item");
  const mainSearch = document.getElementById("main-search");
  const loader = document.getElementById("page-loader");
  const searchToggle = document.getElementById("btn-search-toggle");
  const searchContainer = document.querySelector(".search-container");

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
  
  // Clean Lucide-style SVG icons
  const ICONS = {
    book: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10M6 10h10"/></svg>`,
    briefcase: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>`,
    graduation: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M6 18.8v-4L2 13v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-4Z"/><path d="M21.5 12v6"/></svg>`,
    document: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8M16 13H8M16 17H8"/></svg>`,
    whatsapp: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"/></svg>`,
    instagram: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>`,
    globe: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/></svg>`,
    email: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
    link: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
    scale: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1"/><path d="M18 8h4a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-4"/><circle cx="8" cy="12" r="2"/></svg>`,
    bell: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9Z"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`,
    chevronRight: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`,
    calendar: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
    info: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>`,
    users: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    search: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
    phone: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    copy: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
    plus: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    edit: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`,
    trash: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`,
    lock: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    power: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>`
  };

  // Helper to dynamically match keyword to appropriate SVG icon
  function getIconForLink(title, category) {
    const text = (title + " " + (category || "")).toLowerCase();
    if (text.includes("whatsapp") || text.includes("helpdesk") || text.includes("group") || text.includes("grup")) return ICONS.whatsapp;
    if (text.includes("instagram") || text.includes("ig")) return ICONS.instagram;
    if (text.includes("web") || text.includes("website") || text.includes("online")) return ICONS.globe;
    if (text.includes("email") || text.includes("surat") || text.includes("persuratan")) return ICONS.email;
    if (text.includes("beasiswa") || text.includes("scholarship") || text.includes("ziswa")) return ICONS.graduation;
    if (text.includes("magang") || text.includes("praktikum") || text.includes("laboratorium") || text.includes("lab")) return ICONS.briefcase;
    if (text.includes("dosen") || text.includes("alumni") || text.includes("mahasiswa") || text.includes("maba") || text.includes("hmj")) return ICONS.users;
    if (text.includes("kalender") || text.includes("akademik") || text.includes("jadwal")) return ICONS.calendar;
    if (text.includes("skripsi") || text.includes("tugas akhir") || text.includes("ta-dbl") || text.includes("bimbingan") || text.includes("perbaikan") || text.includes("lembar") || text.includes("template") || text.includes("formulir")) return ICONS.document;
    if (text.includes("hukum") || text.includes("pengadilan") || text.includes("kebijakan") || text.includes("jurnal") || text.includes("kajian")) return ICONS.scale;
    return ICONS.link;
  }

  // Load and merge LocalStorage edits on startup
  function loadAndMergeEdits() {
    const localEditsRaw = localStorage.getItem("fsh_linktree_edits");
    if (!localEditsRaw) return;
    
    try {
      const localEdits = JSON.parse(localEditsRaw);
      
      // Merge profiles
      if (localEdits.profiles) {
        Object.keys(localEdits.profiles).forEach(key => {
          if (DATA.profiles[key]) {
            if (localEdits.profiles[key].links) {
              DATA.profiles[key].links = localEdits.profiles[key].links;
            }
            if (localEdits.profiles[key].title) {
              DATA.profiles[key].title = localEdits.profiles[key].title;
            }
            if (localEdits.profiles[key].bio) {
              DATA.profiles[key].bio = localEdits.profiles[key].bio;
            }
          }
        });
      }
    } catch (e) {
      console.error("Failed to parse LocalStorage linktree edits", e);
    }
  }

  // Save changes to LocalStorage
  function saveEditsToLocal() {
    const localData = { profiles: {} };
    Object.keys(DATA.profiles).forEach(key => {
      localData.profiles[key] = {
        title: DATA.profiles[key].title,
        bio: DATA.profiles[key].bio,
        links: DATA.profiles[key].links
      };
    });
    localStorage.setItem("fsh_linktree_edits", JSON.stringify(localData));
  }

  // Config Supabase credentials
  const SUPABASE_URL = window.SUPABASE_URL || "";
  const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || "";

  async function loadSupabaseData() {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return false;
    }
    try {
      const headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
      };

      // Fetch active profiles
      const resProfiles = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=*`, { headers });
      if (!resProfiles.ok) throw new Error("Profiles load failed");
      const dbProfiles = await resProfiles.json();

      // Fetch links
      const resLinks = await fetch(`${SUPABASE_URL}/rest/v1/links?select=*&order=sort_order.asc`, { headers });
      if (!resLinks.ok) throw new Error("Links load failed");
      const dbLinks = await resLinks.json();

      // Fetch directory tables
      const [resFak, resProdi, resHmj] = await Promise.all([
        fetch(`${SUPABASE_URL}/rest/v1/directory_fakultas?select=*&order=sort_order.asc`, { headers }),
        fetch(`${SUPABASE_URL}/rest/v1/directory_prodi?select=*&order=sort_order.asc`, { headers }),
        fetch(`${SUPABASE_URL}/rest/v1/directory_hmj?select=*&order=sort_order.asc`, { headers })
      ]);

      const dbFak = resFak.ok ? await resFak.json() : null;
      const dbProdi = resProdi.ok ? await resProdi.json() : null;
      const dbHmj = resHmj.ok ? await resHmj.json() : null;

      // Map back to profiles database
      dbProfiles.forEach(p => {
        if (!DATA.profiles[p.key]) {
          DATA.profiles[p.key] = {};
        }
        DATA.profiles[p.key].title = p.title;
        DATA.profiles[p.key].bio = p.bio;
        DATA.profiles[p.key].photo = p.photo;
        DATA.profiles[p.key].bg_color = p.bg_color;
        DATA.profiles[p.key].url_banner = p.url_banner;
        DATA.profiles[p.key].socials = {
          facebook: p.social_facebook || "",
          instagram: p.social_instagram || "",
          web: p.social_web || "",
          email: p.social_email || ""
        };
        DATA.profiles[p.key].links = [];
      });

      dbLinks.forEach(lnk => {
        if (DATA.profiles[lnk.profile_key]) {
          DATA.profiles[lnk.profile_key].links.push({
            title: lnk.title,
            url: lnk.url,
            category: lnk.category,
            description: lnk.description || ""
          });
        }
      });

      if (dbFak) DATA.directory.fakultas = dbFak;
      if (dbProdi) DATA.directory.prodi = dbProdi;
      if (dbHmj) DATA.directory.hmj = dbHmj;

      return true;
    } catch (err) {
      console.warn("Failed to load Supabase, falling back to local static data:", err);
      return false;
    }
  }

  // Initialize data merging or Supabase
  const startTime = Date.now();
  const dbLoaded = await loadSupabaseData();
  if (!dbLoaded) {
    loadAndMergeEdits();
  }

  const elapsed = Date.now() - startTime;
  const remainingLoaderTime = Math.max(0, 500 - elapsed);

  // Hide loader
  setTimeout(() => {
    if (loader) {
      loader.style.opacity = "0";
      setTimeout(() => loader.style.display = "none", 400);
    }
  }, remainingLoaderTime);

  // Check bootstrap configurations for subdirectory cleaning
  if (window.CURRENT_PROFILE && DATA.profiles[window.CURRENT_PROFILE]) {
    activeProfile = window.CURRENT_PROFILE;
    
    // Hide standard tab bar since we are in direct standalone page mode
    const navBar = document.querySelector(".nav-tab-bar");
    if (navBar) navBar.style.display = "none";
    const viewport = document.getElementById("app-viewport");
    if (viewport) viewport.style.paddingBottom = "20px";

    if (activeProfile === "informasi") {
      renderInformasiPage();
    } else if (activeProfile === "wag-prodi") {
      renderWagProdiPage();
    } else {
      renderProfileView(activeProfile);
    }
  } else {
    // Check search URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const pParam = urlParams.get("p") || urlParams.get("page");
    if (pParam && DATA.profiles[pParam]) {
      activeProfile = pParam;
      if (activeProfile === "informasi") {
        renderInformasiPage();
      } else if (activeProfile === "wag-prodi") {
        renderWagProdiPage();
      } else {
        renderProfileView(activeProfile);
      }
    } else {
      switchTab("home");
    }
  }

  // Bottom Nav items click trigger
  tabItems.forEach(item => {
    item.addEventListener("click", () => {
      const tab = item.getAttribute("data-tab");
      activeProfile = null;
      switchTab(tab);
    });
  });

  // Brand Logo Text Click Trigger
  const brandText = document.querySelector(".brand-text");
  if (brandText) {
    brandText.addEventListener("click", () => {
      activeProfile = null;
      switchTab("home");
    });
  }

  // Switch Active Tab
  function switchTab(tabName) {
    currentTab = tabName;
    
    tabItems.forEach(item => {
      if (item.getAttribute("data-tab") === tabName) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    mainSearch.value = "";
    if (searchContainer) {
      searchContainer.classList.remove("show");
    }

    if (tabName === "home") {
      renderHomeHub();
    } else if (tabName === "prodi") {
      renderProdiList();
    } else if (tabName === "directory") {
      renderDirectory("");
    } else if (tabName === "info") {
      renderInfoView();
    }
  }

  // Intercept search typing
  mainSearch.addEventListener("input", (e) => {
    const query = e.target.value.trim().toLowerCase();
    
    if (currentTab !== "directory" && activeProfile === null && query.length > 0) {
      activeProfile = null;
      switchTab("directory");
      mainSearch.value = query;
      renderDirectory(query);
    } else if (activeProfile !== null) {
      filterProfileLinks(query);
    } else {
      renderDirectory(query);
    }
  });

  // Toggle search bar visibility
  if (searchToggle && searchContainer && mainSearch) {
    searchToggle.addEventListener("click", () => {
      searchContainer.classList.toggle("show");
      if (searchContainer.classList.contains("show")) {
        mainSearch.focus();
      } else {
        mainSearch.value = "";
        mainSearch.dispatchEvent(new Event("input"));
      }
    });
  }

  // ==========================================
  // VIEW RENDERERS
  // ==========================================

  // Render FSH Central Home Hub
  function renderHomeHub() {
    activeProfile = null;
    appViewport.innerHTML = `
      <!-- Quick Info Ticker -->
      <div class="info-ticker-section" style="border-top: none;">
        <div class="ticker-card">
          <span class="ticker-tag" style="background-color: var(--halodoc-red);">Maba</span>
          <div class="ticker-text">Selamat Datang Mahasiswa Baru Fakultas Syariah dan Hukum UIN SGD Bandung Tahun 2026!</div>
        </div>
      </div>

      <!-- Halodoc-inspired Circular Service Grid -->
      <div class="services-grid-section">
        <div class="section-title">
          Layanan Akademik & Info
          <span id="see-all-directories">Lihat Direktori</span>
        </div>
        <div class="services-grid">
          <!-- 1. Info Maba (First Position) -->
          <button class="service-item" id="btn-informasi-maba">
            <div class="service-icon-wrapper" style="background-color: rgba(224, 0, 77, 0.08); border-color: rgba(224, 0, 77, 0.2);">
              ${ICONS.book}
            </div>
            <div class="service-label" style="color: var(--halodoc-red); font-weight: 700;">Info Maba</div>
          </button>

          <!-- 2. WAG Maba 2026 -->
          <button class="service-item blue" id="btn-wag-prodi">
            <div class="service-icon-wrapper" style="background-color: rgba(37, 211, 102, 0.08); border-color: rgba(37, 211, 102, 0.2);">
              ${ICONS.whatsapp}
            </div>
            <div class="service-label" style="color: #128C7E; font-weight: 700;">WAG Maba 2026</div>
          </button>

          <button class="service-item" id="btn-layanan-tu">
            <div class="service-icon-wrapper">
              ${ICONS.scale}
            </div>
            <div class="service-label">Layanan TU</div>
          </button>
          
          <button class="service-item blue" id="btn-beasiswa">
            <div class="service-icon-wrapper">
              ${ICONS.graduation}
            </div>
            <div class="service-label">Beasiswa</div>
          </button>

          <button class="service-item teal" id="btn-prodi-hub">
            <div class="service-icon-wrapper">
              ${ICONS.users}
            </div>
            <div class="service-label">Prodi Hub</div>
          </button>

          <button class="service-item" id="btn-lab-praktikum">
            <div class="service-icon-wrapper">
              ${ICONS.briefcase}
            </div>
            <div class="service-label">Laboratorium</div>
          </button>

          <button class="service-item blue" id="btn-akademik">
            <div class="service-icon-wrapper">
              ${ICONS.calendar}
            </div>
            <div class="service-label">Akademik</div>
          </button>

          <button class="service-item teal" id="btn-lembaga">
            <div class="service-icon-wrapper">
              ${ICONS.scale}
            </div>
            <div class="service-label">Lembaga FSH</div>
          </button>
        </div>
      </div>

      <!-- Quicklinks List Section (TU FSH Links) -->
      <div class="prodi-list-section" style="padding-top: 10px;">
        <div class="section-title">Link Utama Fakultas</div>
        <div id="quicklinks-container"></div>
      </div>
    `;

    // Render list of TU links
    const container = document.getElementById("quicklinks-container");
    const tuLinks = DATA.profiles.fsh.links;
    const featuredLinks = tuLinks.filter(lnk => 
      lnk.category === "Beasiswa" || lnk.category === "Informasi & Layanan TU"
    );

    // Sort to place WA MABA FSH 2026 at index 0 (very front of the list)
    featuredLinks.sort((a, b) => {
      const aMaba = a.title.toLowerCase().includes("maba");
      const bMaba = b.title.toLowerCase().includes("maba");
      if (aMaba && !bMaba) return -1;
      if (!aMaba && bMaba) return 1;
      return 0;
    });

    featuredLinks.forEach(lnk => {
      const href = lnk.url.startsWith("/") ? `.${lnk.url}` : lnk.url;
      const target = lnk.url.startsWith("/") ? "" : 'target="_blank"';
      
      container.innerHTML += `
        <a href="${href}" ${target} class="link-row-card">
          <div class="link-row-info">
            <div class="link-row-title">${escapeHtml(lnk.title)}</div>
            <div class="link-row-desc">${escapeHtml(lnk.category)} ${lnk.description ? '• ' + escapeHtml(lnk.description) : ''}</div>
          </div>
          <div class="link-row-icon">
            ${ICONS.chevronRight}
          </div>
        </a>
      `;
    });

    // Home Grid Event Bindings
    document.getElementById("btn-layanan-tu").addEventListener("click", () => {
      renderProfileView("fsh", "Informasi & Layanan TU");
    });
    document.getElementById("btn-beasiswa").addEventListener("click", () => {
      renderProfileView("fsh", "Beasiswa");
    });
    document.getElementById("btn-prodi-hub").addEventListener("click", () => {
      switchTab("prodi");
    });
    document.getElementById("btn-lab-praktikum").addEventListener("click", () => {
      renderProfileView("laboratorium");
    });
    document.getElementById("btn-akademik").addEventListener("click", () => {
      renderProfileView("akademik");
    });
    document.getElementById("btn-lembaga").addEventListener("click", () => {
      renderProfileView("fsh", "Lembaga-lembaga Fakultas");
    });
    document.getElementById("btn-informasi-maba").addEventListener("click", () => {
      renderInformasiPage();
    });
    document.getElementById("btn-wag-prodi").addEventListener("click", () => {
      renderWagProdiPage();
    });
    document.getElementById("see-all-directories").addEventListener("click", () => {
      switchTab("directory");
    });
  }

  // Render list of departments (Prodi Tab)
  function renderProdiList() {
    appViewport.innerHTML = `
      <div class="prodi-list-section">
        <div class="section-title">Program Studi S1 (Unggul)</div>
        <div id="prodi-cards-container"></div>
      </div>
    `;

    const container = document.getElementById("prodi-cards-container");
    const prodis = DATA.directory.prodi;

    prodis.forEach(pr => {
      const key = pr.link.replace("/", "");
      container.innerHTML += `
        <div class="prodi-card" data-key="${key}">
          <div class="prodi-info">
            <div class="prodi-badge-row">
              <span class="badge-accreditation">${pr.status}</span>
            </div>
            <div class="prodi-name">${pr.name}</div>
            <div class="prodi-desc">Klik untuk info layanan mandiri prodi</div>
          </div>
          <div class="prodi-arrow">
            ${ICONS.chevronRight}
          </div>
        </div>
      `;
    });

    // Special items: Laboratorium & Akademik
    container.innerHTML += `
      <div class="section-title" style="margin-top: 20px;">Unit Pelaksana Akademik</div>
      
      <div class="prodi-card" data-key="laboratorium">
        <div class="prodi-info">
          <div class="prodi-name">Laboratorium FSH</div>
          <div class="prodi-desc">Layanan praktikum, magang, dan kelengkapan TA</div>
        </div>
        <div class="prodi-arrow">
          ${ICONS.chevronRight}
        </div>
      </div>

      <div class="prodi-card" data-key="akademik">
        <div class="prodi-info">
          <div class="prodi-name">Layanan Akademik FSH</div>
          <div class="prodi-desc">Administrasi perkuliahan dan kelengkapan akademik</div>
        </div>
        <div class="prodi-arrow">
          ${ICONS.chevronRight}
        </div>
      </div>
    `;

    // Click triggers
    document.querySelectorAll(".prodi-card").forEach(card => {
      card.addEventListener("click", () => {
        const key = card.getAttribute("data-key");
        renderProfileView(key);
      });
    });
  }

  // Render filterable and searchable Directory (Direktori Tab)
  let activeDirCat = "semua";
  function renderDirectory(searchQuery = "") {
    appViewport.innerHTML = `
      <div class="directory-section">
        <div class="directory-category-tabs">
          <button class="directory-cat-btn ${activeDirCat === "semua" ? "active" : ""}" data-cat="semua">Semua</button>
          <button class="directory-cat-btn ${activeDirCat === "fakultas" ? "active" : ""}" data-cat="fakultas">Lembaga</button>
          <button class="directory-cat-btn ${activeDirCat === "prodi" ? "active" : ""}" data-cat="prodi">Prodi</button>
          <button class="directory-cat-btn ${activeDirCat === "hmj" ? "active" : ""}" data-cat="hmj">Himpunan</button>
        </div>

        <div id="directory-items-container"></div>
      </div>
    `;

    // Bind category button filters
    document.querySelectorAll(".directory-cat-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        activeDirCat = btn.getAttribute("data-cat");
        renderDirectory(mainSearch.value.trim());
      });
    });

    const container = document.getElementById("directory-items-container");
    container.innerHTML = "";

    let html = "";
    let matchesCount = 0;
    const query = searchQuery.toLowerCase();

    // 1. Render Fakultas (Lembaga)
    if (activeDirCat === "semua" || activeDirCat === "fakultas") {
      DATA.directory.fakultas.forEach(f => {
        const isMatch = query === "" || 
                        f.name.toLowerCase().includes(query) || 
                        (f.description && f.description.toLowerCase().includes(query)) ||
                        (f.whatsapp_label && f.whatsapp_label.toLowerCase().includes(query));
        if (isMatch) {
          matchesCount++;
          html += `
            <div class="directory-card">
              <div class="directory-header">
                <div style="display: flex; gap: 12px; align-items: center; width: 100%;">
                  ${f.photo ? `<img src="${f.photo}" class="directory-thumb" alt="${f.name}">` : ''}
                  <div style="flex: 1;">
                    <div class="directory-title">${f.name}</div>
                    <div class="directory-meta">Lembaga / Unit Fakultas</div>
                  </div>
                </div>
              </div>
              ${f.description ? `<div class="directory-desc" style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.45; margin-top: 4px;">${escapeHtml(f.description)}</div>` : ''}
              <div class="directory-actions">
                ${f.whatsapp ? `<a href="https://wa.me/${f.whatsapp.replace('+', '')}" target="_blank" class="action-btn wa">${ICONS.whatsapp} WA (${escapeHtml(f.whatsapp_label || 'Helpdesk')})</a>` : ''}
                ${f.instagram ? `<a href="${f.instagram}" target="_blank" class="action-btn ig">${ICONS.instagram} Instagram</a>` : ''}
                ${f.web ? `<a href="${f.web}" target="_blank" class="action-btn web">${ICONS.globe} Detail Lembaga</a>` : ''}
                ${f.group_wa ? `<a href="${f.group_wa}" target="_blank" class="action-btn group">${ICONS.users} Grup WA</a>` : ''}
              </div>
            </div>
          `;
        }
      });
    }

    // 2. Render Prodi
    if (activeDirCat === "semua" || activeDirCat === "prodi") {
      DATA.directory.prodi.forEach(p => {
        if (query === "" || p.name.toLowerCase().includes(query)) {
          matchesCount++;
          const prodiKey = p.link.replace("/", "");
          html += `
            <div class="directory-card">
              <div class="directory-header">
                <div>
                  <div class="directory-title">${p.name}</div>
                  <div class="directory-meta">Program Studi • Akreditasi: <strong>${p.status}</strong></div>
                </div>
              </div>
              <div class="directory-actions">
                <a href="#" class="action-btn web btn-go-prodi" data-key="${prodiKey}">${ICONS.link} Layanan Linktree</a>
                ${p.instagram ? `<a href="${p.instagram}" target="_blank" class="action-btn ig">${ICONS.instagram} Instagram</a>` : ''}
                ${p.web ? `<a href="${p.web}" target="_blank" class="action-btn web">${ICONS.globe} Web</a>` : ''}
              </div>
            </div>
          `;
        }
      });
    }

    // 3. Render HMJ
    if (activeDirCat === "semua" || activeDirCat === "hmj") {
      DATA.directory.hmj.forEach(h => {
        if (query === "" || h.name.toLowerCase().includes(query) || h.contact_person.toLowerCase().includes(query)) {
          matchesCount++;
          html += `
            <div class="directory-card">
              <div class="directory-header">
                <div>
                  <div class="directory-title">${h.name}</div>
                  <div class="directory-meta">Himpunan Mahasiswa • CP: ${h.contact_person}</div>
                </div>
              </div>
              <div class="directory-actions">
                ${h.whatsapp ? `<a href="https://wa.me/${h.whatsapp.replace('+', '').replace(' ', '')}" target="_blank" class="action-btn wa">${ICONS.whatsapp} WA (${h.contact_person})</a>` : ''}
                ${h.instagram ? `<a href="${h.instagram}" target="_blank" class="action-btn ig">${ICONS.instagram} Instagram</a>` : ''}
                ${h.group_link ? `<a href="${h.group_link}" target="_blank" class="action-btn group">${ICONS.users} Grup/Form</a>` : ''}
              </div>
            </div>
          `;
        }
      });
    }

    if (matchesCount === 0) {
      container.innerHTML = `
        <div class="empty-state">
          ${ICONS.search}
          <div>Tidak ada hasil untuk "${searchQuery}"</div>
          <div style="font-size: 0.75rem; margin-top: 6px;">Coba gunakan kata kunci yang berbeda</div>
        </div>
      `;
    } else {
      container.innerHTML = html;
      document.querySelectorAll(".btn-go-prodi").forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          const key = btn.getAttribute("data-key");
          renderProfileView(key);
        });
      });
    }
  }

  // Render Info Tab
  function renderInfoView() {
    appViewport.innerHTML = `
      <div class="info-section">
        <div class="info-banner-card">
          <h3>Portal LifeatFSH UIN SGD</h3>
          <p>Aplikasi pelayanan satu pintu (one stop service) Fakultas Syariah dan Hukum UIN Sunan Gunung Djati Bandung. Menghubungkan civitas akademika dengan prodi, laboratorium, dan informasi penting lainnya.</p>
        </div>

        <div class="section-title">Akses & Manajemen</div>

        <div class="info-row-item" style="border-color: rgba(224, 0, 77, 0.15); cursor: pointer;" id="btn-goto-login">
          <div class="info-row-icon">
            ${ICONS.lock}
          </div>
          <div class="info-row-content">
            <h4>Login Operator / Himpunan</h4>
            <p>Kelola linktree prodi dan database himpunan</p>
          </div>
          <div class="info-row-link">
            ${ICONS.chevronRight}
          </div>
        </div>

        <div class="section-title">Dokumen & Layanan Utama</div>

        <div class="info-row-item">
          <div class="info-row-icon">
            ${ICONS.calendar}
          </div>
          <div class="info-row-content">
            <h4>Kalender Akademik 2024-2025</h4>
            <p>File Panduan Jadwal Semester Ganjil & Genap</p>
          </div>
          <a href="https://drive.google.com/file/d/1-YStscTMxX-zbPMgPORlMtnQqDwhjcOD/view?usp=drive_link" target="_blank" class="info-row-link">
            ${ICONS.chevronRight}
          </a>
        </div>

        <div class="info-row-item">
          <div class="info-row-icon">
            ${ICONS.document}
          </div>
          <div class="info-row-content">
            <h4>Layanan Surat Mahasiswa</h4>
            <p>Pengajuan Persuratan Online Mandiri</p>
          </div>
          <a href="https://tufsh.uinsgd.ac.id/layanan/" target="_blank" class="info-row-link">
            ${ICONS.chevronRight}
          </a>
        </div>

        <div class="info-row-item">
          <div class="info-row-icon">
            ${ICONS.scale}
          </div>
          <div class="info-row-content">
            <h4>JDIH FSH UIN SGD</h4>
            <p>Jaringan Dokumentasi dan Informasi Hukum</p>
          </div>
          <a href="https://lifeatfsh.uinsgd.ac.id/JDIH" target="_blank" class="info-row-link">
            ${ICONS.chevronRight}
          </a>
        </div>

        <div class="info-row-item">
          <div class="info-row-icon">
            ${ICONS.phone}
          </div>
          <div class="info-row-content">
            <h4>Helpdesk Tata Usaha</h4>
            <p>Layanan Informasi WhatsApp (+628953000900)</p>
          </div>
          <a href="https://wa.me/628953000900" target="_blank" class="info-row-link">
            ${ICONS.chevronRight}
          </a>
        </div>
      </div>
    `;

    document.getElementById("btn-goto-login").addEventListener("click", () => {
      // Check if session exists
      const user = sessionStorage.getItem("fsh_user");
      if (user) {
        renderAdminDashboard(user);
      } else {
        renderLoginPage();
      }
    });
  }

  // ==========================================
  // DEDICATED /INFORMASI PAGE RENDERER
  // ==========================================
  function renderInformasiPage() {
    activeProfile = "informasi";
    const profile = DATA.profiles.informasi;

    appViewport.innerHTML = `
      <div class="prodi-profile-header" style="border-bottom: 1px solid var(--border-light); padding: 16px 20px;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
          ${!window.CURRENT_PROFILE ? `
            <button class="back-hub-floating" id="profile-back-btn" style="position: static; flex-shrink: 0; width: 36px; height: 36px; border-radius: 50%; background-color: var(--bg-slate); display: flex; align-items: center; justify-content: center; border: none; cursor: pointer;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            </button>
          ` : `
            <a href="../" class="back-hub-floating" title="Kembali ke Portal Fakultas" style="position: static; flex-shrink: 0; width: 36px; height: 36px; border-radius: 50%; background-color: var(--bg-slate); display: flex; align-items: center; justify-content: center; border: none; text-decoration: none;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </a>
          `}
          <div class="profile-title-wrapper" style="flex: 1;">
            <div style="font-size: 0.72rem; color: var(--halodoc-red); font-weight: 700; margin-bottom: 2px;">Fakultas Syariah & Hukum UIN SGD</div>
            <h1 class="profile-title" style="font-size: 1.15rem; font-weight: 700; color: var(--text-dark); line-height: 1.2;">${escapeHtml(profile.title)}</h1>
          </div>
        </div>
        <div class="profile-bio" style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.45;">${escapeHtml(profile.bio)}</div>
      </div>

      <div class="informasi-section">
        
        <!-- TABLE 1: LEMBAGA / FAKULTAS -->
        <div class="table-container-card">
          <div class="table-title">Lembaga & Tata Usaha Fakultas</div>
          <table class="table-info">
            <thead>
              <tr>
                <th>Lembaga</th>
                <th style="width: 80px;">WA Helpdesk</th>
                <th style="width: 80px;">Media</th>
              </tr>
            </thead>
            <tbody>
              ${DATA.directory.fakultas.map(f => `
                <tr>
                  <td><strong>${escapeHtml(f.name)}</strong></td>
                  <td>
                    ${f.whatsapp ? `
                      <div class="table-action-row">
                        <a href="https://wa.me/${f.whatsapp.replace('+', '')}" target="_blank" class="table-btn wa" title="Hubungi WA">${ICONS.whatsapp}</a>
                        <button class="table-btn copy btn-copy-tel" data-tel="${escapeHtml(f.whatsapp)}" title="Salin Nomor">${ICONS.copy}</button>
                      </div>
                    ` : '-'}
                  </td>
                  <td>
                    <div class="table-action-row">
                      ${f.instagram ? `<a href="${f.instagram}" target="_blank" class="table-btn ig" title="Instagram">${ICONS.instagram}</a>` : ''}
                      ${f.web ? `<a href="${f.web}" target="_blank" class="table-btn web" title="Website">${ICONS.globe}</a>` : ''}
                      ${f.group_wa ? `<a href="${f.group_wa}" target="_blank" class="table-btn wa" title="Grup WA Angkatan" style="background-color: var(--halodoc-blue-light); color: var(--halodoc-blue);">${ICONS.users}</a>` : ''}
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- TABLE 2: PROGRAM STUDI -->
        <div class="table-container-card">
          <div class="table-title">Program Studi S1 (Unggul)</div>
          <table class="table-info">
            <thead>
              <tr>
                <th>Program Studi</th>
                <th style="width: 70px; text-align: center;">Linktree</th>
                <th style="width: 80px; text-align: center;">Media Resmi</th>
              </tr>
            </thead>
            <tbody>
              ${DATA.directory.prodi.map(p => {
                const key = p.link.replace("/", "");
                const relativeLink = window.CURRENT_PROFILE ? `../${key}/` : `?p=${key}`;
                return `
                  <tr>
                    <td><strong>${escapeHtml(p.name)}</strong> <span class="badge-accreditation-sm">${escapeHtml(p.status)}</span></td>
                    <td style="text-align: center;">
                      <a href="${relativeLink}" class="table-btn web btn-prodi-direct" data-key="${key}" style="margin: 0 auto;">${ICONS.link}</a>
                    </td>
                    <td>
                      <div class="table-action-row" style="justify-content: center;">
                        ${p.instagram ? `<a href="${p.instagram}" target="_blank" class="table-btn ig" title="Instagram">${ICONS.instagram}</a>` : ''}
                        ${p.web ? `<a href="${p.web}" target="_blank" class="table-btn web" title="Website">${ICONS.globe}</a>` : ''}
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

        <!-- TABLE 3: HIMPUNAN MAHASISWA (HMJ) -->
        <div class="table-container-card">
          <div class="table-title">Organisasi Kemahasiswaan (HMJ)</div>
          <table class="table-info">
            <thead>
              <tr>
                <th>HMJ</th>
                <th>Contact Person</th>
                <th style="width: 100px;">Aksi</th>
              </tr>
            </thead>
            <tbody>
              ${DATA.directory.hmj.map(h => `
                <tr>
                  <td><strong>${escapeHtml(h.name)}</strong></td>
                  <td>${escapeHtml(h.contact_person)}</td>
                  <td>
                    <div class="table-action-row">
                      ${h.whatsapp ? `<a href="https://wa.me/${h.whatsapp.replace('+', '').replace(' ', '')}" target="_blank" class="table-btn wa" title="Hubungi WA">${ICONS.whatsapp}</a>` : ''}
                      ${h.instagram ? `<a href="${h.instagram}" target="_blank" class="table-btn ig" title="Instagram">${ICONS.instagram}</a>` : ''}
                      ${h.group_link ? `<a href="${h.group_link}" target="_blank" class="table-btn web" title="Formulir/Group Angkatan" style="background-color: var(--halodoc-blue-light); color: var(--halodoc-blue);">${ICONS.users}</a>` : ''}
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

      </div>
    `;

    // Bind clipboard copy buttons
    document.querySelectorAll(".btn-copy-tel").forEach(btn => {
      btn.addEventListener("click", () => {
        const tel = btn.getAttribute("data-tel");
        navigator.clipboard.writeText(tel).then(() => {
          const originalHTML = btn.innerHTML;
          btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
          btn.style.color = "var(--success-green)";
          setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.color = "";
          }, 1500);
        });
      });
    });

    // Bind direct prodi linktree buttons
    document.querySelectorAll(".btn-prodi-direct").forEach(btn => {
      if (!window.CURRENT_PROFILE) {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          const key = btn.getAttribute("data-key");
          renderProfileView(key);
        });
      }
    });

    // Bind back button
    if (!window.CURRENT_PROFILE) {
      document.getElementById("profile-back-btn").addEventListener("click", () => {
        activeProfile = null;
        switchTab("home");
      });
    }
  }

  // ==========================================
  // DEDICATED /WAG-PRODI PAGE RENDERER
  // ==========================================
  function renderWagProdiPage() {
    activeProfile = "wag-prodi";
    const profile = DATA.profiles["wag-prodi"];

    let cardsHtml = "";
    
    DATA.directory.hmj.forEach(hmjItem => {
      const prodiKey = hmjItem.name.toLowerCase().replace("hmj - ", "");
      const prodiItem = DATA.directory.prodi.find(p => p.name.toLowerCase().includes(prodiKey)) || {};
      
      const cleanWa = hmjItem.whatsapp ? hmjItem.whatsapp.replace(/[^0-9]/g, "") : "";
      const waLink = cleanWa ? `https://wa.me/${cleanWa}` : "";

      cardsHtml += `
        <div class="table-container-card" style="margin-bottom: 16px; padding: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
            <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-dark); margin: 0;">
              ${escapeHtml(hmjItem.name.replace("HMJ - ", "HMJ "))}
            </h4>
            ${prodiItem.status ? `
              <span class="profile-accreditation-badge" style="background-color: var(--success-green); font-size: 0.6rem; padding: 2px 6px; margin: 0;">
                ${escapeHtml(prodiItem.status)}
              </span>
            ` : ""}
          </div>
          
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 14px; line-height: 1.4;">
            <div style="margin-bottom: 4px;">
              <strong>Ketua / CP HMJ:</strong> ${escapeHtml(hmjItem.contact_person || "-")} 
              ${hmjItem.whatsapp ? `(${escapeHtml(hmjItem.whatsapp)})` : ""}
            </div>
            ${hmjItem.instagram ? `
              <div>
                <strong>Instagram HMJ:</strong> <a href="${hmjItem.instagram}" target="_blank" style="color: var(--halodoc-red); text-decoration: none;">@${escapeHtml(hmjItem.instagram.split('/').filter(Boolean).pop())}</a>
              </div>
            ` : ""}
          </div>

          <div style="display: flex; gap: 8px;">
            ${waLink ? `
              <a href="${waLink}" target="_blank" class="action-btn" style="flex: 1; background-color: var(--bg-slate); color: var(--text-dark); border: 1px solid var(--border-light); font-weight: 600;">
                ${ICONS.phone} Hubungi CP
              </a>
            ` : ""}
            ${hmjItem.group_link ? `
              <a href="${hmjItem.group_link}" target="_blank" class="action-btn" style="flex: 1.5; background-color: #25D366; color: white; border: none; font-weight: 700;">
                ${ICONS.whatsapp} Gabung WAG
              </a>
            ` : ""}
          </div>
        </div>
      `;
    });

    appViewport.innerHTML = `
      <div class="prodi-profile-header" style="border-bottom: 1px solid var(--border-light); padding: 16px 20px;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
          ${!window.CURRENT_PROFILE ? `
            <button class="back-hub-floating" id="profile-back-btn" style="position: static; flex-shrink: 0; width: 36px; height: 36px; border-radius: 50%; background-color: var(--bg-slate); display: flex; align-items: center; justify-content: center; border: none; cursor: pointer;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            </button>
          ` : `
            <a href="../" class="back-hub-floating" title="Kembali ke Portal Fakultas" style="position: static; flex-shrink: 0; width: 36px; height: 36px; border-radius: 50%; background-color: var(--bg-slate); display: flex; align-items: center; justify-content: center; border: none; text-decoration: none;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </a>
          `}
          <div class="profile-title-wrapper" style="flex: 1;">
            <div style="font-size: 0.72rem; color: var(--halodoc-red); font-weight: 700; margin-bottom: 2px;">Fakultas Syariah & Hukum UIN SGD</div>
            <h1 class="profile-title" style="font-size: 1.15rem; font-weight: 700; color: var(--text-dark); line-height: 1.2;">Grup WhatsApp Prodi 2026</h1>
          </div>
        </div>
        <div class="profile-bio" style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.45;">
          Silakan bergabung dengan Grup WhatsApp atau Forum resmi Program Studi Anda di bawah ini untuk berkoordinasi langsung dengan pengurus Himpunan Mahasiswa (HMJ).
        </div>
      </div>

      <div class="informasi-section" style="padding: 16px 20px;">
        <!-- WAG Maba Fakultas 2026 Card -->
        <div class="table-container-card" style="margin-bottom: 20px; padding: 16px; border: 1.5px dashed #25D366; background-color: rgba(37, 211, 102, 0.03); border-radius: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <h4 style="font-size: 0.95rem; font-weight: 700; color: #128C7E; margin: 0; display: flex; align-items: center; gap: 6px;">
              Grup WhatsApp Maba Fakultas 2026
            </h4>
            <span class="profile-accreditation-badge" style="background-color: var(--halodoc-red); font-size: 0.6rem; padding: 2px 6px; margin: 0;">
              Utama
            </span>
          </div>
          <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.45; margin-bottom: 12px; font-weight: 350;">
            Grup WhatsApp koordinasi resmi untuk seluruh mahasiswa baru Fakultas Syariah dan Hukum UIN SGD angkatan 2026.
          </p>
          <a href="https://forms.gle/3k9vuo9TREZSH54u6" target="_blank" class="action-btn" style="background-color: #25D366; color: white; border: none; font-weight: 700; width: 100%;">
            ${ICONS.whatsapp} Gabung WAG Fakultas 2026
          </a>
        </div>

        ${cardsHtml}
      </div>
    `;

    // Bind back button
    if (!window.CURRENT_PROFILE) {
      document.getElementById("profile-back-btn").addEventListener("click", () => {
        activeProfile = null;
        switchTab("home");
      });
    }
  }

  // ==========================================
  // INDIVIDUAL DEPARTMENT PROFILE LINKTREE
  // ==========================================
  function renderProfileView(prodiKey, forceOpenCategory = null) {
    activeProfile = prodiKey;
    const profile = DATA.profiles[prodiKey];
    if (!profile) return;

    const prodiDirInfo = DATA.directory.prodi.find(p => p.link.includes(prodiKey));
    const showAccreditation = prodiDirInfo ? prodiDirInfo.status : null;

    // Overlap-free prodi header configuration
    appViewport.innerHTML = `
      <div class="prodi-profile-header" style="border-bottom: 1px solid var(--border-light); padding: 16px 20px;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
          ${!window.CURRENT_PROFILE ? `
            <button class="back-hub-floating" id="profile-back-btn" style="position: static; flex-shrink: 0; width: 36px; height: 36px; border-radius: 50%; background-color: var(--bg-slate); display: flex; align-items: center; justify-content: center; border: none; cursor: pointer;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            </button>
          ` : `
            <a href="../" class="back-hub-floating" title="Kembali ke Portal Fakultas" style="position: static; flex-shrink: 0; width: 36px; height: 36px; border-radius: 50%; background-color: var(--bg-slate); display: flex; align-items: center; justify-content: center; border: none; text-decoration: none;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </a>
          `}
          <div class="profile-title-wrapper" style="flex: 1;">
            ${showAccreditation ? `<span class="profile-accreditation-badge" style="margin-bottom: 2px;">${escapeHtml(showAccreditation)}</span>` : ""}
            <h1 class="profile-title" style="font-size: 1.15rem; font-weight: 700; color: var(--text-dark); line-height: 1.2;">${escapeHtml(profile.title)}</h1>
          </div>
        </div>
        <div class="profile-bio" style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.45;">${escapeHtml(profile.bio)}</div>
      </div>

      <!-- Accordion Groups -->
      <div class="link-groups-container" id="profile-links-container"></div>

      <!-- Social Links Bar -->
      <div class="profile-socials-bar">
        ${profile.socials.web ? `<a href="${profile.socials.web}" target="_blank" class="social-circle" title="Website">${ICONS.globe}</a>` : ""}
        ${profile.socials.instagram ? `<a href="${profile.socials.instagram}" target="_blank" class="social-circle" title="Instagram">${ICONS.instagram}</a>` : ""}
        ${profile.socials.facebook ? `<a href="${profile.socials.facebook}" target="_blank" class="social-circle" title="Facebook">${ICONS.globe}</a>` : ""}
        ${profile.socials.email ? `<a href="mailto:${profile.socials.email}" class="social-circle" title="Email">${ICONS.email}</a>` : ""}
      </div>
    `;

    // Group links by category
    const groupedLinks = {};
    profile.links.forEach(lnk => {
      const cat = lnk.category || "Umum";
      if (!groupedLinks[cat]) {
        groupedLinks[cat] = [];
      }
      groupedLinks[cat].push(lnk);
    });

    const linksContainer = document.getElementById("profile-links-container");

    Object.keys(groupedLinks).forEach(cat => {
      const isOpen = forceOpenCategory === cat || Object.keys(groupedLinks).length === 1;
      
      let itemsHtml = "";
      groupedLinks[cat].forEach(lnk => {
        const isRelative = lnk.url.startsWith("/");
        const href = isRelative ? `.${lnk.url}` : (lnk.url.startsWith("http") ? lnk.url : `https://${lnk.url}`);
        const target = isRelative ? "" : 'target="_blank"';
        const dynamicIcon = getIconForLink(lnk.title, lnk.category);

        itemsHtml += `
          <a href="${href}" ${target} class="link-row-card" data-title="${lnk.title.toLowerCase()}">
            <div class="link-row-info">
              <div class="link-row-title">${escapeHtml(lnk.title)}</div>
              ${lnk.description ? `<div class="link-row-desc">${escapeHtml(lnk.description)}</div>` : ""}
            </div>
            <div class="link-row-icon">
              ${dynamicIcon}
            </div>
          </a>
        `;
      });

      linksContainer.innerHTML += `
        <div class="accordion-group ${isOpen ? 'open' : ''}" data-category="${cat.toLowerCase()}">
          <div class="accordion-header">
            ${escapeHtml(cat)}
            ${ICONS.chevronRight}
          </div>
          <div class="accordion-content">
            ${itemsHtml}
          </div>
        </div>
      `;
    });

    // Accordion click handlers
    document.querySelectorAll(".accordion-header").forEach(header => {
      header.addEventListener("click", () => {
        const group = header.parentElement;
        group.classList.toggle("open");
      });
    });

    // Back Button binding
    if (!window.CURRENT_PROFILE) {
      document.getElementById("profile-back-btn").addEventListener("click", () => {
        activeProfile = null;
        switchTab(currentTab);
      });
    }
  }

  // Filter links inside folders
  function filterProfileLinks(query) {
    const groups = document.querySelectorAll(".accordion-group");
    groups.forEach(group => {
      let visibleCount = 0;
      const cards = group.querySelectorAll(".link-row-card");
      
      cards.forEach(card => {
        const title = card.getAttribute("data-title");
        if (title.includes(query)) {
          card.style.display = "flex";
          visibleCount++;
        } else {
          card.style.display = "none";
        }
      });

      if (visibleCount > 0 && query.length > 0) {
        group.classList.add("open");
        group.style.display = "block";
      } else if (query.length > 0 && visibleCount === 0) {
        group.classList.remove("open");
        group.style.display = "none";
      } else {
        group.style.display = "block";
      }
    });
  }

  // ==========================================
  // ADMIN SYSTEM: MOCK LOGIN PANEL & CRUD
  // ==========================================
  function renderLoginPage() {
    activeProfile = "login";
    appViewport.innerHTML = `
      <div class="login-section">
        <button class="back-hub-floating" id="login-back-btn" style="position: static; margin-bottom: 8px;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        
        <div class="login-card">
          <div class="login-logo-row">
            <div class="login-title">Dashboard Operator FSH</div>
            <div class="login-subtitle">Masukkan credentials operator prodi atau himpunan</div>
          </div>
          
          <div class="form-group">
            <label for="admin-username">Username</label>
            <input type="text" id="admin-username" class="form-control" placeholder="Contoh: admin.tufsh / hmj.hk">
          </div>

          <div class="form-group">
            <label for="admin-password">Password</label>
            <input type="password" id="admin-password" class="form-control" placeholder="••••••••">
          </div>

          <div class="login-error-msg" id="login-error">Username atau password salah!</div>

          <button class="btn-primary" id="btn-login-submit">
            ${ICONS.lock} Masuk Ke Dashboard
          </button>
        </div>


      </div>
    `;

    document.getElementById("login-back-btn").addEventListener("click", () => {
      activeProfile = null;
      switchTab("info");
    });

    document.getElementById("btn-login-submit").addEventListener("click", handleLoginSubmit);
  }

  function handleLoginSubmit() {
    const userField = document.getElementById("admin-username").value.trim();
    const passField = document.getElementById("admin-password").value.trim();
    const errorEl = document.getElementById("login-error");

    let validatedUser = null;

    // Check credentials logic
    if (userField === "admin.tufsh" && passField === "admin123") {
      validatedUser = "admin.tufsh";
    } else if (userField.startsWith("hmj.") && passField === "hmj123") {
      // Find prodi key
      const key = userField.replace("hmj.", "");
      if (DATA.profiles[key] || key === "fsh") {
        validatedUser = userField;
      }
    }

    if (validatedUser) {
      sessionStorage.setItem("fsh_user", validatedUser);
      renderAdminDashboard(validatedUser);
    } else {
      errorEl.style.display = "block";
    }
  }

  // Render CRUD dashboard for the operator
  function renderAdminDashboard(username) {
    activeProfile = "admin";
    
    // Determine editing scopes
    let isFakultasAdmin = (username === "admin.tufsh");
    let currentSelectedProfile = isFakultasAdmin ? "fsh" : username.replace("hmj.", "");
    
    appViewport.innerHTML = `
      <div class="admin-section">
        <div class="admin-header-card">
          <div class="admin-user-info">
            <h3>Halo, ${username}!</h3>
            <p>Role: ${isFakultasAdmin ? 'Administrator Fakultas' : 'Operator Himpunan (' + currentSelectedProfile.toUpperCase() + ')'}</p>
          </div>
          <button class="btn-sm-logout" id="btn-admin-logout">${ICONS.power} Logout</button>
        </div>

        <div class="crud-container">
          <!-- Selection Dropdown (Only for general admin) -->
          ${isFakultasAdmin ? `
            <div class="form-group">
              <label for="admin-select-profile">Pilih Halaman yang Dikelola</label>
              <select id="admin-select-profile" class="form-control" style="background-color: var(--bg-white);">
                <option value="fsh">Layanan Tata Usaha (Fakultas)</option>
                <option value="hk">Prodi Hukum Keluarga (TAHURA)</option>
                <option value="hes">Prodi Hukum Ekonomi Syariah</option>
                <option value="pm">Prodi Perbandingan Madzhab</option>
                <option value="hpi">Prodi Hukum Pidana Islam</option>
                <option value="htn">Prodi Hukum Tata Negara</option>
                <option value="ih">Prodi Ilmu Hukum</option>
                <option value="laboratorium">Laboratorium Fakultas</option>
                <option value="akademik">Unit Layanan Akademik</option>
              </select>
            </div>
          ` : ''}

          <!-- Live link editor form container -->
          <div id="crud-editor-form-wrapper" style="display: none;"></div>

          <!-- Links Listing Table Card -->
          <div class="crud-list-card">
            <div class="crud-list-header">
              <h4>Daftar Tautan Aktif</h4>
              <button class="btn-add-item" id="btn-trigger-add">+ Tambah Baru</button>
            </div>
            <div id="crud-links-list-container"></div>
          </div>
        </div>
      </div>
    `;

    // Logout trigger
    document.getElementById("btn-admin-logout").addEventListener("click", () => {
      sessionStorage.removeItem("fsh_user");
      activeProfile = null;
      switchTab("info");
    });

    // Dropdown change listener (only for admin)
    if (isFakultasAdmin) {
      const selectEl = document.getElementById("admin-select-profile");
      selectEl.addEventListener("change", (e) => {
        currentSelectedProfile = e.target.value;
        renderAdminLinksList(currentSelectedProfile);
        hideEditorForm();
      });
    }

    // Trigger adding new link
    document.getElementById("btn-trigger-add").addEventListener("click", () => {
      renderLinkEditorForm(currentSelectedProfile);
    });

    // Render lists immediately
    renderAdminLinksList(currentSelectedProfile);
  }

  function hideEditorForm() {
    const wrapper = document.getElementById("crud-editor-form-wrapper");
    wrapper.innerHTML = "";
    wrapper.style.display = "none";
  }

  // Render link editor form (for Add/Edit operations)
  function renderLinkEditorForm(profileKey, linkIndexToEdit = null) {
    const wrapper = document.getElementById("crud-editor-form-wrapper");
    wrapper.style.display = "block";

    let isEditing = (linkIndexToEdit !== null);
    let titleVal = "";
    let urlVal = "";
    let catVal = "";
    let descVal = "";

    if (isEditing) {
      const linkItem = DATA.profiles[profileKey].links[linkIndexToEdit];
      titleVal = linkItem.title;
      urlVal = linkItem.url;
      catVal = linkItem.category;
      descVal = linkItem.description || "";
    }

    // Auto load categories in this profile for selection auto-suggestions
    const existingCategories = [...new Set(DATA.profiles[profileKey].links.map(l => l.category))];

    wrapper.innerHTML = `
      <div class="crud-form-card">
        <div class="crud-form-title">${isEditing ? 'Edit Tautan' : 'Tambah Tautan Baru'}</div>
        
        <div class="form-group">
          <label for="form-link-title">Judul Tautan *</label>
          <input type="text" id="form-link-title" class="form-control" value="${titleVal}" placeholder="Contoh: Formulir Pengajuan KRS">
        </div>

        <div class="form-group">
          <label for="form-link-url">URL / Tautan *</label>
          <input type="text" id="form-link-url" class="form-control" value="${urlVal}" placeholder="Contoh: https://google.form/xyz">
        </div>

        <div class="form-group">
          <label for="form-link-category">Kategori Folder *</label>
          <input type="text" id="form-link-category" class="form-control" value="${catVal}" placeholder="Contoh: Layanan Akademik" list="category-suggestions">
          <datalist id="category-suggestions">
            ${existingCategories.map(c => `<option value="${c}">`).join('')}
          </datalist>
        </div>

        <div class="form-group">
          <label for="form-link-desc">Deskripsi (Opsional)</label>
          <input type="text" id="form-link-desc" class="form-control" value="${descVal}" placeholder="Dikelola oleh Staff Jurusan">
        </div>

        <div class="crud-form-actions">
          <button class="btn-cancel" id="btn-form-cancel">Batal</button>
          <button class="btn-primary btn-save" id="btn-form-save">Simpan Tautan</button>
        </div>
      </div>
    `;

    document.getElementById("btn-form-cancel").addEventListener("click", hideEditorForm);
    document.getElementById("btn-form-save").addEventListener("click", () => {
      handleSaveLink(profileKey, linkIndexToEdit);
    });
  }

  function handleSaveLink(profileKey, linkIndexToEdit = null) {
    const title = document.getElementById("form-link-title").value.trim();
    const url = document.getElementById("form-link-url").value.trim();
    const category = document.getElementById("form-link-category").value.trim();
    const description = document.getElementById("form-link-desc").value.trim();

    if (!title || !url || !category) {
      alert("Harap isi semua kolom wajib (*)!");
      return;
    }

    const newLinkItem = { title, url, category, description };

    if (linkIndexToEdit !== null) {
      // Edit
      DATA.profiles[profileKey].links[linkIndexToEdit] = newLinkItem;
    } else {
      // Add
      DATA.profiles[profileKey].links.push(newLinkItem);
    }

    // Save and sync
    saveEditsToLocal();
    hideEditorForm();
    renderAdminLinksList(profileKey);
  }

  // Render list of active links in the admin view
  function renderAdminLinksList(profileKey) {
    const container = document.getElementById("crud-links-list-container");
    container.innerHTML = "";

    const links = DATA.profiles[profileKey].links;
    if (links.length === 0) {
      container.innerHTML = `<div style="text-align:center; padding: 20px; font-size: 0.8rem; color: var(--text-muted);">Halaman ini belum memiliki tautan aktif.</div>`;
      return;
    }

    links.forEach((lnk, idx) => {
      container.innerHTML += `
        <div class="crud-item-row">
          <div class="crud-item-info">
            <span class="crud-item-title">${lnk.title}</span>
            <span class="crud-item-desc">${lnk.category} ${lnk.description ? '• ' + lnk.description : ''}</span>
          </div>
          <div class="crud-item-actions">
            <button class="crud-action-icon-btn edit btn-edit-lnk" data-idx="${idx}">${ICONS.edit}</button>
            <button class="crud-action-icon-btn delete btn-delete-lnk" data-idx="${idx}">${ICONS.trash}</button>
          </div>
        </div>
      `;
    });

    // Bind Edit triggers
    document.querySelectorAll(".btn-edit-lnk").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-idx"));
        renderLinkEditorForm(profileKey, idx);
      });
    });

    // Bind Delete triggers
    document.querySelectorAll(".btn-delete-lnk").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-idx"));
        if (confirm(`Apakah Anda yakin ingin menghapus tautan "${links[idx].title}"?`)) {
          links.splice(idx, 1);
          saveEditsToLocal();
          renderAdminLinksList(profileKey);
          hideEditorForm();
        }
      });
    });
  }
  } catch (err) {
    console.error("Critical Startup Error:", err);
    const errBox = document.createElement("div");
    errBox.style.cssText = "position:fixed;top:0;left:0;width:100%;background:red;color:white;padding:20px;z-index:999999;font-family:monospace;white-space:pre-wrap;overflow:auto;max-height:100vh;";
    errBox.innerHTML = `<h3>Critical Startup Error:</h3><p>${err.message}</p><pre>${err.stack}</pre>`;
    document.body.appendChild(errBox);
    const loader = document.getElementById("page-loader");
    if (loader) loader.style.display = "none";
  }
});
