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
  Users
} from 'lucide-react';

export default function App() {
  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [operator, setOperator] = useState(null); // { username, role, profile_key }
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // App states
  const [activeTab, setActiveTab] = useState('links'); // 'links', 'fakultas', 'prodi', 'hmj'
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(''); // Current profile key being managed
  
  // Data lists
  const [links, setLinks] = useState([]);
  const [dirFakultas, setDirFakultas] = useState([]);
  const [dirProdi, setDirProdi] = useState([]);
  const [dirHmj, setDirHmj] = useState([]);
  
  // UX states
  const [searchQuery, setSearchQuery] = useState('');
  const [dataLoading, setDataLoading] = useState(false);
  const [toast, setToast] = useState(null);

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

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  // ==========================================
  // API SERVICE CALLS
  // ==========================================

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('key, title')
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
      }

      setIsDialogOpen(false);
      fetchData();
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
      }

      showToast('success', 'Data berhasil dihapus.');
      fetchData();
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
    }
    return [];
  };

  const filteredItems = getFilteredItems();

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
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 font-sans selection:bg-rose-500 selection:text-white">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-950 text-slate-100 flex flex-col border-r border-slate-900 shrink-0">
        <div className="p-6 border-b border-slate-900">
          <div className="font-bold text-base tracking-tight text-white">FSH Linktree CMS</div>
          <div className="text-xs text-rose-400 mt-1 uppercase font-semibold tracking-wider">
            {operator.role === 'admin' ? 'Fakultas Admin' : `HMJ : ${operator.profile_key.toUpperCase()}`}
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5">
          <button
            onClick={() => setActiveTab('links')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'links'
                ? 'bg-rose-600/10 text-rose-400 border-l-4 border-rose-500 pl-3'
                : 'hover:bg-slate-900 text-slate-400 hover:text-slate-100'
            }`}
          >
            <FolderOpen className="h-4 w-4" />
            Links Jurusan / Fakultas
          </button>

          {/* Directory management tabs only available for admin */}
          {operator.role === 'admin' && (
            <>
              <div className="text-slate-600 text-xs font-semibold px-4 pt-4 pb-2 uppercase tracking-wider block">Direktori Maba</div>
              <button
                onClick={() => setActiveTab('fakultas')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'fakultas'
                    ? 'bg-rose-600/10 text-rose-400 border-l-4 border-rose-500 pl-3'
                    : 'hover:bg-slate-900 text-slate-400 hover:text-slate-100'
                }`}
              >
                <Building className="h-4 w-4" />
                Lembaga & TU
              </button>

              <button
                onClick={() => setActiveTab('prodi')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'prodi'
                    ? 'bg-rose-600/10 text-rose-400 border-l-4 border-rose-500 pl-3'
                    : 'hover:bg-slate-900 text-slate-400 hover:text-slate-100'
                }`}
              >
                <GraduationCap className="h-4 w-4" />
                S1 Program Studi
              </button>

              <button
                onClick={() => setActiveTab('hmj')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'hmj'
                    ? 'bg-rose-600/10 text-rose-400 border-l-4 border-rose-500 pl-3'
                    : 'hover:bg-slate-900 text-slate-400 hover:text-slate-100'
                }`}
              >
                <Users className="h-4 w-4" />
                Himpunan Mahasiswa
              </button>
            </>
          )}
        </nav>

        {/* User profile footer */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-8 w-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-rose-400 shrink-0 font-bold uppercase text-xs">
              {operator.username[0]}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-slate-200 truncate">{operator.username}</div>
              <div className="text-[10px] text-slate-500 truncate">{operator.role}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Keluar"
            className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
        {/* Top Header Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {activeTab === 'links' && 'Manajemen Linktree'}
              {activeTab === 'fakultas' && 'Direktori Lembaga & TU'}
              {activeTab === 'prodi' && 'Direktori Program Studi S1'}
              {activeTab === 'hmj' && 'Direktori Himpunan Mahasiswa'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {activeTab === 'links' && 'Kelola daftar tautan eksternal dan beasiswa pada masing-masing profile prodi.'}
              {activeTab === 'fakultas' && 'Kelola daftar lembaga, nomor helpdesk, dan link grup angkatan maba fakultas.'}
              {activeTab === 'prodi' && 'Kelola info website prodi dan akreditasi prodi.'}
              {activeTab === 'hmj' && 'Kelola kontak ketua himpunan dan formulir grup Whatsapp maba.'}
            </p>
          </div>

          <button
            onClick={openAddDialog}
            className="self-start sm:self-center px-4 py-2.5 bg-[#E0004D] hover:bg-[#c20042] text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-rose-500/5 hover:shadow-rose-500/10 cursor-pointer active:scale-95 transition-all"
          >
            <Plus className="h-3.5 w-3.5 stroke-[3]" />
            Tambah Data
          </button>
        </div>

        {/* Data Filter Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
            <div className="flex flex-wrap items-center gap-3">
              {/* Profile dropdown selector for links tab */}
              {activeTab === 'links' && (
                <div className="flex items-center gap-2">
                  <ListFilter className="h-4 w-4 text-slate-400" />
                  <select
                    value={selectedProfile}
                    onChange={(e) => setSelectedProfile(e.target.value)}
                    disabled={operator.role === 'prodi'}
                    className="bg-white border border-slate-200 rounded-lg text-xs py-1.5 px-3 font-medium focus:outline-none focus:border-rose-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
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

            {/* General Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari data..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-rose-500 transition-all text-xs"
              />
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
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                    {activeTab === 'links' && (
                      <>
                        <th className="px-6 py-3.5">Urutan</th>
                        <th className="px-6 py-3.5">Judul Link</th>
                        <th className="px-6 py-3.5">Kategori</th>
                        <th className="px-6 py-3.5">Deskripsi</th>
                        <th className="px-6 py-3.5 text-right">Aksi</th>
                      </>
                    )}
                    {activeTab === 'fakultas' && (
                      <>
                        <th className="px-6 py-3.5">Nama Lembaga</th>
                        <th className="px-6 py-3.5">Helpdesk WA</th>
                        <th className="px-6 py-3.5">Instagram</th>
                        <th className="px-6 py-3.5">Group WA</th>
                        <th className="px-6 py-3.5 text-right">Aksi</th>
                      </>
                    )}
                    {activeTab === 'prodi' && (
                      <>
                        <th className="px-6 py-3.5">Nama Program Studi</th>
                        <th className="px-6 py-3.5">Akreditasi</th>
                        <th className="px-6 py-3.5">Instagram</th>
                        <th className="px-6 py-3.5">Website</th>
                        <th className="px-6 py-3.5 text-right">Aksi</th>
                      </>
                    )}
                    {activeTab === 'hmj' && (
                      <>
                        <th className="px-6 py-3.5">Nama Organisasi (HMJ)</th>
                        <th className="px-6 py-3.5">Ketua / CP</th>
                        <th className="px-6 py-3.5">No WhatsApp</th>
                        <th className="px-6 py-3.5">Form / Group WA</th>
                        <th className="px-6 py-3.5 text-right">Aksi</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {/* Links rows */}
                  {activeTab === 'links' && filteredItems.map((lnk, idx) => (
                    <tr key={lnk.id} className="hover:bg-slate-50/50 transition-all">
                      <td className="px-6 py-4 font-mono text-slate-400">{lnk.sort_order || idx + 1}</td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{lnk.title}</div>
                        <a href={lnk.url} target="_blank" className="text-[10px] text-slate-400 hover:text-rose-500 flex items-center gap-1 mt-1 truncate max-w-xs">
                          {lnk.url} <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-semibold text-[10px]">
                          {lnk.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 max-w-xs truncate">{lnk.description || '-'}</td>
                      <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                        <button onClick={() => openEditDialog(lnk)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-slate-100 rounded-lg cursor-pointer transition-all">
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => handleDelete(lnk.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-all">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {/* Fakultas rows */}
                  {activeTab === 'fakultas' && filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-all">
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-3">
                          {item.photo && (
                            <img src={item.photo} alt={item.name} className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0" />
                          )}
                          <div className="min-w-0">
                            <div className="truncate font-semibold text-slate-900">{item.name}</div>
                            {item.description && (
                              <div className="text-[10px] text-slate-400 font-normal max-w-xs truncate">{item.description}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {item.whatsapp ? (
                          <div>
                            <span className="font-medium text-slate-800">{item.whatsapp}</span>
                            <span className="text-[10px] text-slate-400 block">{item.whatsapp_label || 'CS'}</span>
                          </div>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4">
                        {item.instagram ? (
                          <a href={item.instagram} target="_blank" className="text-rose-500 hover:underline truncate max-w-[120px] block">
                            @{item.instagram.split('/').filter(Boolean).pop()}
                          </a>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate">
                        {item.group_wa ? (
                          <a href={item.group_wa} target="_blank" className="text-emerald-600 hover:underline truncate block">
                            Gabung WAG
                          </a>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                        <button onClick={() => openEditDialog(item)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-slate-100 rounded-lg cursor-pointer transition-all">
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-all">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {/* Prodi rows */}
                  {activeTab === 'prodi' && filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-all">
                      <td className="px-6 py-4 font-semibold text-slate-900">{item.name}</td>
                      <td className="px-6 py-4">
                        {item.status ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 text-[10px]">
                            {item.status}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4">
                        {item.instagram ? (
                          <a href={item.instagram} target="_blank" className="text-rose-500 hover:underline">
                            @{item.instagram.split('/').filter(Boolean).pop()}
                          </a>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4">
                        {item.web ? (
                          <a href={item.web} target="_blank" className="text-slate-400 hover:text-rose-500 flex items-center gap-1">
                            Buka Situs <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                        <button onClick={() => openEditDialog(item)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-slate-100 rounded-lg cursor-pointer transition-all">
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-all">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {/* HMJ rows */}
                  {activeTab === 'hmj' && filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-all">
                      <td className="px-6 py-4 font-semibold text-slate-900">{item.name}</td>
                      <td className="px-6 py-4 font-medium text-slate-800">{item.contact_person || '-'}</td>
                      <td className="px-6 py-4 font-mono text-slate-600">{item.whatsapp || '-'}</td>
                      <td className="px-6 py-4 max-w-xs truncate">
                        {item.group_link ? (
                          <a href={item.group_link} target="_blank" className="text-rose-500 hover:underline block truncate">
                            Formulir/Grup WAG
                          </a>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                        <button onClick={() => openEditDialog(item)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-slate-100 rounded-lg cursor-pointer transition-all">
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-all">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

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

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold cursor-pointer hover:bg-slate-50 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={dataLoading}
                  className="px-5 py-2 bg-[#E0004D] hover:bg-[#c20042] text-white font-semibold rounded-lg text-xs cursor-pointer shadow-md shadow-rose-500/5 hover:shadow-rose-500/10 transition-all flex items-center gap-1.5 disabled:opacity-70 disabled:cursor-not-allowed"
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
