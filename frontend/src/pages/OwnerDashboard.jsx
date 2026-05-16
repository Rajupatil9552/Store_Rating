import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import API from '../services/api';
import { Star, MapPin, Mail, User, BarChart3, MessageSquare, Plus, X, Store, ArrowRight, AlertCircle, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OwnerDashboard = () => {
    const [dashData, setDashData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ name: '', email: '', address: '' });
    
    // Sorting state for ratings
    const [sortField, setSortField] = useState('created_at');
    const [sortOrder, setSortOrder] = useState('desc');

    const handleSort = (field) => {
        if (sortField === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        else { setSortField(field); setSortOrder('asc'); }
    };

    const sortRatings = (ratings) => [...ratings].sort((a, b) => {
        const valA = String(a[sortField] || '').toLowerCase();
        const valB = String(b[sortField] || '').toLowerCase();
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const SortTh = ({ label, field }) => (
        <th className="px-6 py-4 cursor-pointer group select-none" onClick={() => handleSort(field)}>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/25 group-hover:text-white/50 transition-colors">
                {label}
                <ArrowUpDown className={`w-3 h-3 transition-opacity ${sortField === field ? 'opacity-100 text-violet-400' : 'opacity-30'}`} />
            </div>
        </th>
    );

    const fetchOwnerDashboard = useCallback(async () => {
        try {
            const { data } = await API.get('/owner/dashboard');
            setDashData(data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchOwnerDashboard(); }, [fetchOwnerDashboard]);

    const handleCreateStore = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setError('');
        try {
            await API.post('/stores', formData);
            setShowModal(false);
            setFormData({ name: '', email: '', address: '' });
            fetchOwnerDashboard();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create store');
        } finally {
            setFormLoading(false);
        }
    };

    const StarBar = ({ rating }) => (
        <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-white/10'}`} />
                ))}
            </div>
            <span className="text-amber-400 font-bold text-sm">{Number(rating).toFixed(2)}</span>
        </div>
    );

    const inputClass = "w-full py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 outline-none border border-white/[0.08] focus:border-violet-500/40 bg-white/[0.03] text-white placeholder:text-white/20";

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-8 border-b border-white/[0.06]">
                <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-[10px] font-bold uppercase tracking-widest mb-3">
                        <BarChart3 className="w-3 h-3" />
                        Owner Console
                    </div>
                    <h1 className="text-5xl font-black tracking-tight text-white">My Stores</h1>
                    <p className="text-white/35 mt-1.5 text-sm font-medium">Ratings and customer feedback across your properties</p>
                </motion.div>

                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-violet-600/20 active:scale-95 cursor-pointer"
                    >
                        <Plus className="w-4 h-4" /> Add New Store
                    </button>
                    <div className="hidden sm:flex items-center gap-2.5 px-5 py-3 rounded-2xl border border-green-500/20 bg-green-500/8">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-sm font-semibold text-green-400">Systems Online</span>
                    </div>
                </div>
            </div>

            {/* Create Store Modal - Teleported to root to bypass layout depth traps */}
            {createPortal(
                <AnimatePresence>
                    {showModal && (
                        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 overflow-hidden">
                            {/* Backdrop */}
                            <motion.div 
                                key="backdrop"
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }} 
                                exit={{ opacity: 0 }}
                                onClick={() => setShowModal(false)}
                                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                            />
                            
                            {/* Modal Content */}
                            <motion.div 
                                key="modal"
                                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 40 }}
                                className="relative w-full max-w-lg bg-[#0f172a] rounded-[2.5rem] border border-white/[0.08] shadow-[0_0_100px_rgba(109,40,217,0.3)] overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
                                
                                <div className="p-8 md:p-10">
                                    <div className="flex justify-between items-start mb-10">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-violet-400 mb-1">
                                                <Store className="w-5 h-5" />
                                                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Establish Terminal</span>
                                            </div>
                                            <h2 className="text-3xl font-black text-white tracking-tighter italic">Initialize Node</h2>
                                            <p className="text-white/30 text-xs font-medium">Provision new property metadata into the RatingNexus grid.</p>
                                        </div>
                                        <button onClick={() => setShowModal(false)} className="p-2.5 rounded-2xl hover:bg-white/5 transition-all text-white/20 hover:text-white cursor-pointer active:scale-90 border border-transparent hover:border-white/10">
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>

                                    {error && (
                                        <div className="mb-8 bg-red-500/5 border border-red-500/20 text-red-400 px-5 py-4 rounded-3xl flex items-center gap-4 text-xs font-bold tracking-wide">
                                            <AlertCircle className="w-5 h-5 flex-shrink-0 animate-pulse" />
                                            {error}
                                        </div>
                                    )}

                                    <form onSubmit={handleCreateStore} className="space-y-7">
                                        <div className="space-y-2.5">
                                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em] ml-1">Store Identity</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                                    <Store className="w-4 h-4 text-white/10 group-focus-within:text-violet-400 transition-colors" />
                                                </div>
                                                <input 
                                                    type="text" required placeholder="e.g. Skyline Tech Hub"
                                                    className={`w-full py-4 px-5 pl-12 rounded-2xl text-sm font-semibold transition-all duration-300 outline-none border border-white/[0.06] focus:border-violet-500/50 bg-white/[0.02] hover:bg-white/[0.04] text-white placeholder:text-white/10 shadow-inner`}
                                                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2.5">
                                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em] ml-1">Operational Email</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                                    <Mail className="w-4 h-4 text-white/10 group-focus-within:text-violet-400 transition-colors" />
                                                </div>
                                                <input 
                                                    type="email" required placeholder="contact@property.com"
                                                    className={`w-full py-4 px-5 pl-12 rounded-2xl text-sm font-semibold transition-all duration-300 outline-none border border-white/[0.06] focus:border-violet-500/50 bg-white/[0.02] hover:bg-white/[0.04] text-white placeholder:text-white/10 shadow-inner`}
                                                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2.5">
                                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em] ml-1">Geospatial Address</label>
                                            <div className="relative group">
                                                <div className="absolute top-4 left-0 pl-5 flex items-start pointer-events-none">
                                                    <MapPin className="w-4 h-4 text-white/10 group-focus-within:text-violet-400 transition-colors" />
                                                </div>
                                                <textarea 
                                                    required rows="3" placeholder="Full physical location details..."
                                                    className={`w-full py-4 px-5 pl-12 rounded-2xl text-sm font-semibold transition-all duration-300 outline-none border border-white/[0.06] focus:border-violet-500/50 bg-white/[0.02] hover:bg-white/[0.04] text-white placeholder:text-white/10 shadow-inner resize-none`}
                                                    value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})}
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <button 
                                                type="submit" disabled={formLoading}
                                                className="w-full py-5 rounded-[1.5rem] bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black text-xs tracking-[0.3em] uppercase transition-all shadow-2xl shadow-violet-900/30 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-4 cursor-pointer group"
                                            >
                                                {formLoading ? (
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <>Establish Node <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.getElementById('portal-root') || document.body
            )}

            {/* Loading */}
            {loading && (
                <div className="space-y-8">
                    {[1, 2].map(i => (
                        <div key={i} className="space-y-4 animate-pulse">
                            <div className="h-28 rounded-2xl border border-white/[0.05]" style={{ background: 'rgba(255,255,255,0.03)' }} />
                            <div className="h-48 rounded-2xl border border-white/[0.05]" style={{ background: 'rgba(255,255,255,0.02)' }} />
                        </div>
                    ))}
                </div>
            )}

            {/* Empty */}
            {!loading && dashData.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="py-28 text-center space-y-4 rounded-[2.5rem] border border-white/[0.06]"
                    style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <div className="w-16 h-16 rounded-2xl border border-white/[0.06] flex items-center justify-center mx-auto mb-4"
                        style={{ background: 'rgba(255,255,255,0.04)' }}>
                        <Store className="w-8 h-8 text-white/20" />
                    </div>
                    <p className="text-white/25 font-bold text-lg">No nodes linked to your profile</p>
                    <p className="text-white/15 text-sm max-w-xs mx-auto">Initialize your first store node to begin data collection</p>
                    <button 
                        onClick={() => setShowModal(true)}
                        className="mt-6 px-10 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer"
                    >
                        Initialize First Node
                    </button>
                </motion.div>
            )}

            {/* Store list */}
            {!loading && dashData.length > 0 && (
                <div className="space-y-14">
                    {dashData.map((store, i) => (
                        <motion.div key={store.id}
                            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                            className="space-y-5"
                        >
                            {/* Store card */}
                            <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] p-7"
                                style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.02) 100%)' }}>
                                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
                                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                                    <div className="space-y-2.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-violet-400 to-indigo-500" />
                                            <h2 className="text-2xl font-black tracking-tight text-white">{store.name}</h2>
                                        </div>
                                        <div className="flex flex-col gap-1 ml-4 text-white/40 text-sm font-medium">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-3.5 h-3.5 text-violet-400/70" />
                                                {store.address}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-start lg:items-end gap-1.5">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/25">Avg. Rating</span>
                                        <StarBar rating={store.average_rating} />
                                        <div className="w-32 h-1.5 rounded-full overflow-hidden bg-white/[0.06] mt-1">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(Number(store.average_rating) / 5) * 100}%` }}
                                                transition={{ duration: 0.9, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-amber-400"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Ratings table */}
                            <div className="rounded-2xl overflow-hidden border border-white/[0.07]"
                                style={{ background: 'rgba(255,255,255,0.02)' }}>

                                {/* Table header */}
                                <div className="px-6 py-4 border-b border-white/[0.05] flex items-center justify-between"
                                    style={{ background: 'rgba(255,255,255,0.04)' }}>
                                    <div className="flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4 text-white/30" />
                                        <span className="text-xs font-bold uppercase tracking-widest text-white/30">
                                            Customer Reviews ({store.ratings.length})
                                        </span>
                                    </div>
                                    <div className="text-[10px] font-bold text-white/10 uppercase tracking-widest">
                                        Signal Stream
                                    </div>
                                </div>

                                <table className="w-full text-left">
                                    <thead style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                        <tr>
                                            <SortTh label="Reviewer" field="name" />
                                            <SortTh label="Email" field="email" />
                                            <SortTh label="Score" field="rating" />
                                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white/25">Comment</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.03]">
                                        {sortRatings(store.ratings).map((rating, rIdx) => (
                                            <motion.tr key={rIdx}
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: rIdx * 0.04 }}
                                                className="group hover:bg-white/[0.03] transition-all duration-150 border-l-2 border-l-transparent hover:border-l-amber-500/40"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-xl flex items-center justify-center border border-white/[0.08]"
                                                            style={{ background: 'rgba(255,255,255,0.06)' }}>
                                                            <User className="w-3.5 h-3.5 text-white/40" />
                                                        </div>
                                                        <span className="text-sm font-semibold text-white/80">{rating.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-white/35 text-sm font-medium">
                                                        <Mail className="w-3.5 h-3.5" />
                                                        {rating.email}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                                                        <Star className="w-3.5 h-3.5 fill-current" />
                                                        {rating.rating}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-white/40 text-sm italic line-clamp-1 group-hover:line-clamp-none transition-all duration-300 leading-relaxed">
                                                        "{rating.comment || 'No comment provided.'}"
                                                    </p>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>

                                {store.ratings.length === 0 && (
                                    <div className="py-16 text-center space-y-2">
                                        <MessageSquare className="w-8 h-8 text-white/[0.08] mx-auto mb-3" />
                                        <p className="text-white/20 text-sm font-medium">No reviews yet</p>
                                        <p className="text-white/12 text-xs">Customer ratings will appear here</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OwnerDashboard;