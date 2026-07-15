import { useEffect, useState } from "react";
import { useGlobalContext } from "../context/GlobalContext";

import api from "../api/axios";

const CreateCampaignModal = ({ onClose, existingNames }) => {
  const [step, setStep] = useState(1); // 1 details, 2 contacts, 3 review
  const { campaigns, setCampaigns,TEMPLATES,setTEMPLATES } = useGlobalContext();

  const [name, setName] = useState('');
  const [templateId, setTemplateId] = useState(null);

  const [contacts, setContacts] = useState([]);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [bulkMode, setBulkMode] = useState(false);

const tabBtn = {
  flex: 1, padding: '8px 10px', borderRadius: 8, borderWidth: '1px',borderStyle: 'solid',borderColor: 'var(--line)',
  background: '#fff', fontSize: 12.5, fontWeight: 600, color: 'var(--ink-soft)',
};
const tabBtnActive = { background: 'var(--ink)', color: '#fff', borderColor: 'var(--ink)' };
const nameTaken = existingNames.some(n => n.trim().toLowerCase() === name.trim().toLowerCase());
const inputStyle = {
  width: '100%', padding: '10px 12px', borderRadius: 9, border: '1px solid var(--line)',
  fontSize: 13.5, background: '#fff', color: 'var(--ink)', outline: 'none',
};
const btnGhost = {
  background: 'transparent', color: 'var(--ink-soft)', border: '1px solid var(--line)', borderRadius: 9,
  padding: '9px 16px', fontSize: 13.5, fontWeight: 600,
};
const btnPrimary = {
  background: 'var(--teal)', color: '#fff', border: 'none', borderRadius: 9,
  padding: '9px 18px', fontSize: 13.5, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8,
  transition: 'background 0.15s', minWidth: 40, justifyContent: 'center',
};
const overlayStyle = {
  position: 'fixed', inset: 0, background: 'rgba(18,24,43,0.45)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 150, padding: 16,
};
const cardStyle = {
  background: 'var(--paper-raised)', borderRadius: 16, boxShadow: '0 20px 60px -20px rgba(18,24,43,0.35)',
  border: '1px solid var(--line)',
};
const labelStyle = { fontSize: 12.5, fontWeight: 700, color: 'var(--ink)', marginBottom: 6, display: 'block' };
const errorStyle = { fontSize: 12, color: 'var(--coral)', marginTop: 5, display: 'flex', alignItems: 'center', gap: 5 };


const STATUS_META = {
  Draft:      { color: '#5B6472', bg: '#E9EBE7', label: 'Draft' },
  Processing: { color: '#C8890A', bg: '#FBF0DD', label: 'Processing' },
  Completed:  { color: '#0E7C74', bg: '#E3F1EF', label: 'Completed' },
};
function uid(prefix) {
  return prefix + '_' + Math.random().toString(36).slice(2, 10);
}
function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
function normalizePhone(raw) {
  return raw.replace(/[\s\-()]/g, '');
}
function isValidIndianPhone(raw) {
  const p = normalizePhone(raw);
  // Accepts +91XXXXXXXXXX or 10-digit starting 6-9
  return /^(\+91)?[6-9]\d{9}$/.test(p);
}
function phoneKey(raw) {
  let p = normalizePhone(raw);
  if (p.startsWith('+91')) p = p.slice(3);
  if (p.startsWith('91') && p.length === 12) p = p.slice(2);
  return p;
}
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
function Spinner({ size = 16, color = 'currentColor' }) {
  return (
    <svg className="spinner" width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeOpacity="0.2" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
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


  function validateStep1() {
    const e = {};
    if (!name.trim()) e.name = 'Campaign name is required.';
    else if (nameTaken) e.name = 'A campaign with this name already exists.';
    if (!templateId) e.template = 'Choose a message template.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep2() {
    const e = {};
    if (contacts.length === 0) e.contacts = 'Add at least one contact to continue.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function addContact() {
    const e = {};
    if (!contactName.trim()) e.contactName = 'Enter a name.';
    if (!contactPhone.trim()) e.contactPhone = 'Enter a phone number.';
    else if (!isValidIndianPhone(contactPhone)) e.contactPhone = 'Enter a valid 10-digit Indian mobile number.';
    else if (contacts.some(c => phoneKey(c.phone) === phoneKey(contactPhone))) e.contactPhone = 'This number is already added.';
    setErrors(e);
    if (Object.keys(e).length) return;
    setContacts(c => [...c, { name: contactName.trim(), phone: normalizePhone(contactPhone) }]);
    setContactName('');
    setContactPhone('');
  }

  function addBulk() {
    const lines = bulkText.split('\n').map(l => l.trim()).filter(Boolean);
    const added = [];
    const skipped = [];
    const seen = new Set(contacts.map(c => phoneKey(c.phone)));

    for (const line of lines) {
      const parts = line.split(',').map(s => s.trim());
      const nm = parts[0] || 'Unnamed';
      const ph = parts[1] || parts[0];

      if (!ph || !isValidIndianPhone(ph)) { skipped.push(line); continue; }
      const k = phoneKey(ph);

      if (seen.has(k)) { skipped.push(line); continue; }
      seen.add(k);
      added.push({ id: uid('ct'), name: parts[1] ? nm : ('Contact ' + (contacts.length + added.length + 1)), phone: normalizePhone(ph) });
    }
    setContacts(c => [...c, ...added]);
    setBulkText('');
    setErrors(e => ({ ...e, bulk: skipped.length ? `${added.length} added, ${skipped.length} skipped (invalid or duplicate).` : null }));
  }

  function removeContact(id) {
    setContacts(c => c.filter(x => x.id !== id));
  }

  function next() {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setErrors({});
    setStep(s => s + 1);
  }

  function back() {
    setErrors({});
    setStep(s => s - 1);
  }

  const submit=async()=>{
    setSubmitting(true);
    setTimeout(async()=>{
        const campaignResponse = await api.post("/campaigns/",{
          campaignName:name,
          templateId:templateId,
          contacts:contacts,
        })
        if(campaignResponse.data.status == "success"){
          setCampaigns([...campaigns,campaignResponse.data.data.campaign])
          setSubmitting(false);
          onClose();
        }
      },650)
    
  }

  const selectedTemplate = TEMPLATES.find(t => t._id === templateId);
  const steps = ['Details', 'Contacts', 'Review'];

  return (
    <div style={overlayStyle} onMouseDown={(e) => { if (e.target === e.currentTarget && !submitting) onClose(); }}>
      <div className="pop-in" style={{ ...cardStyle, width: 620, maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ padding: '20px 24px 0', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ margin: 0, fontSize: 19, fontWeight: 700 }}>New campaign</h2>
            <button onClick={onClose} disabled={submitting} style={{ background: 'none', border: 'none', fontSize: 20, color: 'var(--ink-soft)', lineHeight: 1 }}>×</button>
          </div>
          <div style={{ display: 'flex', gap: 18, marginTop: 18 }}>
            {steps.map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, flexShrink: 0,
                  background: step > i + 1 ? 'var(--teal)' : step === i + 1 ? 'var(--ink)' : 'var(--line)',
                  color: step >= i + 1 ? '#fff' : 'var(--ink-soft)',
                }}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: step === i + 1 ? 'var(--ink)' : 'var(--ink-soft)' }}>{s}</span>
                {i < steps.length - 1 && <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />}
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="scrollbar-thin" style={{ padding: 24, overflowY: 'auto', flex: 1 }}>
          {/* -------------------------------------------------------------------------------------------------------------------------------------- */}
          {step === 1 && (
            <div className="rise-in">
                {/* Campaign Name Label and Input */}
                <label style={labelStyle}>Campaign name</label>
                <input
                    style={{ ...inputStyle, borderColor: errors.name ? 'var(--coral)' : 'var(--line)' }}
                    placeholder="e.g. August Payment Reminders"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    autoFocus
                />
                {errors.name && <div style={errorStyle}>⚠ {errors.name}</div>}
                
                {/* ----------------------------------------------------------------------------------------------------------------------------- */}
                {/* Template Section */}
                <label style={{ ...labelStyle, marginTop: 20 }}>Message template</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {/* Template Card Section */}
                    {TEMPLATES.map(t => (
                    <button
                            key={t._id}
                            onClick={() => setTemplateId(t._id)}
                            style={{
                            textAlign: 'left', padding: 12, borderRadius: 10,
                            border: templateId === t._id ? '2px sol_ var(--teal)' : '1px solid var(--line)',
                            background: templateId === t._id ? 'var(--teal-tint)' : '#fff',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            {/* Template Card Name */}
                            <span style={{ fontSize: 13, fontWeight: 700 }}>{t.templateName}</span>
                            {/* After select tick  */}
                            {templateId === t._id && <span style={{ color: 'var(--teal)', fontSize: 13 }}>✓</span>}
                        </div>
                        
                        {/* Template Category */}
                        <span style={{ fontSize: 10.5, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{t.category}</span>
                        {/* Message/Preview  */}
                        <p style={{ fontSize: 11.5, color: 'var(--ink-soft)', marginTop: 6, marginBottom: 0, lineHeight: 1.4 }}>{t.message}</p>
                    
                    </button>
                    ))}

                </div>
                {errors.template && <div style={errorStyle}>⚠ {errors.template}</div>}
            </div>
          )}
        {/* -------------------------------------------------------------------------------------------------------------------------------------- */}
        {/* -------------------------------------------------------------------------------------------------------------------------------------- */}
          {step === 2 && (
            <div className="rise-in">
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <button onClick={() => setBulkMode(false)} style={{ ...tabBtn, ...(!bulkMode ? tabBtnActive : {}) }}>Add one by one</button>
                <button onClick={() => setBulkMode(true)} style={{ ...tabBtn, ...(bulkMode ? tabBtnActive : {}) }}>Paste a list</button>
              </div>

              {!bulkMode ? (
                <div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {/* Contact Name field */}
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Contact name</label>
                        <input style={{ ...inputStyle, borderColor: errors.contactName ? 'var(--coral)' : 'var(--line)' }}
                            value={contactName} onChange={e => setContactName(e.target.value)}
                            placeholder="Riya Sharma" onKeyDown={e => e.key === 'Enter' && addContact()} />
                        {errors.contactName && <div style={errorStyle}>⚠ {errors.contactName}</div>}
                    </div>

                    {/* Phone Number field */}
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle}>Phone number</label>
                      <input style={{ ...inputStyle, borderColor: errors.contactPhone ? 'var(--coral)' : 'var(--line)' }}
                        value={contactPhone} onChange={e => setContactPhone(e.target.value)}
                        placeholder="+91 98765 43210" onKeyDown={e => e.key === 'Enter' && addContact()} />
                      {errors.contactPhone && <div style={errorStyle}>⚠ {errors.contactPhone}</div>}
                    </div>

                  </div>
                  <button onClick={addContact} style={{ ...btnPrimary, marginTop: 12, width: '100%' }}>+ Add contact</button>
                </div>
              ) : (
                <div>
                  <label style={labelStyle}>One contact per line — "Name, Phone"</label>
                  <textarea
                    style={{ ...inputStyle, height: 96, resize: 'vertical', fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5 }}
                    placeholder={"Riya Sharma, +919876543210\nAman Gupta, 9123456780"}
                    value={bulkText}
                    onChange={e => setBulkText(e.target.value)}
                  />
                  {errors.bulk && <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 5 }}>ℹ {errors.bulk}</div>}
                  <button onClick={addBulk} disabled={!bulkText.trim()} style={{ ...btnPrimary, marginTop: 10, width: '100%' }}>Add from list</button>
                </div>
              )}

              <div style={{ marginTop: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Contacts added</label>
                  <span className="mono" style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{contacts.length} total</span>
                </div>
                {errors.contacts && <div style={{ ...errorStyle, marginBottom: 8 }}>⚠ {errors.contacts}</div>}
                <div className="scrollbar-thin" style={{ maxHeight: 180, overflowY: 'auto', border: '1px solid var(--line)', borderRadius: 10 }}>
                  {contacts.length === 0 ? (
                    <div style={{ padding: 20, textAlign: 'center', fontSize: 12.5, color: 'var(--ink-soft)' }}>No contacts yet — add some above.</div>
                  ) : contacts.map(c => (
                    <div key={c.phone} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderBottom: '1px solid var(--line)' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                        <div className="mono" style={{ fontSize: 11.5, color: 'var(--ink-soft)' }}>{c.phone}</div>
                      </div>
                      <button onClick={() => removeContact(c.id)} style={{ background: 'none', border: 'none', color: 'var(--coral)', fontSize: 12, fontWeight: 700 }}>Remove</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="rise-in">
              <div style={{ background: 'var(--paper)', borderRadius: 12, padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Campaign</div>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{name}</div>
                  </div>
                  <StatusPill status="Draft" />
                </div>
                <div style={{ display: 'flex', gap: 24, marginTop: 14 }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>Template</div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{selectedTemplate?.templateName}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>Contacts</div>
                    <div className="mono" style={{ fontSize: 13, fontWeight: 600 }}>{contacts.length}</div>
                  </div>
                </div>
                <div style={{ marginTop: 14, background: '#fff', border: '1px solid var(--line)', borderRadius: 10, padding: 12 }}>
                  <div style={{ fontSize: 10.5, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>Message preview</div>
                  <div style={{ fontSize: 13, lineHeight: 1.5 }}>{selectedTemplate?.message}</div>
                </div>
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 14, lineHeight: 1.5 }}>
                This campaign will be saved as a <strong>Draft</strong>. You can review and send it from the dashboard whenever you're ready.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', flexShrink: 0 }}>
          <button onClick={step === 1 ? onClose : back} disabled={submitting} style={btnGhost}>
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          {step < 3 ? (
            <button onClick={next} style={btnPrimary}>Continue</button>
          ) : (
            <button onClick={submit} disabled={submitting} style={btnPrimary}>
              {submitting ? <><Spinner size={14} color="#fff" /> Saving…</> : 'Save as draft'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateCampaignModal;