
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import {
    LayoutDashboard,
    FileText,
    Settings,
    LogOut,
    Menu,
    X,
    ExternalLink,
    ChevronRight,
    User
} from "lucide-react";

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                navigate("/admin");
            }
            setLoading(false);
        };
        checkUser();
    }, [navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/admin");
    };

    const navItems = [
        { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
        { label: "Blog Posts", icon: FileText, path: "/admin/posts" },
        { label: "Categories", icon: Settings, path: "/admin/categories" },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center font-sans">
                <div className="w-6 h-6 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9FAFB] text-gray-900 flex font-sans selection:bg-black selection:text-white">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        * {
            font-family: 'Inter', -apple-system, sans-serif !important;
            -webkit-font-smoothing: antialiased;
        }

        .sidebar-item-active {
            background: #F3F4F6;
            color: #000;
        }

        .hide-scrollbar::-webkit-scrollbar {
            display: none;
        }
      `}</style>

            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? "w-64" : "w-20"
                    } bg-white border-r border-[#E5E7EB] transition-all duration-300 flex flex-col fixed h-full z-50`}
            >
                <div className="h-16 flex items-center px-6 border-b border-[#F3F4F6]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-black text-sm">V</div>
                        {isSidebarOpen && <span className="font-bold tracking-tight text-lg">Vakalt Hub</span>}
                    </div>
                </div>

                <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto hide-scrollbar">
                    {navItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${isActive
                                        ? "bg-[#F3F4F6] text-black"
                                        : "text-gray-500 hover:bg-[#F9FAFB] hover:text-black"
                                    }`}
                            >
                                <item.icon size={20} className={`${isActive ? "text-black" : "text-gray-400 group-hover:text-black"} transition-colors`} />
                                {isSidebarOpen && <span className="flex-1">{item.label}</span>}
                                {isSidebarOpen && isActive && <div className="w-1 h-1 rounded-full bg-black"></div>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-3 border-t border-[#F3F4F6] space-y-1">
                    <Link
                        to="/"
                        target="_blank"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-500 hover:text-black hover:bg-[#F9FAFB] rounded-xl transition-all"
                    >
                        <ExternalLink size={20} className="text-gray-400" />
                        {isSidebarOpen && <span>Live Preview</span>}
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                        <LogOut size={20} />
                        {isSidebarOpen && <span>Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
                <header className="h-16 border-b border-[#E5E7EB] px-8 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-40">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-[#F3F4F6] rounded-lg text-gray-400 hover:text-black transition-all"
                        >
                            <Menu size={20} />
                        </button>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-400">Workspace</span>
                            <ChevronRight size={14} className="text-gray-300" />
                            <span className="font-semibold text-black">
                                {navItems.find(item => location.pathname.startsWith(item.path))?.label || "Publication"}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex flex-col items-end mr-2">
                            <span className="text-[11px] font-bold text-black uppercase tracking-wider">Mohan Sece</span>
                            <span className="text-[10px] text-gray-400">System Admin</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-center text-gray-400">
                            <User size={20} />
                        </div>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
