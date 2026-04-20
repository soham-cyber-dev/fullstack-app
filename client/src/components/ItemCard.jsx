export default function ItemCard({ item, onEdit, onDelete }) {
  const date = new Date(item.created_at).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric"
  });

  return (
    <div className="glass card-shine glass-hover rounded-2xl p-5 flex flex-col gap-3 cursor-default"
      style={{transition:'all 0.3s ease', border:'1px solid rgba(255,255,255,0.06)'}}>
      <div className="flex items-start justify-between gap-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{background:'linear-gradient(135deg,rgba(99,102,241,0.3),rgba(139,92,246,0.3))',border:'1px solid rgba(99,102,241,0.3)'}}>
          <svg width="14" height="14" fill="none" stroke="#818cf8" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
        </div>
        <div className="flex gap-1">
          <button onClick={onEdit}
            className="p-1.5 rounded-lg transition-all duration-200"
            style={{color:'rgba(148,163,184,0.6)',background:'transparent'}}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(99,102,241,0.15)'; e.currentTarget.style.color='#818cf8'; }}
            onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='rgba(148,163,184,0.6)'; }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button onClick={onDelete}
            className="p-1.5 rounded-lg transition-all duration-200"
            style={{color:'rgba(148,163,184,0.6)',background:'transparent'}}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,0.15)'; e.currentTarget.style.color='#f87171'; }}
            onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='rgba(148,163,184,0.6)'; }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-base mb-1" style={{color:'#e2e8f0'}}>{item.title}</h3>
        {item.description && (
          <p className="text-sm leading-relaxed line-clamp-2" style={{color:'rgba(148,163,184,0.6)'}}>{item.description}</p>
        )}
      </div>

      <div className="flex items-center justify-between pt-3" style={{borderTop:'1px solid rgba(255,255,255,0.05)'}}>
        <span className="text-xs" style={{color:'rgba(148,163,184,0.4)'}}>{date}</span>
        <span className="text-xs px-2 py-0.5 rounded-full" style={{background:'rgba(99,102,241,0.15)',color:'#818cf8',border:'1px solid rgba(99,102,241,0.2)'}}>
          Active
        </span>
      </div>
    </div>
  );
}
