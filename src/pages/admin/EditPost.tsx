
import { useState, useEffect, useRef, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/components/admin/AdminLayout';
import {
    ArrowLeft,
    Upload,
    X,
    Save,
    Eye,
    Globe,
    Image as ImageIcon,
    Clock,
    CheckCircle,
    FileText
} from 'lucide-react';
import { toast } from 'sonner';

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const quillRef = useRef<ReactQuill>(null);
    const isNew = !id;

    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [category, setCategory] = useState('Uncategorized');
    const [categories, setCategories] = useState<any[]>([]);
    const [content, setContent] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [readTime, setReadTime] = useState('5 min read');
    const [featured, setFeatured] = useState(false);
    const [status, setStatus] = useState<'published' | 'draft'>('published');
    const [imageUrl, setImageUrl] = useState('');

    const [seoTitle, setSeoTitle] = useState('');
    const [seoDesc, setSeoDesc] = useState('');

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchCategories();
        if (!isNew) {
            loadPost();
        }
    }, [id]);

    const fetchCategories = async () => {
        const { data } = await supabase.from('categories').select('*').order('name');
        if (data) setCategories(data);
    };

    const loadPost = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();
        if (error) {
            toast.error("Error loading publication");
            navigate('/admin/posts');
        }
        if (data) {
            setTitle(data.title);
            setSlug(data.slug);
            setCategory(data.category || 'Uncategorized');
            setContent(data.content || '');
            setExcerpt(data.excerpt || '');
            setReadTime(data.read_time || '5 min read');
            setFeatured(data.featured || false);
            setStatus(data.status || 'published');
            setImageUrl(data.image_url || '');
            setSeoTitle(data.seo_title || '');
            setSeoDesc(data.seo_description || '');
        }
        setLoading(false);
    };

    const generateSlug = (text: string) => {
        return text.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setTitle(val);
        if (isNew) {
            setSlug(generateSlug(val));
            setSeoTitle(val);
        }
    };

    const uploadFile = async (file: File) => {
        // Cloudinary configuration - should be moved to .env
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dx2q3cxrn';
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'vakalt_unsigned';

        if (!cloudName || cloudName === 'YOUR_CLOUD_NAME') {
            console.warn('Cloudinary Cloud Name not configured correctly.');
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Cloudinary upload failed');
            }

            const data = await response.json();
            return data.secure_url;
        } catch (error: any) {
            console.error('Cloudinary upload error:', error);
            throw error;
        }
    };

    const handleHeaderImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File too large. Maximum size is 5MB.");
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error("Please upload an image file.");
            return;
        }

        try {
            setUploading(true);
            const url = await uploadFile(file);
            setImageUrl(url);
            toast.success("Cover image uploaded successfully");
        } catch (error: any) {
            console.error("Upload error:", error);
            toast.error(`Upload failed: ${error.message || 'Unknown error'}. Please check storage bucket settings.`);
        } finally {
            setUploading(false);
        }
    };

    const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files?.[0];
            if (file && quillRef.current) {
                try {
                    toast.info("Uploading inline image...");
                    const url = await uploadFile(file);
                    const quill = quillRef.current.getEditor();
                    const range = quill.getSelection();
                    if (range) {
                        quill.insertEmbed(range.index, 'image', url);
                        toast.success("Image inserted");
                    }
                } catch (error: any) {
                    console.error("Inline image error:", error);
                    toast.error(`Inline upload failed: ${error.message || 'Unknown error'}`);
                }
            }
        };
    };

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['link', 'image', 'code-block'],
                ['clean']
            ],
            handlers: { image: imageHandler }
        }
    }), []);

    const handleSave = async () => {
        if (!title || !slug || !content) {
            toast.warning("Title, slug, and content are required.");
            return;
        }

        setSaving(true);
        const postData = {
            title, slug, category, content, excerpt,
            read_time: readTime, featured, status,
            image_url: imageUrl, seo_title: seoTitle,
            seo_description: seoDesc,
            updated_at: new Date().toISOString(),
        };

        try {
            const { error } = isNew
                ? await supabase.from('posts').insert([{ ...postData, created_at: new Date().toISOString() }])
                : await supabase.from('posts').update(postData).eq('id', id);

            if (error) throw error;
            toast.success(isNew ? "Post launched successfully" : "Publication synchronized");
            navigate('/admin/posts');
        } catch (error: any) {
            toast.error("Sync Error: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <AdminLayout>
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <div className="w-8 h-8 border-2 border-gray-100 border-t-black rounded-full animate-spin"></div>
                <p className="text-gray-400 font-medium">Accessing records...</p>
            </div>
        </AdminLayout>
    );

    return (
        <AdminLayout>
            <div className="max-w-6xl mx-auto space-y-10 pb-40 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-8">
                    <div className="flex items-center gap-6">
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/admin/posts')}
                            className="w-10 h-10 p-0 hover:bg-white border border-gray-200 rounded-xl transition-all"
                        >
                            <ArrowLeft size={18} />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-black text-black tracking-tight">{isNew ? 'New Publication' : 'Edit Insight'}</h1>
                            <p className="text-sm text-gray-500 font-medium">Drafting authoritative legal intelligence.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" className="font-bold text-gray-400 hover:text-black uppercase text-[10px] tracking-widest px-6" onClick={() => navigate('/admin/posts')}>Discard</Button>
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-black text-white hover:bg-gray-800 rounded-2xl h-12 px-8 font-bold shadow-xl shadow-black/10 gap-2 transition-all active:scale-95"
                        >
                            <Save size={18} />
                            {saving ? 'Syncing...' : 'Save Changes'}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 space-y-10">
                        {/* Core Editor */}
                        <div className="bg-white border border-gray-200 p-8 rounded-3xl shadow-sm space-y-8 transition-all">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Title Headline</Label>
                                <Input
                                    value={title}
                                    onChange={handleTitleChange}
                                    placeholder="Add title..."
                                    className="text-3xl font-black h-auto border-none p-0 focus-visible:ring-0 placeholder:text-gray-200 text-black tracking-tight leading-tight"
                                />
                                <div className="h-[1px] bg-gray-50 w-full"></div>
                                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                    <span className="opacity-50">Slug:</span>
                                    <span className="text-blue-500">/insights/</span>
                                    <input
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        className="bg-transparent border-none p-0 focus:outline-none focus:text-black font-mono"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Excerpt (Card View)</Label>
                                <Textarea
                                    value={excerpt}
                                    onChange={(e) => setExcerpt(e.target.value)}
                                    placeholder="Write a brief overview for cards..."
                                    className="bg-gray-50/50 border-gray-100 focus:border-black rounded-2xl min-h-[100px] text-gray-700 leading-relaxed font-medium p-4 transition-all"
                                />
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Content Editor</Label>
                                <div className="editor-container rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-inner">
                                    <ReactQuill
                                        ref={quillRef}
                                        theme="snow"
                                        value={content}
                                        onChange={setContent}
                                        modules={modules}
                                        className="h-[600px]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SEO Tools */}
                        <div className="bg-white border border-gray-200 p-8 rounded-3xl shadow-sm space-y-6">
                            <div className="flex items-center gap-2 border-b border-gray-50 pb-4">
                                <Globe size={18} className="text-blue-500" />
                                <h3 className="font-bold text-black tracking-tight">Search Engine Meta</h3>
                            </div>
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-gray-600">SEO Title</Label>
                                    <Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className="rounded-xl border-gray-200 bg-gray-50/30" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-gray-600">Meta Description</Label>
                                    <Textarea value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} className="rounded-xl border-gray-200 bg-gray-50/30" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                        {/* Status Sidebar */}
                        <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-sm space-y-6">
                            <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Publication Status</Label>
                                <div className="grid grid-cols-2 gap-2 bg-gray-50 p-1 rounded-xl border border-gray-100">
                                    <button
                                        onClick={() => setStatus('draft')}
                                        className={`py-2 px-4 rounded-lg text-xs font-bold transition-all ${status === 'draft' ? "bg-white text-black shadow-sm" : "text-gray-400"}`}
                                    >
                                        Draft
                                    </button>
                                    <button
                                        onClick={() => setStatus('published')}
                                        className={`py-2 px-4 rounded-lg text-xs font-bold transition-all ${status === 'published' ? "bg-black text-white shadow-lg" : "text-gray-400"}`}
                                    >
                                        Live
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Categorization</Label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl h-11 px-4 text-sm font-bold focus:outline-none focus:border-black appearance-none"
                                >
                                    <option value="Uncategorized">Uncategorized</option>
                                    {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                                </select>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Read Time</Label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input value={readTime} onChange={(e) => setReadTime(e.target.value)} className="bg-gray-50 border-gray-100 pl-11 h-11 rounded-xl text-sm font-bold" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="space-y-0.5">
                                    <span className="text-xs font-bold text-black">Feature on Hero</span>
                                    <p className="text-[10px] text-gray-400 font-medium">Prioritize in Insights page</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={featured}
                                    onChange={(e) => setFeatured(e.target.checked)}
                                    className="w-5 h-5 rounded-md border-gray-300 text-black focus:ring-black accent-black"
                                />
                            </div>
                        </div>

                        {/* Media Sidebar */}
                        <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-sm space-y-6">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Hero Media</Label>
                            <div
                                className={`relative aspect-video rounded-2xl overflow-hidden border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer group ${imageUrl ? "border-transparent" : "border-gray-100 bg-gray-50 hover:bg-white hover:border-black/20"}`}
                                onClick={() => !uploading && fileInputRef.current?.click()}
                            >
                                {uploading ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-6 h-6 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
                                        <span className="text-[10px] font-bold text-gray-400">Uploading...</span>
                                    </div>
                                ) : imageUrl ? (
                                    <>
                                        <img src={imageUrl} alt="Cover" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm">
                                            <Button size="sm" className="bg-white text-black hover:bg-gray-100 font-bold rounded-lg h-9">Replace Image</Button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-6 space-y-2">
                                        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center mx-auto text-gray-400">
                                            <Upload size={20} />
                                        </div>
                                        <p className="text-xs font-bold text-black">Sync Digital Asset</p>
                                    </div>
                                )}
                                <input type="file" ref={fileInputRef} onChange={handleHeaderImageUpload} className="hidden" accept="image/*" />
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            className="w-full h-12 rounded-2xl border-gray-200 hover:border-black font-bold gap-2 transition-all"
                            onClick={() => window.open(`/insights/${slug}`, '_blank')}
                        >
                            <Eye size={18} /> View Live Draft
                        </Button>
                    </div>
                </div>
            </div>

            <style>{`
                .editor-container .ql-toolbar.ql-snow {
                    border: none !important;
                    border-bottom: 1px solid #F3F4F6 !important;
                    background: #F9FAFB;
                    padding: 1rem 1.5rem;
                }
                .editor-container .ql-container.ql-snow {
                    border: none !important;
                }
                .editor-container .ql-editor {
                    padding: 2rem;
                    font-size: 1rem;
                    line-height: 1.6;
                    color: #374151;
                    min-height: 500px;
                }
                .editor-container .ql-editor img {
                    border-radius: 1rem;
                    margin: 2rem 0;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
                }
            `}</style>
        </AdminLayout>
    );
};

export default EditPost;
