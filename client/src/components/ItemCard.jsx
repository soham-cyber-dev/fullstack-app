const CATEGORY_COLORS = {
  General:   { bg: 'rgba(99,102,241,0.15)',  text: '#818cf8', border: 'rgba(99,102,241,0.3)'  },
  Work:      { bg: 'rgba(59,130,246,0.15)',  text: '#60a5fa', border: 'rgba(59,130,246,0.3)'  },
  Personal:  { bg: 'rgba(139,92,246,0.15)',  text: '#a78bfa', border: 'rgba(139,92,246,0.3)'  },
  Ideas:     { bg: 'rgba(245,158,11,0.15)',  text: '#fbbf24', border: 'rgba(245,158,11,0.3)'  },
  Important: { bg: 'rgba(239,68,68,0.15)',   text: '#f87171', border: 'rgba(239,68,68,0.3)'   },
};

export default function ItemCard({ item, onEdit, onDelete }) {
  const date = new Date(item.created_at).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric"
  });
  const color = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.General;

  return (
    <div className="glass card-shine glass-hover rounded-2xl overflow-hidden flex flex-col cursor-default"
      style={{transition:'all 0.3s ease',border:'1px solid rgba(255,255,255,0.06)'}}>

      {item.image_url && (
        <div className="relative overflow-hidden" style={{height:'160px'}}>
          <img src={item.image_url} alt={item.title}
            className="w-full h-full object-cover"
            style={{transition:'transform 0.3s ease'}}
            onMouseEnter={e => e.currentTarget.style.transform='scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform='scale(1)'} />
          <div className="absolute inset-0" style={{background:'linear-gradient(to bottom,transparent 50%,rgba(0,0,0,0.5))'}}></div>
        </div>
      )}

      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs px-2 py-1 rounded-full font-medium"
            style={{background:color.bg,color:color.text,border:`1px solid ${color.border}`}}>
            {item.category || 'General'}
          </span>
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
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
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
          {item.image_url && (
            <span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
              style={{background:'rgba(16,185,129,0.1)',color:'#6ee7b7',border:'1px solid rgba(16,185,129,0.2)'}}>
              <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
              </svg>
              Image
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
