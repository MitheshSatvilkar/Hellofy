



const ConfirmDialog = ({ title, message, confirmLabel, danger, onConfirm, onCancel, busy }) => {

    const overlayStyle = {
        position: 'fixed', inset: 0, background: 'rgba(18,24,43,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 150, padding: 16,
    };
    const cardStyle = {
        background: 'var(--paper-raised)', borderRadius: 16, boxShadow: '0 20px 60px -20px rgba(18,24,43,0.35)',
        border: '1px solid var(--line)',
    };
    const btnGhost = {
        background: 'transparent', color: 'var(--ink-soft)', border: '1px solid var(--line)', borderRadius: 9,
        padding: '9px 16px', fontSize: 13.5, fontWeight: 600,
    };
    const btnDanger = {
        background: 'var(--coral)', color: '#fff', border: 'none', borderRadius: 9,
        padding: '9px 18px', fontSize: 13.5, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8, justifyContent: 'center',
    };

    function Spinner({ size = 16, color = 'currentColor' }) {
        return (
            <svg className="spinner" width={size} height={size} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke={color} strokeOpacity="0.2" strokeWidth="3" />
            <path d="M21 12a9 9 0 0 0-9-9" stroke={color} strokeWidth="3" strokeLinecap="round" />
            </svg>
        );
    }


    return (
        <div style={overlayStyle} onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel(); }}>
            <div className="pop-in" style={{ ...cardStyle, width: 380, padding: 24 }}>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{title}</h3>
                <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: 10 }}>{message}</p>
                <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
                <button onClick={onCancel} style={btnGhost}>Cancel</button>
                
                <button onClick={onConfirm} disabled={busy} style={danger ? btnDanger : btnPrimary}>
                    {busy ? <Spinner size={14} color="#fff" /> : confirmLabel}
                </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;