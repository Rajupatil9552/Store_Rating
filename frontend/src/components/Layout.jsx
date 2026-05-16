import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = () => {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-[#080c14] text-white selection:bg-violet-500/30 antialiased overflow-x-hidden flex flex-col font-sans">

            {/* ── Layered atmospheric background ── */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Radial base gradient */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(109,40,217,0.18),transparent)]" />
                {/* Noise texture overlay */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`, backgroundRepeat: 'repeat', backgroundSize: '128px 128px' }}
                />
                {/* Orbs */}
                <div className="absolute top-[-20%] left-[-10%] w-[55%] h-[55%] bg-violet-700/15 blur-[160px] rounded-full animate-[pulse_8s_ease-in-out_infinite]" />
                <div className="absolute bottom-[-15%] right-[-15%] w-[45%] h-[45%] bg-indigo-600/10 blur-[140px] rounded-full animate-[pulse_10s_ease-in-out_infinite_2s]" />
                <div className="absolute top-[40%] right-[5%] w-[25%] h-[25%] bg-fuchsia-700/8 blur-[100px] rounded-full animate-[pulse_12s_ease-in-out_infinite_4s]" />
                {/* Subtle grid */}
                <div className="absolute inset-0 opacity-[0.025]"
                    style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
                />
            </div>

            <Navbar />

            <main className="container mx-auto px-6 py-32 max-w-7xl flex-grow">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 24, filter: 'blur(12px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* ── Footer ── */}
            <footer className="relative z-10 mt-auto border-t border-white/[0.06] bg-black/50 backdrop-blur-3xl py-14">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-12">
                        {/* Brand */}
                        <div className="flex flex-col items-center md:items-start gap-3">
                            <div className="flex items-center gap-3">
                                <div className="relative w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center border border-violet-500/30 shadow-lg shadow-violet-500/20"
                                    style={{ background: 'linear-gradient(135deg, rgba(109,40,217,0.4), rgba(79,70,229,0.2))' }}>
                                    <span className="text-violet-300 font-black italic text-lg leading-none">R</span>
                                </div>
                                <span className="text-lg font-black tracking-tight">
                                    Rate<span className="text-violet-400">Nexus</span>
                                </span>
                            </div>
                            <p className="text-white/20 text-[10px] font-semibold uppercase tracking-[0.25em]">Distributed Intelligence Network</p>
                        </div>

                        {/* Links */}
                        <div className="flex gap-16">
                            <div className="space-y-4">
                                <p className="text-[10px] uppercase font-black tracking-[0.2em] text-white/30">Navigate</p>
                                <div className="flex flex-col gap-2 text-sm font-medium text-white/25">
                                    <a href="/stores" className="hover:text-violet-400 transition-colors duration-200">Store Radar</a>
                                    <a href="/admin" className="hover:text-violet-400 transition-colors duration-200">Control Panel</a>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <p className="text-[10px] uppercase font-black tracking-[0.2em] text-white/30">Security</p>
                                <div className="flex flex-col gap-2 text-sm font-medium text-white/25">
                                    <a href="#" className="hover:text-violet-400 transition-colors duration-200">Auth Protocol</a>
                                    <a href="#" className="hover:text-violet-400 transition-colors duration-200">SSL Lattice</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/[0.04] text-center text-[10px] font-semibold uppercase tracking-[0.5em] text-white/[0.07]">
                        © 2026 RateNexus Infrastructure · All Rights Secured
                    </div>
                </div>
            </footer>
            
        </div>
    );
};

export default Layout;