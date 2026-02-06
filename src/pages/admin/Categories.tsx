
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import {
    Plus,
    Trash2,
    Edit,
    Search,
    Hash,
    AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from "sonner";

const Categories = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [newCatName, setNewCatName] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        // We fetch from 'posts' to see used categories, 
        // but ideally we fetch from a 'categories' table.
        // For now, let's assume a 'categories' table exists.
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name', { ascending: true });

        if (error) {
            console.error(error);
            // If table doesn't exist, we might get an error.
            // I'll remind the user to create it.
        } else {
            setCategories(data || []);
        }
        setLoading(false);
    };

    const generateSlug = (text: string) => {
        return text.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCatName.trim()) return;

        const slug = generateSlug(newCatName);
        const { error } = await supabase
            .from('categories')
            .insert([{ name: newCatName.trim(), slug }]);

        if (error) {
            toast.error("Category already exists or error occurred.");
        } else {
            toast.success("Category added.");
            setNewCatName("");
            fetchCategories();
        }
    };

    const handleUpdate = async (id: string) => {
        const slug = generateSlug(editName);
        const { error } = await supabase
            .from('categories')
            .update({ name: editName.trim(), slug })
            .eq('id', id);

        if (error) {
            toast.error("Error updating category.");
        } else {
            toast.success("Category updated.");
            setEditingId(null);
            fetchCategories();
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Delete "${name}"? This won't delete posts, but they may become uncategorized.`)) {
            const { error } = await supabase.from('categories').delete().eq('id', id);
            if (error) {
                toast.error("Error deleting category.");
            } else {
                toast.success("Category removed.");
                fetchCategories();
            }
        }
    };

    const filtered = categories.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="space-y-8 font-sans">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-black mb-1">Taxonomy</h1>
                        <p className="text-gray-500 font-medium text-sm">Manage global blog categories.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Add New Category */}
                    <div className="lg:col-span-4">
                        <div className="bg-white border border-gray-200 p-8 rounded-[2rem] shadow-sm sticky top-28">
                            <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                                <Plus size={14} /> New Category
                            </h3>
                            <form onSubmit={handleAdd} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1 font-sans">Category Name</label>
                                    <Input
                                        value={newCatName}
                                        onChange={(e) => setNewCatName(e.target.value)}
                                        placeholder="e.g. Litigation Finance"
                                        className="h-12 bg-gray-50 border-gray-100 rounded-xl font-bold placeholder:text-gray-200"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-black text-white hover:bg-gray-800 rounded-xl font-bold shadow-lg shadow-black/10"
                                >
                                    Add to Library
                                </Button>
                            </form>
                            <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
                                <AlertCircle size={18} className="text-blue-500 shrink-0" />
                                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider leading-relaxed">
                                    Slugs are automatically generated for URL compatibility.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Category List */}
                    <div className="lg:col-span-8">
                        <div className="bg-white border border-gray-200 rounded-[2rem] shadow-xl shadow-gray-200/40 overflow-hidden">
                            <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                                <div className="relative group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                                    <Input
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Filter categories..."
                                        className="pl-12 h-12 bg-white border-gray-100 rounded-xl text-sm"
                                    />
                                </div>
                            </div>

                            <div className="divide-y divide-gray-50">
                                {loading ? (
                                    <div className="p-20 text-center">
                                        <div className="w-8 h-8 border-4 border-gray-100 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Loading Library...</span>
                                    </div>
                                ) : filtered.map((cat) => (
                                    <div key={cat.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all">
                                                <Hash size={18} />
                                            </div>
                                            {editingId === cat.id ? (
                                                <Input
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    className="h-10 bg-white border-black/10 rounded-lg font-bold min-w-[200px]"
                                                    autoFocus
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handleUpdate(cat.id);
                                                        if (e.key === 'Escape') setEditingId(null);
                                                    }}
                                                />
                                            ) : (
                                                <div className="flex flex-col">
                                                    <span className="font-black text-gray-900 text-lg tracking-tight">{cat.name}</span>
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">/{cat.slug}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {editingId === cat.id ? (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleUpdate(cat.id)}
                                                    className="bg-black text-white rounded-lg h-9 px-4 font-bold"
                                                >
                                                    Save
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        setEditingId(cat.id);
                                                        setEditName(cat.name);
                                                    }}
                                                    className="w-10 h-10 bg-white border border-gray-100 hover:bg-black hover:text-white rounded-xl shadow-sm transition-all"
                                                >
                                                    <Edit size={16} />
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(cat.id, cat.name)}
                                                className="w-10 h-10 bg-white border border-gray-100 hover:bg-red-50 hover:text-red-500 rounded-xl shadow-sm transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {!loading && filtered.length === 0 && (
                                    <div className="p-20 text-center opacity-30">
                                        <Hash size={48} className="mx-auto mb-4" />
                                        <p className="font-black uppercase tracking-widest text-xs">Library Empty</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Categories;
