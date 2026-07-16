import { useState,useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

import SummaryStrip from "./SummaryStrip";
import CampaignCard from "./CampaignCard";
import CreateCampaignModal from "./CreateCampaignModal";
import DetailDrawer from "./DetailDrawer";
import ConfirmDialog from "./ConfirmDialog";


import api from "../api/axios";

import { useMemo } from "react";
import {useGlobalContext} from "../context/GlobalContext"

function uid(prefix) {
  return prefix + '_' + Math.random().toString(36).slice(2, 10);
}

const FILTERS = ['All', 'Draft', 'Processing', 'Completed'];

const Dashboard = ()=>{
    const [showCreate, setShowCreate] = useState(false);
    const { campaigns, setCampaigns,TEMPLATES,setTEMPLATES,user,socket,connectSocket } = useGlobalContext();

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

    async function confirmDelete() {
        setDeleting(true);

        const url = `/campaigns/${deleteTarget._id}`;
        const deleteCampaignResponse = await api.delete(url);

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
        const StartCampaign = await api.post(`/campaigns/start/${campaignId}`,{});
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

    }
    async function handleLogout(){
        try{
            const logout = await api.post("/users/logout",{});
            if(logout.data.status == "success"){
                alert(logout.data.message);  
                navigate("/")
            }
            
        }
        catch(err){
            console.log(err);
        }
        
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
                const campaignList = await api.get("/campaigns/");
                setCampaigns(campaignList.data.data.campaign);  

                //Get Templates
                const template = await api.get("/templates/",{
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
                    <div className="flex items-center justify-center w-[38px] h-[38px] rounded-full bg-[var(--ink)] text-white font-extrabold text-[15px]">
                        {user?.name?.[0] || "H"}
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

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowCreate(true)}
                        className="px-5 py-[11px] text-sm text-white rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                        + New campaign
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-11 h-11 flex items-center justify-center rounded-full bg-[var(--teal)] hover:opacity-90 text-white transition-all shadow-md"
                        title="Logout"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-5 h-5"
                        >
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                    </button>
                </div>
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