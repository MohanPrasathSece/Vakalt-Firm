
import { useState, useEffect, useRef, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import AdminLayout from '@/components/admin/AdminLayout';
import {
    ArrowLeft,
    ImageIcon,
    X,
    Upload,
    Clock,
    Settings,
    Eye,
    Type,
    CheckCircle2,
    AlertTriangle,
    FileText,
    Globe,
    Search as SearchIcon
} from 'lucide-react';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

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

    // SEO Fields
    const [seoTitle, setSeoTitle] = useState('');
    const [seoDesc, setSeoDesc] = useState('');

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

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
            toast.error("Error loading post");
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
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `post-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('blog-images')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('blog-images')
            .getPublicUrl(filePath);

        return publicUrl;
    };

    const handleHeaderImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            const url = await uploadFile(file);
            setImageUrl(url);
            toast.success("Header asset synchronized.");
        } catch (error: any) {
            toast.error("Upload failed. Verify 'blog-images' bucket policies.");
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
                    toast.info("Uploading inline image...", { duration: 2000 });
                    const url = await uploadFile(file);
                    const quill = quillRef.current.getEditor();
                    const range = quill.getSelection();
                    if (range) {
                        quill.insertEmbed(range.index, 'image', url);
                    }
                } catch (error) {
                    toast.error("Inline upload failed.");
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
                [{ 'align': [] }],
                ['link', 'image', 'code-block'],
                ['clean']
            ],
            handlers: {
                image: imageHandler
            }
        }
    }), []);

    const handleSave = async () => {
        if (!title || !slug || !content) {
            toast.warning("Incomplete Data: Title, Slug, and Content are required.");
            setShowConfirm(false);
            return;
        }

        setLoading(true);
        const postData = {
            title,
            slug,
            category,
            content,
            excerpt,
            read_time: readTime,
            featured,
            status,
            image_url: imageUrl,
            seo_title: seoTitle,
            seo_description: seoDesc,
            updated_at: new Date().toISOString(),
        };

        try {
            const { error } = isNew
                ? await supabase.from('posts').insert([{ ...postData, created_at: new Date().toISOString() }])
                : await supabase.from('posts').update(postData).eq('id', id);

            if (error) throw error;

            toast.success(`Publication ${isNew ? 'Launched' : 'Synchronized'}`);
            navigate('/admin/posts');
        } catch (error: any) {
            toast.error("Sync Error: " + error.message);
        } finally {
            setLoading(false);
            setShowConfirm(false);
        }
    };

    if (loading && !isNew) {
        return <AdminLayout>
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-12 h-12 border-4 border-gray-100 border-t-black rounded-full animate-spin"></div>
                <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Accessing Secure Records...</p>
            </div>
        </AdminLayout>;
    }

    return (
        <AdminLayout>
            <div className="space-y-12 max-w-6xl mx-auto pb-40 font-sans">
                {/* Modern Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-gray-100 pb-10">
                    <div className="flex items-center gap-6">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => navigate('/admin/posts')}
                            className="w-12 h-12 bg-white border border-gray-200 hover:bg-gray-100 rounded-xl"
                        >
                            <ArrowLeft size={20} />
                        </Button>
                        <div>
                            <h1 className="text-4xl font-black tracking-tight text-black">{isNew ? 'New Insight' : 'Refine Article'}</h1>
                            <p className="text-gray-500 font-medium">Drafting authoritative legal content.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => navigate('/admin/posts')}
                            className="h-14 px-8 text-gray-400 hover:text-black font-bold uppercase text-[10px] tracking-widest"
                        >
                            Discard Draft
                        </Button>
                        <Button
                            type="button"
                            onClick={() => setShowConfirm(true)}
                            disabled={loading}
                            className={`h-14 px-10 rounded-2xl font-black gap-2 shadow-2xl transition-all active:scale-95 ${status === 'published' ? 'bg-black text-white hover:bg-gray-800 shadow-black/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 shadow-none'
                                }`}
                        >
                            <CheckCircle2 size={18} />
                            {isNew ? 'Save Publication' : 'Update Content'}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8 space-y-10">
                        <Tabs defaultValue="editor" className="w-full">
                            <TabsList className="bg-gray-100/50 p-1.5 rounded-2xl gap-2 mb-8">
                                <TabsTrigger value="editor" className="rounded-xl px-8 py-3 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                    <FileText size={16} className="mr-2" /> Publisher
                                </TabsTrigger>
                                <TabsTrigger value="seo" className="rounded-xl px-8 py-3 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                    <Globe size={16} className="mr-2" /> Google Meta (SEO)
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="editor" className="space-y-10 focus-visible:outline-none">
                                {/* Editor Section */}
                                <div className="bg-white border border-gray-200 p-10 rounded-[3rem] shadow-sm space-y-10">
                                    <div className="space-y-4">
                                        <Label className="text-gray-400 uppercase text-[10px] font-black tracking-[0.2em] flex items-center gap-2 pl-1">
                                            <Type size={12} /> Primary Headline
                                        </Label>
                                        <Input
                                            value={title}
                                            onChange={handleTitleChange}
                                            placeholder="Click to add headline..."
                                            className="text-4xl font-black h-auto leading-tight bg-transparent border-none p-0 focus-visible:ring-0 placeholder:text-gray-100 text-black tracking-tighter"
                                            required
                                        />
                                        <div className="h-0.5 bg-gray-50 w-full rounded-full"></div>
                                        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                            <span className="opacity-40">Permalink:</span>
                                            <span className="text-black/30">/insights/</span>
                                            <input
                                                value={slug}
                                                onChange={(e) => setSlug(e.target.value)}
                                                className="bg-transparent border-none p-0 focus:outline-none focus:text-black transition-colors font-mono"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Label className="text-gray-400 uppercase text-[10px] font-black tracking-[0.2em] flex items-center gap-2 pl-1">
                                            <FileText size={12} /> Executive Summary (Excerpt)
                                        </Label>
                                        <Textarea
                                            value={excerpt}
                                            onChange={(e) => setExcerpt(e.target.value)}
                                            placeholder="Write a brief overview for the blog cards..."
                                            className="bg-gray-50/50 border-gray-100 focus:border-black focus:ring-1 focus:ring-black rounded-3xl min-h-[140px] text-gray-700 leading-relaxed font-medium p-8 shadow-inner transition-all"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <Label className="text-gray-400 uppercase text-[10px] font-black tracking-[0.2em] flex items-center gap-2 pl-1">
                                            <ImageIcon size={12} /> Editorial Narrative
                                        </Label>
                                        <div className="editor-container rounded-[2.5rem] overflow-hidden border border-gray-200 bg-white shadow-inner">
                                            <ReactQuill
                                                ref={quillRef}
                                                theme="snow"
                                                value={content}
                                                onChange={setContent}
                                                modules={modules}
                                                className="h-[700px]"
                                            />
                                        </div>
                                        <div className="flex items-center justify-center gap-3 pt-6">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                                Active Image Handler: Drag & Drop or Paste Enabled
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="seo" className="focus-visible:outline-none">
                                <div className="bg-white border border-gray-200 p-10 rounded-[3rem] shadow-sm space-y-10">
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-black text-black tracking-tight">Search Engine Protocol</h3>
                                        <p className="text-gray-400 font-medium">Control how your insight appears in search results.</p>
                                    </div>

                                    <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 space-y-6">
                                        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                                                <SearchIcon size={14} className="text-blue-500" />
                                            </div>
                                            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Google Preview</span>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-[#1a0dab] text-xl font-medium hover:underline cursor-pointer truncate">{seoTitle || title || 'Insight Title'}</div>
                                            <div className="text-[#006621] text-sm flex items-center gap-1">vakalt.com/insights/{slug || 'post-slug'} <span className="text-[10px] border border-[#006621]/20 rounded px-1 opacity-50">▼</span></div>
                                            <div className="text-[#545454] text-sm leading-relaxed line-clamp-2">
                                                {seoDesc || excerpt || 'Enter meta description to improve search visibility and click-through rates.'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-8">
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Target SEO Title</Label>
                                            <Input
                                                value={seoTitle}
                                                onChange={(e) => setSeoTitle(e.target.value)}
                                                placeholder="Custom title for Google..."
                                                className="h-14 bg-gray-50 border-gray-100 rounded-2xl font-bold"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Meta Description</Label>
                                            <Textarea
                                                value={seoDesc}
                                                onChange={(e) => setSeoDesc(e.target.value)}
                                                placeholder="Highly optimized description for search snippets..."
                                                className="bg-gray-50 border-gray-100 rounded-2xl min-h-[120px] font-medium"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Controls Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Publish Settings */}
                        <div className="bg-white border border-gray-200 p-8 rounded-[2.5rem] shadow-sm space-y-8">
                            <h3 className="font-black flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-400 border-b border-gray-50 pb-6">
                                <Settings size={14} /> Publication Tools
                            </h3>

                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-black uppercase tracking-wider pl-1">Global Status</Label>
                                <div className="grid grid-cols-2 gap-2 p-1.5 bg-gray-50 rounded-2xl border border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setStatus('draft')}
                                        className={`py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${status === 'draft' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-black'}`}
                                    >
                                        Draft
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStatus('published')}
                                        className={`py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${status === 'published' ? 'bg-black text-white shadow-lg shadow-black/20' : 'text-gray-400 hover:text-black'}`}
                                    >
                                        Live
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-xs font-bold text-black uppercase tracking-wider pl-1 font-sans">Strategic Category</Label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl h-14 px-6 text-sm font-bold focus:outline-none focus:border-black transition-all appearance-none text-black cursor-pointer shadow-sm"
                                >
                                    <option value="Uncategorized">Uncategorized</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                                    ))}
                                </select>
                                <p className="text-[9px] text-gray-400 font-medium px-1 leading-relaxed italic">
                                    Manage categories in the Taxonomy section.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-black uppercase tracking-wider pl-1">Article Read Time</Label>
                                <div className="relative">
                                    <Clock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        value={readTime}
                                        onChange={(e) => setReadTime(e.target.value)}
                                        placeholder="e.g. 5 min read"
                                        className="h-14 bg-gray-50 border-gray-100 rounded-2xl pl-14 text-sm font-bold placeholder:text-gray-200 shadow-sm"
                                    />
                                </div>
                            </div>

                            <div className="p-6 bg-gray-50 border border-gray-100 rounded-[2rem] flex items-center justify-between transition-all hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 group">
                                <div className="space-y-1">
                                    <Label htmlFor="featured" className="text-sm font-black text-black tracking-tight cursor-pointer">Pin to Featured</Label>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest group-hover:text-black transition-colors">Hero Section Priority</p>
                                </div>
                                <Switch
                                    id="featured"
                                    checked={featured}
                                    onCheckedChange={setFeatured}
                                />
                            </div>
                        </div>

                        {/* Image Upload UI Redesign */}
                        <div className="bg-white border border-gray-200 p-8 rounded-[2.5rem] shadow-sm space-y-6">
                            <h3 className="font-black flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-400 border-b border-gray-50 pb-6">
                                <ImageIcon size={14} /> Global Cover Image
                            </h3>

                            <div
                                className={`relative aspect-[16/10] rounded-[2rem] border-2 border-dashed transition-all overflow-hidden flex flex-col items-center justify-center cursor-pointer group
                                    ${imageUrl ? 'border-transparent shadow-2xl' : 'border-gray-100 bg-gray-50 hover:border-black/10 hover:bg-gray-100/30'}`}
                                onClick={() => !uploading && !imageUrl && fileInputRef.current?.click()}
                            >
                                {uploading ? (
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-10 h-10 border-4 border-gray-100 border-t-black rounded-full animate-spin"></div>
                                        <p className="text-[10px] font-black text-black uppercase tracking-widest">Optimizing Assets...</p>
                                    </div>
                                ) : imageUrl ? (
                                    <>
                                        <img src={imageUrl} alt="Cover" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3 backdrop-blur-[2px]">
                                            <Button
                                                type="button"
                                                size="sm"
                                                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                                                className="bg-white text-black h-11 px-6 font-black rounded-xl hover:bg-gray-100 shadow-xl"
                                            >
                                                Replace
                                            </Button>
                                            <Button
                                                type="button"
                                                size="icon"
                                                onClick={(e) => { e.stopPropagation(); setImageUrl(''); }}
                                                className="h-11 w-11 bg-red-500 text-white rounded-xl hover:bg-red-600 shadow-xl"
                                            >
                                                <X size={18} />
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-8">
                                        <div className="w-20 h-20 rounded-[2rem] bg-white shadow-xl shadow-gray-200/50 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all text-black">
                                            <Upload className="w-8 h-8" />
                                        </div>
                                        <p className="font-black text-black text-lg tracking-tight">Select Cover Photo</p>
                                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-2">Maximum File Size: 5.0 MB</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleHeaderImageUpload}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full h-14 text-black border-gray-200 hover:bg-black hover:text-white rounded-2xl font-black gap-2 transition-all shadow-sm"
                            onClick={() => window.open(`/insights/${slug}`, '_blank')}
                        >
                            <Eye size={18} /> Deep-Link Preview
                        </Button>
                    </div>
                </div>
            </div>

            {/* Confirmation Dialog */}
            <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                <DialogContent className="bg-white border-none rounded-[3rem] shadow-2xl p-0 overflow-hidden max-w-lg">
                    <div className="p-10 text-center space-y-6">
                        <div className="w-20 h-20 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto">
                            <AlertTriangle size={36} className="text-black" />
                        </div>
                        <div className="space-y-2">
                            <DialogTitle className="text-3xl font-black tracking-tight text-black">Final Protocol Check</DialogTitle>
                            <DialogDescription className="text-gray-400 font-medium px-6 leading-relaxed">
                                {status === 'published'
                                    ? "You are about to synchronize this article with the live production database. All changes will be reflected immediately."
                                    : "You are saving this article as a draft. It will be hidden from the public insights page until published."}
                            </DialogDescription>
                        </div>
                    </div>
                    <div className="flex border-t border-gray-100">
                        <Button
                            variant="ghost"
                            onClick={() => setShowConfirm(false)}
                            className="flex-1 h-20 rounded-none border-r border-gray-100 text-gray-400 font-bold hover:bg-gray-50 uppercase text-[10px] tracking-widest"
                        >
                            Back to Editing
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={loading}
                            className="flex-1 h-20 rounded-none bg-black text-white hover:bg-gray-800 font-black uppercase text-[10px] tracking-widest shadow-none"
                        >
                            {loading ? "Transmitting..." : "Proceed to Live"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <style>{`
                .editor-container .ql-toolbar.ql-snow {
                    background: #fdfdfd;
                    border: none !important;
                    border-bottom: 2px solid #f8f9fa !important;
                    padding: 1.5rem 2.5rem;
                }
                .editor-container .ql-container.ql-snow {
                    border: none !important;
                }
                .editor-container .ql-editor {
                    padding: 3rem;
                    font-size: 1.15rem;
                    line-height: 1.85;
                    color: #1a1a1a;
                    min-height: 600px;
                }
                .editor-container .ql-editor.ql-blank::before {
                    left: 3rem;
                    color: #e5e7eb;
                    font-style: normal;
                }
                .editor-container .ql-editor img {
                    border-radius: 1.5rem;
                    margin: 2rem 0;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                }
                .editor-container .ql-editor img:hover {
                    box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.2);
                }
                .editor-container .ql-editor blockquote {
                    border-left: 5px solid black;
                    padding-left: 2rem;
                    font-style: italic;
                    color: #4b5563;
                    margin: 2rem 0;
                }
            `}</style>
        </AdminLayout>
    );
};

export default EditPost;
