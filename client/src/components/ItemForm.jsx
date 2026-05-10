import { useState } from "react";
import api from "../api/axios";

const CATEGORIES = ["General", "Work", "Personal", "Ideas", "Important"];

export default function ItemForm({ editItem, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    title: editItem?.title || "",
    description: editItem?.description || "",
    category: editItem?.category || "General",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(editItem?.image_url || null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB.");
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category);
      if (image) formData.append("image", image);

      if (editItem) {
        await api.put(`/items/${editItem.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/items", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass card-shine rounded-2xl p-6 w-full max-w-md mx-4"
      style={{border:'1px solid rgba(99,102,241,0.3)',boxShadow:'0 25px 60px rgba(0,0,0,0.5)',maxHeight:'90vh',overflowY:'auto'}}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{background:'linear-gradient(135deg,#3b82f6,#8b5cf6)'}}>
          <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
            {editItem
              ? <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>
              : <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>
            }
          </svg>
        </div>
        <h2 className="text-lg font-semibold" style={{color:'#e2e8f0'}}>
          {editItem ? "Edit Item" : "New Item"}
        </h2>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl text-sm" style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',color:'#fca5a5'}}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{color:'rgba(148,163,184,0.9)'}}>Title</label>
          <input type="text" name="title" value={form.title}
            onChange={handleChange} required
            className="input-field w-full rounded-xl px-4 py-3 text-sm"
            placeholder="Enter item title" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{color:'rgba(148,163,184,0.9)'}}>Category</label>
          <select name="category" value={form.category} onChange={handleChange}
            className="input-field w-full rounded-xl px-4 py-3 text-sm"
            style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',color:'#e2e8f0'}}>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat} style={{background:'#1a1a2e',color:'#e2e8f0'}}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{color:'rgba(148,163,184,0.9)'}}>Description</label>
          <textarea name="description" value={form.description}
            onChange={handleChange} rows={3}
            className="input-field w-full rounded-xl px-4 py-3 text-sm resize-none"
            placeholder="Optional description" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{color:'rgba(148,163,184,0.9)'}}>Image</label>
          {preview ? (
            <div className="relative rounded-xl overflow-hidden" style={{border:'1px solid rgba(255,255,255,0.1)'}}>
              <img src={preview} alt="Preview"
                className="w-full object-cover" style={{maxHeight:'180px'}} />
              <button type="button" onClick={removeImage}
                className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
                style={{background:'rgba(0,0,0,0.7)',color:'white',border:'1px solid rgba(255,255,255,0.2)'}}>
                ✕
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center rounded-xl cursor-pointer transition-all duration-200 py-6"
              style={{border:'1px dashed rgba(99,102,241,0.4)',background:'rgba(99,102,241,0.05)'}}
              onMouseEnter={e => e.currentTarget.style.background='rgba(99,102,241,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background='rgba(99,102,241,0.05)'}>
              <svg width="24" height="24" fill="none" stroke="#818cf8" strokeWidth="1.5" viewBox="0 0 24 24" className="mb-2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <span className="text-sm" style={{color:'rgba(148,163,184,0.6)'}}>Click to upload image</span>
              <span className="text-xs mt-1" style={{color:'rgba(148,163,184,0.4)'}}>PNG, JPG, WEBP up to 5MB</span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onCancel}
            className="flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-200"
            style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(148,163,184,0.8)'}}
            onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.05)'}>
            Cancel
          </button>
          <button type="submit" disabled={loading}
            className="btn-primary flex-1 py-3 rounded-xl text-white text-sm font-semibold"
            style={{opacity: loading ? 0.7 : 1}}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/>
                </svg>
                {editItem ? "Updating..." : "Creating..."}
              </span>
            ) : editItem ? "Update →" : "Create →"}
          </button>
        </div>
      </form>
    </div>
  );
}
