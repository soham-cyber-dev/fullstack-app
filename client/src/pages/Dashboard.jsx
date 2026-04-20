import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import ItemForm from "../components/ItemForm";
import ItemCard from "../components/ItemCard";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const fetchItems = async () => {
    try {
      const res = await api.get("/items");
      setItems(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this item?")) return;
    await api.delete(`/items/${id}`);
    setItems(items.filter(i => i.id !== id));
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditItem(null);
    fetchItems();
  };

  return (
    <div className="min-h-screen grid-bg" style={{background:'#0a0a0f'}}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div style={{position:'absolute',top:'0',left:'30%',width:'600px',height:'300px',background:'radial-gradient(ellipse,rgba(99,102,241,0.05) 0%,transparent 70%)'}}></div>
      </div>

      {/* Navbar */}
      <nav className="glass sticky top-0 z-40 px-6 py-4" style={{borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:'linear-gradient(135deg,#3b82f6,#8b5cf6)'}}>
              <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="font-bold text-lg gradient-text">MyApp</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)'}}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{background:'linear-gradient(135deg,#3b82f6,#8b5cf6)',color:'white'}}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm" style={{color:'rgba(148,163,184,0.8)'}}>{user?.name}</span>
            </div>
            <button onClick={logout}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm transition-all duration-200"
              style={{color:'rgba(248,113,113,0.8)',border:'1px solid rgba(239,68,68,0.2)',background:'transparent'}}
              onMouseEnter={e => e.currentTarget.style.background='rgba(239,68,68,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold" style={{color:'#e2e8f0'}}>Your Items</h2>
            <p className="text-sm mt-1" style={{color:'rgba(148,163,184,0.5)'}}>
              {items.length} item{items.length !== 1 ? "s" : ""} total
            </p>
          </div>
          <button
            onClick={() => { setEditItem(null); setShowForm(true); }}
            className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Item
          </button>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Items", value: items.length, color: "#3b82f6" },
            { label: "This Month", value: items.filter(i => new Date(i.created_at).getMonth() === new Date().getMonth()).length, color: "#8b5cf6" },
            { label: "Status", value: "Active", color: "#10b981" },
          ].map((stat, i) => (
            <div key={i} className="glass rounded-2xl p-4" style={{border:'1px solid rgba(255,255,255,0.05)'}}>
              <p className="text-xs mb-1" style={{color:'rgba(148,163,184,0.5)'}}>{stat.label}</p>
              <p className="text-2xl font-bold" style={{color: stat.color}}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center z-50"
            style={{background:'rgba(0,0,0,0.7)',backdropFilter:'blur(4px)'}}>
            <ItemForm
              editItem={editItem}
              onSuccess={handleFormSuccess}
              onCancel={() => { setShowForm(false); setEditItem(null); }}
            />
          </div>
        )}

        {/* Items grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
              <p style={{color:'rgba(148,163,184,0.5)',fontSize:'14px'}}>Loading your items...</p>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center animate-float"
              style={{background:'rgba(99,102,241,0.1)',border:'1px solid rgba(99,102,241,0.2)'}}>
              <svg width="36" height="36" fill="none" stroke="#6366f1" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold mb-1" style={{color:'rgba(148,163,184,0.8)'}}>No items yet</p>
              <p className="text-sm" style={{color:'rgba(148,163,184,0.4)'}}>Click "New Item" to create your first one</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                onEdit={() => handleEdit(item)}
                onDelete={() => handleDelete(item.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
