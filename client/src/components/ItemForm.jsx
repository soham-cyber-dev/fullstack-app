import { useState } from "react";
import api from "../api/axios";

const CATEGORIES = ["General", "Work", "Personal", "Ideas", "Important"];

export default function ItemForm({ editItem, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    title: editItem?.title || "",
    description: editItem?.description || "",
    category: editItem?.category || "General",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (editItem) {
        await api.put(`/items/${editItem.id}`, form);
      } else {
        await api.post("/items", form);
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
      style={{border:'1px solid rgba(99,102,241,0.3)',boxShadow:'0 25px 60px rgba(0,0,0,0.5)'}}>
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
          <input
            type="text" name="title" value={form.title}
            onChange={handleChange} required
            className="input-field w-full rounded-xl px-4 py-3 text-sm"
            placeholder="Enter item title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{color:'rgba(148,163,184,0.9)'}}>Category</label>
          <select
            name="category" value={form.category}
            onChange={handleChange}
            className="input-field w-full rounded-xl px-4 py-3 text-sm"
            style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',color:'#e2e8f0'}}>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat} style={{background:'#1a1a2e',color:'#e2e8f0'}}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{color:'rgba(148,163,184,0.9)'}}>Description</label>
          <textarea
            name="description" value={form.description}
            onChange={handleChange} rows={3}
            className="input-field w-full rounded-xl px-4 py-3 text-sm resize-none"
            placeholder="Optional description"
          />
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
            {loading ? "Saving..." : editItem ? "Update →" : "Create →"}
          </button>
        </div>
      </form>
    </div>
  );
}
