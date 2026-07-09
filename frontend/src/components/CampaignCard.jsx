const STATUS_META = {
  Draft:      { color: '#5B6472', bg: '#E9EBE7', label: 'Draft' },
  Processing: { color: '#C8890A', bg: '#FBF0DD', label: 'Processing' },
  Completed:  { color: '#0E7C74', bg: '#E3F1EF', label: 'Completed' },
};


function StatusPill({ status }) {
  const m = STATUS_META[status] || STATUS_META.Draft;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: m.bg, color: m.color, fontSize: 12, fontWeight: 700,
      padding: '4px 10px', borderRadius: 999, letterSpacing: '0.02em',
    }}>
      {status === 'Processing' && <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: m.color }} />}
      {m.label}
    </span>
  );
}
function StatBar({ label, value, total, color }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ink-soft)', marginBottom: 4 }}>
        <span>{label}</span>
        <span className="mono" style={{ color: 'var(--ink)', fontWeight: 600 }}>{value}</span>
      </div>
      <div style={{ height: 6, borderRadius: 999, background: 'var(--line)', overflow: 'hidden' }}>
        <div className="bar-fill" style={{ width: pct + '%', height: '100%', background: color, borderRadius: 999 }} />
      </div>
    </div>
  );
}
function IconButton({ onClick, label, danger, children, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      style={{
        width: 32, height: 32, borderRadius: 8, border: '1px solid var(--line)',
        background: 'var(--paper-raised)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: danger ? 'var(--coral)' : 'var(--ink-soft)', opacity: disabled ? 0.5 : 1,
        transition: 'background 0.15s, border-color 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = danger ? 'var(--coral-tint)' : 'var(--paper)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'var(--paper-raised)'; }}
    >
      {children}
    </button>
  );
}


const btnGhost = {
  background: 'transparent', color: 'var(--ink-soft)', border: '1px solid var(--line)', borderRadius: 9,
  padding: '9px 16px', fontSize: 13.5, fontWeight: 600,
};
const btnPrimary = {
  background: 'var(--teal)', color: '#fff', border: 'none', borderRadius: 9,
  padding: '9px 18px', fontSize: 13.5, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8,
  transition: 'background 0.15s', minWidth: 40, justifyContent: 'center',
};


function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}


const CampaignCard =({ campaign, template, onOpen, onSend, onDelete, isSending })=>{
    const a = campaign.analytics;
    const total = campaign.contacts.length;
    return (
        <div className="rise-in" style={{
        background: 'var(--paper-raised)', border: '1px solid var(--line)', borderRadius: 14,
        padding: 18, boxShadow: 'var(--shadow)', display: 'flex', flexDirection: 'column', gap: 12,
        }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <button onClick={() => onOpen(campaign)} style={{ background: 'none', border: 'none', textAlign: 'left', padding: 0 }}>
            <h3 style={{ margin: 0, fontSize: 15.5, fontWeight: 700, color: 'var(--ink)' }}>{campaign.campaignName}</h3>
            <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{template?.templateName || 'Unknown template'}</span>
            </button>
            <StatusPill status={campaign.status} />
        </div>

        <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--ink-soft)' }}>
            <span>👥 <span className="mono" style={{ color: 'var(--ink)', fontWeight: 600 }}>{total}</span> contacts</span>
            <span>📅 {formatDate(campaign.createdAt)}</span>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
            <StatBar label="Sent" value={a.sent} total={total || 1} color="var(--ink-soft)" />
            <StatBar label="Delivered" value={a.delivered} total={total || 1} color="var(--teal)" />
            <StatBar label="Failed" value={a.failed} total={total || 1} color="var(--coral)" />
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <button onClick={() => onOpen(campaign)} style={{ ...btnGhost, flex: 1 }}>View details</button>
            {
              campaign.status === 'Draft' && (
              <button onClick={() => onSend(campaign._id)} disabled={isSending} style={{ ...btnPrimary, flex: 1 }}>
                  {isSending ? <Spinner size={14} color="#fff" /> : 'Send'}
              </button>
            )}
            <IconButton onClick={() => onDelete(campaign)} label="Delete campaign" danger>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z" /></svg>
            </IconButton>
        </div>
        </div>
    );
}

export default CampaignCard;