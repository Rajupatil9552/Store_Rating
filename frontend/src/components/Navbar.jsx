import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, ShoppingBag, User, Shield, Warehouse } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    const userName = localStorage.getItem('name');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl z-[100] glass px-8 py-4 flex justify-between items-center rounded-3xl shadow-2xl overflow-hidden border border-white/5 backdrop-blur-2xl">
            {/* Animated Background Pulse */}
            <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
            </div>

            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-all group">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                    <ShoppingBag className="w-5 h-5 fill-current" />
                </div>
                <div className="flex flex-col">
                    <span className="text-xl font-black uppercase tracking-tighter italic leading-none">
                        Rating<span className="text-primary not-italic">Nexus</span>
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-0.5">Control Shell</span>
                </div>
            </Link>

            <div className="flex items-center gap-10">
                {token ? (
                    <>
                        <Link to="/stores" className={`nav-link flex items-center gap-2 ${isActive('/stores') ? 'text-white after:w-full' : ''}`}>
                            <Warehouse className="w-4 h-4" /> Nodes
                        </Link>
                        
                        {userRole === 'ADMIN' && (
                            <Link to="/admin" className={`nav-link flex items-center gap-2 ${isActive('/admin') ? 'text-white after:w-full' : ''}`}>
                                <Shield className="w-4 h-4" /> Root
                            </Link>
                        )}

                        {userRole === 'OWNER' && (
                            <Link to="/owner" className={`nav-link flex items-center gap-2 ${isActive('/owner') ? 'text-white after:w-full' : ''}`}>
                                <LayoutDashboard className="w-4 h-4" /> Dashboard
                            </Link>
                        )}

                        <div className="h-6 w-px bg-white/10" />

                        <div className="flex items-center gap-4">
                            <Link to="/settings" className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-lg group ${isActive('/settings') ? 'bg-violet-600 text-white shadow-violet-600/20' : 'bg-white/5 text-white/40 hover:bg-white/10'}`} title="Account Settings">
                                <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            </Link>
                            <div className="flex flex-col items-end">
                                <span className="text-xs font-black uppercase tracking-widest text-primary leading-none mb-1">{userRole}</span>
                                <span className="text-sm font-bold text-white/60 leading-none">{userName}</span>
                            </div>
                            <button 
                                onClick={handleLogout}
                                className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all cursor-pointer shadow-lg shadow-red-500/5 group"
                                title="Terminate Session"
                            >
                                <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center gap-6">
                        <Link to="/login" className="text-sm font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all">
                            Access System
                        </Link>
                        <Link to="/register" className="btn-primary">
                            Initialize ID
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
