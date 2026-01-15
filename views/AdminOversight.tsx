
import React, { useState, useRef, useMemo, useCallback } from 'react';
import { AppRole } from '../types';

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  joinedDate: string;
  avatar: string;
}

const ADMIN_STATS = [
  { label: 'Marketplace GMV', value: '$1,248,390', change: '+12.5%', icon: 'payments', color: 'bg-blue-50 text-blue-600' },
  { label: 'Platform Fees', value: '$84,512', change: '+8.2%', icon: 'account_balance_wallet', color: 'bg-emerald-50 text-emerald-600' },
  { label: 'Active Sellers', value: '1,240', change: '+5.1%', icon: 'groups', color: 'bg-indigo-50 text-indigo-600' },
  { label: 'New Signups', value: '48', change: '+15.3%', icon: 'person_add', color: 'bg-amber-50 text-amber-600' },
];

const INITIAL_USERS: ManagedUser[] = [
  { id: 'USR-101', name: 'Alex Rivera', email: 'alex@marketflow.io', role: 'buyer', joinedDate: 'Jan 12, 2024', avatar: 'https://picsum.photos/seed/alex/100/100' },
  { id: 'USR-102', name: 'Jordan Smith', email: 'jordan.s@creators.com', role: 'seller', joinedDate: 'Feb 05, 2024', avatar: 'https://picsum.photos/seed/jordan/100/100' },
  { id: 'USR-103', name: 'Elena Rodriguez', email: 'elena@admin.flow', role: 'admin', joinedDate: 'Nov 22, 2023', avatar: 'https://picsum.photos/seed/elena/100/100' },
  { id: 'USR-104', name: 'Marcus Chen', email: 'marcus@designlabs.net', role: 'seller', joinedDate: 'Mar 15, 2024', avatar: 'https://picsum.photos/seed/marcus/100/100' },
  { id: 'USR-105', name: 'Sarah Blake', email: 's.blake@freelance.org', role: 'buyer', joinedDate: 'Apr 02, 2024', avatar: 'https://picsum.photos/seed/sarah/100/100' },
];

const ROLE_UI_CONFIG: Record<AppRole, { classes: string; icon: string }> = {
  admin: { 
    classes: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50', 
    icon: 'shield_person' 
  },
  seller: { 
    classes: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-amber-800/50', 
    icon: 'store' 
  },
  buyer: { 
    classes: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50', 
    icon: 'person' 
  },
};

const AdminOversight: React.FC = () => {
  const [managedUsers, setManagedUsers] = useState<ManagedUser[]>(INITIAL_USERS);
  const [avatarUserToEdit, setAvatarUserToEdit] = useState<ManagedUser | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [userToDelete, setUserToDelete] = useState<ManagedUser | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    role: 'buyer' as AppRole
  });

  const handleRoleChange = (userId: string, newRole: AppRole) => {
    setManagedUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const openAvatarModal = (user: ManagedUser) => {
    setAvatarUserToEdit(user);
    setPreviewAvatar(null);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }, []);

  const saveAvatar = () => {
    if (avatarUserToEdit && previewAvatar) {
      setManagedUsers(prev => prev.map(user => 
        user.id === avatarUserToEdit.id ? { ...user, avatar: previewAvatar } : user
      ));
      setAvatarUserToEdit(null);
      setPreviewAvatar(null);
    }
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email) return;

    const newUser: ManagedUser = {
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      name: newUserForm.name,
      email: newUserForm.email,
      role: newUserForm.role,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      avatar: `https://picsum.photos/seed/${newUserForm.name.split(' ')[0].toLowerCase()}/100/100`
    };

    setManagedUsers([newUser, ...managedUsers]);
    setIsCreateModalOpen(false);
    setNewUserForm({ name: '', email: '', role: 'buyer' });
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      setManagedUsers(prev => prev.filter(u => u.id !== userToDelete.id));
      setUserToDelete(null);
    }
  };

  const filteredUsers = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return managedUsers.filter(user => 
      user.name.toLowerCase().includes(lowerSearch) ||
      user.email.toLowerCase().includes(lowerSearch) ||
      user.role.toLowerCase().includes(lowerSearch) ||
      user.id.toLowerCase().includes(lowerSearch)
    );
  }, [managedUsers, searchTerm]);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-background-dark p-8 pb-32">
      <div className="max-w-[1440px] mx-auto space-y-10">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Ecosystem Health</h2>
            <p className="text-slate-500 font-bold text-base">Monitoring platform-wide performance metrics and user permissions.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-primary text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-primary-dark transition-all shadow-xl shadow-primary/30"
            >
              <span className="material-symbols-outlined text-lg">person_add</span>
              Create User
            </button>
            <button className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-sm transition-all hover:bg-slate-50">
              <span className="material-symbols-outlined text-lg">download</span>
              Export Report
            </button>
          </div>
        </header>

        {/* Admin Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ADMIN_STATS.map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:scale-[1.02] hover:shadow-xl group">
              <div className="flex justify-between items-start mb-6">
                <div className={`size-12 rounded-2xl ${stat.color} flex items-center justify-center shadow-inner`}>
                  <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-emerald-500 text-xs font-black flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-sm leading-none">trending_up</span>
                    {stat.change}
                  </span>
                  <span className="text-[10px] font-black text-slate-300 uppercase mt-1">Growth</span>
                </div>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* User Access & Permissions Management Section */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-10 py-8 border-b border-slate-50 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">User Access & Permissions</h3>
              <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">Global role management and account verification</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                <input 
                  type="text" 
                  placeholder="Search name, email, or role..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm w-full sm:w-72 focus:ring-2 focus:ring-primary"
                />
              </div>
              <button 
                onClick={() => setSearchTerm('')}
                className={`size-11 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center transition-colors ${searchTerm ? 'text-primary' : 'text-slate-400'}`}
              >
                <span className="material-symbols-outlined">{searchTerm ? 'close' : 'filter_list'}</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 dark:bg-slate-800/30">
                <tr>
                  <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Platform Participant</th>
                  <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Verification Status</th>
                  <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Authorized Role</th>
                  <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Access Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.length > 0 ? filteredUsers.map((user) => {
                  const uiConfig = ROLE_UI_CONFIG[user.role];
                  return (
                    <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all group">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          {/* Avatar with New Intuitive Click Interaction */}
                          <div 
                            className="relative flex-shrink-0 group/avatar cursor-pointer" 
                            onClick={() => openAvatarModal(user)}
                            title="Update Profile Photo"
                          >
                            <div className="size-16 rounded-2xl overflow-hidden border-2 border-slate-100 dark:border-slate-800 transition-all group-hover/avatar:border-primary group-hover/avatar:shadow-lg group-hover/avatar:scale-105 shadow-sm">
                              <img 
                                src={user.avatar} 
                                alt={user.name} 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                            <div className="absolute inset-0 bg-primary/40 backdrop-blur-[2px] rounded-2xl opacity-0 group-hover/avatar:opacity-100 transition-all flex flex-col items-center justify-center text-white scale-90 group-hover/avatar:scale-100">
                              <span className="material-symbols-outlined text-2xl mb-1">edit_square</span>
                              <span className="text-[8px] font-black uppercase tracking-widest">Edit</span>
                            </div>
                            <div className="absolute -bottom-1 -right-1 size-6 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-md">
                              <span className="material-symbols-outlined text-[14px] text-slate-500">add_photo_alternate</span>
                            </div>
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-black text-slate-900 dark:text-white truncate">{user.name}</p>
                            <p className="text-xs font-bold text-slate-500 truncate">{user.email}</p>
                            <div className="mt-1.5 flex flex-col gap-1">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                  <span className="material-symbols-outlined text-[12px]">fingerprint</span>
                                  UID: <span className="text-slate-600 dark:text-slate-300">{user.id}</span>
                               </p>
                               <div className="flex items-center gap-3">
                                 <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase">
                                    <span className="material-symbols-outlined text-[11px]">history</span>
                                    Joined {user.joinedDate}
                                 </div>
                                 <button 
                                  onClick={() => openAvatarModal(user)}
                                  className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline transition-all"
                                 >
                                  Update Photo
                                 </button>
                               </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-2">
                           <span className="size-2 rounded-full bg-emerald-500"></span>
                           <p className="text-xs font-black text-slate-500 uppercase">Verified</p>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${uiConfig.classes}`}>
                          <span className="material-symbols-outlined text-[14px] leading-none">{uiConfig.icon}</span>
                          {user.role}
                        </div>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="flex items-center bg-slate-50 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
                            {(['buyer', 'seller', 'admin'] as AppRole[]).map((r) => (
                              <button
                                key={r}
                                onClick={() => handleRoleChange(user.id, r)}
                                disabled={user.role === r}
                                className={`size-8 rounded-xl flex items-center justify-center transition-all ${
                                  user.role === r 
                                    ? 'bg-primary text-white shadow-md' 
                                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                                }`}
                                title={`Make ${r}`}
                              >
                                <span className="material-symbols-outlined text-base">
                                  {r === 'admin' ? 'shield_person' : r === 'seller' ? 'store' : 'person'}
                                </span>
                              </button>
                            ))}
                          </div>
                          <button 
                            onClick={() => setUserToDelete(user)}
                            className="size-9 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center shadow-sm"
                            title="Delete User"
                          >
                            <span className="material-symbols-outlined text-xl">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={4} className="px-10 py-20 text-center">
                      <div className="flex flex-col items-center gap-4 text-slate-400">
                        <span className="material-symbols-outlined text-5xl">search_off</span>
                        <p className="text-sm font-bold">No participants found matching "{searchTerm}"</p>
                        <button 
                          onClick={() => setSearchTerm('')}
                          className="text-xs font-black text-primary uppercase tracking-widest hover:underline"
                        >
                          Clear Search
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-8 bg-slate-50/30 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800 flex justify-center">
             <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-all">
                View All Platform Accounts
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
          </div>
        </div>

        {/* Existing Layout Split (Seller & Disputes) */}
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Seller Performance Directory</h3>
              <button className="text-xs font-black uppercase tracking-widest text-primary hover:underline">Audited Report</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Organization</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Fee Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {[
                    { name: 'Neo Logic Systems', status: 'Connected', contribution: '$3,432.32', icon: 'NL' },
                    { name: 'Vivid Ventures', status: 'Pending', contribution: '$1,457.64', icon: 'VV' },
                    { name: 'Alpha Tech Lab', status: 'Connected', contribution: '$8,192.00', icon: 'AT' },
                    { name: 'Key Peak Solutions', status: 'Connected', contribution: '$464.00', icon: 'KP' },
                  ].map((seller) => (
                    <tr key={seller.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="size-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-black text-slate-400">{seller.icon}</div>
                          <span className="text-sm font-black text-slate-900 dark:text-white">{seller.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          seller.status === 'Connected' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          <span className={`size-1.5 rounded-full ${seller.status === 'Connected' ? 'bg-blue-500' : 'bg-amber-500'}`}></span>
                          {seller.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right font-black text-primary text-sm">{seller.contribution}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
            <div className="bg-primary dark:bg-primary/20 p-8 rounded-[2rem] text-white shadow-2xl shadow-primary/30 relative overflow-hidden group">
              <span className="material-symbols-outlined absolute -bottom-8 -right-8 text-[120px] opacity-10 transition-transform group-hover:scale-110 group-hover:-rotate-12">priority_high</span>
              <h3 className="text-2xl font-black mb-2">Attention Needed</h3>
              <p className="text-blue-100 font-bold text-sm mb-6 leading-relaxed">
                There are 5 high-priority disputes that require oversight before the 24-hour resolution window expires.
              </p>
              <button className="w-full h-12 bg-white text-primary rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-colors shadow-xl">
                Resolve Disputes Now
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-6">
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Subscription Distribution</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    <span>Enterprise (142)</span>
                    <span className="text-slate-900 dark:text-white">45%</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '45%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    <span>Pro (298)</span>
                    <span className="text-slate-900 dark:text-white">32%</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400" style={{ width: '32%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Management Modal with Drag and Drop */}
      {avatarUserToEdit && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in" onClick={() => setAvatarUserToEdit(null)}></div>
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white">Update Identity Photo</h3>
                  <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">Global Profile Avatar for {avatarUserToEdit.name}</p>
                </div>
                <button onClick={() => setAvatarUserToEdit(null)} className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center hover:text-slate-600">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-shrink-0 text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Current Version</p>
                  <div className="size-32 rounded-[2rem] overflow-hidden border-4 border-slate-100 dark:border-slate-800 shadow-inner">
                    <img src={avatarUserToEdit.avatar} className="w-full h-full object-cover" alt="Current" />
                  </div>
                </div>

                <div className="flex-1 w-full space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">New Upload</p>
                  <div 
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative h-32 rounded-[2rem] border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden ${
                      isDragging ? 'bg-primary/5 border-primary' : previewAvatar ? 'border-primary' : 'border-slate-200 dark:border-slate-800 hover:border-primary/50 bg-slate-50 dark:bg-slate-800/50'
                    }`}
                  >
                    {previewAvatar ? (
                      <img src={previewAvatar} alt="Preview" className="w-full h-full object-cover animate-in fade-in duration-500" />
                    ) : (
                      <div className="text-center p-4">
                        <span className="material-symbols-outlined text-3xl text-primary mb-2 animate-bounce">upload_file</span>
                        <p className="text-xs font-black text-slate-600 dark:text-slate-300">Drop image here or click</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">PNG, JPG, WEBP</p>
                      </div>
                    )}
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleAvatarFileChange}
                    />
                  </div>
                  {previewAvatar && (
                    <button 
                      onClick={() => setPreviewAvatar(null)}
                      className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline block mx-auto"
                    >
                      Clear Selection
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 flex gap-4">
                <button 
                  onClick={() => setAvatarUserToEdit(null)}
                  className="flex-1 h-14 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  Discard Changes
                </button>
                <button 
                  disabled={!previewAvatar}
                  onClick={saveAvatar}
                  className="flex-1 h-14 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:brightness-110 transition-all disabled:opacity-30 flex items-center justify-center gap-2"
                >
                  Commit New Photo
                  <span className="material-symbols-outlined text-lg">verified</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setIsCreateModalOpen(false)}></div>
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white">New User Account</h3>
                  <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">Configure platform identity</p>
                </div>
                <button onClick={() => setIsCreateModalOpen(false)} className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center hover:text-slate-600">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Full Legal Name</label>
                  <input 
                    type="text" 
                    required
                    value={newUserForm.name}
                    onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                    placeholder="e.g. Jonathan Ive"
                    className="w-full px-5 py-4 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary transition-all text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    placeholder="jonathan@apple.com"
                    className="w-full px-5 py-4 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary transition-all text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Initial Authorized Role</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['buyer', 'seller', 'admin'] as AppRole[]).map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setNewUserForm({ ...newUserForm, role })}
                        className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all flex flex-col items-center justify-center gap-2 ${
                          newUserForm.role === role 
                            ? 'bg-primary border-primary text-white shadow-lg' 
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                        }`}
                      >
                        <span className="material-symbols-outlined text-xl">
                          {role === 'admin' ? 'shield_person' : role === 'seller' ? 'store' : 'person'}
                        </span>
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    className="w-full h-14 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                  >
                    Generate Account
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm animate-in fade-in" onClick={() => setUserToDelete(null)}></div>
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-10 text-center">
              <div className="size-20 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <span className="material-symbols-outlined text-4xl">warning</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Permanent Removal</h3>
              <p className="text-sm font-bold text-slate-500 leading-relaxed mb-8">
                Are you absolutely sure you want to delete <span className="text-slate-900 dark:text-white font-black">{userToDelete.name}</span>? 
                This action is irreversible and will purge all associated platform data.
              </p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={confirmDeleteUser}
                  className="w-full h-14 bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl shadow-red-500/20"
                >
                  Confirm Permanent Delete
                </button>
                <button 
                  onClick={() => setUserToDelete(null)}
                  className="w-full h-14 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOversight;
