
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from "sonner";
import {
    Search,
    Plus,
    Trash2,
    Edit3,
    ExternalLink,
    MoreHorizontal,
    Filter,
    ArrowUpRight,
    Circle,
    Tag,
    X
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const Posts = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [showCategoryDialog, setShowCategoryDialog] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");

    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data, error } = await supabase.from('categories').select('*').order('name');
            if (error) throw error;
            return data;
        },
    });

    const { data: posts = [], isLoading: loading } = useQuery({
        queryKey: ['admin_posts'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('posts')
                .select('id, title, slug, category, featured, status, created_at')
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data;
        },
    });

    const deletePostMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('posts').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            toast.success("Publication archived");
            queryClient.invalidateQueries({ queryKey: ['admin_posts'] });
        },
        onError: () => toast.error("Error deleting post"),
    });

    const addCategoryMutation = useMutation({
        mutationFn: async (name: string) => {
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const { error } = await supabase.from('categories').insert([{ name, slug }]);
            if (error) throw error;
        },
        onSuccess: () => {
            toast.success("Category created");
            setNewCategoryName("");
            setShowCategoryDialog(false);
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
        onError: () => toast.error("Error adding category"),
    });

    const handleDelete = (id: string) => {
        deletePostMutation.mutate(id);
    };

    const handleAddCategory = () => {
        if (!newCategoryName.trim()) {
            toast.error("Category name is required");
            return;
        }
        addCategoryMutation.mutate(newCategoryName);
    };

    const filtered = posts.filter((post: any) => {
        const matchesSearch = post.title?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "all" ||
            selectedCategory === "uncategorized" && (!post.category || post.category === "Uncategorized") ||
            post.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-black">Publications</h1>
                        <p className="text-gray-500 mt-1">Manage and monitor your legal briefed insights.</p>
                    </div>
                    <Button
                        onClick={() => navigate('/admin/posts/new')}
                        className="bg-black text-white hover:bg-gray-800 rounded-full px-6 h-11 text-sm font-bold shadow-lg shadow-black/10 gap-2 transition-all active:scale-95"
                    >
                        <Plus size={18} /> New Article
                    </Button>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative flex-1 group w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                        <Input
                            placeholder="Find publications..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white border-gray-200 pl-11 h-11 rounded-full focus:ring-1 focus:ring-black focus:border-black transition-all"
                        />
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="h-11 rounded-full border-gray-200 font-bold px-6 gap-2 hover:bg-white hover:border-black transition-all text-[11px] uppercase tracking-wider">
                                <Filter size={18} />
                                {selectedCategory === "all" ? "All Categories" :
                                    selectedCategory === "uncategorized" ? "Uncategorized" :
                                        categories.find(c => c.name === selectedCategory)?.name || "Category"}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-xl border-gray-100 shadow-xl p-2">
                            <DropdownMenuItem
                                className="rounded-lg font-semibold py-2 cursor-pointer"
                                onClick={() => setSelectedCategory("all")}
                            >
                                All Categories
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="rounded-lg font-semibold py-2 cursor-pointer"
                                onClick={() => setSelectedCategory("uncategorized")}
                            >
                                Uncategorized
                            </DropdownMenuItem>
                            {categories.map((cat) => (
                                <DropdownMenuItem
                                    key={cat.id}
                                    className="rounded-lg font-semibold py-2 cursor-pointer"
                                    onClick={() => setSelectedCategory(cat.name)}
                                >
                                    {cat.name}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="h-11 rounded-full border-gray-200 font-bold px-6 gap-2 hover:bg-white hover:border-black transition-all text-[11px] uppercase tracking-wider">
                                <Tag size={18} /> Add Category
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md rounded-3xl">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold">Create New Category</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold">Category Name</Label>
                                    <Input
                                        placeholder="e.g., Corporate Law"
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                                        className="h-12 rounded-xl"
                                        autoFocus
                                    />
                                </div>
                                <div className="flex gap-2 justify-end">
                                    <Button variant="outline" onClick={() => setShowCategoryDialog(false)} className="rounded-full h-11 px-6 font-bold text-xs uppercase tracking-widest">
                                        Cancel
                                    </Button>
                                    <Button onClick={handleAddCategory} className="bg-black text-white hover:bg-gray-800 rounded-full h-11 px-6 font-bold text-xs uppercase tracking-widest">
                                        Create Category
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm shadow-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-6 py-4 font-bold text-gray-500 uppercase text-[10px] tracking-widest min-w-[200px]">Publication Details</th>
                                    <th className="px-6 py-4 font-bold text-gray-500 uppercase text-[10px] tracking-widest min-w-[150px]">Classification</th>
                                    <th className="px-6 py-4 font-bold text-gray-500 uppercase text-[10px] tracking-widest text-center min-w-[100px]">Visibility</th>
                                    <th className="px-6 py-4 font-bold text-gray-500 uppercase text-[10px] tracking-widest min-w-[120px]">Date</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="py-20 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-6 h-6 border-2 border-gray-100 border-t-black rounded-full animate-spin"></div>
                                                <span className="text-gray-400 font-medium animate-pulse">Syncing insights...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-20 text-center text-gray-400 font-medium">No publications found.</td>
                                    </tr>
                                ) : filtered.map((post) => (
                                    <tr key={post.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-bold text-black group-hover:text-black transition-colors">{post.title}</span>
                                                <span className="text-gray-400 text-xs font-mono">/insights/{post.slug}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[11px] font-bold">
                                                {post.category || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex justify-center">
                                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${post.status === 'published'
                                                    ? 'bg-green-50 text-green-600 border border-green-100'
                                                    : 'bg-orange-50 text-orange-600 border border-orange-100'
                                                    }`}>
                                                    <Circle size={8} fill="currentColor" />
                                                    {post.status || 'published'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-gray-500 font-medium">
                                            {new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="w-9 h-9 rounded-full border-gray-200 hover:border-black transition-all"
                                                    onClick={() => navigate(`/admin/posts/${post.id}`)}
                                                >
                                                    <Edit3 size={16} />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="w-9 h-9 rounded-full border-gray-200 hover:text-blue-600 hover:border-blue-200 transition-all"
                                                    onClick={() => window.open(`/insights/${post.slug}`, '_blank')}
                                                >
                                                    <ArrowUpRight size={16} />
                                                </Button>

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="w-9 h-9 rounded-lg hover:bg-gray-100">
                                                            <MoreHorizontal size={16} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-40 rounded-xl border-gray-100 shadow-xl p-1">
                                                        <DropdownMenuItem
                                                            className="text-red-500 focus:text-red-600 focus:bg-red-50 rounded-lg font-semibold py-2 cursor-pointer gap-2"
                                                            onClick={() => handleDelete(post.id)}
                                                        >
                                                            <Trash2 size={14} /> Archive Post
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Posts;
