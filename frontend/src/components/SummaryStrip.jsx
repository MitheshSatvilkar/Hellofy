import { useMemo } from "react";

const SummaryStrip =({campaigns})=>{
    const totals = useMemo(() => campaigns.reduce((acc, c) => {
        acc.contacts += c.contacts.length;
        acc.sent += c.analytics.sent;
        acc.delivered += c.analytics.delivered;
        acc.failed += c.analytics.failed;
        return acc;
    }, { contacts: 0, sent: 0, delivered: 0, failed: 0 }), [campaigns]);

    const items = [
        { label: 'Campaigns', value: campaigns.length, color: 'var(--ink)' },
        { label: 'Total contacts', value: totals.contacts, color: 'var(--ink)' },
        { label: 'Sent', value: totals.sent, color: 'var(--ink-soft)' },
        { label: 'Delivered', value: totals.delivered, color: 'var(--teal)' },
        { label: 'Failed', value: totals.failed, color: 'var(--coral)' },
    ];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 24 }}>
        {items.map(it => (
            <div key={it.label} style={{ background: 'var(--paper-raised)', border: '1px solid var(--line)', borderRadius: 12, padding: '14px 16px' }}>
                <div className="mono" style={{ fontSize: 22, fontWeight: 700, color: it.color }}>{it.value}</div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-soft)', marginTop: 2 }}>{it.label}</div>
            </div>
        ))}
        </div>
    );
}
export default SummaryStrip;