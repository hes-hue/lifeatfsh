import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import {
  Lock,
  User,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  ListFilter,
  Search,
  ExternalLink,
  Loader2,
  FolderOpen,
  Info,
  CheckCircle,
  AlertTriangle,
  Building,
  GraduationCap,
  Users,
  Layout,
  FileText,
  Image
} from 'lucide-react';

export default function App() {
  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [operator, setOperator] = useState(null); // { username, role, profile_key }
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // App states
  const [activeTab, setActiveTab] = useState('links'); // 'links', 'profiles', 'static_pages', 'fakultas', 'prodi', 'hmj'
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(''); // Current profile key being managed
  const [iframeKey, setIframeKey] = useState(0);
  const [staticPages, setStaticPages] = useState([]);
  const [twibbonCampaigns, setTwibbonCampaigns] = useState([]);

  // Static Pages Form
  const [pageSlug, setPageSlug] = useState('');
  const [pageTitle, setPageTitle] = useState('');
  const [pageContent, setPageContent] = useState('');
  const [pageProfileKey, setPageProfileKey] = useState('');

  // Twibbon Campaign Form
  const [campaignSlug, setCampaignSlug] = useState('');
  const [campaignTitle, setCampaignTitle] = useState('');
  const [campaignDescription, setCampaignDescription] = useState('');
  const [campaignFrameUrl, setCampaignFrameUrl] = useState('');
  const [campaignProfileKey, setCampaignProfileKey] = useState('');

  // Profiles Form
  const [profileKey, setProfileKey] = useState('');
  const [profileTitle, setProfileTitle] = useState('');
  const [profileBio, setProfileBio] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [profileBgColor, setProfileBgColor] = useState('#F5F5F5');
  const [profileUrlBanner, setProfileUrlBanner] = useState('');
  const [profileSocialFacebook, setProfileSocialFacebook] = useState('');
  const [profileSocialInstagram, setProfileSocialInstagram] = useState('');
  const [profileSocialWeb, setProfileSocialWeb] = useState('');
  const [profileSocialEmail, setProfileSocialEmail] = useState('');
  
  // Data lists
  const [links, setLinks] = useState([]);
  const [dirFakultas, setDirFakultas] = useState([]);
  const [dirProdi, setDirProdi] = useState([]);
  const [dirHmj, setDirHmj] = useState([]);
  
  // UX states
  const [searchQuery, setSearchQuery] = useState('');
  const [dataLoading, setDataLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, selectedProfile, searchQuery]);

  // Dialog (Modal) states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
  const [currentEditItem, setCurrentEditItem] = useState(null);

  // Form states
  // 1. Link Form
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkCategory, setLinkCategory] = useState('');
  const [linkDescription, setLinkDescription] = useState('');

  // 2. Fakultas Directory Form
  const [fakName, setFakName] = useState('');
  const [fakWhatsapp, setFakWhatsapp] = useState('');
  const [fakWhatsappLabel, setFakWhatsappLabel] = useState('');
  const [fakInstagram, setFakInstagram] = useState('');
  const [fakWeb, setFakWeb] = useState('');
  const [fakGroupWa, setFakGroupWa] = useState('');
  const [fakDescription, setFakDescription] = useState('');
  const [fakPhoto, setFakPhoto] = useState('');

  // 3. Prodi Directory Form
  const [proName, setProName] = useState('');
  const [proStatus, setProStatus] = useState('');
  const [proLink, setProLink] = useState('');
  const [proInstagram, setProInstagram] = useState('');
  const [proWeb, setProWeb] = useState('');

  // 4. HMJ Directory Form
  const [hmjName, setHmjName] = useState('');
  const [hmjCp, setHmjCp] = useState('');
  const [hmjWhatsapp, setHmjWhatsapp] = useState('');
  const [hmjInstagram, setHmjInstagram] = useState('');
  const [hmjGroupLink, setHmjGroupLink] = useState('');

  // Auto-clear toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Load Session on startup
  useEffect(() => {
    const savedOp = localStorage.getItem('fsh_operator');
    const savedPass = sessionStorage.getItem('fsh_op_password');
    if (savedOp && savedPass) {
      const opData = JSON.parse(savedOp);
      setOperator(opData);
      setIsLoggedIn(true);
      if (opData.role === 'prodi') {
        setSelectedProfile(opData.profile_key);
      } else {
        setSelectedProfile('fsh');
      }
    } else {
      localStorage.removeItem('fsh_operator');
      sessionStorage.removeItem('fsh_op_password');
      setOperator(null);
      setIsLoggedIn(false);
    }
  }, []);

  // Fetch base profiles list
  useEffect(() => {
    if (isLoggedIn) {
      fetchProfiles();
    }
  }, [isLoggedIn]);

  // Fetch table data when activeTab or selectedProfile changes
  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn, activeTab, selectedProfile]);

  // Sync profile details state variables to match selectedProfile in real-time (for live preview)
  useEffect(() => {
    if (selectedProfile && profiles.length > 0) {
      const activeProf = profiles.find(p => p.key === selectedProfile);
      if (activeProf) {
        setProfileKey(activeProf.key || '');
        setProfileTitle(activeProf.title || '');
        setProfileBio(activeProf.bio || '');
        setProfilePhoto(activeProf.photo || '');
        setProfileBgColor(activeProf.bg_color || '#F5F5F5');
        setProfileUrlBanner(activeProf.url_banner || '');
        setProfileSocialFacebook(activeProf.social_facebook || '');
        setProfileSocialInstagram(activeProf.social_instagram || '');
        setProfileSocialWeb(activeProf.social_web || '');
        setProfileSocialEmail(activeProf.social_email || '');
      }
    }
  }, [selectedProfile, profiles]);

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  const normalizeSlug = (value) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-+/g, '-');

  // ==========================================
  // API SERVICE CALLS
  // ==========================================

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('key', { ascending: true });
      if (error) throw error;
      setProfiles(data || []);
    } catch (err) {
      console.error('Error profiles:', err);
    }
  };

  const fetchData = async () => {
    setDataLoading(true);
    try {
      if (activeTab === 'links' && selectedProfile) {
        const { data, error } = await supabase
          .from('links')
          .select('*')
          .eq('profile_key', selectedProfile)
          .order('sort_order', { ascending: true });
        if (error) throw error;
        setLinks(data || []);
      } else if (activeTab === 'profiles') {
        await fetchProfiles();
      } else if (activeTab === 'static_pages') {
        let query = supabase.from('static_pages').select('*');
        if (operator.role === 'prodi') {
          query = query.eq('profile_key', operator.profile_key);
        }
        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;
        setStaticPages(data || []);
      } else if (activeTab === 'twibbon') {
        let query = supabase.from('twibbon_campaigns').select('*');
        if (operator.role === 'prodi') {
          query = query.eq('profile_key', operator.profile_key);
        }
        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;
        setTwibbonCampaigns(data || []);
      } else if (activeTab === 'fakultas') {
        const { data, error } = await supabase
          .from('directory_fakultas')
          .select('*')
          .order('sort_order', { ascending: true });
        if (error) throw error;
        setDirFakultas(data || []);
      } else if (activeTab === 'prodi') {
        const { data, error } = await supabase
          .from('directory_prodi')
          .select('*')
          .order('sort_order', { ascending: true });
        if (error) throw error;
        setDirProdi(data || []);
      } else if (activeTab === 'hmj') {
        const { data, error } = await supabase
          .from('directory_hmj')
          .select('*')
          .order('sort_order', { ascending: true });
        if (error) throw error;
        setDirHmj(data || []);
      }
    } catch (err) {
      showToast('error', 'Gagal memuat data dari database: ' + err.message);
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      showToast('error', 'Harap isi semua kolom!');
      return;
    }
    setAuthLoading(true);
    try {
      // RPC check
      const { data, error } = await supabase.rpc('verify_operator', {
        p_username: username,
        p_password: password
      });

      if (error) throw error;

      if (data && data.length > 0 && data[0].is_valid) {
        const opData = {
          username,
          role: data[0].role,
          profile_key: data[0].profile_key
        };
        setOperator(opData);
        localStorage.setItem('fsh_operator', JSON.stringify(opData));
        sessionStorage.setItem('fsh_op_password', password);
        setIsLoggedIn(true);
        if (opData.role === 'prodi') {
          setSelectedProfile(opData.profile_key);
        } else {
          setSelectedProfile('fsh');
        }
        showToast('success', `Selamat datang kembali, ${username}!`);
      } else {
        showToast('error', 'Username atau Password salah!');
      }
    } catch (err) {
      showToast('error', 'Terjadi kesalahan sistem: ' + err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('fsh_operator');
    sessionStorage.removeItem('fsh_op_password');
    setIsLoggedIn(false);
    setOperator(null);
    setUsername('');
    setPassword('');
    showToast('success', 'Berhasil keluar.');
  };

  // ==========================================
  // CRUD OPERATIONS
  // ==========================================

  const openAddDialog = () => {
    setDialogMode('add');
    setCurrentEditItem(null);
    
    // Clear forms
    setLinkTitle('');
    setLinkUrl('');
    setLinkCategory('');
    setLinkDescription('');

    setFakName('');
    setFakDescription('');
    setFakPhoto('');
    setFakWhatsapp('');
    setFakWhatsappLabel('');
    setFakInstagram('');
    setFakWeb('');
    setFakGroupWa('');

    setProName('');
    setProStatus('');
    setProLink('');
    setProInstagram('');
    setProWeb('');

    setHmjName('');
    setHmjCp('');
    setHmjWhatsapp('');
    setHmjInstagram('');
    setHmjGroupLink('');

    setProfileKey('');
    setProfileTitle('');
    setProfileBio('');
    setProfilePhoto('');
    setProfileBgColor('#F5F5F5');
    setProfileUrlBanner('');
    setProfileSocialFacebook('');
    setProfileSocialInstagram('');
    setProfileSocialWeb('');
    setProfileSocialEmail('');

    setPageSlug('');
    setPageTitle('');
    setPageContent('');
    setPageProfileKey(operator?.role === 'prodi' ? operator?.profile_key : (selectedProfile || 'fsh'));

    setCampaignSlug('');
    setCampaignTitle('');
    setCampaignDescription('');
    setCampaignFrameUrl('');
    setCampaignProfileKey(operator?.role === 'prodi' ? operator?.profile_key : (selectedProfile || 'fsh'));

    setIsDialogOpen(true);
  };

  const openEditDialog = (item) => {
    setDialogMode('edit');
    setCurrentEditItem(item);

    if (activeTab === 'links') {
      setLinkTitle(item.title);
      setLinkUrl(item.url);
      setLinkCategory(item.category);
      setLinkDescription(item.description || '');
    } else if (activeTab === 'fakultas') {
      setFakName(item.name);
      setFakDescription(item.description || '');
      setFakPhoto(item.photo || '');
      setFakWhatsapp(item.whatsapp || '');
      setFakWhatsappLabel(item.whatsapp_label || '');
      setFakInstagram(item.instagram || '');
      setFakWeb(item.web || '');
      setFakGroupWa(item.group_wa || '');
    } else if (activeTab === 'prodi') {
      setProName(item.name);
      setProStatus(item.status || '');
      setProLink(item.link);
      setProInstagram(item.instagram || '');
      setProWeb(item.web || '');
    } else if (activeTab === 'hmj') {
      setHmjName(item.name);
      setHmjCp(item.contact_person || '');
      setHmjWhatsapp(item.whatsapp || '');
      setHmjInstagram(item.instagram || '');
      setHmjGroupLink(item.group_link || '');
    } else if (activeTab === 'profiles') {
      setProfileKey(item.key);
      setProfileTitle(item.title);
      setProfileBio(item.bio || '');
      setProfilePhoto(item.photo || '');
      setProfileBgColor(item.bg_color || '#F5F5F5');
      setProfileUrlBanner(item.url_banner || '');
      setProfileSocialFacebook(item.social_facebook || '');
      setProfileSocialInstagram(item.social_instagram || '');
      setProfileSocialWeb(item.social_web || '');
      setProfileSocialEmail(item.social_email || '');
    } else if (activeTab === 'static_pages') {
      setPageSlug(item.slug);
      setPageTitle(item.title);
      setPageContent(item.content);
      setPageProfileKey(item.profile_key);
    } else if (activeTab === 'twibbon') {
      setCampaignSlug(item.slug);
      setCampaignTitle(item.title);
      setCampaignDescription(item.description || '');
      setCampaignFrameUrl(item.frame_url);
      setCampaignProfileKey(item.profile_key);
    }

    setIsDialogOpen(true);
  };

  const executeSecureWrite = async (tableName, actionType, payload, id = null) => {
    const savedOp = localStorage.getItem('fsh_operator');
    const savedPass = sessionStorage.getItem('fsh_op_password');
    if (!savedOp || !savedPass) {
      throw new Error('Sesi kedaluwarsa. Harap login kembali.');
    }
    const op = JSON.parse(savedOp);
    
    const { data, error } = await supabase.rpc('execute_secure_write', {
      op_username: op.username,
      op_password: savedPass,
      target_table: tableName,
      action_type: actionType,
      row_data: payload,
      row_id: id ? String(id) : null
    });
    
    if (error) {
      throw error;
    }
    return data;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setDataLoading(true);
    try {
      if (activeTab === 'links') {
        const payload = {
          profile_key: selectedProfile,
          title: linkTitle,
          url: linkUrl,
          category: linkCategory,
          description: linkDescription
        };

        if (dialogMode === 'add') {
          payload.sort_order = links.length + 1;
          await executeSecureWrite('links', 'insert', payload);
          showToast('success', 'Link berhasil ditambahkan!');
        } else {
          await executeSecureWrite('links', 'update', payload, currentEditItem.id);
          showToast('success', 'Link berhasil diperbarui!');
        }
      } else if (activeTab === 'fakultas') {
        const payload = {
          name: fakName,
          description: fakDescription,
          photo: fakPhoto,
          whatsapp: fakWhatsapp,
          whatsapp_label: fakWhatsappLabel,
          instagram: fakInstagram,
          web: fakWeb,
          group_wa: fakGroupWa
        };

        if (dialogMode === 'add') {
          payload.sort_order = dirFakultas.length + 1;
          await executeSecureWrite('directory_fakultas', 'insert', payload);
          showToast('success', 'Lembaga berhasil ditambahkan!');
        } else {
          await executeSecureWrite('directory_fakultas', 'update', payload, currentEditItem.id);
          showToast('success', 'Lembaga berhasil diperbarui!');
        }
      } else if (activeTab === 'prodi') {
        const payload = {
          name: proName,
          status: proStatus,
          link: proLink,
          instagram: proInstagram,
          web: proWeb
        };

        if (dialogMode === 'add') {
          payload.sort_order = dirProdi.length + 1;
          await executeSecureWrite('directory_prodi', 'insert', payload);
          showToast('success', 'Prodi berhasil ditambahkan!');
        } else {
          await executeSecureWrite('directory_prodi', 'update', payload, currentEditItem.id);
          showToast('success', 'Prodi berhasil diperbarui!');
        }
      } else if (activeTab === 'hmj') {
        const payload = {
          name: hmjName,
          contact_person: hmjCp,
          whatsapp: hmjWhatsapp,
          instagram: hmjInstagram,
          group_link: hmjGroupLink
        };

        if (dialogMode === 'add') {
          payload.sort_order = dirHmj.length + 1;
          await executeSecureWrite('directory_hmj', 'insert', payload);
          showToast('success', 'HMJ berhasil ditambahkan!');
        } else {
          await executeSecureWrite('directory_hmj', 'update', payload, currentEditItem.id);
          showToast('success', 'HMJ berhasil diperbarui!');
        }
      } else if (activeTab === 'profiles') {
        const payload = {
          key: profileKey,
          title: profileTitle,
          bio: profileBio,
          photo: profilePhoto,
          bg_color: profileBgColor,
          url_banner: profileUrlBanner,
          social_facebook: profileSocialFacebook,
          social_instagram: profileSocialInstagram,
          social_web: profileSocialWeb,
          social_email: profileSocialEmail
        };

        if (dialogMode === 'add') {
          await executeSecureWrite('profiles', 'insert', payload);
          showToast('success', 'Halaman Linktree berhasil ditambahkan!');
        } else {
          await executeSecureWrite('profiles', 'update', payload, currentEditItem.key);
          showToast('success', 'Halaman Linktree berhasil diperbarui!');
        }
        fetchProfiles();
      } else if (activeTab === 'static_pages') {
        const payload = {
          slug: pageSlug,
          title: pageTitle,
          content: pageContent,
          profile_key: pageProfileKey
        };

        if (dialogMode === 'add') {
          await executeSecureWrite('static_pages', 'insert', payload);
          showToast('success', 'Halaman Statis berhasil ditambahkan!');
        } else {
          await executeSecureWrite('static_pages', 'update', payload, currentEditItem.id);
          showToast('success', 'Halaman Statis berhasil diperbarui!');
        }
      } else if (activeTab === 'twibbon') {
        const payload = {
          slug: campaignSlug,
          title: campaignTitle,
          description: campaignDescription,
          frame_url: campaignFrameUrl,
          profile_key: campaignProfileKey
        };

        if (dialogMode === 'add') {
          await executeSecureWrite('twibbon_campaigns', 'insert', payload);
          showToast('success', 'Kampanye Twibbon berhasil ditambahkan!');
        } else {
          await executeSecureWrite('twibbon_campaigns', 'update', payload, currentEditItem.id);
          showToast('success', 'Kampanye Twibbon berhasil diperbarui!');
        }
      }

      setIsDialogOpen(false);
      fetchData();
      setIframeKey(k => k + 1);
    } catch (err) {
      showToast('error', 'Gagal menyimpan perubahan: ' + err.message);
    } finally {
      setDataLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
    setDataLoading(true);
    try {
      if (activeTab === 'links') {
        await executeSecureWrite('links', 'delete', {}, id);
      } else if (activeTab === 'fakultas') {
        await executeSecureWrite('directory_fakultas', 'delete', {}, id);
      } else if (activeTab === 'prodi') {
        await executeSecureWrite('directory_prodi', 'delete', {}, id);
      } else if (activeTab === 'hmj') {
        await executeSecureWrite('directory_hmj', 'delete', {}, id);
      } else if (activeTab === 'profiles') {
        await executeSecureWrite('profiles', 'delete', {}, id);
        fetchProfiles();
      } else if (activeTab === 'static_pages') {
        await executeSecureWrite('static_pages', 'delete', {}, id);
      } else if (activeTab === 'twibbon') {
        await executeSecureWrite('twibbon_campaigns', 'delete', {}, id);
      }

      showToast('success', 'Data berhasil dihapus.');
      fetchData();
      setIframeKey(k => k + 1);
    } catch (err) {
      showToast('error', 'Gagal menghapus data: ' + err.message);
    } finally {
      setDataLoading(false);
    }
  };

  // Filter lists based on Search Query
  const getFilteredItems = () => {
    const q = searchQuery.toLowerCase();
    if (activeTab === 'links') {
      return links.filter(lnk => lnk.title.toLowerCase().includes(q) || lnk.category.toLowerCase().includes(q));
    } else if (activeTab === 'fakultas') {
      return dirFakultas.filter(item => item.name.toLowerCase().includes(q));
    } else if (activeTab === 'prodi') {
      return dirProdi.filter(item => item.name.toLowerCase().includes(q) || (item.status && item.status.toLowerCase().includes(q)));
    } else if (activeTab === 'hmj') {
      return dirHmj.filter(item => item.name.toLowerCase().includes(q) || (item.contact_person && item.contact_person.toLowerCase().includes(q)));
    } else if (activeTab === 'profiles') {
      return profiles.filter(p => p.title.toLowerCase().includes(q) || p.key.toLowerCase().includes(q));
    } else if (activeTab === 'static_pages') {
      return staticPages.filter(item => item.title.toLowerCase().includes(q) || item.slug.toLowerCase().includes(q));
    } else if (activeTab === 'twibbon') {
      return twibbonCampaigns.filter(item => item.title.toLowerCase().includes(q) || item.slug.toLowerCase().includes(q));
    }
    return [];
  };

  const filteredItems = getFilteredItems();
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // ==========================================
  // RENDER LOGIN SCREEN
  // ==========================================
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans selection:bg-rose-500 selection:text-white">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-8 transition-all duration-300">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Fakultas Syariah & Hukum</h1>
            <p className="text-sm text-slate-500 mt-2">CMS Portal Linktree & Informasi Maba</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="admin.tufsh / hmj.hk"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white transition-all text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 bg-[#E0004D] hover:bg-[#c20042] text-white font-semibold rounded-xl text-sm shadow-lg shadow-rose-500/10 hover:shadow-rose-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {authLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Masuk Dashboard'
              )}
            </button>
          </form>

          {/* Menu Tentang / Panduan Penggunaan */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <details className="group cursor-pointer">
              <summary className="list-none flex items-center justify-between text-xs font-semibold text-slate-500 hover:text-slate-800 transition-all select-none">
                <span className="flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5" />
                  Tentang & Panduan Penggunaan Aplikasi
                </span>
                <span className="transition-transform group-open:rotate-180 text-[10px]">▼</span>
              </summary>
              <div className="mt-3 space-y-3 text-xs text-slate-600 leading-relaxed max-h-[220px] overflow-y-auto pr-1">
                <p className="font-semibold text-slate-800">Life at FSH CMS adalah panel pengelolaan satu pintu untuk memperbarui data pada portal linktree utama.</p>
                
                <div className="space-y-1.5">
                  <div className="font-semibold text-slate-800">📍 Cara Menambah Link Baru:</div>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Pilih menu <strong>Links Jurusan / Fakultas</strong> di sidebar.</li>
                    <li>Pilih prodi Anda (jika admin) dan klik <strong>Tambah Data</strong>.</li>
                    <li>Masukkan judul link, alamat URL lengkap (misal: <code>https://...</code>), dan kategori link (misal: Beasiswa/Layanan).</li>
                  </ol>
                </div>

                <div className="space-y-1.5">
                  <div className="font-semibold text-slate-800">📄 Cara Membuat Halaman Baru (Statis):</div>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Pilih menu <strong>Halaman Statis Custom</strong> dan klik <strong>Tambah Data</strong>.</li>
                    <li>Tulis Judul Halaman dan ketik <strong>Slug URL</strong> (contoh: <code>alur-sidang</code>). Halaman Anda akan otomatis ber-alamat di <code>domain/[jurusan]/alur-sidang</code>.</li>
                    <li>Tulis konten panduan Anda di kotak teks. Blok teks dan gunakan toolbar atas untuk menebalkan (B), memiringkan (I), membuat bullet list, subjudul (H), atau memasang link.</li>
                    <li>Klik <strong>Simpan</strong> untuk mempublikasikan halaman secara langsung.</li>
                  </ol>
                </div>

                <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-2 text-center">
                  © 2026 Fakultas Syariah dan Hukum UIN SGD Bandung. All rights reserved.
                </div>
              </div>
            </details>
          </div>
        </div>

        {/* Global Toast Notification */}
        {toast && (
          <div className="fixed bottom-4 right-4 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-800 animate-slide-in text-sm z-50">
            {toast.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // RENDER CMS DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F8FAFC] font-sans selection:bg-slate-950 selection:text-white">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white text-slate-800 flex flex-col border-r border-slate-200 shrink-0">
        <div className="p-5 border-b border-slate-200/80 flex items-center justify-between">
          <div>
            <div className="font-bold text-xs text-slate-900 tracking-tight flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-slate-900"></span>
              FSH Linktree CMS
            </div>
            <div className="text-[9px] text-slate-400 mt-0.5 uppercase font-bold tracking-wider">
              {operator.role === 'admin' ? 'Fakultas Admin' : `HMJ : ${operator.profile_key.toUpperCase()}`}
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <div className="text-slate-400 text-[9px] font-bold px-3 pt-2 pb-1 uppercase tracking-widest block">Main Menu</div>
          <button
            onClick={() => setActiveTab('links')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'links'
                ? 'bg-slate-200/60 text-slate-900'
                : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
            }`}
          >
            <FolderOpen className="h-4 w-4 text-slate-400" />
            Links Jurusan / Fakultas
            {links.length > 0 && (
              <span className="ml-auto bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                {links.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('static_pages')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'static_pages'
                ? 'bg-slate-200/60 text-slate-900'
                : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="h-4 w-4 text-slate-400" />
            Halaman Statis Custom
            {staticPages.length > 0 && (
              <span className="ml-auto bg-slate-200 text-slate-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                {staticPages.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('twibbon')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'twibbon'
                ? 'bg-slate-200/60 text-slate-900'
                : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
            }`}
          >
            <Image className="h-4 w-4 text-slate-400" />
            Twibbon Kampanye
            {twibbonCampaigns.length > 0 && (
              <span className="ml-auto bg-slate-200 text-slate-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                {twibbonCampaigns.length}
              </span>
            )}
          </button>

          {/* Settings tab available for prodi to edit their own profile details */}
          {operator.role === 'prodi' && (
            <button
              onClick={() => {
                const myProfile = profiles.find(p => p.key === operator.profile_key);
                if (myProfile) {
                  setProfileKey(myProfile.key);
                  setProfileTitle(myProfile.title);
                  setProfileBio(myProfile.bio || '');
                  setProfilePhoto(myProfile.photo || '');
                  setProfileBgColor(myProfile.bg_color || '#F5F5F5');
                  setProfileUrlBanner(myProfile.url_banner || '');
                  setProfileSocialFacebook(myProfile.social_facebook || '');
                  setProfileSocialInstagram(myProfile.social_instagram || '');
                  setProfileSocialWeb(myProfile.social_web || '');
                  setProfileSocialEmail(myProfile.social_email || '');
                }
                setActiveTab('profiles');
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'profiles'
                  ? 'bg-slate-200/60 text-slate-900'
                  : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
              }`}
            >
              <Layout className="h-4 w-4 text-slate-400" />
              Tampilan & Informasi
            </button>
          )}

          {/* Directory management tabs only available for admin */}
          {operator.role === 'admin' && (
            <>
              <div className="text-slate-400 text-[9px] font-bold px-3 pt-4 pb-1 uppercase tracking-widest block">Kelola Halaman</div>
              <button
                onClick={() => setActiveTab('profiles')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'profiles'
                    ? 'bg-slate-200/60 text-slate-900'
                    : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
                }`}
              >
                <Layout className="h-4 w-4 text-slate-400" />
                Halaman Linktree
                {profiles.length > 0 && (
                  <span className="ml-auto bg-slate-200 text-slate-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    {profiles.length}
                  </span>
                )}
              </button>

              <div className="text-slate-400 text-[9px] font-bold px-3 pt-4 pb-1 uppercase tracking-widest block">Direktori Maba</div>
              <button
                onClick={() => setActiveTab('fakultas')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'fakultas'
                    ? 'bg-slate-200/60 text-slate-900'
                    : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
                }`}
              >
                <Building className="h-4 w-4 text-slate-400" />
                Lembaga & TU
                {dirFakultas.length > 0 && (
                  <span className="ml-auto bg-slate-200 text-slate-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    {dirFakultas.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('prodi')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'prodi'
                    ? 'bg-slate-200/60 text-slate-900'
                    : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
                }`}
              >
                <GraduationCap className="h-4 w-4 text-slate-400" />
                S1 Program Studi
                {dirProdi.length > 0 && (
                  <span className="ml-auto bg-slate-200 text-slate-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    {dirProdi.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('hmj')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'hmj'
                    ? 'bg-slate-200/60 text-slate-900'
                    : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
                }`}
              >
                <Users className="h-4 w-4 text-slate-400" />
                Himpunan Mahasiswa
                {dirHmj.length > 0 && (
                  <span className="ml-auto bg-slate-200 text-slate-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    {dirHmj.length}
                  </span>
                )}
              </button>
            </>
          )}
        </nav>

        {/* User profile footer */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-7 w-7 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 font-bold uppercase text-[10px]">
              {operator.username[0]}
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-slate-800 truncate">{operator.username}</div>
              <div className="text-[9px] text-slate-400 truncate uppercase font-semibold">{operator.role}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Keluar"
            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-all cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </aside>

      {/* Main Content & Preview Split Layout Wrapper */}
      <div className="flex-1 flex flex-col lg:flex-row min-w-0 min-h-0 overflow-hidden bg-slate-50">
        
        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto min-w-0">
        {/* Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <span>Dashboard</span>
              <span>/</span>
              <span className="text-slate-600">
                {activeTab === 'links' && 'Links'}
                {activeTab === 'profiles' && 'Profiles'}
                {activeTab === 'static_pages' && 'Static Pages'}
                {activeTab === 'twibbon' && 'Twibbon'}
                {activeTab === 'fakultas' && 'Lembaga'}
                {activeTab === 'prodi' && 'Prodi'}
                {activeTab === 'hmj' && 'HMJ'}
              </span>
              {selectedProfile && (
                <>
                  <span>/</span>
                  <span className="text-slate-600 font-extrabold">{selectedProfile.toUpperCase()}</span>
                </>
              )}
            </div>
            <h2 className="text-sm font-bold text-slate-900 mt-1">
              {activeTab === 'links' && 'Manajemen Linktree'}
              {activeTab === 'profiles' && 'Manajemen Halaman Linktree'}
              {activeTab === 'static_pages' && 'Manajemen Halaman Statis'}
              {activeTab === 'twibbon' && 'Manajemen Kampanye Twibbon'}
              {activeTab === 'fakultas' && 'Direktori Lembaga & TU'}
              {activeTab === 'prodi' && 'Direktori Program Studi S1'}
              {activeTab === 'hmj' && 'Direktori Himpunan Mahasiswa'}
            </h2>
          </div>
        </div>

        {activeTab === 'profiles' && operator.role === 'prodi' ? (
          <div className="space-y-6 max-w-4xl">
            {/* Form Title & Description Header */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900">Pengaturan Tampilan & Informasi</h3>
              <p className="text-slate-500 text-xs mt-1">Ubah identitas visual, bio prodi, dan info media sosial yang tampil pada halaman linktree Anda.</p>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              setDataLoading(true);
              try {
                const payload = {
                  key: profileKey,
                  title: profileTitle,
                  bio: profileBio,
                  photo: profilePhoto,
                  bg_color: profileBgColor,
                  url_banner: profileUrlBanner,
                  social_facebook: profileSocialFacebook,
                  social_instagram: profileSocialInstagram,
                  social_web: profileSocialWeb,
                  social_email: profileSocialEmail
                };
                await executeSecureWrite('profiles', 'update', payload, profileKey);
                showToast('success', 'Profil halaman Anda berhasil diperbarui!');
                fetchProfiles();
                setIframeKey(k => k + 1);
              } catch (err) {
                showToast('error', err.message || 'Gagal menyimpan perubahan.');
              } finally {
                setDataLoading(false);
              }
            }} className="space-y-6">
              
              {/* Card 1: Informasi Dasar */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <span className="text-rose-500 text-xs">📝</span>
                  <h4 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Informasi Dasar</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">ID Halaman (Key / Slug)</label>
                    <input
                      type="text"
                      disabled
                      value={profileKey}
                      className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-mono text-xs cursor-not-allowed focus:outline-none"
                    />
                    <p className="text-[10px] text-slate-400">Url aktif: <code>lifeatfsh.uinsgd.ac.id/{profileKey}</code></p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Judul Halaman / Nama Lembaga *</label>
                    <input
                      type="text"
                      required
                      placeholder="Nama Lembaga / Jurusan"
                      value={profileTitle}
                      onChange={(e) => setProfileTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 focus:bg-white transition-all text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Deskripsi / Bio Singkat</label>
                  <textarea
                    placeholder="Keterangan singkat mengenai prodi/layanan..."
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 focus:bg-white transition-all text-xs min-h-[90px] resize-y"
                  />
                </div>
              </div>

              {/* Card 2: Tampilan & Media */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <span className="text-rose-500 text-xs">🎨</span>
                  <h4 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Tampilan & Media</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Logo / Foto URL</label>
                    <input
                      type="text"
                      placeholder="https://ik.imagekit.io/..."
                      value={profilePhoto}
                      onChange={(e) => setProfilePhoto(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 focus:bg-white transition-all text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Banner Image URL</label>
                    <input
                      type="text"
                      placeholder="https://ik.imagekit.io/..."
                      value={profileUrlBanner}
                      onChange={(e) => setProfileUrlBanner(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 focus:bg-white transition-all text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Warna Latar Belakang</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={profileBgColor && profileBgColor.startsWith('#') && profileBgColor.length === 7 ? profileBgColor : '#f5f5f5'}
                        onChange={(e) => setProfileBgColor(e.target.value)}
                        className="w-11 h-9 p-0 bg-transparent border-0 cursor-pointer shrink-0 rounded-lg overflow-hidden"
                      />
                      <input
                        type="text"
                        placeholder="#F5F5F5"
                        value={profileBgColor}
                        onChange={(e) => setProfileBgColor(e.target.value)}
                        className="flex-1 px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 focus:bg-white transition-all text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Media Sosial & Kontak */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <span className="text-rose-500 text-xs">🌐</span>
                  <h4 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Media Sosial & Kontak</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Website Resmi</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={profileSocialWeb}
                      onChange={(e) => setProfileSocialWeb(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 focus:bg-white transition-all text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Instagram URL</label>
                    <input
                      type="text"
                      placeholder="https://instagram.com/..."
                      value={profileSocialInstagram}
                      onChange={(e) => setProfileSocialInstagram(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 focus:bg-white transition-all text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Facebook URL</label>
                    <input
                      type="text"
                      placeholder="https://facebook.com/..."
                      value={profileSocialFacebook}
                      onChange={(e) => setProfileSocialFacebook(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 focus:bg-white transition-all text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Email Resmi</label>
                    <input
                      type="email"
                      placeholder="nama@uinsgd.ac.id"
                      value={profileSocialEmail}
                      onChange={(e) => setProfileSocialEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 focus:bg-white transition-all text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Form Action Bar */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={dataLoading}
                  className="px-6 py-3 bg-[#E0004D] hover:bg-[#c20042] text-white rounded-xl font-semibold text-xs shadow-md shadow-rose-500/10 hover:shadow-rose-500/20 cursor-pointer transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {dataLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>

            </form>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
            <div className="flex flex-wrap items-center gap-3">
              {/* Profile dropdown selector for links tab */}
              {activeTab === 'links' && (
                <div className="flex items-center gap-1.5">
                  <ListFilter className="h-3.5 w-3.5 text-slate-400" />
                  <select
                    value={selectedProfile}
                    onChange={(e) => setSelectedProfile(e.target.value)}
                    disabled={operator.role === 'prodi'}
                    className="bg-white border border-slate-200 rounded-lg text-xs py-1 px-2.5 font-semibold focus:outline-none focus:border-slate-900 disabled:bg-slate-100 disabled:cursor-not-allowed text-slate-700"
                  >
                    {operator.role === 'admin' ? (
                      profiles.map(p => (
                        <option key={p.key} value={p.key}>{p.title}</option>
                      ))
                    ) : (
                      <option value={operator.profile_key}>
                        {profiles.find(p => p.key === operator.profile_key)?.title || operator.profile_key.toUpperCase()}
                      </option>
                    )}
                  </select>
                </div>
              )}
            </div>

            {/* Search Input & Compact Tambah Data Button */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-60">
                <Search className="absolute left-3 top-2.5 h-3 w-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari data..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all text-xs"
                />
              </div>

              {!(activeTab === 'profiles' && operator.role === 'prodi') && (
                <button
                  onClick={openAddDialog}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm hover:shadow active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
                >
                  <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                  Tambah Data
                </button>
              )}
            </div>
          </div>

          {/* Dynamic Table Content */}
          <div className="overflow-x-auto">
            {dataLoading ? (
              <div className="p-16 flex flex-col items-center justify-center gap-3">
                <Loader2 className="h-8 w-8 text-rose-500 animate-spin" />
                <div className="text-xs text-slate-500">Memuat data dari database...</div>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="p-16 text-center text-slate-400 text-xs">
                Tidak ada data ditemukan. Silakan tambahkan data baru.
              </div>
            ) : (
              <>
                <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-slate-50 text-slate-400 uppercase tracking-wider font-bold text-[9px]">
                    {activeTab === 'links' && (
                      <>
                        <th className="px-4 py-2.5 w-16">Urutan</th>
                        <th className="px-4 py-2.5">Judul Link</th>
                        <th className="px-4 py-2.5">Kategori</th>
                        <th className="px-4 py-2.5">Deskripsi</th>
                        <th className="px-4 py-2.5 text-right">Aksi</th>
                      </>
                    )}
                    {activeTab === 'profiles' && (
                      <>
                        <th className="px-4 py-2.5 w-24">ID (Key)</th>
                        <th className="px-4 py-2.5">Nama Halaman</th>
                        <th className="px-4 py-2.5">Bio</th>
                        <th className="px-4 py-2.5">Link</th>
                        <th className="px-4 py-2.5 text-right">Aksi</th>
                      </>
                    )}
                    {activeTab === 'static_pages' && (
                      <>
                        <th className="px-4 py-2.5">Judul Halaman</th>
                        <th className="px-4 py-2.5">Slug</th>
                        <th className="px-4 py-2.5">Profil</th>
                        <th className="px-4 py-2.5">Link</th>
                        <th className="px-4 py-2.5 text-right">Aksi</th>
                      </>
                    )}
                    {activeTab === 'twibbon' && (
                      <>
                        <th className="px-4 py-2.5">Judul Kampanye</th>
                        <th className="px-4 py-2.5">Slug</th>
                        <th className="px-4 py-2.5">Frame URL</th>
                        <th className="px-4 py-2.5">Link</th>
                        <th className="px-4 py-2.5 text-right">Aksi</th>
                      </>
                    )}
                    {activeTab === 'fakultas' && (
                      <>
                        <th className="px-4 py-2.5">Nama Lembaga</th>
                        <th className="px-4 py-2.5">Helpdesk WA</th>
                        <th className="px-4 py-2.5">Instagram</th>
                        <th className="px-4 py-2.5">Group WA</th>
                        <th className="px-4 py-2.5 text-right">Aksi</th>
                      </>
                    )}
                    {activeTab === 'prodi' && (
                      <>
                        <th className="px-4 py-2.5">Nama Program Studi</th>
                        <th className="px-4 py-2.5 w-24">Akreditasi</th>
                        <th className="px-4 py-2.5">Instagram</th>
                        <th className="px-4 py-2.5">Website</th>
                        <th className="px-4 py-2.5 text-right">Aksi</th>
                      </>
                    )}
                    {activeTab === 'hmj' && (
                      <>
                        <th className="px-4 py-2.5">Nama Organisasi (HMJ)</th>
                        <th className="px-4 py-2.5">Ketua / CP</th>
                        <th className="px-4 py-2.5">WhatsApp</th>
                        <th className="px-4 py-2.5">Group WA</th>
                        <th className="px-4 py-2.5 text-right">Aksi</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
                  {/* Links rows */}
                  {activeTab === 'links' && paginatedItems.map((lnk, idx) => (
                    <tr key={lnk.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-2 font-mono text-slate-400 text-xs">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-800 text-xs">{lnk.title}</span>
                          <a href={lnk.url} target="_blank" rel="noreferrer" title={lnk.url} className="text-slate-400 hover:text-slate-900 transition-colors shrink-0">
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold text-[9px] border border-slate-200/40">
                          {lnk.category}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-slate-500 max-w-xs truncate text-[11px]">{lnk.description || '-'}</td>
                      <td className="px-4 py-2 text-right space-x-1 whitespace-nowrap">
                        <button onClick={() => openEditDialog(lnk)} className="p-1 text-slate-400 hover:text-slate-950 hover:bg-slate-100 rounded cursor-pointer transition-all">
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => handleDelete(lnk.id)} className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer transition-all">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {/* Fakultas rows */}
                  {activeTab === 'fakultas' && paginatedItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          {item.photo && (
                            <img src={item.photo} alt={item.name} className="w-6 h-6 rounded object-cover border border-slate-200 shrink-0" />
                          )}
                          <div className="min-w-0">
                            <div className="truncate font-semibold text-slate-800 text-xs">{item.name}</div>
                            {item.description && (
                              <div className="text-[10px] text-slate-400 font-normal max-w-xs truncate">{item.description}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        {item.whatsapp ? (
                          <div className="text-[11px]">
                            <span className="font-semibold text-slate-700">{item.whatsapp}</span>
                            <span className="text-[9px] text-slate-400 block">{item.whatsapp_label || 'CS'}</span>
                          </div>
                        ) : '-'}
                      </td>
                      <td className="px-4 py-2 text-[11px]">
                        {item.instagram ? (
                          <a href={item.instagram} target="_blank" rel="noreferrer" className="text-slate-500 hover:underline hover:text-slate-900">
                            @{item.instagram.split('/').filter(Boolean).pop()}
                          </a>
                        ) : '-'}
                      </td>
                      <td className="px-4 py-2 max-w-xs truncate text-[11px]">
                        {item.group_wa ? (
                          <a href={item.group_wa} target="_blank" rel="noreferrer" className="text-emerald-600 font-semibold hover:underline">
                            Gabung WAG
                          </a>
                        ) : '-'}
                      </td>
                      <td className="px-4 py-2 text-right space-x-1 whitespace-nowrap">
                        <button onClick={() => openEditDialog(item)} className="p-1 text-slate-400 hover:text-slate-950 hover:bg-slate-100 rounded cursor-pointer transition-all">
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer transition-all">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {/* Prodi rows */}
                  {activeTab === 'prodi' && paginatedItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-2 font-semibold text-slate-800 text-xs">{item.name}</td>
                      <td className="px-4 py-2">
                        {item.status ? (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 text-[9px]">
                            {item.status}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="px-4 py-2 text-[11px]">
                        {item.instagram ? (
                          <a href={item.instagram} target="_blank" rel="noreferrer" className="text-slate-500 hover:underline hover:text-slate-900">
                            @{item.instagram.split('/').filter(Boolean).pop()}
                          </a>
                        ) : '-'}
                      </td>
                      <td className="px-4 py-2 text-[11px]">
                        {item.web ? (
                          <a href={item.web} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-900 flex items-center gap-0.5">
                            Buka <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        ) : '-'}
                      </td>
                      <td className="px-4 py-2 text-right space-x-1 whitespace-nowrap">
                        <button onClick={() => openEditDialog(item)} className="p-1 text-slate-400 hover:text-slate-950 hover:bg-slate-100 rounded cursor-pointer transition-all">
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer transition-all">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {/* HMJ rows */}
                  {activeTab === 'hmj' && paginatedItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-2 font-semibold text-slate-800 text-xs">{item.name}</td>
                      <td className="px-4 py-2 text-slate-700 text-[11px]">{item.contact_person || '-'}</td>
                      <td className="px-4 py-2 font-mono text-slate-500 text-[11px]">{item.whatsapp || '-'}</td>
                      <td className="px-4 py-2 max-w-xs truncate text-[11px]">
                        {item.group_link ? (
                          <a href={item.group_link} target="_blank" rel="noreferrer" className="text-slate-500 hover:underline hover:text-slate-900 block truncate">
                            Gabung WAG
                          </a>
                        ) : '-'}
                      </td>
                      <td className="px-4 py-2 text-right space-x-1 whitespace-nowrap">
                        <button onClick={() => openEditDialog(item)} className="p-1 text-slate-400 hover:text-slate-950 hover:bg-slate-100 rounded cursor-pointer transition-all">
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer transition-all">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {/* Profiles rows */}
                  {activeTab === 'profiles' && paginatedItems.map((item) => (
                    <tr key={item.key} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-2 font-mono font-bold text-slate-900 text-xs">{item.key}</td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          {item.photo && (
                            <img src={item.photo} alt={item.title} className="w-6 h-6 rounded object-cover border border-slate-200 shrink-0" />
                          )}
                          <div className="font-semibold text-slate-800 text-xs">{item.title}</div>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-slate-500 max-w-xs truncate text-[11px]">{item.bio || '-'}</td>
                      <td className="px-4 py-2 text-[11px]">
                        <a href={`/${item.key}`} target="_blank" rel="noreferrer" className="text-slate-500 hover:underline hover:text-slate-900 flex items-center gap-0.5">
                          Buka <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      </td>
                      <td className="px-4 py-2 text-right space-x-1 whitespace-nowrap">
                        <button onClick={() => openEditDialog(item)} className="p-1 text-slate-400 hover:text-slate-950 hover:bg-slate-100 rounded cursor-pointer transition-all">
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => handleDelete(item.key)} className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer transition-all">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {/* Static Pages rows */}
                  {activeTab === 'static_pages' && paginatedItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-2 font-semibold text-slate-800 text-xs">{item.title}</td>
                      <td className="px-4 py-2 font-mono text-slate-500 text-[11px]">{item.slug}</td>
                      <td className="px-4 py-2 font-mono font-bold text-slate-500 text-[11px]">{item.profile_key}</td>
                      <td className="px-4 py-2 text-[11px]">
                        <a href={item.profile_key === 'fsh' ? `/${item.slug}` : `/${item.profile_key}/${item.slug}`} target="_blank" rel="noreferrer" className="text-slate-500 hover:underline hover:text-slate-900 flex items-center gap-0.5">
                          Buka <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      </td>
                      <td className="px-4 py-2 text-right space-x-1 whitespace-nowrap">
                        <button onClick={() => openEditDialog(item)} className="p-1 text-slate-400 hover:text-slate-950 hover:bg-slate-100 rounded cursor-pointer transition-all">
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer transition-all">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {/* Twibbon campaigns rows */}
                  {activeTab === 'twibbon' && paginatedItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-2 font-semibold text-slate-800 text-xs">{item.title}</td>
                      <td className="px-4 py-2 font-mono text-slate-500 text-[11px]">{item.slug}</td>
                      <td className="px-4 py-2 font-mono text-slate-400 max-w-xs truncate text-[11px]">{item.frame_url}</td>
                      <td className="px-4 py-2 text-[11px]">
                        <a href={`/twibbon/${item.slug}`} target="_blank" rel="noreferrer" className="text-slate-500 hover:underline hover:text-slate-900 flex items-center gap-0.5">
                          Buka <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      </td>
                      <td className="px-4 py-2 text-right space-x-1 whitespace-nowrap">
                        <button onClick={() => openEditDialog(item)} className="p-1 text-slate-400 hover:text-slate-950 hover:bg-slate-100 rounded cursor-pointer transition-all">
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer transition-all">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination Footer */}
              {totalPages > 1 && (
                <div className="p-3 border-t border-slate-200/60 flex items-center justify-between bg-[#F8FAFC]/50 text-[11px] text-slate-500 shrink-0 font-medium select-none">
                  <div>
                    Menampilkan <span className="font-bold text-slate-800">{(currentPage - 1) * itemsPerPage + 1}</span> sampai <span className="font-bold text-slate-800">{Math.min(filteredItems.length, currentPage * itemsPerPage)}</span> dari <span className="font-bold text-slate-800">{filteredItems.length}</span> data
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className="text-[11px] font-bold text-slate-600 hover:text-slate-900 disabled:text-slate-350 disabled:cursor-not-allowed cursor-pointer transition-colors active:scale-[0.98]"
                    >
                      &larr; Previous
                    </button>
                    <span className="font-semibold text-slate-500">Halaman {currentPage} dari {totalPages}</span>
                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className="text-[11px] font-bold text-slate-600 hover:text-slate-900 disabled:text-slate-350 disabled:cursor-not-allowed cursor-pointer transition-colors active:scale-[0.98]"
                    >
                      Next &rarr;
                    </button>
                  </div>
                </div>
              )}
              </>
            )}
          </div>
        </div>
      )}
      </main>

      {/* Live Preview Panel (Visible on lg viewports and up) */}
      {selectedProfile && (
        <aside className="hidden lg:flex w-[380px] bg-slate-50 border-l border-slate-200 flex-col p-6 items-center justify-start shrink-0 h-screen sticky top-0">
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Preview</span>
            <button
              onClick={() => setIframeKey(k => k + 1)}
              className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-lg shadow-sm transition-all cursor-pointer font-medium"
            >
              <span>🔄</span> Refresh Preview
            </button>
          </div>
          
          {/* Browser-style Viewport Wrapper */}
          <div className="w-full max-w-[340px] flex-1 min-h-0 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden flex flex-col relative">
            {/* Browser Header Bar */}
            <div className="bg-slate-100/80 border-b border-slate-200 px-4 py-3 flex items-center gap-3 shrink-0">
              {/* Window Controls */}
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FF5F56]"></span>
                <span className="w-2 h-2 rounded-full bg-[#FFBD2E]"></span>
                <span className="w-2 h-2 rounded-full bg-[#27C93F]"></span>
              </div>
              {/* Mock Address Bar */}
              <div className="flex-1 bg-white border border-slate-200/60 rounded-lg py-1 px-2.5 flex items-center gap-1.5 text-[9px] text-slate-400 font-mono truncate select-all">
                <span>🔒</span>
                <span className="text-slate-600 font-medium">lifeatfsh.uinsgd.ac.id</span>
                <span className="text-slate-400">/{selectedProfile === 'fsh' ? '' : selectedProfile}</span>
              </div>
            </div>

            <iframe
              key={iframeKey}
              src={selectedProfile === 'fsh' ? `/?key=${iframeKey}` : `/${selectedProfile}/?key=${iframeKey}`}
              className="w-full h-full border-none bg-slate-50"
              title="Live Linktree Preview"
            />
          </div>
        </aside>
      )}
    </div>

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 right-4 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-800 animate-slide-in text-sm z-50">
          {toast.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Dynamic Dialog Modal (Shadcn-inspired Card overlay) */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-zoom-in max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {dialogMode === 'add' ? 'Tambah Data Baru' : 'Edit Data'}
              </h3>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-semibold p-1 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Form 1: Links management inputs */}
              {activeTab === 'links' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Judul Link</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Formulir Pendaftaran Ujian Komprehensif"
                      value={linkTitle}
                      onChange={(e) => setLinkTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white transition-all text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">URL Link</label>
                    <input
                      type="text"
                      required
                      placeholder="https://docs.google.com/forms/..."
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white transition-all text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Kategori Accordion</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Informasi & Layanan TU / Beasiswa"
                      value={linkCategory}
                      onChange={(e) => setLinkCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white transition-all text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Deskripsi Singkat (Optional)</label>
                    <textarea
                      placeholder="Contoh: Pendaftaran dibuka s/d tanggal 20 Februari"
                      value={linkDescription}
                      onChange={(e) => setLinkDescription(e.target.value)}
                      maxLength={120}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white transition-all text-xs min-h-[60px]"
                    />
                    <div className="text-[9px] text-slate-400 text-right">{linkDescription.length}/120 karakter</div>
                  </div>
                </>
              )}

              {/* Form 2: Fakultas Directory inputs */}
              {activeTab === 'fakultas' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Nama Lembaga</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Media Center - Fakultas Syariah"
                      value={fakName}
                      onChange={(e) => setFakName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">URL Foto/Logo</label>
                    <input
                      type="text"
                      placeholder="https://fsh.uinsgd.ac.id/wp-content/...webp"
                      value={fakPhoto}
                      onChange={(e) => setFakPhoto(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Deskripsi Lembaga</label>
                    <textarea
                      placeholder="Penjelasan singkat tugas atau peran lembaga..."
                      value={fakDescription}
                      onChange={(e) => setFakDescription(e.target.value)}
                      maxLength={200}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white text-xs min-h-[60px]"
                    />
                    <div className="text-[8px] text-slate-400 text-right">{fakDescription.length}/200 karakter</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Nomor Whatsapp</label>
                      <input
                        type="text"
                        placeholder="Contoh: +628953000900"
                        value={fakWhatsapp}
                        onChange={(e) => setFakWhatsapp(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Label Penerima WA</label>
                      <input
                        type="text"
                        placeholder="Contoh: Bu Dea"
                        value={fakWhatsappLabel}
                        onChange={(e) => setFakWhatsappLabel(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500 text-xs"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Link Instagram (Full URL)</label>
                    <input
                      type="text"
                      placeholder="https://instagram.com/..."
                      value={fakInstagram}
                      onChange={(e) => setFakInstagram(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Link Website (Full URL)</label>
                    <input
                      type="text"
                      placeholder="https://tufsh.uinsgd.ac.id/"
                      value={fakWeb}
                      onChange={(e) => setFakWeb(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Link Group WhatsApp Angkatan</label>
                    <input
                      type="text"
                      placeholder="https://chat.whatsapp.com/..."
                      value={fakGroupWa}
                      onChange={(e) => setFakGroupWa(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500 text-xs"
                    />
                  </div>
                </>
              )}

              {/* Form 3: Prodi Directory inputs */}
              {activeTab === 'prodi' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Nama Program Studi</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Hukum Pidana Islam (Jinayah)"
                      value={proName}
                      onChange={(e) => setProName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500 text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Akreditasi</label>
                      <input
                        type="text"
                        placeholder="Contoh: Unggul / A"
                        value={proStatus}
                        onChange={(e) => setProStatus(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Routing Link</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: /hpi"
                        value={proLink}
                        onChange={(e) => setProLink(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500 text-xs"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Link Instagram (Full URL)</label>
                    <input
                      type="text"
                      placeholder="https://instagram.com/..."
                      value={proInstagram}
                      onChange={(e) => setProInstagram(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Link Website (Full URL)</label>
                    <input
                      type="text"
                      placeholder="https://hpi.uinsgd.ac.id/"
                      value={proWeb}
                      onChange={(e) => setProWeb(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500 text-xs"
                    />
                  </div>
                </>
              )}

              {/* Form 4: HMJ Directory inputs */}
              {activeTab === 'hmj' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Nama Organisasi (HMJ)</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: HMJ - Hukum Keluarga"
                      value={hmjName}
                      onChange={(e) => setHmjName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500 text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Ketua / Contact Person</label>
                      <input
                        type="text"
                        placeholder="Contoh: Raihan"
                        value={hmjCp}
                        onChange={(e) => setHmjCp(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">No WhatsApp CP</label>
                      <input
                        type="text"
                        placeholder="Contoh: +6282124396365"
                        value={hmjWhatsapp}
                        onChange={(e) => setHmjWhatsapp(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500 text-xs"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Link Instagram (Full URL)</label>
                    <input
                      type="text"
                      placeholder="https://instagram.com/..."
                      value={hmjInstagram}
                      onChange={(e) => setHmjInstagram(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Formulir / Link Group WA Maba</label>
                    <input
                      type="text"
                      placeholder="https://docs.google.com/forms/..."
                      value={hmjGroupLink}
                      onChange={(e) => setHmjGroupLink(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500 text-xs"
                    />
                  </div>
                </>
              )}

              {/* Form 5: Profiles management inputs */}
              {activeTab === 'profiles' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">ID Halaman (Key / Slug)</label>
                    <input
                      type="text"
                      required
                      disabled={dialogMode === 'edit'}
                      placeholder="Contoh: hk, hes, ih"
                      value={profileKey}
                      onChange={(e) => setProfileKey(normalizeSlug(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white transition-all text-xs disabled:bg-slate-100 disabled:cursor-not-allowed"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Alamat url halaman Anda akan menjadi: <code>https://lifeatfsh.uinsgd.ac.id/{profileKey || 'slug'}</code></p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Judul Halaman / Nama Lembaga</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Lembaga Penjaminan Mutu"
                      value={profileTitle}
                      onChange={(e) => setProfileTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white transition-all text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Deskripsi / Bio Singkat</label>
                    <textarea
                      placeholder="Contoh: Layanan penjaminan mutu fakultas..."
                      value={profileBio}
                      onChange={(e) => setProfileBio(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white transition-all text-xs min-h-[60px]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">URL Gambar Logo / Photo</label>
                    <input
                      type="text"
                      placeholder="https://ik.imagekit.io/..."
                      value={profilePhoto}
                      onChange={(e) => setProfilePhoto(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white transition-all text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Background Color (Hex/CSS)</label>
                      <input
                        type="text"
                        placeholder="Contoh: #F5F5F5"
                        value={profileBgColor}
                        onChange={(e) => setProfileBgColor(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white transition-all text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">URL Gambar Banner</label>
                      <input
                        type="text"
                        placeholder="https://ik.imagekit.io/..."
                        value={profileUrlBanner}
                        onChange={(e) => setProfileUrlBanner(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white transition-all text-xs"
                      />
                    </div>
                  </div>

                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-2 border-t border-slate-100">Media Sosial & Kontak</div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Website Resmi</label>
                      <input
                        type="text"
                        placeholder="https://lpm.uinsgd.ac.id"
                        value={profileSocialWeb}
                        onChange={(e) => setProfileSocialWeb(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white transition-all text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Instagram URL</label>
                      <input
                        type="text"
                        placeholder="https://instagram.com/lpm.uinsgd"
                        value={profileSocialInstagram}
                        onChange={(e) => setProfileSocialInstagram(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white transition-all text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Facebook URL</label>
                      <input
                        type="text"
                        placeholder="https://facebook.com/lpm.uinsgd"
                        value={profileSocialFacebook}
                        onChange={(e) => setProfileSocialFacebook(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white transition-all text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Email Resmi</label>
                      <input
                        type="email"
                        placeholder="lpm@uinsgd.ac.id"
                        value={profileSocialEmail}
                        onChange={(e) => setProfileSocialEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white transition-all text-xs"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Form 6: Static Pages inputs */}
              {activeTab === 'static_pages' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Judul Halaman</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Panduan Mengisi KRS"
                        value={pageTitle}
                        onChange={(e) => setPageTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white transition-all text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Slug URL (ID Unik)</label>
                      <input
                        type="text"
                        required
                        disabled={dialogMode === 'edit'}
                        placeholder="Contoh: panduan-krs"
                        value={pageSlug}
                        onChange={(e) => setPageSlug(normalizeSlug(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white transition-all text-xs disabled:bg-slate-100 disabled:cursor-not-allowed"
                      />
                      <p className="text-[9px] text-slate-400 mt-0.5">Alamat: <code>/{pageProfileKey || 'profil'}/{pageSlug || 'slug'}</code></p>
                    </div>
                  </div>

                  {operator.role === 'admin' && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Lingkup Halaman (Profil/Prodi)</label>
                      <select
                        value={pageProfileKey}
                        onChange={(e) => setPageProfileKey(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white text-xs"
                      >
                        {profiles.map(p => (
                          <option key={p.key} value={p.key}>{p.title}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Konten Halaman (Styling Teks)</label>
                    <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 focus-within:bg-white focus-within:border-rose-500 transition-all">
                      {/* Editor Toolbar */}
                      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-100/80 border-b border-slate-200/80">
                        <button
                          type="button"
                          onClick={() => document.execCommand('bold', false)}
                          className="px-2 py-1 text-xs font-bold rounded hover:bg-slate-200 text-slate-700 cursor-pointer active:scale-95 transition-all"
                          title="Tebal (Bold)"
                        >
                          B
                        </button>
                        <button
                          type="button"
                          onClick={() => document.execCommand('italic', false)}
                          className="px-2 py-1 text-xs italic rounded hover:bg-slate-200 text-slate-700 cursor-pointer active:scale-95 transition-all"
                          title="Miring (Italic)"
                        >
                          I
                        </button>
                        <button
                          type="button"
                          onClick={() => document.execCommand('underline', false)}
                          className="px-2 py-1 text-xs underline rounded hover:bg-slate-200 text-slate-700 cursor-pointer active:scale-95 transition-all"
                          title="Garis Bawah (Underline)"
                        >
                          U
                        </button>
                        <div className="h-4 w-[1px] bg-slate-300 mx-1"></div>
                        <button
                          type="button"
                          onClick={() => document.execCommand('insertUnorderedList', false)}
                          className="px-2 py-1 text-xs rounded hover:bg-slate-200 text-slate-700 cursor-pointer active:scale-95 transition-all"
                          title="Daftar Bullet"
                        >
                          • List
                        </button>
                        <button
                          type="button"
                          onClick={() => document.execCommand('insertOrderedList', false)}
                          className="px-2 py-1 text-xs rounded hover:bg-slate-200 text-slate-700 cursor-pointer active:scale-95 transition-all"
                          title="Daftar Nomor"
                        >
                          1. List
                        </button>
                        <div className="h-4 w-[1px] bg-slate-300 mx-1"></div>
                        <button
                          type="button"
                          onClick={() => {
                            const size = prompt('Masukkan ukuran heading (1 untuk Judul Besar, 2 untuk Subjudul, 3 untuk Biasa):', '2');
                            if (size) document.execCommand('formatBlock', false, `<h${size}>`);
                          }}
                          className="px-2 py-1 text-xs font-semibold rounded hover:bg-slate-200 text-slate-700 cursor-pointer active:scale-95 transition-all"
                          title="Judul / Heading"
                        >
                          H
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const url = prompt('Masukkan URL Link:');
                            if (url) document.execCommand('createLink', false, url);
                          }}
                          className="px-2 py-1 text-xs text-rose-600 font-semibold rounded hover:bg-slate-200 cursor-pointer active:scale-95 transition-all"
                          title="Sematkan Link"
                        >
                          Link
                        </button>
                        <button
                          type="button"
                          onClick={() => document.execCommand('removeFormat', false)}
                          className="px-2 py-1 text-xs text-slate-400 rounded hover:bg-slate-200 cursor-pointer active:scale-95 transition-all"
                          title="Hapus Format"
                        >
                          Clear
                        </button>
                      </div>
                      
                      {/* Editor Textarea (contentEditable) */}
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        onInput={(e) => setPageContent(e.currentTarget.innerHTML)}
                        ref={(el) => {
                          if (el && el.innerHTML !== pageContent) {
                            el.innerHTML = pageContent;
                          }
                        }}
                        className="w-full p-4 text-xs min-h-[220px] max-h-[400px] overflow-y-auto outline-none prose prose-slate max-w-none text-slate-900 bg-white"
                        placeholder="Ketik konten halaman di sini, gunakan toolbar di atas untuk styling..."
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Gunakan tombol-tombol di toolbar atas untuk menebalkan teks, membuat daftar, atau menambahkan link.</p>
                  </div>
                </>
              )}

              {/* Form 7: Twibbon campaigns inputs */}
              {activeTab === 'twibbon' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Judul Kampanye</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Twibbon Maba FSH 2026"
                        value={campaignTitle}
                        onChange={(e) => setCampaignTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white transition-all text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Slug URL (ID Unik)</label>
                      <input
                        type="text"
                        required
                        disabled={dialogMode === 'edit'}
                        placeholder="Contoh: maba-fsh-2026"
                        value={campaignSlug}
                        onChange={(e) => setCampaignSlug(normalizeSlug(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white transition-all text-xs disabled:bg-slate-100 disabled:cursor-not-allowed"
                      />
                      <p className="text-[9px] text-slate-400 mt-0.5">Alamat: <code>/twibbon/{campaignSlug || 'slug'}</code></p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Frame PNG URL (Harus Transparan)</label>
                    <input
                      type="url"
                      required
                      placeholder="Contoh: https://imgbb.com/frame.png"
                      value={campaignFrameUrl}
                      onChange={(e) => setCampaignFrameUrl(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white transition-all text-xs"
                    />
                    <p className="text-[9px] text-slate-400 mt-0.5">Upload bingkai PNG transparan Anda ke layanan hosting gambar gratis (seperti ImgBB/ImageKit) lalu tempel link langsungnya di sini.</p>
                  </div>

                  {operator.role === 'admin' && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Lingkup Kampanye (Profil/Prodi)</label>
                      <select
                        value={campaignProfileKey}
                        onChange={(e) => setCampaignProfileKey(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white text-xs"
                      >
                        {profiles.map(p => (
                          <option key={p.key} value={p.key}>{p.title}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Deskripsi / Petunjuk Kampanye</label>
                    <textarea
                      placeholder="Contoh: Ayo ramaikan dengan memakai bingkai foto resmi dan posting di medsos..."
                      value={campaignDescription}
                      onChange={(e) => setCampaignDescription(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white transition-all text-xs h-20 outline-none resize-none"
                    />
                  </div>
                </>
              )}

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold cursor-pointer hover:bg-slate-50 active:scale-[0.98] transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={dataLoading}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs cursor-pointer shadow-sm hover:shadow transition-all flex items-center gap-1.5 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  {dataLoading && <Loader2 className="h-3 w-3 animate-spin" />}
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
