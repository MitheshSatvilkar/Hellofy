import { useEffect } from "react";


const DetailDrawer=({ campaign, template, onClose, onSend, sendingIds })=>{
    if (!campaign) return null;
    const isSending = sendingIds.has(campaign._id);
    const a = campaign.analytics;
    const total = campaign.contacts.length;
    
    const overlayStyle = {
        position: 'fixed', inset: 0, background: 'rgba(18,24,43,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 150, padding: 16,
    };
    const cardStyle = {
        background: 'var(--paper-raised)', borderRadius: 16, boxShadow: '0 20px 60px -20px rgba(18,24,43,0.35)',
        border: '1px solid var(--line)',
    };
    const btnPrimary = {
        background: 'var(--teal)', color: '#fff', border: 'none', borderRadius: 9,
        padding: '9px 18px', fontSize: 13.5, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8,
        transition: 'background 0.15s', minWidth: 40, justifyContent: 'center',
    };

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

    function formatDate(iso) {
        const d = new Date(iso);
        return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    return (
        <div style={overlayStyle} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="pop-in" style={{ ...cardStyle, width: 460, maxHeight: '86vh', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '22px 24px 0', flexShrink: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                    <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{campaign.campaignName}</h2>
                    <div style={{ marginTop: 8 }}><StatusPill status={campaign.status} /></div>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, color: 'var(--ink-soft)' }}>×</button>
                </div>
                </div>

                <div className="scrollbar-thin" style={{ padding: 24, overflowY: 'auto', flex: 1 }}>
                <div style={{ display: 'flex', gap: 20, fontSize: 12.5, color: 'var(--ink-soft)', marginBottom: 18 }}>
                    <div><div style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Template</div><div style={{ color: 'var(--ink)', fontWeight: 600, marginTop: 2 }}>{template?.templateName}</div></div>
                    <div><div style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Created</div><div style={{ color: 'var(--ink)', fontWeight: 600, marginTop: 2 }}>{formatDate(campaign.createdAt)}</div></div>
                    <div><div style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Contacts</div><div className="mono" style={{ color: 'var(--ink)', fontWeight: 600, marginTop: 2 }}>{total}</div></div>
                </div>

                <div style={{ background: 'var(--paper)', borderRadius: 12, padding: 16 }}>
                    <div style={{ fontSize: 11, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 12 }}>Analytics</div>
                    <div style={{ display: 'flex', gap: 18, marginBottom: 16 }}>
                    <div style={{ flex: 1, textAlign: 'center', background: '#fff', borderRadius: 10, padding: '10px 4px', border: '1px solid var(--line)' }}>
                        <div className="mono" style={{ fontSize: 20, fontWeight: 700 }}>{total}</div>
                        <div style={{ fontSize: 10.5, color: 'var(--ink-soft)' }}>Total</div>
                    </div>
                    <div style={{ flex: 1, textAlign: 'center', background: '#fff', borderRadius: 10, padding: '10px 4px', border: '1px solid var(--line)' }}>
                        <div className="mono" style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)' }}>{a.sent}</div>
                        <div style={{ fontSize: 10.5, color: 'var(--ink-soft)' }}>Sent</div>
                    </div>
                    <div style={{ flex: 1, textAlign: 'center', background: '#fff', borderRadius: 10, padding: '10px 4px', border: '1px solid var(--line)' }}>
                        <div className="mono" style={{ fontSize: 20, fontWeight: 700, color: 'var(--teal)' }}>{a.delivered}</div>
                        <div style={{ fontSize: 10.5, color: 'var(--ink-soft)' }}>Delivered</div>
                    </div>
                    <div style={{ flex: 1, textAlign: 'center', background: '#fff', borderRadius: 10, padding: '10px 4px', border: '1px solid var(--line)' }}>
                        <div className="mono" style={{ fontSize: 20, fontWeight: 700, color: 'var(--coral)' }}>{a.failed}</div>
                        <div style={{ fontSize: 10.5, color: 'var(--ink-soft)' }}>Failed</div>
                    </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <StatBar label="Delivered" value={a.delivered} total={total || 1} color="var(--teal)" />
                    <StatBar label="Failed" value={a.failed} total={total || 1} color="var(--coral)" />
                    </div>
                </div>

                <div style={{ marginTop: 18 }}>
                    <div style={{ fontSize: 11, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
                        Contact list ({total})
                    </div>
                    <div className="scrollbar-thin" style={{ maxHeight: 180, overflowY: 'auto', border: '1px solid var(--line)', borderRadius: 10 }}>
                    {campaign.contacts.map(c => (
                        <div key={c.phone} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 12px', borderBottom: '1px solid var(--line)', fontSize: 12.5 }}>
                        <span style={{ fontWeight: 600 }}>{c.name}</span>
                        <span className="mono" style={{ color: 'var(--ink-soft)' }}>{c.phone}</span>
                        </div>
                    ))}
                    </div>
                </div>
                </div>

                {campaign.status === 'Draft' && (
                <div style={{ padding: '16px 24px', borderTop: '1px solid var(--line)', flexShrink: 0 }}>
                    <button onClick={() => onSend(campaign._id)} disabled={isSending} style={{ ...btnPrimary, width: '100%' }}>
                    {isSending ? <><Spinner size={14} color="#fff" /> Sending…</> : 'Send campaign'}
                    </button>
                </div>
                )}
            </div>
        </div>
    );
}


export default DetailDrawer;