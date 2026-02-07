
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
    Plus,
    Trash2,
    Edit2,
    Save,
    X,
    Hash,
    Layers,
    ChevronRight,
    AlertCircle
} from 'lucide-react';

const Categories = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newName, setNewName] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('categories').select('*').order('name');
        if (error) toast.error("Failed to load categories");
        else setCategories(data || []);
        setLoading(false);
    };

    const handleAdd = async () => {
        if (!newName.trim()) return;
        const slug = newName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const { error } = await supabase.from('categories').insert([{ name: newName, slug }]);
        if (error) toast.error("Error adding category");
        else {
            toast.success("Category created");
            setNewName("");
            fetchCategories();
        }
    };

    const handleDelete = async (id: string) => {
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) toast.error("Error deleting");
        else {
            toast.success("Category removed");
            fetchCategories();
        }
    };

    const handleUpdate = async (id: string) => {
        const slug = editValue.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const { error } = await supabase.from('categories').update({ name: editValue, slug }).eq('id', id);
        if (error) toast.error("Update failed");
        else {
            toast.success("Taxonomy updated");
            setEditingId(null);
            fetchCategories();
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl space-y-10 animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-black">Taxonomy</h1>
                        <p className="text-gray-500 mt-1 text-sm font-medium">Categorize and organize your legal insights.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-white border border-[#E5E7EB] p-8 rounded-3xl shadow-sm space-y-6">
                            <div className="flex items-center gap-2 border-b border-[#F3F4F6] pb-4 text-black">
                                <Layers size={18} />
                                <h3 className="font-bold">Add Category</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Name</label>
                                    <Input
                                        placeholder="e.g., Corporate Law"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        className="h-11 bg-gray-50/50 rounded-full px-6 text-sm font-bold"
                                    />
                                </div>
                                <Button onClick={handleAdd} className="w-full bg-black text-white hover:bg-gray-800 h-11 rounded-full font-bold gap-2 shadow-xl shadow-black/5 transition-all active:scale-95 text-xs uppercase tracking-widest">
                                    <Plus size={18} /> Create Category
                                </Button>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl flex gap-4">
                            <AlertCircle size={20} className="text-blue-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-blue-700 leading-relaxed font-medium">
                                <strong>Note:</strong> Renaming or deleting categories will reflect across the public Insights page instantly. Posts in deleted categories will display as "Uncategorized".
                            </p>
                        </div>
                    </div>

                    <div className="lg:col-span-7">
                        <div className="bg-white border border-[#E5E7EB] rounded-3xl shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-[#F3F4F6] bg-gray-50/50">
                                <div className="flex items-center gap-2 text-gray-500 uppercase text-[10px] font-black tracking-widest pl-2">
                                    <Hash size={14} /> Available Classifications
                                </div>
                            </div>
                            <div className="divide-y divide-[#F3F4F6]">
                                {loading ? (
                                    <div className="p-20 text-center"><div className="w-6 h-6 border-2 border-gray-100 border-t-black rounded-full animate-spin mx-auto"></div></div>
                                ) : (
                                    <>
                                        {/* Uncategorized - Always shown */}
                                        <div className="p-6 flex items-center justify-between bg-gray-50/30">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                                                    <span className="font-bold text-gray-600">Uncategorized</span>
                                                    <span className="text-[10px] text-gray-400 font-mono tracking-tight bg-gray-100 px-2 py-0.5 rounded">/uncategorized</span>
                                                    <span className="text-[9px] text-gray-400 uppercase tracking-wider font-black ml-2">(Default)</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* User-created categories */}
                                        {categories.length === 0 ? (
                                            <div className="p-20 text-center text-gray-400 font-medium italic">No custom categories defined yet.</div>
                                        ) : categories.map((cat) => (
                                            <div key={cat.id} className="p-6 flex items-center justify-between hover:bg-[#F9FAFB] transition-colors group">
                                                <div className="flex-1">
                                                    {editingId === cat.id ? (
                                                        <div className="flex items-center gap-2 max-w-sm animate-in fade-in slide-in-from-left-2 duration-300">
                                                            <Input
                                                                value={editValue}
                                                                onChange={(e) => setEditValue(e.target.value)}
                                                                className="h-10 bg-white border-black rounded-full px-4 font-bold"
                                                                autoFocus
                                                            />
                                                            <Button variant="outline" size="icon" onClick={() => handleUpdate(cat.id)} className="shrink-0 rounded-full hover:border-black"><Save size={16} /></Button>
                                                            <Button variant="ghost" size="icon" onClick={() => setEditingId(null)} className="shrink-0 rounded-full"><X size={16} /></Button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                                                            <span className="font-bold text-black">{cat.name}</span>
                                                            <span className="text-[10px] text-gray-400 font-mono tracking-tight bg-gray-50 px-2 py-0.5 rounded">/{cat.slug}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                {editingId !== cat.id && (
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button variant="ghost" size="icon" className="w-9 h-9 text-gray-400 hover:text-black hover:bg-white border hover:border-gray-200 rounded-full transition-all" onClick={() => { setEditingId(cat.id); setEditValue(cat.name); }}>
                                                            <Edit2 size={14} />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="w-9 h-9 text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border hover:border-red-100 rounded-full transition-all" onClick={() => handleDelete(cat.id)}>
                                                            <Trash2 size={14} />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </>
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
