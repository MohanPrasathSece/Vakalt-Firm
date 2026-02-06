
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import {
    Search,
    Plus,
    Trash2,
    Edit,
    ExternalLink,
    Filter,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    Eye,
    FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const Posts = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");
    const navigate = useNavigate();

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        // PERFORMANCE OPTIMIZATION: Only fetch columns needed for the list view.
        // This avoids downloading large 'content' fields for every single post.
        const { data, error } = await supabase
            .from('posts')
            .select('id, title, slug, category, featured, created_at, read_time, image_url')
            .order('created_at', { ascending: false });

        if (error) {
            toast.error("Failed to load posts");
        } else {
            setPosts(data || []);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this post?')) {
            const { error } = await supabase.from('posts').delete().eq('id', id);
            if (error) {
                toast.error("Error deleting post");
            } else {
                toast.success("Post deleted successfully");
                fetchPosts();
            }
        }
    };

    const filteredPosts = posts.filter(post => {
        const matchesSearch = (post.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
            (post.category?.toLowerCase() || "").includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === "All" || post.category === activeFilter;
        return matchesSearch && matchesFilter;
    });

    const categories = ["All", ...new Set(posts.map(p => p.category || 'Uncategorized'))];

    return (
        <AdminLayout>
            <div className="space-y-8 font-sans">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-black mb-1">Publications</h1>
                        <p className="text-gray-500 font-medium text-sm">Organize and manage your legal insights.</p>
                    </div>
                    <Button
                        onClick={() => navigate('/admin/posts/new')}
                        className="bg-black text-white hover:bg-gray-800 rounded-xl h-14 px-8 font-bold gap-2 shadow-xl shadow-black/10 transition-all active:scale-95"
                    >
                        <Plus size={20} />
                        Create New Post
                    </Button>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search articles..."
                            className="pl-12 h-14 bg-white border-gray-200 focus:border-black focus:ring-1 focus:ring-black text-black placeholder:text-gray-400 rounded-2xl shadow-sm transition-all"
                        />
                    </div>
                    <div className="flex gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="h-14 border-gray-200 bg-white px-6 rounded-2xl gap-3 hover:bg-gray-50 text-gray-600 font-bold hover:text-black shadow-sm transition-all">
                                    <Filter size={18} />
                                    {activeFilter}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white border-gray-100 text-gray-900 rounded-xl shadow-2xl p-2 min-w-[200px]">
                                {categories.map(cat => (
                                    <DropdownMenuItem
                                        key={cat}
                                        onClick={() => setActiveFilter(cat)}
                                        className="hover:bg-gray-50 cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold"
                                    >
                                        {cat}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Posts Table */}
                <div className="bg-white border border-gray-200 rounded-[2rem] overflow-hidden shadow-xl shadow-gray-200/40">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-gray-400 text-[10px] uppercase font-bold tracking-[0.2em] border-b border-gray-100 bg-gray-50/50">
                                    <th className="px-8 py-6">Publication Name</th>
                                    <th className="px-8 py-6">Category</th>
                                    <th className="px-8 py-6">Status</th>
                                    <th className="px-8 py-6">Date Published</th>
                                    <th className="px-8 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-32 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-10 h-10 border-4 border-gray-100 border-t-black rounded-full animate-spin"></div>
                                                <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">Synchronizing...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredPosts.map((post) => (
                                    <tr key={post.id} className="hover:bg-gray-50/50 transition-all group">
                                        <td className="px-8 py-7">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0 group-hover:bg-white transition-colors">
                                                    {post.image_url ? (
                                                        <img src={post.image_url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <FileText size={24} className="text-gray-300" />
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-black text-gray-900 group-hover:text-black transition-colors line-clamp-1 text-lg tracking-tight">{post.title}</span>
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.1em]">{post.read_time || '3 min read'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-7">
                                            <span className="px-4 py-1.5 bg-gray-100 border border-gray-200 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                                {post.category || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-7">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2.5 h-2.5 rounded-full ${post.featured ? 'bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.5)]' : 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.3)]'}`}></div>
                                                <span className="text-xs font-bold text-gray-700 uppercase tracking-tight">{post.featured ? 'Featured' : 'Published'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-7 text-sm font-bold text-gray-400 tabular-nums">
                                            {new Date(post.created_at).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-8 py-7 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="w-11 h-11 bg-white border border-gray-200 hover:bg-black hover:text-white transition-all rounded-xl shadow-sm"
                                                    onClick={() => navigate(`/admin/posts/${post.id}`)}
                                                >
                                                    <Edit size={18} />
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="w-11 h-11 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl shadow-sm">
                                                            <MoreVertical size={18} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-white border-gray-100 text-gray-900 rounded-xl shadow-2xl p-2 min-w-[180px]">
                                                        <DropdownMenuItem
                                                            className="hover:bg-gray-50 cursor-pointer gap-3 rounded-lg px-4 py-2 font-semibold"
                                                            onClick={() => window.open(`/insights/${post.slug}`, '_blank')}
                                                        >
                                                            <Eye size={16} className="text-gray-400" /> View Live
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="hover:bg-red-50 text-red-600 cursor-pointer gap-3 rounded-lg px-4 py-2 font-semibold"
                                                            onClick={() => handleDelete(post.id)}
                                                        >
                                                            <Trash2 size={16} /> Mark for Removal
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredPosts.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-40 text-center">
                                            <div className="flex flex-col items-center gap-6">
                                                <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                                                    <Search size={48} className="text-gray-200" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xl font-black text-gray-900 tracking-tight">No results found</p>
                                                    <p className="text-gray-400 font-medium">Try broader search terms or clear filters.</p>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => { setSearchQuery(""); setActiveFilter("All") }}
                                                    className="h-12 border-gray-200 hover:bg-black hover:text-white px-8 rounded-xl font-bold transition-all"
                                                >
                                                    Reset all filters
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Posts;
