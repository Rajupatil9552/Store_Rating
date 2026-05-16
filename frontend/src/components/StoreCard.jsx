import React, { useState } from 'react';
import { Star, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const StoreCard = ({ store, onRate }) => {
    const [hoverStar, setHoverStar] = useState(0);
    const displayRating = hoverStar || store.user_rating || 0;

    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="group relative flex flex-col h-full rounded-2xl overflow-hidden border border-white/[0.07] hover:border-violet-500/30 transition-all duration-300"
            style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.02) 100%)' }}
        >
            {/* Hover glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: 'radial-gradient(circle at 50% 0%, rgba(109,40,217,0.12), transparent 70%)' }} />

            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative p-6 flex flex-col gap-4 flex-1">

                {/* Header row */}
                <div className="flex justify-between items-start gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        {/* Avatar-style icon */}
                        <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-sm font-black text-violet-300 border border-violet-500/20"
                            style={{ background: 'linear-gradient(135deg, rgba(109,40,217,0.3), rgba(79,70,229,0.15))' }}>
                            {store.name.charAt(0)}
                        </div>
                        <h3 className="text-base font-bold text-white/90 leading-tight truncate group-hover:text-white transition-colors duration-200">
                            {store.name}
                        </h3>
                    </div>
                    {/* Score badge */}
                    <div className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-bold border-amber-500/30 text-amber-400 bg-amber-500/10">
                        <Star className="w-3 h-3 fill-current" />
                        {Number(store.overall_rating || 0).toFixed(1)}
                    </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-2 text-white/40 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-violet-400/70 mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed line-clamp-2">{store.address}</span>
                </div>

                {/* Divider */}
                <div className="mt-auto pt-5 border-t border-white/[0.06]">
                    <div className="flex items-center justify-between gap-4">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-white/25">
                            {store.user_rating ? 'Your rating' : 'Rate this store'}
                        </div>
                        {/* Stars */}
                        <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => onRate(store.id, star, !!store.user_rating)}
                                    onMouseEnter={() => setHoverStar(star)}
                                    onMouseLeave={() => setHoverStar(0)}
                                    className={`transition-all duration-100 hover:scale-110 active:scale-95 cursor-pointer p-0.5 ${displayRating >= star ? 'text-amber-400' : 'text-white/15 hover:text-white/40'}`}
                                >
                                    <Star className={`w-5 h-5 transition-all duration-100 ${displayRating >= star ? 'fill-current drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]' : ''}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Progress bar for overall rating */}
                    <div className="mt-3 h-1 rounded-full overflow-hidden bg-white/[0.06]">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(Number(store.overall_rating || 0) / 5) * 100}%` }}
                            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-amber-400"
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default StoreCard;