const DATA = {
  // Navigation mapping
  routes: [
    { key: "fsh", name: "TU FSH UIN SGD", path: "/" },
    { key: "hk", name: "Hukum Keluarga", path: "/hk" },
    { key: "hes", name: "Hukum Ekonomi Syariah", path: "/hes" },
    { key: "pm", name: "Perbandingan Madzhab", path: "/pm" },
    { key: "hpi", name: "Hukum Pidana Islam", path: "/hpi" },
    { key: "htn", name: "Hukum Tata Negara", path: "/htn" },
    { key: "ih", name: "Ilmu Hukum", path: "/ih" },
    { key: "laboratorium", name: "Laboratorium", path: "/laboratorium" },
    { key: "akademik", name: "Akademik", path: "/akademik" },
    { key: "informasi", name: "Informasi Maba", path: "/informasi" },
    { key: "wag-prodi", name: "WAG Maba Prodi 2026", path: "/wag-prodi" }
  ],

  // Individual profiles data
  profiles: {
    fsh: {
      title: "Quicklink Fakultas Syariah dan Hukum",
      bio: "Pelayanan Tata Usaha dilaksanakan setiap hari kerja (Termasuk Layanan Persuratan Online) | WhatsApp Helpdesk dibalas pukul 08.00 s/d 15.00 WIB",
      photo: "https://ik.imagekit.io/liveatfsh/logo_uin.webp?updatedAt=1748865112640",
      bg_color: "#F5F5F5",
      url_banner: "https://ik.imagekit.io/liveatfsh/tr:w-700,h-330/Selamat-Datang-Mahasiswa-Baru1%20(1).png?updatedAt=1748865112963",
      socials: {
        facebook: "https://facebook.com/jurusan",
        instagram: "https://instagram.com/jurusan",
        web: "https://fsh.uinsgd.ac.id/",
        email: "hk@uinsgd.ac.id"
      },
      links: [
        { title: "ZISWA - Daftar Beasiswa Alumni FSH", url: "https://forms.gle/MGEGuBjgXW3ftjNT6", category: "Beasiswa", description: "" },
        { title: "China Sholarship (ASEAN)", url: "https://drive.google.com/open?id=1e36Xt4WNVQkiCXDY4WWEiUtOLCYYgcVT&usp=drive_fs", category: "Beasiswa", description: "" },
        { title: "Beasiswa LPDP S2/S3", url: "https://lpdp.kemenkeu.go.id", category: "Beasiswa", description: "" },
        { title: "Beasiswa S2 Double Degree Kemenag", url: "https://kemenag.go.id/nasional/dibuka-pendaftaran-beasiswa-s2-double-degree-hingga-15-februari-2026-ini-syaratnya-Stp97", category: "Beasiswa", description: "" },
        { title: "Hukum Keluarga", url: "/hk", category: "Layanan Jurusan", description: "dikelola oleh Pak Dede" },
        { title: "Hukum Ekonomi Syariah", url: "/hes", category: "Layanan Jurusan", description: "dikelola oleh Pak Sanan" },
        { title: "Perbandingan Madzhab", url: "/pm", category: "Layanan Jurusan", description: "dikelola oleh Pak Yanis" },
        { title: "Hukum Pidana Islam", url: "/hpi", category: "Layanan Jurusan", description: "dikelola oleh Pak Dede" },
        { title: "Hukum Tata Negara", url: "/htn", category: "Layanan Jurusan", description: "dikelola oleh Pak Ismail" },
        { title: "Ilmu Hukum", url: "/ih", category: "Layanan Jurusan", description: "dikelola oleh Pak Iwa" },
        { title: "Pusat Kajian Studi Hukum dan Kebijakan (PKSHK)", url: "https://lifeatfsh.uinsgd.ac.id/PKSHK", category: "Lembaga-lembaga Fakultas", description: "" },
        { title: "Jaringan Dokumentasi dan Informasi Hukum (JDIH)", url: "https://lifeatfsh.uinsgd.ac.id/JDIH", category: "Lembaga-lembaga Fakultas", description: "" },
        { title: "Unit Pembinaan dan Promosi Mahasiswa Unggul (P2MU)", url: "https://lifeatfsh.uinsgd.ac.id/P2MU", category: "Lembaga-lembaga Fakultas", description: "" },
        { title: "Lembaga Jurnal Fakultas Syariah dan Hukum", url: "https://lifeatfsh.uinsgd.ac.id/JURNAL", category: "Lembaga-lembaga Fakultas", description: "" },
        { title: "Pusat Pengembangan Kinerja, Informasi, dan Dokumentasi (PPKID)", url: "https://lifeatfsh.uinsgd.ac.id/PPKID", category: "Lembaga-lembaga Fakultas", description: "" },
        { title: "Lembaga Bantuan dan Konsultasi Hukum (LBKH)", url: "https://lifeatfsh.uinsgd.ac.id/LBKH", category: "Lembaga-lembaga Fakultas", description: "" },
        { title: "Link Alternative Layanan TU", url: "https://ruangfsh.vercel.app/layanan", category: "Informasi & Layanan TU", description: "" },
        { title: "Layanan Tata Usaha", url: "https://tufsh.uinsgd.ac.id/", category: "Informasi & Layanan TU", description: "" },
        { title: "Layanan Surat Mahasiswa", url: "https://tufsh.uinsgd.ac.id/layanan/", category: "Informasi & Layanan TU", description: "" },
        { title: "Kontak Dosen", url: "https://tufsh.uinsgd.ac.id/layanan/", category: "Informasi & Layanan TU", description: "" },
        { title: "Cek Judul Tugas Akhir", url: "https://tugasakhirfsh.vercel.app/", category: "Informasi & Layanan TU", description: "" },
        { title: "Layanan Laboratorium Fakultas", url: "/laboratorium", category: "Informasi & Layanan TU", description: "" },
        { title: "Kalender Akademik 2024-2025", url: "https://drive.google.com/file/d/1-YStscTMxX-zbPMgPORlMtnQqDwhjcOD/view?usp=drive_link", category: "Informasi & Layanan TU", description: "" },
        { title: "Group WhatsApp MABA FSH 2026", url: "https://forms.gle/3k9vuo9TREZSH54u6", category: "Informasi & Layanan TU", description: "Silahkan isi google form dulu, setelah itu akan dikirim Link Group WhatsApp Maba FSH 2026" }
      ]
    },
    hk: {
      title: "TAHURA",
      bio: "Selamat datang di ''Tahapan Sidang Hukum Keluarga Terstruktur dan Rapi\"",
      photo: "https://ik.imagekit.io/liveatfsh/logo_uin.webp?updatedAt=1748865112640",
      bg_color: "#F5F5F5",
      url_banner: "https://ik.imagekit.io/liveatfsh/tr:w-700,h-330/Selamat-Datang-Mahasiswa-Baru1%20(1).png?updatedAt=1748865112963",
      socials: {
        facebook: "https://facebook.com/jurusan",
        instagram: "https://www.instagram.com/hukumkeluarga.uinsgd/",
        web: "https://hk.uinsgd.ac.id/",
        email: "as.fsh@uinsgd.ac.id"
      },
      links: [
        { title: "Tracer Study", url: "https://link.uinsgd.ac.id/TracerStudyHK", category: "Data Pendukung Tugas Akhir", description: "" },
        { title: "Lembar Proses Bimbingan Skripsi", url: "https://drive.google.com/file/d/1OHfmOwAlA-MyqAra4ryZU8lIKpPBBDn3/view?usp=sharing", category: "Data Pendukung Tugas Akhir", description: "" },
        { title: "Lembar Nilai Bimbingan Skripsi", url: "https://drive.google.com/file/d/1LaBIobie-yM7l3MgDwizEM5fxuzgXijF/view?usp=sharing", category: "Data Pendukung Tugas Akhir", description: "" },
        { title: "Formulir Pengajuan SK Tugas Akhir & SK TA-DBL", url: "https://docs.google.com/forms/d/e/1FAIpQLSdULCQA8JduRP4rT4HU95XD_5ETKF5_w7DpkoUyyGx181T5jg/viewform?pli=1", category: "Data Pendukung Tugas Akhir", description: "" },
        { title: "Template Surat Pengajuan Proposal Usulan Penelitian", url: "https://docs.google.com/document/d/1oaOBSaHShw8GGIyZRFWJOonlolVHIBKrReii_idEGvk/edit?usp=sharing", category: "Data Pendukung Tugas Akhir", description: "" },
        { title: "Formulir Susulan KRS", url: "https://docs.google.com/document/d/1shNUqn-6Fp3Fzcg4z312bFfWNXPB1j_a/edit?usp=sharing&ouid=118444543959679561236&rtpof=true&sd=true", category: "Data Pendukung Tugas Akhir", description: "" },
        { title: "Lembar Perbaikan Nilai", url: "https://docs.google.com/document/d/1wsRS_6_rm75Nq7d3u-BgJ8UUi1kJfnB2/edit?usp=sharing&ouid=118444543959679561236&rtpof=true&sd=true", category: "Data Pendukung Tugas Akhir", description: "" },
        { title: "Lembar Password", url: "https://drive.google.com/file/d/1pgLd1uUjGI2Jp2_S9ZD__Mvp6M3mkoyg/view?usp=sharing", category: "Data Pendukung Tugas Akhir", description: "" },
        { title: "Link Alternative Layanan TU", url: "https://ruangfsh.vercel.app/layanan", category: "Informasi & Layanan TU", description: "" },
        { title: "Layanan Tata Usaha", url: "https://tufsh.uinsgd.ac.id/", category: "Informasi & Layanan TU", description: "" },
        { title: "Layanan Surat Mahasiswa", url: "https://tufsh.uinsgd.ac.id/layanan/", category: "Informasi & Layanan TU", description: "" },
        { title: "Kontak Dosen", url: "https://tugasakhirfsh.vercel.app/", category: "Informasi & Layanan TU", description: "" },
        { title: "Cek Judul Tugas Akhir", url: "https://link.uinsgd.ac.id/databasetugasakhirfsh", category: "Data Pendukung Tugas Akhir", description: "" },
        { title: "Tahapan Alur Penyelesaian Tugas Akhir", url: "https://docs.google.com/document/d/1EOyiw1_i--StDbbZJ2v8luL9Oaebukos/edit?usp=drivesdk&ouid=110005091259806273834&rtpof=true&sd=true", category: "Data Pendukung Tugas Akhir", description: "" },
        { title: "Layanan Laboratorium Fakultas", url: "https://linktr.ee/labfsh", category: "Informasi & Layanan TU", description: "" },
        { title: "Formulir Eligible", url: "https://forms.gle/6KBeaDHjssjR7S3AA", category: "Data Pendukung Tugas Akhir", description: "" },
        { title: "Layanan Helpdesk Hukum Keluarga", url: "https://wa.me/6285121234241", category: "Layanan Akademik Hukum Keluarga", description: "" },
        { title: "Formulir Validasi Wisuda Jurusan", url: "https://forms.gle/ij8omJpDWQVVKyoF7", category: "Layanan Akademik Hukum Keluarga", description: "" }
      ]
    },
    hes: {
      title: "Hukum Ekonomi Syariah",
      bio: "Menyediakan layanan akademik seperti konsultasi bisnis syariah, audit halal produk, dan pendampingan penyusunan kontrak muamalah kontemporer.",
      photo: "https://ik.imagekit.io/liveatfsh/logo_uin.webp?updatedAt=1748865112640",
      bg_color: "#F5F5F5",
      url_banner: "https://ik.imagekit.io/liveatfsh/tr:w-700,h-330/Selamat-Datang-Mahasiswa-Baru1%20(1).png?updatedAt=1748865112963",
      socials: {
        facebook: "https://facebook.com/jurusan",
        instagram: "https://www.instagram.com/hes.uinsgd/",
        web: "https://hes.uinsgd.ac.id/",
        email: "hes@uinsgd.ac.id"
      },
      links: [
        { title: "Formulir Perbaikan Persyaratan UP", url: "https://docs.google.com/forms/d/e/1FAIpQLSf8gcStOAGKKLtuRcEvQATMg2ysM21u5vCsuarmukPUCEVyAA/viewform", category: "Perbaikan Persyaratan Tugas Akhir", description: "-" },
        { title: "Formulir Perbaikan Persyaratan Komprehensif", url: "https://docs.google.com/forms/d/e/1FAIpQLSeu3JXHTlvOwfyjvzeU3em_hvzyn31XZ9HZ1kJ84pCf0Db_lg/viewform", category: "Perbaikan Persyaratan Tugas Akhir", description: "" },
        { title: "Formulir Perbaikan Persyaratan Munaqosyah", url: "https://docs.google.com/forms/d/e/1FAIpQLSeuOmcwccOn4SIac2vBPu7CMWA04CSkMx5qMkg9deX3PRK6Gg/viewform", category: "Perbaikan Persyaratan Tugas Akhir", description: "" },
        { title: "Link Alternative Layanan TU", url: "https://ruangfsh.vercel.app/layanan", category: "Informasi & Layanan TU", description: "" },
        { title: "Layanan Tata Usaha", url: "https://tufsh.uinsgd.ac.id/", category: "Informasi & Layanan TU", description: "" },
        { title: "Layanan Surat Mahasiswa", url: "https://tufsh.uinsgd.ac.id/layanan/", category: "Informasi & Layanan TU", description: "" },
        { title: "Kontak Dosen", url: "https://tufsh.uinsgd.ac.id/layanan/", category: "Informasi & Layanan TU", description: "" },
        { title: "Cek Judul Tugas Akhir", url: "https://tufsh.uinsgd.ac.id/layanan/", category: "Informasi & Layanan TU", description: "" },
        { title: "Layanan Laboratorium Fakultas", url: "/laboratorium", category: "Informasi & Layanan TU", description: "" }
      ]
    },
    pm: {
      title: "Perbandingan Madzhab",
      bio: "Layanan akademik mencakup analisis perbandingan pendapat mazhab, workshop metodologi istinbat hukum, dan konsultasi penyelesaian masalah fiqih kontemporer.",
      photo: "https://ik.imagekit.io/liveatfsh/logo_uin.webp?updatedAt=1748865112640",
      bg_color: "#F5F5F5",
      url_banner: "https://pm.uinsgd.ac.id/wp-content/uploads/2025/06/hero-perbandingan-madzhab-2-1024x592.png",
      socials: {
        facebook: "https://facebook.com/jurusan",
        instagram: "https://www.instagram.com/pmh.uinsgd/",
        web: "https://pm.uinsgd.ac.id/",
        email: "pm@uinsgd.ac.id"
      },
      links: [
        { title: "Formulir Perbaikan Persyaratan UP", url: "https://docs.google.com/forms/d/e/1FAIpQLSf8gcStOAGKKLtuRcEvQATMg2ysM21u5vCsuarmukPUCEVyAA/viewform", category: "Perbaikan Persyaratan Tugas Akhir", description: "" },
        { title: "Formulir Perbaikan Persyaratan Komprehensif", url: "https://docs.google.com/forms/d/e/1FAIpQLSeu3JXHTlvOwfyjvzeU3em_hvzyn31XZ9HZ1kJ84pCf0Db_lg/viewform", category: "Perbaikan Persyaratan Tugas Akhir", description: "" },
        { title: "Formulir Perbaikan Persyaratan Munaqosyah", url: "https://docs.google.com/forms/d/e/1FAIpQLSeuOmcwccOn4SIac2vBPu7CMWA04CSkMx5qMkg9deX3PRK6Gg/viewform", category: "Perbaikan Persyaratan Tugas Akhir", description: "" },
        { title: "Link Alternative Layanan TU", url: "https://ruangfsh.vercel.app/layanan", category: "Informasi & Layanan TU", description: "" },
        { title: "Layanan Tata Usaha", url: "https://tufsh.uinsgd.ac.id/", category: "Informasi & Layanan TU", description: "" },
        { title: "Layanan Surat Mahasiswa", url: "https://tufsh.uinsgd.ac.id/layanan/", category: "Informasi & Layanan TU", description: "" },
        { title: "Kontak Dosen", url: "https://tufsh.uinsgd.ac.id/layanan/", category: "Informasi & Layanan TU", description: "" },
        { title: "Cek Judul Tugas Akhir", url: "https://tufsh.uinsgd.ac.id/layanan/", category: "Informasi & Layanan TU", description: "" },
        { title: "Layanan Laboratorium Fakultas", url: "/laboratorium", category: "Informasi & Layanan TU", description: "" },
        { title: "Cek Plagiasi", url: "/#", category: "Layanan Jurusan", description: "" }
      ]
    },
    hpi: {
      title: "Hukum Pidana Islam",
      bio: "Layanan akademik Prodi Hukum Pidana Islam (Jinayah) UIN SGD Bandung. Menyediakan informasi perkuliahan, tugas akhir, dan kemahasiswaan.",
      photo: "https://ik.imagekit.io/liveatfsh/logo_uin.webp?updatedAt=1748865112640",
      bg_color: "#F5F5F5",
      url_banner: "https://ik.imagekit.io/liveatfsh/tr:w-700,h-330/Selamat-Datang-Mahasiswa-Baru1%20(1).png?updatedAt=1748865112963",
      socials: {
        facebook: "https://facebook.com/jurusan",
        instagram: "https://www.instagram.com/prodihpi.uinsgd/",
        web: "https://hpi.uinsgd.ac.id/",
        email: "hpi@uinsgd.ac.id"
      },
      links: [
        { title: "Formulir Perbaikan Persyaratan UP", url: "https://docs.google.com/forms/d/e/1FAIpQLSf8gcStOAGKKLtuRcEvQATMg2ysM21u5vCsuarmukPUCEVyAA/viewform", category: "Perbaikan Persyaratan Tugas Akhir", description: "" },
        { title: "Formulir Perbaikan Persyaratan Komprehensif", url: "https://docs.google.com/forms/d/e/1FAIpQLSeu3JXHTlvOwfyjvzeU3em_hvzyn31XZ9HZ1kJ84pCf0Db_lg/viewform", category: "Perbaikan Persyaratan Tugas Akhir", description: "" },
        { title: "Formulir Perbaikan Persyaratan Munaqosyah", url: "https://docs.google.com/forms/d/e/1FAIpQLSeuOmcwccOn4SIac2vBPu7CMWA04CSkMx5qMkg9deX3PRK6Gg/viewform", category: "Perbaikan Persyaratan Tugas Akhir", description: "" },
        { title: "Link Alternative Layanan TU", url: "https://ruangfsh.vercel.app/layanan", category: "Informasi & Layanan TU", description: "" },
        { title: "Layanan Tata Usaha", url: "https://tufsh.uinsgd.ac.id/", category: "Informasi & Layanan TU", description: "" },
        { title: "Layanan Surat Mahasiswa", url: "https://tufsh.uinsgd.ac.id/layanan/", category: "Informasi & Layanan TU", description: "" },
        { title: "Kontak Dosen", url: "https://tufsh.uinsgd.ac.id/layanan/", category: "Informasi & Layanan TU", description: "" },
        { title: "Cek Judul Tugas Akhir", url: "https://tufsh.uinsgd.ac.id/layanan/", category: "Informasi & Layanan TU", description: "" },
        { title: "Layanan Laboratorium Fakultas", url: "/laboratorium", category: "Informasi & Layanan TU", description: "" }
      ]
    },
    htn: {
      title: "Hukum Tata Negara",
      bio: "Layanan akademik berupa analisis kebijakan publik berbasis syariah, konsultasi perancangan perda syariah, dan kajian konstitusi Islam.",
      photo: "https://ik.imagekit.io/liveatfsh/logo_uin.webp?updatedAt=1748865112640",
      bg_color: "#F5F5F5",
      url_banner: "https://ik.imagekit.io/liveatfsh/tr:w-700,h-330/Selamat-Datang-Mahasiswa-Baru1%20(1).png?updatedAt=1748865112963",
      socials: {
        facebook: "https://facebook.com/jurusan",
        instagram: "https://www.instagram.com/htn.uinsgd/",
        web: "https://htn.uinsgd.ac.id/",
        email: "htn@uinsgd.ac.id"
      },
      links: [
        { title: "Formulir Perbaikan Persyaratan UP", url: "https://docs.google.com/forms/d/e/1FAIpQLSf8gcStOAGKKLtuRcEvQATMg2ysM21u5vCsuarmukPUCEVyAA/viewform", category: "Perbaikan Persyaratan Tugas Akhir", description: "" },
        { title: "Formulir Perbaikan Persyaratan Komprehensif", url: "https://docs.google.com/forms/d/e/1FAIpQLSeu3JXHTlvOwfyjvzeU3em_hvzyn31XZ9HZ1kJ84pCf0Db_lg/viewform", category: "Perbaikan Persyaratan Tugas Akhir", description: "" },
        { title: "Formulir Perbaikan Persyaratan Munaqosyah", url: "https://docs.google.com/forms/d/e/1FAIpQLSeuOmcwccOn4SIac2vBPu7CMWA04CSkMx5qMkg9deX3PRK6Gg/viewform", category: "Perbaikan Persyaratan Tugas Akhir", description: "" },
        { title: "Link Alternative Layanan TU", url: "https://ruangfsh.vercel.app/layanan", category: "Informasi & Layanan TU", description: "" },
        { title: "Layanan Tata Usaha", url: "https://tufsh.uinsgd.ac.id/", category: "Informasi & Layanan TU", description: "" },
        { title: "Layanan Surat Mahasiswa", url: "https://tufsh.uinsgd.ac.id/layanan/", category: "Informasi & Layanan TU", description: "" },
        { title: "Susulan KRS", url: "https://docs.google.com/forms/d/e/1FAIpQLSd-r4iDLMcI9hz7TmDZzXzlr_RBy1S1ZCIOkcw7dwyF6IMOtw/viewform?usp=sharing&ouid=102757615810967398691", category: "Informasi & Layanan TU", description: "" },
        { title: "Cek Judul Tugas Akhir", url: "https://tufsh.uinsgd.ac.id/layanan/", category: "Informasi & Layanan TU", description: "" },
        { title: "Layanan Laboratorium Fakultas", url: "/laboratorium", category: "Informasi & Layanan TU", description: "" }
      ]
    },
    ih: {
      title: "Ilmu Hukum",
      bio: "Pelayanan Jurusan dilaksanakan setiap hari kerja (Termasuk Layanan Persuratan Online) | WhatsApp Helpdesk dibalas pukul 08.00 s/d 15.00 WIB",
      photo: "https://ik.imagekit.io/liveatfsh/logo_uin.webp?updatedAt=1748865112640",
      bg_color: "#F5F5F5",
      url_banner: "https://ik.imagekit.io/liveatfsh/tr:w-700,h-330/Selamat-Datang-Mahasiswa-Baru1%20(1).png?updatedAt=1748865112963",
      socials: {
        facebook: "https://facebook.com/jurusan",
        instagram: "https://www.instagram.com/ilmuhukum.uinsgd/",
        web: "https://ilmuhukum.uinsgd.ac.id/",
        email: "ih@uinsgd.ac.id"
      },
      links: [
        { title: "Formulir Perbaikan Persyaratan UP", url: "https://docs.google.com/forms/d/e/1FAIpQLSf8gcStOAGKKLtuRcEvQATMg2ysM21u5vCsuarmukPUCEVyAA/viewform", category: "Perbaikan Persyaratan Tugas Akhir", description: "" },
        { title: "Formulir Perbaikan Persyaratan Komprehensif", url: "https://docs.google.com/forms/d/e/1FAIpQLSeu3JXHTlvOwfyjvzeU3em_hvzyn31XZ9HZ1kJ84pCf0Db_lg/viewform", category: "Perbaikan Persyaratan Tugas Akhir", description: "" },
        { title: "Formulir Perbaikan Persyaratan Munaqosyah", url: "https://docs.google.com/forms/d/e/1FAIpQLSeuOmcwccOn4SIac2vBPu7CMWA04CSkMx5qMkg9deX3PRK6Gg/viewform", category: "Perbaikan Persyaratan Tugas Akhir", description: "" },
        { title: "Link Alternative Layanan TU", url: "https://ruangfsh.vercel.app/layanan", category: "Informasi & Layanan TU", description: "" },
        { title: "Layanan Tata Usaha", url: "https://tufsh.uinsgd.ac.id/", category: "Informasi & Layanan TU", description: "" },
        { title: "Layanan Surat Mahasiswa", url: "https://tufsh.uinsgd.ac.id/layanan/", category: "Informasi & Layanan TU", description: "" },
        { title: "Kontak Dosen", url: "https://tufsh.uinsgd.ac.id/layanan/", category: "Informasi & Layanan TU", description: "" },
        { title: "Cek Judul Tugas Akhir", url: "https://tufsh.uinsgd.ac.id/layanan/", category: "Informasi & Layanan TU", description: "" },
        { title: "Layanan Laboratorium Fakultas", url: "/laboratorium", category: "Informasi & Layanan TU", description: "" },
        { title: "Layanan Pengaduan Non Akademik", url: "https://docs.google.com/forms/d/e/1FAIpQLSfpWOsmonDHMU2GMFSekOIy4pAKMFI3kd24kZSwqZOJmN-kVw/viewform?usp=sharing&ouid=117687726432909300155", category: "Layanan Akademik Prodi Ilmu Hukum", description: "" },
        { title: "Formulir Pendaftaran Semester Pendek (SP)", url: "https://forms.gle/poc5vD4o1hkLTT1q7", category: "Layanan Akademik Prodi Ilmu Hukum", description: "" },
        { title: "Formulir Validasi Kendala Wisuda", url: "https://forms.gle/5GTzpPdXbnAzfhRLA", category: "Layanan Akademik Prodi Ilmu Hukum", description: "" },
        { title: "Formulir Cetak KHS (Cek Eligible)", url: "https://docs.google.com/forms/d/e/1FAIpQLSepyKFwX9dPzhmTHWGDy9pA3aL86fQdMLKNdxrS3RmM1wmiYw/viewform", category: "Layanan Akademik Prodi Ilmu Hukum", description: "" },
        { title: "Pengecekan Plagiarisme Skripsi", url: "https://docs.google.com/forms/d/e/1FAIpQLSfbJs0BKoLgmmz6hgC1y7FUyO-1NS51mIClKA4_ya_-7cnC5A/viewform?usp=sharing&ouid=117687726432909300155", category: "Layanan Akademik Prodi Ilmu Hukum", description: "" }
      ]
    },
    laboratorium: {
      title: "Laboratorium - Fakultas Syariah dan Hukum",
      bio: "Pelayanan Tata Usaha dilaksanakan setiap hari kerja (Termasuk Layanan Persuratan Online) | WhatsApp Helpdesk dibalas pukul 08.00 s/d 15.00 WIB",
      photo: "https://ik.imagekit.io/liveatfsh/logo_uin.webp?updatedAt=1748865112640",
      bg_color: "#F5F5F5",
      url_banner: "https://ik.imagekit.io/liveatfsh/tr:w-700,h-330/Selamat-Datang-Mahasiswa-Baru1%20(1).png?updatedAt=1748865112963",
      socials: {
        facebook: "https://facebook.com/jurusan",
        instagram: "https://instagram.com/jurusan",
        web: "https://fsh.uinsgd.ac.id/",
        email: "hk@uinsgd.ac.id"
      },
      links: [
        { title: "Rekap Nilai Praktikum dan Sertifikat Tahfizh", url: "https://docs.google.com/forms/d/e/1FAIpQLSfsC8_y2q8C5r75P9kBiz50hMvnh78yQ8FxgBdCqW8EeykSpg/viewform", category: "A. Layanan Utama", description: "" },
        { title: "Pangajuan SK Tugas Akhir (Tugas Akhir/TA-DBL)", url: "https://docs.google.com/forms/d/e/1FAIpQLSduviY0rxAXLYsW7MClxgFD0galBCI3v2neISqSJX3JzEkT5w/viewform", category: "A. Layanan Utama", description: "" },
        { title: "Penyerahan Soft File Tugas Akhir/TA-DBL (Syarat Wisuda)", url: "https://docs.google.com/forms/d/e/1FAIpQLScXRC8nGEtvH-NJlCj3pGx9-ON5kPTdj5muYDHbmaKRS-Jnkw/viewform", category: "A. Layanan Utama", description: "" },
        { title: "Daftar Magang Pengadilan Agama", url: "https://docs.google.com/forms/d/e/1FAIpQLSd1tOj8jK5bhWWtttZXyyHBJPf6yBOfOj1Dz8k4BtFh2SDDKQ/viewform", category: "B. Layanan Magang Pengadilan", description: "" },
        { title: "Lapor Magang Pengadilan Agama - Mandiri", url: "https://docs.google.com/forms/d/e/1FAIpQLSfX-eQLjCs8ECQ5Q8bmnuBftTYUzl7mc9SBpsVStj-RAhLo_g/viewform", category: "B. Layanan Magang Pengadilan", description: "" },
        { title: "Redap Data Pendaftaran MKPA", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTGl_ZnHc2-J_7bnLQCctv5hvfw83jFugFaedUaeWexzTKB7EZGPAXha6QPMJs444BkZYiZ9rxcuBlX/pubhtml?gid=848806283&single=true", category: "B. Layanan Magang Pengadilan", description: "" },
        { title: "Formulir Seminar Usulan Penelitian - UP", url: "https://docs.google.com/document/d/1V_jcdyA3QHRTWlSUk05vt2SB0AUgGkej/edit", category: "C. Download File Kelengkapan TA", description: "" },
        { title: "Lembar Perbaikan Usulan Penelitian - UP", url: "https://docs.google.com/document/d/1k-eCsFTR9YN3hJBDttlQLfFpGMEgF28A/edit", category: "C. Download File Kelengkapan TA", description: "" },
        { title: "Lembar Proses Bimbingan Tugas Akhir.docx", url: "https://docs.google.com/document/d/1BCzTZ3S5C4EzL1wNDjMJZoY51cvUKwvk/edit", category: "C. Download File Kelengkapan TA", description: "" },
        { title: "Lembar Nilai Bimbingan Tugas Akhir.docx", url: "https://docs.google.com/document/d/13IB5pHiLOfrP_z4h4jewGlvsUoYLB4ox/edit", category: "C. Download File Kelengkapan TA", description: "" },
        { title: "Format Penggantian SK Judul Tugas Akhir .docx", url: "https://docs.google.com/document/d/15ZSML2X122h2_atNxVm5VoY0N_2-m4MT/edit?usp=drive_link", category: "C. Download File Kelengkapan TA", description: "" }
      ]
    },
    akademik: {
      title: "AKADEMIK - Fakultas Syariah dan Hukum",
      bio: "Pelayanan Tata Usaha dilaksanakan setiap hari kerja (Termasuk Layanan Persuratan Online) | WhatsApp Helpdesk dibalas pukul 08.00 s/d 15.00 WIB",
      photo: "https://ik.imagekit.io/liveatfsh/logo_uin.webp?updatedAt=1748865112640",
      bg_color: "#F5F5F5",
      url_banner: "https://ik.imagekit.io/liveatfsh/tr:w-700,h-330/Selamat-Datang-Mahasiswa-Baru1%20(1).png?updatedAt=1748865112963",
      socials: {
        facebook: "https://facebook.com/jurusan",
        instagram: "https://instagram.com/jurusan",
        web: "https://fsh.uinsgd.ac.id/",
        email: "hk@uinsgd.ac.id"
      },
      links: [
        { title: "Rekap Nilai Praktikum dan Sertifikat Tahfizh", url: "https://docs.google.com/forms/d/e/1FAIpQLSfsC8_y2q8C5r75P9kBiz50hMvnh78yQ8FxgBdCqW8EeykSpg/viewform", category: "A. Layanan Utama", description: "" },
        { title: "Pangajuan SK Tugas Akhir (Skripsi/TA-DBL)", url: "https://docs.google.com/forms/d/e/1FAIpQLSduviY0rxAXLYsW7MClxgFD0galBCI3v2neISqSJX3JzEkT5w/viewform", category: "A. Layanan Utama", description: "" },
        { title: "Penyerahan Soft File Skripsi/TA-DBL (Syarat Wisuda)", url: "https://docs.google.com/forms/d/e/1FAIpQLScXRC8nGEtvH-NJlCj3pGx9-ON5kPTdj5muYDHbmaKRS-Jnkw/viewform", category: "A. Layanan Utama", description: "" },
        { title: "Daftar Magang Pengadilan Agama", url: "https://docs.google.com/forms/d/e/1FAIpQLSd1tOj8jK5bhWWtttZXyyHBJPf6yBOfOj1Dz8k4BtFh2SDDKQ/viewform", category: "B. Layanan Magang Pengadilan", description: "" },
        { title: "Lapor Magang Pengadilan Agama - Mandiri", url: "https://docs.google.com/forms/d/e/1FAIpQLSfX-eQLjCs8ECQ5Q8bmnuBftTYUzl7mc9SBpsVStj-RAhLo_g/viewform", category: "B. Layanan Magang Pengadilan", description: "" },
        { title: "Redap Data Pendaftaran MKPA", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTGl_ZnHc2-J_7bnLQCctv5hvfw83jFugFaedUaeWexzTKB7EZGPAXha6QPMJs444BkZYiZ9rxcuBlX/pubhtml?gid=848806283&single=true", category: "B. Layanan Magang Pengadilan", description: "" },
        { title: "Formulir Seminar Usulan Penelitian - UP", url: "https://docs.google.com/document/d/1V_jcdyA3QHRTWlSUk05vt2SB0AUgGkej/edit", category: "C. Download File Kelengkapan TA", description: "" },
        { title: "Lembar Perbaikan Usulan Penelitian - UP", url: "https://docs.google.com/document/d/1k-eCsFTR9YN3hJBDttlQLfFpGMEgF28A/edit", category: "C. Download File Kelengkapan TA", description: "" },
        { title: "Lembar Proses Bimbingan Skripsi.docx", url: "https://docs.google.com/document/d/1BCzTZ3S5C4EzL1wNDjMJZoY51cvUKwvk/edit", category: "C. Download File Kelengkapan TA", description: "" },
        { title: "Lembar Nilai Bimbingan Skripsi.docx", url: "https://docs.google.com/document/d/13IB5pHiLOfrP_z4h4jewGlvsUoYLB4ox/edit", category: "C. Download File Kelengkapan TA", description: "" },
        { title: "Format Penggantian SK Judul Skripsi .docx", url: "https://docs.google.com/document/d/15ZSML2X122h2_atNxVm5VoY0N_2-m4MT/edit?usp=drive_link", category: "C. Download File Kelengkapan TA", description: "" }
      ]
    },
    informasi: {
      title: "Informasi Mahasiswa Baru",
      bio: "Panduan lengkap daftar lembaga, kontak Whatsapp helpdesk, Instagram, website resmi, dan link grup angkatan mahasiswa baru Fakultas Syariah dan Hukum UIN SGD Bandung.",
      photo: "https://ik.imagekit.io/liveatfsh/logo_uin.webp?updatedAt=1748865112640",
      bg_color: "#F5F5F5",
      url_banner: "https://ik.imagekit.io/liveatfsh/tr:w-700,h-330/Selamat-Datang-Mahasiswa-Baru1%20(1).png?updatedAt=1748865112963",
      socials: {
        facebook: "https://facebook.com/jurusan",
        instagram: "https://www.instagram.com/lifeatfsh",
        web: "https://fsh.uinsgd.ac.id/",
        email: "hk@uinsgd.ac.id"
      },
      links: []
    },
    "wag-prodi": {
      title: "Grup WhatsApp Maba Prodi 2026",
      bio: "Silakan bergabung dengan Grup WhatsApp atau Forum resmi Program Studi Anda di bawah ini untuk koordinasi mahasiswa baru.",
      photo: "",
      bg_color: "#F5F5F5",
      url_banner: "",
      socials: {},
      links: []
    }
  },

  // Directory listing for the "Direktori & Kontak" view
  directory: {
    fakultas: [
      {
        name: "Media Center - Fakultas Syariah dan Hukum",
        whatsapp: "+628953000900",
        whatsapp_label: "Bu Dea",
        instagram: "https://www.instagram.com/fsh.uinsgd/",
        web: "https://fsh.uinsgd.ac.id/",
        group_wa: "https://chat.whatsapp.com/HKgxNsVgwxm59SqOGaTKK3?mode=gi_t"
      },
      {
        name: "Tata Usaha Fakultas Syariah dan Hukum",
        whatsapp: "+628953000900",
        whatsapp_label: "Bu Dea",
        instagram: "https://www.instagram.com/lifeatfsh",
        web: "https://tufsh.uinsgd.ac.id/",
        group_wa: ""
      }
    ],
    prodi: [
      {
        name: "Hukum Pidana Islam (Jinayah)",
        status: "Unggul",
        link: "/hpi",
        instagram: "https://www.instagram.com/prodihpi.uinsgd/",
        web: "https://hpi.uinsgd.ac.id/"
      },
      {
        name: "Perbandingan Madzhab",
        status: "Unggul",
        link: "/pm",
        instagram: "https://www.instagram.com/pmh.uinsgd/",
        web: "https://pm.uinsgd.ac.id/"
      },
      {
        name: "Hukum Ekonomi Syariah (Mu’amalah)",
        status: "Unggul",
        link: "/hes",
        instagram: "https://www.instagram.com/hes.uinsgd/",
        web: "https://hes.uinsgd.ac.id/"
      },
      {
        name: "Hukum Keluarga (Al-Ahwal Al-Syakhsiyah)",
        status: "Unggul",
        link: "/hk",
        instagram: "https://www.instagram.com/hukumkeluarga.uinsgd/",
        web: "https://hk.uinsgd.ac.id/"
      },
      {
        name: "Hukum Tata Negara (Siyasah)",
        status: "Unggul",
        link: "/htn",
        instagram: "https://www.instagram.com/htn.uinsgd/",
        web: "https://htn.uinsgd.ac.id/"
      },
      {
        name: "Ilmu Hukum",
        status: "Unggul",
        link: "/ih",
        instagram: "https://www.instagram.com/ilmuhukum.uinsgd/",
        web: "https://ilmuhukum.uinsgd.ac.id/"
      }
    ],
    hmj: [
      {
        name: "HMJ - Hukum Keluarga",
        contact_person: "Raihan",
        whatsapp: "+6282124396365",
        instagram: "https://www.instagram.com/as.uinsgd",
        group_link: "https://docs.google.com/forms/d/e/1FAIpQLSfIanNpoik68XacIvDNeXZAs3-XLcZR5x3juwfYVo2vSikqtQ/viewform?usp=preview"
      },
      {
        name: "HMJ - Hukum Pidana Islam",
        contact_person: "Ariz Abiyu Rahmat",
        whatsapp: "+6283100150781",
        instagram: "https://www.instagram.com/hmjhpi_uinsgd/",
        group_link: "https://www.instagram.com/hmjhpi_uinsgd/"
      },
      {
        name: "HMJ - Perbandingan Madzhab",
        contact_person: "M. Safrudin",
        whatsapp: "+62089637139463",
        instagram: "https://www.instagram.com/pmh_uinsgd.official/",
        group_link: "https://whatsapp.com/channel/0029VbBPv0h9MF99iAIZQz0u"
      },
      {
        name: "HMJ - Hukum Ekonomi Syariah",
        contact_person: "Alby",
        whatsapp: "+628812077184",
        instagram: "https://www.instagram.com/muamalahuinbdg/",
        group_link: "https://docs.google.com/forms/d/122_JQ4PJ-Xe2Y4XCRvV7hnfAjEPW4gtIrKAZWJOEUI/edit"
      },
      {
        name: "HMJ - Hukum Tata Negara",
        contact_person: "Teguh Nurrobi",
        whatsapp: "+6285860193204",
        instagram: "https://www.instagram.com/htnsiyasahuinbdg/",
        group_link: "https://www.instagram.com/p/DaNemZFD9XU/?img_index=2"
      },
      {
        name: "HMJ - Ilmu Hukum",
        contact_person: "Tansya",
        whatsapp: "+6281292610308",
        instagram: "https://www.instagram.com/ilmuhukumuinbdg/",
        group_link: "https://bit.ly/Mahasiswailmuhukum2026"
      }
    ]
  }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = DATA;
}
