
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
    User,
    ExternalLink
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
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-900 font-sans">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-gray-900 flex font-sans admin-workspace">
            {/* Global Admin Font Override to ensure NO SERIF/FANCY fonts */}
            <style>{`
        .admin-workspace, 
        .admin-workspace h1, 
        .admin-workspace h2, 
        .admin-workspace h3, 
        .admin-workspace h4, 
        .admin-workspace h5, 
        .admin-workspace h6,
        .admin-workspace p,
        .admin-workspace span,
        .admin-workspace div,
        .admin-workspace button,
        .admin-workspace input,
        .admin-workspace textarea,
        .admin-workspace select,
        .admin-workspace label {
            font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
        }
      `}</style>

            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? "w-64" : "w-20"
                    } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col fixed h-full z-50`}
            >
                <div className="p-6 flex items-center justify-between">
                    {isSidebarOpen ? (
                        <span className="text-xl font-bold tracking-tighter text-black">VAKALT<span className="text-gray-400 font-light">.ADMIN</span></span>
                    ) : (
                        <span className="text-xl font-bold tracking-tighter text-black">V</span>
                    )}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="lg:hidden text-gray-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? "bg-black text-white shadow-lg shadow-black/10"
                                    : "text-gray-500 hover:text-black hover:bg-gray-100"
                                    }`}
                            >
                                <item.icon size={20} />
                                {isSidebarOpen && <span className="font-semibold">{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100 space-y-2">
                    <Link
                        to="/"
                        target="_blank"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-black hover:bg-gray-100 transition-all"
                    >
                        <ExternalLink size={20} />
                        {isSidebarOpen && <span className="font-semibold">View Site</span>}
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-semibold"
                    >
                        <LogOut size={20} />
                        {isSidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
                <header className="h-20 border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-40">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-all text-gray-500"
                        >
                            <Menu size={20} />
                        </button>
                        <h2 className="text-lg font-bold text-black uppercase tracking-tight">
                            {navItems.find(item => item.path === location.pathname)?.label || "Publication"}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-full border border-gray-200 text-sm font-medium text-gray-600">
                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
                            Admin Active
                        </div>
                        <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
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
