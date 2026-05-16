import React, { useEffect, useState, useCallback } from 'react';
import API from '../services/api';
import { Users, Store, Star, Search, ArrowUpDown, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StatCard = ({ icon, label, value, color, delay }) => {
    const Icon = icon;
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.07] hover:border-white/[0.12] transition-all duration-300 p-6"
            style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.02) 100%)' }}
        >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle at 80% 20%, ${color}12, transparent 60%)` }} />
            <div className="relative flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl border transition-all duration-300"
                    style={{ background: `${color}15`, borderColor: `${color}25` }}>
                    <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <TrendingUp className="w-4 h-4 text-white/15" />
            </div>
            <div className="relative text-3xl font-black text-white tracking-tight">{value.toLocaleString()}</div>
            <div className="relative text-xs font-semibold uppercase tracking-widest text-white/30 mt-1">{label}</div>
        </motion.div>
    );
};

const SortTh = ({ label, field, sortField, sortOrder, handleSort }) => (
    <th className="px-6 py-5 cursor-pointer group select-none" onClick={() => handleSort(field)}>
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/30 group-hover:text-white/60 transition-colors duration-150">
            {label}
            <ArrowUpDown className={`w-3 h-3 transition-all ${sortField === field ? 'opacity-100 text-violet-400' : 'opacity-40'} ${sortField === field && sortOrder === 'desc' ? 'rotate-180' : ''}`} />
        </div>
    </th>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);
    const [activeTab, setActiveTab] = useState('USERS');
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [showUserModal, setShowUserModal] = useState(false);
    const [showStoreModal, setShowStoreModal] = useState(false);
    const [userData, setUserData] = useState({ name: '', email: '', password: '', role: 'USER', address: '' });
    const [storeData, setStoreData] = useState({ name: '', email: '', address: '', owner_id: '' });
    const [formError, setFormError] = useState('');

    const fetchData = useCallback(async () => {
        try {
            const [statsRes, usersRes, storesRes] = await Promise.all([
                API.get('/admin/stats'),
                API.get(`/admin/users?search=${search}`),
                API.get(`/admin/stores?search=${search}`)
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data);
            setStores(storesRes.data);
        } catch (err) { console.error(err); }
    }, [search]);

    useEffect(() => {
        let isMounted = true;
        const load = async () => {
            if (isMounted) await fetchData();
        };
        load();
        return () => { isMounted = false; };
    }, [fetchData]);

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await API.post('/admin/users', userData);
            setShowUserModal(false);
            setUserData({ name: '', email: '', password: '', role: 'USER', address: '' });
            fetchData();
        } catch (err) { setFormError(err.response?.data?.message || 'Failed to create user'); }
    };

    const handleCreateStore = async (e) => {
        e.preventDefault();
        try {
            await API.post('/admin/create-store', storeData);
            setShowStoreModal(false);
            setStoreData({ name: '', email: '', address: '', owner_id: '' });
            fetchData();
        } catch (err) { setFormError(err.response?.data?.message || 'Failed to create store'); }
    };

    const handleSort = (field) => {
        if (sortField === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        else { setSortField(field); setSortOrder('asc'); }
    };

    const filteredAndSortedData = (data) => {
        return [...data]
            .filter(item => {
                const s = search.toLowerCase();
                return item.name?.toLowerCase().includes(s) || 
                       item.email?.toLowerCase().includes(s) || 
                       item.address?.toLowerCase().includes(s) ||
                       (item.role?.toLowerCase() || '').includes(s);
            })
            .sort((a, b) => {
                const valA = String(a[sortField] || '').toLowerCase();
                const valB = String(b[sortField] || '').toLowerCase();
                if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
                if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
                return 0;
            });
    };



    const roleColors = {
        ADMIN: { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.25)', text: '#f87171' },
        OWNER: { bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.25)', text: '#fb923c' },
        USER: { bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.25)', text: '#818cf8' },
    };

    const inputClass = "w-full py-3 px-4 rounded-xl text-sm font-medium outline-none border border-white/[0.08] focus:border-violet-500/40 bg-white/[0.03] text-white placeholder:text-white/20";

    return (
        <div className="space-y-10 pb-20">

            {/* Page header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-8 border-b border-white/[0.06]">
                <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-[10px] font-bold uppercase tracking-widest mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                        Admin Panel
                    </div>
                    <h1 className="text-5xl font-black tracking-tight text-white">Control Center</h1>
                    <p className="text-white/35 mt-1.5 text-sm font-medium">Manage users, stores, and system data</p>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 w-full lg:w-auto lg:min-w-[420px]">
                    <StatCard icon={Users} label="Users" value={stats.totalUsers} color="#a78bfa" delay={0.05} />
                    <StatCard icon={Store} label="Stores" value={stats.totalStores} color="#60a5fa" delay={0.1} />
                    <StatCard icon={Star} label="Ratings" value={stats.totalRatings} color="#fbbf24" delay={0.15} />
                </div>
            </div>

            {/* Modal - Create User */}
            <AnimatePresence>
                {showUserModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowUserModal(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                            className="relative w-full max-w-md bg-[#161b22] border border-white/10 rounded-2xl p-8 shadow-2xl">
                            <h2 className="text-2xl font-bold mb-6 text-white">Add New User</h2>
                            {formError && <div className="mb-4 text-red-500 text-xs font-bold">{formError}</div>}
                            <form onSubmit={handleCreateUser} className="space-y-4">
                                <input className={inputClass} placeholder="Full Name" required value={userData.name} onChange={e => setUserData({...userData, name: e.target.value})} />
                                <input className={inputClass} type="email" placeholder="Email" required value={userData.email} onChange={e => setUserData({...userData, email: e.target.value})} />
                                <input className={inputClass} type="password" placeholder="Password" required value={userData.password} onChange={e => setUserData({...userData, password: e.target.value})} />
                                <input className={inputClass} placeholder="Address" required value={userData.address} onChange={e => setUserData({...userData, address: e.target.value})} />
                                <select className={inputClass} value={userData.role} onChange={e => setUserData({...userData, role: e.target.value})}>
                                    <option value="USER">User</option>
                                    <option value="OWNER">Store Owner</option>
                                    <option value="ADMIN">Administrator</option>
                                </select>
                                <button type="submit" className="w-full py-3 bg-violet-600 rounded-xl font-bold cursor-pointer hover:bg-violet-500">Create User</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal - Create Store */}
            <AnimatePresence>
                {showStoreModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowStoreModal(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                            className="relative w-full max-w-md bg-[#161b22] border border-white/10 rounded-2xl p-8 shadow-2xl">
                            <h2 className="text-2xl font-bold mb-6 text-white">Add New Store</h2>
                            {formError && <div className="mb-4 text-red-500 text-xs font-bold">{formError}</div>}
                            <form onSubmit={handleCreateStore} className="space-y-4">
                                <input className={inputClass} placeholder="Store Name" required value={storeData.name} onChange={e => setStoreData({...storeData, name: e.target.value})} />
                                <input className={inputClass} type="email" placeholder="Store Email" required value={storeData.email} onChange={e => setStoreData({...storeData, email: e.target.value})} />
                                <input className={inputClass} placeholder="Store Address" required value={storeData.address} onChange={e => setStoreData({...storeData, address: e.target.value})} />
                                <select className={inputClass} required value={storeData.owner_id} onChange={e => setStoreData({...storeData, owner_id: e.target.value})}>
                                    <option value="">Select Owner</option>
                                    {users.filter(u => u.role === 'OWNER').map(u => (
                                        <option key={u.id} value={u.id}>{u.name}</option>
                                    ))}
                                </select>
                                <button type="submit" className="w-full py-3 bg-blue-600 rounded-xl font-bold cursor-pointer hover:bg-blue-500">Create Store</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Toolbar */}
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between sticky top-24 z-40 p-3 rounded-2xl border border-white/[0.07] backdrop-blur-2xl shadow-xl shadow-black/30"
                style={{ background: 'rgba(8,12,20,0.85)' }}>
                
                <div className="flex gap-4 items-center">
                    {/* Tab switcher */}
                    <div className="flex gap-1 p-1 rounded-xl border border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.04)' }}>
                        {['USERS', 'STORES'].map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)}
                                className={`relative px-6 py-2.5 rounded-lg text-xs font-bold tracking-widest uppercase transition-all duration-200 cursor-pointer ${activeTab === tab ? 'text-white shadow-lg' : 'text-white/30 hover:text-white/60'}`}>
                                {activeTab === tab && (
                                    <motion.div layoutId="tab-bg" className="absolute inset-0 rounded-lg"
                                        style={{ background: 'linear-gradient(135deg, rgba(109,40,217,0.6), rgba(79,70,229,0.4))' }} />
                                )}
                                <span className="relative">{tab}</span>
                            </button>
                        ))}
                    </div>

                    <button onClick={() => activeTab === 'USERS' ? setShowUserModal(true) : setShowStoreModal(true)}
                        className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all cursor-pointer">
                        Add New {activeTab === 'USERS' ? 'User' : 'Store'}
                    </button>
                </div>

                {/* Search / Filter */}
                <div className="relative flex-1 max-w-md group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 group-focus-within:text-violet-400 transition-colors duration-200" />
                    <input type="text" placeholder={`Filter by Name, Email, Address, Role…`}
                        className="w-full py-3 pl-11 pr-4 rounded-xl text-sm font-medium outline-none border transition-all duration-200 focus:ring-2 focus:ring-violet-500/30 border-white/[0.07] focus:border-violet-500/40 placeholder:text-white/20"
                        style={{ background: 'rgba(255,255,255,0.04)' }}
                        value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
            </div>

            {/* Table */}
            <AnimatePresence mode="wait">
                <motion.div key={activeTab}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25 }}
                    className="rounded-2xl overflow-hidden border border-white/[0.07]"
                    style={{ background: 'rgba(255,255,255,0.025)' }}>

                    <table className="w-full text-left">
                        <thead style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                            <tr>
                                <SortTh label="Name" field="name" sortField={sortField} sortOrder={sortOrder} handleSort={handleSort} />
                                <SortTh label="Email" field="email" sortField={sortField} sortOrder={sortOrder} handleSort={handleSort} />
                                <SortTh label="Address" field="address" sortField={sortField} sortOrder={sortOrder} handleSort={handleSort} />
                                <SortTh label={activeTab === 'USERS' ? 'Role' : 'Rating'} field={activeTab === 'USERS' ? 'role' : 'average_rating'} sortField={sortField} sortOrder={sortOrder} handleSort={handleSort} />
                                <th className="px-6 py-5">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {filteredAndSortedData(activeTab === 'USERS' ? users : stores).map((item, idx) => (
                                <motion.tr key={idx}
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }}
                                    className="group hover:bg-white/[0.03] transition-all duration-150 border-l-2 border-l-transparent hover:border-l-violet-500/50"
                                >
                                    {/* Name */}
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-black text-violet-300 border border-violet-500/20 group-hover:scale-105 transition-transform duration-200"
                                                style={{ background: 'linear-gradient(135deg, rgba(109,40,217,0.25), rgba(79,70,229,0.12))' }}>
                                                {item.name.charAt(0)}
                                            </div>
                                            <span className="font-bold text-white/90 text-sm">{item.name}</span>
                                        </div>
                                    </td>
                                    {/* Email */}
                                    <td className="px-6 py-5">
                                        <span className="text-white/40 text-sm font-medium">{item.email}</span>
                                    </td>
                                    {/* Address */}
                                    <td className="px-6 py-5">
                                        <span className="text-white/40 text-sm font-medium line-clamp-1 max-w-[200px]">{item.address}</span>
                                    </td>
                                    {/* Role / Rating */}
                                    <td className="px-6 py-5">
                                        {activeTab === 'USERS' ? (
                                            <div className="flex flex-col gap-1.5">
                                                <span className="px-3 py-1 rounded-lg text-[10px] font-bold tracking-widest uppercase border w-fit"
                                                    style={{ background: roleColors[item.role]?.bg, borderColor: roleColors[item.role]?.border, color: roleColors[item.role]?.text }}>
                                                    {item.role}
                                                </span>
                                                {item.role === 'OWNER' && (
                                                    <div className="flex items-center gap-1 text-amber-400 font-bold text-[10px]">
                                                        <Star className="w-2.5 h-2.5 fill-current" />
                                                        {Number(item.average_rating).toFixed(1)} Avg
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-amber-400 font-bold text-sm">
                                                <Star className="w-3.5 h-3.5 fill-current" />
                                                {Number(item.average_rating).toFixed(2)}
                                            </div>
                                        )}
                                    </td>
                                    {/* Action */}
                                    <td className="px-6 py-5">
                                        <button className="px-4 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase border transition-all duration-200 border-red-500/20 bg-red-500/8 text-red-500/40 hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-lg hover:shadow-red-500/20 cursor-pointer">
                                            Revoke
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>

                    {(activeTab === 'USERS' ? users : stores).length === 0 && (
                        <div className="py-24 text-center space-y-3">
                            <div className="text-5xl font-black text-white/[0.04] tracking-[0.3em] uppercase">Empty</div>
                            <p className="text-white/20 text-sm font-medium">No results for this query</p>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;