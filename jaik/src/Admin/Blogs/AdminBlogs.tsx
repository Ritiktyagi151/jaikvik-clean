"use client";
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import {
  FiEdit2, FiTrash2, FiPlus, FiSearch, FiLock, FiUnlock,
  FiRefreshCw, FiUpload, FiX, FiUser, FiCalendar, FiEye
} from "react-icons/fi";
import { useDebounce } from "use-debounce";
import "react-quill-new/dist/quill.snow.css";
// ✅ IMPORT INTERFACE
import type { blogInterface } from "../../interfaces/blogInterface";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";
const MEDIA_BASE = API_BASE.replace('/api', '');
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
const QuillEditor = ReactQuill as any;

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "list",
  "bullet",
  "align",
  "link",
  "image",
  "code-block",
];

const BlogDashboard: React.FC = () => {
  // ✅ UPDATED: Used blogInterface instead of Blog
  const [blogs, setBlogs] = useState<blogInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 300);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<blogInterface | null>(null);

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/blogs/admin?t=${new Date().getTime()}`);
      const incomingData = response.data.data || (Array.isArray(response.data) ? response.data : []);
      setBlogs(incomingData);
      setError(null);
    } catch (err: any) {
      console.error("Fetch Error:", err);
      setError(`Fetch failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleSave = async (formData: FormData) => {
    try {
      setLoading(true);
      // ✅ UPDATED: Checking for _id from backend
      const id = currentBlog?._id || currentBlog?.id;
      const config = { headers: { "Content-Type": "multipart/form-data" } };

      if (id) {
        await axios.put(`${API_BASE}/blogs/${id}`, formData, config);
      } else {
        await axios.post(`${API_BASE}/blogs`, formData, config);
      }
      
      setIsFormOpen(false);
      fetchBlogs();
    } catch (err: any) {
      alert(err.response?.data?.message || "Error saving blog.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await axios.delete(`${API_BASE}/blogs/${id}`);
        fetchBlogs();
      } catch (err) {
        alert("Delete failed.");
      }
    }
  };

  const handleToggleLock = async (id: string) => {
    try {
      await axios.patch(`${API_BASE}/blogs/${id}/lock`);
      fetchBlogs();
    } catch (err) { console.error(err); }
  };

  const handleStatusChange = async (blog: blogInterface, status: string) => {
    const id = blog._id || blog.id;
    if (!id) return;
    try {
      const formData = new FormData();
      formData.append("status", status);
      if (status === "published") {
        formData.append("publishedAt", new Date().toISOString());
      }
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      await axios.put(`${API_BASE}/blogs/${id}`, formData, config);
      fetchBlogs();
    } catch (err) {
      console.error(err);
      alert("Status update failed.");
    }
  };

  const filteredBlogs = useMemo(() => {
    return blogs.filter(b => 
      (b.draft?.title || b.title || "").toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      (b.draft?.author || b.author || "").toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [blogs, debouncedSearch]);

  return (
    <div className="min-h-screen bg-black text-gray-200 p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-red-600 tracking-tight uppercase">Jaikvik Admin Panel</h1>
          <div className="flex gap-4">
            <button onClick={fetchBlogs} className="p-2 border border-gray-700 rounded hover:bg-gray-800 transition-all text-white">
              <FiRefreshCw className={loading ? "animate-spin" : ""} />
            </button>
            <button 
              onClick={() => { setCurrentBlog(null); setIsFormOpen(true); }}
              className="px-4 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-700 flex items-center gap-2 transition-all shadow-lg"
            >
              <FiPlus /> NEW BLOG
            </button>
          </div>
        </div>

        {error && <div className="p-4 mb-4 bg-red-900/20 border border-red-600 text-red-500 rounded">{error}</div>}

        <div className="relative mb-6">
          <FiSearch className="absolute left-3 top-3 text-gray-500" />
          <input 
            className="w-full bg-[#111] border border-gray-800 rounded-md p-2.5 pl-10 text-white outline-none focus:border-red-600 transition-all" 
            placeholder="Search blogs..." 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
          />
        </div>

        <div className="bg-[#0a0a0a] rounded-lg border border-gray-800 overflow-x-auto shadow-2xl">
          <table className="w-full text-left min-w-[980px]">
            <thead className="bg-[#1a1a1a] text-gray-400 text-sm uppercase font-bold border-b border-gray-800">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">Author</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredBlogs.length > 0 ? (
                filteredBlogs.map((blog) => (
                  <tr key={blog._id || blog.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="p-4 font-medium text-white max-w-[250px] truncate">{blog.draft?.title || blog.title}</td>
                    <td className="p-4 text-gray-300 font-semibold italic">{blog.draft?.author || blog.author || "Admin"}</td>
                    <td className="p-4 text-gray-400 text-sm">
                        {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString('en-GB') : (blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-GB') : "N/A")}
                    </td>
                    <td className="p-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-[11px] uppercase font-bold ${
                        blog.status === "published" ? "bg-green-900/40 text-green-400" :
                        blog.status === "scheduled" ? "bg-yellow-900/40 text-yellow-400" :
                        "bg-gray-800 text-gray-300"
                      }`}>
                        {blog.status || "draft"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button onClick={() => {
                          const id = blog._id || blog.id;
                          if(id) handleToggleLock(id);
                        }} className="text-yellow-600">
                          <FiLock size={18}/>
                        </button>
                        <button
                          onClick={() => handleStatusChange(blog, blog.status === "published" ? "draft" : "published")}
                          className="text-green-500 hover:text-green-400"
                        >
                          <FiUnlock size={18}/>
                        </button>
                        <button onClick={() => { setCurrentBlog(blog); setIsFormOpen(true); }} className="text-blue-400 hover:text-blue-300">
                          <FiEdit2 size={18}/>
                        </button>
                        <button onClick={() => {
                          const id = blog._id || blog.id;
                          if(id) handleDelete(id);
                        }} className="text-red-600 hover:text-red-500">
                          <FiTrash2 size={18}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-16 text-center text-gray-600 italic text-lg">
                    {loading ? "Data is loading..." : "No blogs found in the database."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <BlogFormModal
          initialData={currentBlog}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSave}
          isLoading={loading}
        />
      )}
    </div>
  );
};

// --- Modal Component ---
const BlogFormModal = ({ initialData, onClose, onSave, isLoading }: any) => {
  const initialDraft = initialData?.draft || initialData || {};
  const [data, setData] = useState<any>({
    title: initialDraft.title || "",
    content: initialDraft.content || "",
    description: initialDraft.description || "",
    category: initialDraft.category || "Marketing",
    author: initialDraft.author || "Admin",
    tags: (initialDraft.tags || []).join(", "),
    metaTitle: initialDraft.metaTitle || "",
    metaDescription: initialDraft.metaDescription || "",
    metaKeywords: (initialDraft.metaKeywords || []).join(", "),
    canonicalUrl: initialDraft.canonicalUrl || "",
    status: initialData?.status || "draft",
    publishedAt: initialData?.publishedAt ? new Date(initialData.publishedAt).toISOString().slice(0, 16) : "",
    scheduledAt: initialData?.scheduledAt ? new Date(initialData.scheduledAt).toISOString().slice(0, 16) : "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(initialDraft.image ? `${MEDIA_BASE}${initialDraft.image}` : "");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const quillRef = useRef<any>(null);

  const handleImageUpload = async () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);
      try {
        const response = await axios.post(`${API_BASE}/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const imageUrl = response.data?.url;
        const editor = quillRef.current?.getEditor();
        const range = editor?.getSelection(true);
        if (imageUrl && range) {
          editor.insertEmbed(range.index, "image", imageUrl);
          editor.setSelection(range.index + 1);
        }
      } catch (error) {
        alert("Image upload failed.");
      }
    };
  };

  const quillModules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["link", "image", "code-block"],
        ["clean"],
      ],
      handlers: {
        image: handleImageUpload,
      },
    },
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      // ✅ Don't append _id to FormData if it's a new post
      if (key !== '_id' && data[key] !== undefined) {
          formData.append(key, data[key]);
      }
    });
    if (imageFile) formData.append("image", imageFile);
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/95 overflow-y-auto">
      <div className="bg-[#0f0f0f] border border-red-700/30 rounded-lg w-full max-w-3xl p-6 shadow-2xl my-auto">
        <div className="flex justify-between items-center mb-6 border-b border-red-700/50 pb-3">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">{initialData ? "Update Blog Post" : "Create New Blog"}</h2>
          <button onClick={onClose}><FiX className="text-gray-400 hover:text-red-500 w-6 h-6" /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="col-span-1 md:col-span-2">
                <label className="text-[10px] text-red-500 font-black mb-1 block uppercase">Blog Title *</label>
                <input required className="w-full bg-[#1a1a1a] border border-gray-800 p-3 text-white rounded outline-none focus:border-red-600" value={data.title} onChange={e => setData({...data, title: e.target.value})} />
            </div>

            <div>
                <label className="text-[10px] text-red-500 font-black mb-1 block uppercase tracking-widest"><FiUser className="inline mr-1"/> Author Name</label>
                <input required className="w-full bg-[#1a1a1a] border border-gray-800 p-3 text-white rounded outline-none focus:border-red-600" value={data.author} onChange={e => setData({...data, author: e.target.value})} />
            </div>

            <div>
                <label className="text-[10px] text-red-500 font-black mb-1 block uppercase tracking-widest"><FiCalendar className="inline mr-1"/> Publish Date</label>
                <input type="datetime-local" className="w-full bg-[#1a1a1a] border border-gray-800 p-3 text-white rounded outline-none focus:border-red-600" 
                  value={data.publishedAt || ""} 
                  onChange={e => setData({...data, publishedAt: e.target.value})} 
                />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
                <label className="text-[10px] text-red-500 font-black mb-1 block uppercase">Category</label>
                <select className="w-full bg-[#1a1a1a] border border-gray-800 p-3 text-white rounded outline-none focus:border-red-600" value={data.category} onChange={e => setData({...data, category: e.target.value})}>
                    <option value="Marketing">Marketing</option>
                    <option value="SEO">SEO</option>
                    <option value="Development">Development</option>
                    <option value="Social Media">Social Media Marketing</option>
                    <option value="E-Commerce">E-Commerce Seo</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                </select>
            </div>
            <div>
                <label className="text-[10px] text-red-500 font-black mb-1 block uppercase">Status</label>
                <select className="w-full bg-[#1a1a1a] border border-gray-800 p-3 text-white rounded outline-none focus:border-red-600" value={data.status} onChange={e => setData({...data, status: e.target.value})}>
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="published">Published</option>
                </select>
            </div>
          </div>

          {data.status === "scheduled" && (
            <div>
              <label className="text-[10px] text-red-500 font-black mb-1 block uppercase">Schedule Date</label>
              <input type="datetime-local" className="w-full bg-[#1a1a1a] border border-gray-800 p-3 text-white rounded outline-none focus:border-red-600" 
                value={data.scheduledAt || ""} 
                onChange={e => setData({...data, scheduledAt: e.target.value})} 
              />
            </div>
          )}

          <div>
              <label className="text-[10px] text-red-500 font-black mb-1 block uppercase">Tags (comma separated)</label>
              <input className="w-full bg-[#1a1a1a] border border-gray-800 p-3 text-white rounded outline-none focus:border-red-600" value={data.tags} onChange={e => setData({...data, tags: e.target.value})} />
          </div>

          <div>
              <label className="text-[10px] text-red-500 font-black mb-1 block uppercase text-gray-500">Short Description</label>
              <input required className="w-full bg-[#1a1a1a] border border-gray-800 p-3 text-white rounded outline-none focus:border-red-600" value={data.description} onChange={e => setData({...data, description: e.target.value})} />
          </div>
          
          <div className="bg-[#151515] p-4 rounded-lg border border-gray-800">
            <label className="block text-[10px] font-black text-red-500 uppercase mb-3">Featured Media</label>
            <div className="flex items-center gap-6">
              <label className="flex-1 flex flex-col items-center justify-center bg-black border-2 border-dashed border-gray-800 hover:border-red-600 rounded-lg p-6 cursor-pointer transition-all">
                <FiUpload className="text-2xl mb-2 text-red-600" />
                <span className="text-xs text-gray-500">Click to replace image</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
              {preview && (
                <div className="w-28 h-28 border border-red-600/30 rounded-lg overflow-hidden shadow-xl">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div>
              <label className="text-[10px] text-red-500 font-black mb-2 block uppercase">Content (Rich Editor)</label>
              <div className="bg-[#1a1a1a] border border-gray-800 rounded">
                <QuillEditor
                  ref={quillRef}
                  theme="snow"
                  value={data.content}
                  onChange={(val: string) => setData({ ...data, content: val })}
                  modules={quillModules}
                  formats={quillFormats}
                />
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-[10px] text-red-500 font-black mb-1 block uppercase">Meta Title</label>
              <input className="w-full bg-[#1a1a1a] border border-gray-800 p-3 text-white rounded outline-none focus:border-red-600" value={data.metaTitle} onChange={e => setData({...data, metaTitle: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] text-red-500 font-black mb-1 block uppercase">Meta Keywords</label>
              <input className="w-full bg-[#1a1a1a] border border-gray-800 p-3 text-white rounded outline-none focus:border-red-600" value={data.metaKeywords} onChange={e => setData({...data, metaKeywords: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-red-500 font-black mb-1 block uppercase">Meta Description</label>
            <textarea rows={3} className="w-full bg-[#1a1a1a] border border-gray-800 p-3 text-white rounded outline-none focus:border-red-600" value={data.metaDescription} onChange={e => setData({...data, metaDescription: e.target.value})} />
          </div>

          <div>
            <label className="text-[10px] text-red-500 font-black mb-1 block uppercase">Canonical URL</label>
            <input className="w-full bg-[#1a1a1a] border border-gray-800 p-3 text-white rounded outline-none focus:border-red-600" value={data.canonicalUrl} onChange={e => setData({...data, canonicalUrl: e.target.value})} />
          </div>
          
          <div className="flex justify-between gap-3 pt-6 border-t border-gray-800/50">
            <button type="button" onClick={() => setIsPreviewOpen(true)} className="text-gray-300 font-bold px-6 py-2 hover:text-white transition-colors flex items-center gap-2">
              <FiEye /> PREVIEW
            </button>
            <div className="flex gap-3">
            <button type="button" onClick={onClose} className="text-gray-400 font-bold px-6 py-2 hover:text-white transition-colors">CANCEL</button>
            <button disabled={isLoading} className="bg-red-600 px-12 py-3 rounded text-white font-black hover:bg-red-700 transition-all shadow-xl disabled:opacity-50 flex items-center gap-2 tracking-widest">
              {isLoading ? <FiRefreshCw className="animate-spin"/> : (initialData ? "UPDATE POST" : "PUBLISH NOW")}
            </button>
            </div>
          </div>
        </form>
      </div>

      {isPreviewOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/95 overflow-y-auto">
          <div className="bg-[#0f0f0f] border border-red-700/30 rounded-lg w-full max-w-4xl p-6 shadow-2xl my-auto">
            <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-3">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">Preview</h3>
              <button onClick={() => setIsPreviewOpen(false)}><FiX className="text-gray-400 hover:text-red-500 w-6 h-6" /></button>
            </div>
            <div className="prose prose-invert max-w-none">
              <h1 className="text-3xl font-bold mb-2">{data.title || "Untitled"}</h1>
              <p className="text-gray-400 mb-6">{data.description}</p>
              <div dangerouslySetInnerHTML={{ __html: data.content }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDashboard;
