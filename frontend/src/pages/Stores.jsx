import React, { useEffect, useState, useCallback } from 'react';
import API from '../services/api';
import StoreCard from '../components/StoreCard';
import { Search, Store, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Stores = () => {
    const [stores, setStores] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [sortField, setSortField] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');

    const handleSort = (field) => {
        if (sortField === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        else { setSortField(field); setSortOrder('asc'); }
    };

    const sortedStores = [...stores].sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        
        if (sortField === 'overall_rating') {
            valA = Number(valA || 0);
            valB = Number(valB || 0);
        } else {
            valA = String(valA || '').toLowerCase();
            valB = String(valB || '').toLowerCase();
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const fetchStores = useCallback(async () => {
        try {
            const { data } = await API.get(`/stores/search?name=${search}`);
            setStores(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [search]);

    useEffect(() => {
        fetchStores();
    }, [fetchStores]);

    const handleRate = async (storeId, stars, isUpdate) => {
        if (!localStorage.getItem('token')) return alert('Please login to rate stores');
        try {
            if (isUpdate) await API.put('/ratings', { storeId, rating: stars });
            else await API.post('/ratings', { storeId, rating: stars });
            fetchStores();
        } catch (err) {
            alert(err.response?.data?.message || 'Error submitting rating');
        }
    };

    return (
        <div className="space-y-14">

            {/* Hero section */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-center space-y-5 pt-4"
            >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-semibold uppercase tracking-widest mb-2">
                    <Store className="w-3.5 h-3.5" />
                    Store Directory
                </div>
                <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white leading-[0.95]">
                    Discover the{' '}
                    <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #a78bfa, #818cf8)' }}>
                        best stores
                    </span>
                </h1>
                <p className="text-white/40 text-base max-w-xl mx-auto leading-relaxed">
                    Browse, search, and share your experience with the finest establishments around you.
                </p>
            </motion.div>

            {/* Search bar */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-center"
            >
                <div className="relative flex-1 group w-full">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-violet-400 transition-colors duration-200" />
                    <input
                        type="text"
                        placeholder="Search by name or location…"
                        className="w-full py-4 pl-12 pr-5 rounded-2xl text-sm font-medium outline-none border transition-all duration-200 focus:ring-2 focus:ring-violet-500/30 border-white/[0.08] focus:border-violet-500/40 placeholder:text-white/25"
                        style={{ background: 'rgba(255,255,255,0.05)' }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                        <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors text-lg leading-none cursor-pointer">×</button>
                    )}
                </div>

                <div className="flex gap-2 p-1 rounded-2xl border border-white/[0.06] bg-white/[0.03] self-stretch md:self-auto">
                    {[
                        { label: 'Name', field: 'name' },
                        { label: 'Rating', field: 'overall_rating' },
                        { label: 'Address', field: 'address' }
                    ].map(opt => (
                        <button
                            key={opt.field}
                            onClick={() => handleSort(opt.field)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${sortField === opt.field ? 'bg-violet-600 text-white' : 'text-white/30 hover:text-white/60'}`}
                        >
                            {opt.label}
                            {sortField === opt.field && (
                                <ArrowUpDown className={`w-3 h-3 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                            )}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Results count */}
            {!loading && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-white/30 font-medium">
                        {stores.length === 0 ? 'No stores found' : `${stores.length} store${stores.length !== 1 ? 's' : ''} available`}
                    </p>
                    {search && (
                        <p className="text-xs text-violet-400/70 font-medium">Filtered by: "<span className="text-violet-300">{search}</span>"</p>
                    )}
                </div>
            )}

            {/* Content */}
            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-52 rounded-2xl border border-white/[0.05] animate-pulse"
                                style={{ background: 'rgba(255,255,255,0.03)', animationDelay: `${i * 0.1}s` }} />
                        ))}
                    </motion.div>
                ) : stores.length === 0 ? (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                        className="py-24 text-center space-y-4"
                    >
                        <div className="w-16 h-16 rounded-2xl border border-white/[0.06] flex items-center justify-center mx-auto mb-4"
                            style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <Store className="w-7 h-7 text-white/20" />
                        </div>
                        <p className="text-white/25 font-semibold">No stores match your search</p>
                        <button onClick={() => setSearch('')} className="text-violet-400 text-sm font-semibold hover:text-violet-300 transition-colors cursor-pointer underline underline-offset-4 decoration-violet-500/30">
                            Clear search
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {sortedStores.map((store, i) => (
                            <motion.div
                                key={store.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="h-full"
                            >
                                <StoreCard store={store} onRate={handleRate} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Stores;