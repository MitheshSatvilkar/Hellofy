import { useState,useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

import SummaryStrip from "./SummaryStrip";
import CampaignCard from "./CampaignCard";
import CreateCampaignModal from "./CreateCampaignModal";
import DetailDrawer from "./DetailDrawer";
import ConfirmDialog from "./ConfirmDialog";

import { useMemo } from "react";
import axios from "axios";
import {useGlobalContext} from "../Context/GlobalContext"

function uid(prefix) {
  return prefix + '_' + Math.random().toString(36).slice(2, 10);
}
function mockContacts(n) {
  const first = ['Aarav','Vivaan','Aditya','Vihaan','Arjun','Sai','Reyansh','Krishna','Ishaan','Rohan','Ananya','Diya','Saanvi','Aadhya','Myra','Priya','Kavya','Riya','Neha','Sneha'];
  const last = ['Sharma','Verma','Patel','Gupta','Reddy','Nair','Iyer','Singh','Rao','Menon'];
  const arr = [];
  for (let i = 0; i < n; i++) {
    const fn = first[i % first.length];
    const ln = last[(i * 7) % last.length];
    const num = 6000000000 + Math.floor(Math.random() * 999999999);
    arr.push({ id: uid('ct'), name: `${fn} ${ln}`, phone: '+91' + String(num).slice(0, 10) });
  }
  return arr;
}

const FILTERS = ['All', 'Draft', 'Processing', 'Completed'];

const Dashboard = ()=>{
    const [showCreate, setShowCreate] = useState(false);
    const { campaigns, setCampaigns,TEMPLATES,setTEMPLATES,user,setUser,socket,connectSocket } = useGlobalContext();

    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState('All');
    const [loadError, setLoadError] = useState(null);
    const [detailCampaign, setDetailCampaign] = useState(null);
    const [sendingIds, setSendingIds] = useState(() => new Set());
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    
    const { toasts, push, dismiss } = useToasts();
    const timersRef = useRef([]);

    const navigate = useNavigate();

    function handleCreate(newCampaign) {
        setCampaigns(cs => [newCampaign, ...cs]);
        setShowCreate(false);
        push(`"${newCampaign.name}" saved as draft.`, 'success');
    }
    async function confirmDelete() {
        setDeleting(true);

        const url = `http://localhost:3000/api/v1/campaigns/${deleteTarget._id}`;
        const deleteCampaignResponse = await axios.delete(url,{
            withCredentials:true
        });

        setTimeout(() => {
            setCampaigns(cs => cs.filter(c => c._id !== deleteTarget._id));
            push(`"${deleteTarget.name}" deleted.`, 'info');
            setDeleteTarget(null);
            setDeleting(false);
            if (detailCampaign && detailCampaign.id === deleteTarget.id) setDetailCampaign(null);
        }, 500);
    }
    //Send Campaign Processing Request
    async function handleSend(campaignId) {
        const StartCampaign = await axios.post(`http://localhost:3000/api/v1/campaigns/start/${campaignId}`,{},{
            withCredentials:true
        });
        try{
            setCampaigns(prev =>
                prev.map(campaign =>
                    campaign._id === StartCampaign.data.data.campaign._id
                    ? { ...campaign, status: StartCampaign.data.data.campaign.status }
                    : campaign
                )
            );
        }   
        catch(err){
            console.log(err);
        }

        // setSendingIds(s => new Set(s).add(campaignId));
        // setCampaigns(cs => cs.map(c => c._id === campaignId ? { ...c, status: 'Processing' } : c));
        // push('Campaign is now processing…', 'info');

        // const t1 = setTimeout(() => {
        // setCampaigns(cs => cs.map(c => {
        //     if (c._id !== campaignId) return c;
        //     const total = c.contacts.length;
        //     const partialSent = Math.round(total * (0.4 + Math.random() * 0.3));
        //     return { ...c, analytics: { ...c.analytics, sent: partialSent } };
        // }));
        // }, 900);

        // const t2 = setTimeout(() => {
        // setCampaigns(cs => cs.map(c => {
        //     if (c._id !== campaignId) return c;
        //         const total = c.contacts.length;
        //         const failed = Math.max(0, Math.round(total * (Math.random() * 0.08)));
        //         const delivered = total - failed;
        //         return { ...c, status: 'Completed', analytics: { sent: total, delivered, failed } };
        //     }));
        //     setSendingIds(s => { const n = new Set(s); n.delete(campaignId); return n; });
        //     push('Campaign completed.', 'success');
        // }, 2600);

        // timersRef.current.push(t1, t2);
    }
    function useToasts() {
        const [toasts, setToasts] = useState([]);
        const push = useCallback((message, kind = 'info') => {
            const id = uid('toast');
            setToasts(t => [...t, { id, message, kind }]);
            setTimeout(() => {
            setToasts(t => t.filter(x => x.id !== id));
            }, 3600);
        }, []);
        const dismiss = useCallback((id) => setToasts(t => t.filter(x => x.id !== id)), []);
        return { toasts, push, dismiss };
    }

    useEffect(()=>{
        let cancelled = false;
        (async()=>{
            try{
                //Check socket connection
                if(user && (!socket || !socket.connected)){
                    connectSocket(user._id);
                }
                //Get Campaign
                const campaignList = await axios.get("http://localhost:3000/api/v1/campaigns/",{
                    withCredentials:true
                });
                setCampaigns(campaignList.data.data.campaign);  
                //Get Templates
                const template = await axios.get("http://localhost:3000/api/v1/templates/",{
                    withCredentials:true
                });
                setTEMPLATES(template.data.data.template);
                socket?.emit("register",user._id);

                socket?.on("campaignUpdate",(data)=>{
                    try{
                        setCampaigns(prev =>
                            prev.map(campaign => 
                                campaign._id === data.campaignId
                                ? { ...campaign, analytics: data.analytics }
                                : campaign
                            )
                        );
                    
                    }
                    catch(err){
                        console.log(err)
                    }
                    
                })
                socket?.on("campaignCompleted",(data)=>{
                    try{
                        setCampaigns(prev =>
                            prev.map(campaign => 
                                campaign._id === data.campaignId
                                ? { ...campaign, status: data.status }
                                : campaign
                            )
                        );
                    }
                    catch(err){
                        console.log(err)
                    }
                    
                })
                
            }
            catch(err){
                console.log(err);
            }
        })();
        return () => { cancelled = true; };
    },[user])


    const filtered = useMemo(() => {
        if (!campaigns) return [];
        return campaigns
        .filter(c => filter === 'All' || c.status === filter)
        .filter(c => c.campaignName.toLowerCase().includes(query.trim().toLowerCase()))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [campaigns, filter, query]);

    
    //Delete Ccampaign Request
    function handleDeleteRequest(campaign) {
        setDeleteTarget(campaign);
    }

    const templateById = useMemo(() => {
        const m = {};
        TEMPLATES.forEach(t => {
            m[t._id] = t; 
        });
        return m;
    }, [TEMPLATES]);



    const btnPrimary = {
        background: 'var(--teal)', color: '#fff', border: 'none', borderRadius: 9,
        padding: '9px 18px', fontSize: 13.5, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8,
        transition: 'background 0.15s', minWidth: 40, justifyContent: 'center',
    };
    const inputStyle = {
        width: '100%', padding: '10px 12px', borderRadius: 9, border: '1px solid var(--line)',
        fontSize: 13.5, background: '#fff', color: 'var(--ink)', outline: 'none',
    };

    function CardSkeleton() {
        return (
            <div style={{ background: 'var(--paper-raised)', border: '1px solid var(--line)', borderRadius: 14, padding: 18, boxShadow: 'var(--shadow)' }}>
            <div className="shimmer" style={{ height: 16, width: '60%', borderRadius: 6, marginBottom: 10 }} />
            <div className="shimmer" style={{ height: 11, width: '35%', borderRadius: 6, marginBottom: 18 }} />
            <div className="shimmer" style={{ height: 6, width: '100%', borderRadius: 6, marginBottom: 8 }} />
            <div className="shimmer" style={{ height: 34, width: '100%', borderRadius: 8 }} />
            </div>
        );
    }

    const loading = campaigns === null;

    return(
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '32px 24px 80px' }}>
            {/* Top bar */}
            <div className="flex flex-wrap items-center justify-between gap-3.5 mb-7">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-[38px] h-[38px] rounded-[50px] bg-[var(--ink)] text-white font-extrabold text-[15px]">
                        {user?.name[0] || "H"}
                    </div>

                    <div>
                        <h1 className="m-0 text-[19px] font-extrabold">
                            {user?.name || "Hellofy"}
                        </h1>
                        <span className="text-[13px] font-semibold text-[var(--ink-soft)]">
                            Campaign dashboard
                        </span>
                    </div>
                </div>

                <button
                    onClick={() => setShowCreate(true)}
                    className="px-5 py-[11px] text-sm text-white rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                    + New campaign
                </button>
            </div>
            
            {/* Summary Cards */}
            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 24 }}>
                    {[1,2,3,4,5].map(i => <div key={i} className="shimmer" style={{ height: 66, borderRadius: 12 }} />)}
                </div>
            ) : (
                <SummaryStrip campaigns={campaigns} />
            )}

            {/* Controls */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: '1 1 260px', minWidth: 220 }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-soft)', fontSize: 14 }}>⌕</span>
                <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search campaigns by name…"
                    style={{ ...inputStyle, paddingLeft: 32 }}
                />
                </div>
                <div style={{ display: 'flex', gap: 6, background: 'var(--paper-raised)', border: '1px solid var(--line)', borderRadius: 10, padding: 4 }}>
                {FILTERS.map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            padding: '7px 14px', borderRadius: 7, border: 'none', fontSize: 12.5, fontWeight: 600,
                            background: filter === f ? 'var(--ink)' : 'transparent',
                            color: filter === f ? '#fff' : 'var(--ink-soft)',
                        }}
                    >
                    {f}
                    </button>
                ))}
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                    {[1,2,3,4].map(i => <CardSkeleton key={i} />)}
                </div>
            ) : loadError ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--coral)' }}>{loadError}</div>
            ) : filtered.length === 0 ? (
                <div style={{
                textAlign: 'center', padding: '70px 20px', border: '1px dashed var(--line)', borderRadius: 16,
                background: 'var(--paper-raised)',
                }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>📭</div>
                <h3 style={{ margin: '0 0 6px', fontSize: 16 }}>
                    {campaigns.length === 0 ? 'No campaigns yet' : 'No campaigns match your search'}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: '0 0 18px' }}>
                    {campaigns.length === 0 ? 'Create your first campaign to get started.' : 'Try a different name or filter.'}
                </p>
                {campaigns.length === 0 && (
                    <button onClick={() => setShowCreate(true)} style={btnPrimary}>+ New campaign</button>
                )}
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                {filtered.map(c => (
                    <CampaignCard
                        key={c._id}
                        campaign={c}
                        template={templateById[c.templateId]}
                        onOpen={setDetailCampaign}
                        onSend={handleSend}
                        onDelete={handleDeleteRequest}
                        isSending={sendingIds.has(c.id)}
                    />
                ))}
                </div>
            )}
            

            {/* Create Campaign Form */}
            {showCreate && (
                <CreateCampaignModal
                    onClose={() => setShowCreate(false)}
                    existingNames={campaigns ? campaigns.map(c => c.campaignName) : []}
                />
            )}

            {/* Campaign Details Form */}
            {detailCampaign && (
                <DetailDrawer
                    campaign={campaigns.find(c => c._id === detailCampaign._id) || detailCampaign}
                    template={templateById[detailCampaign.templateId]}
                    onClose={() => setDetailCampaign(null)}
                    onSend={handleSend}
                    sendingIds={sendingIds}
                />
            )}

            {/* Delete Campaign Form */}
            {deleteTarget && (
                <ConfirmDialog
                    title="Delete campaign?"
                    message={`"${deleteTarget.name}" and its contact list will be permanently removed. This can't be undone.`}
                    confirmLabel="Delete"
                    danger
                    busy={deleting}
                    onConfirm={confirmDelete}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}




        </div>
    )
}

export default Dashboard;