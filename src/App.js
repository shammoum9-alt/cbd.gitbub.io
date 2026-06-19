import React, { useState, useEffect, useCallback, useRef } from "react";
import Caisse from "./components/caisse";
import Dashboard from "./components/dashboard";
import Recettes from "./components/recette";
import Planif from "./components/planif";
import Compta from "./components/compta";
import Cbc from "./components/cbc";
import Allergenes from "./components/allergenes";
import Parametres from "./components/param";
import { CBC_CBD, PRODUITS } from "./data/produit";

const GOOGLE_URL = "https://script.google.com/macros/s/AKfycbz2lcDc_0K3Ax95Ffj-MnNmu1CKuKAxXlsNOYsj6A_DkIZfwz54QsMRSVZ6oLfIvivNUw/exec";

function fmt(n, dec=2){ return isNaN(n) ? "—" : Number(n).toFixed(dec); }
function fmtE(n){ return isNaN(n) ? "—" : Number(n).toFixed(2)+"€"; }

function calcCR(p) {
  const somme = p.ingredients.reduce((s,i)=>s+i.q*i.pu, 0);
  if(p.feuille_brick) return (somme + 0.05*p.nbre_par_fournee) / p.nbre_par_fournee;
  if(p.nbre_par_fournee > 1) return somme / p.nbre_par_fournee;
  return somme;
}

const MOIS_LABELS = ["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Aoû","Sep","Oct","Nov","Déc"];

const defaultParams = {
  taux_cotisation_acre: 0.062,
  taux_cfp: 0.001,
  taux_ir: 0.01,
  abattement: 0.71,
  charges_fixes: [
    { label:"Emplacement marché", montant:220 },
    { label:"Location food truck", montant:1600 },
    { label:"Assurance Pro", montant:73 },
    { label:"SumUp / TPE", montant:40 },
  ],
  charges_variables_fixes: [
    { label:"Fournitures diverses", montant:86 },
    { label:"Déplacements/Essence", montant:227 },
  ]
};

// localStorage
const loadLocal = () => {
  try { const r = localStorage.getItem("sam_data"); return r ? JSON.parse(r) : null; } catch(e){ return null; }
};
const saveLocal = (data) => {
  try { localStorage.setItem("sam_data", JSON.stringify(data)); } catch(e){}
};

// Google Sheets
const loadRemote = async () => {
  try {
    const r = await fetch(GOOGLE_URL + "?t=" + Date.now(), {
      method: "GET",
      cache: "no-store"
    });
    if(!r.ok) return null;
    const d = await r.json();
    return (d && d.status !== "error") ? d : null;
  } catch(e){ return null; }
};
const saveRemote = (data) => {
  try {
    // Si action spécifique (save_journee_event), on envoie tel quel
    // Sinon on enveloppe dans save_all
    const payload = data.action
      ? JSON.stringify(data)
      : JSON.stringify({action:"save_all", ...data});
    fetch(GOOGLE_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain" },
      body: payload
    });
  } catch(e){}
};

// Merge deux listes de ventes : union par id, pas d'écrasement
const mergeVentes = (local=[], remote=[]) => {
  const map = {};
  // Remote d'abord, local écrase (local est plus récent)
  remote.forEach(v => { if(v?.id) map[v.id] = v; });
  local.forEach(v => { if(v?.id) map[v.id] = v; });
  // deleted et rembourse : si présent sur l'une → gagne
  Object.keys(map).forEach(id => {
    const l = local.find(v=>String(v.id)===String(id));
    const r = remote.find(v=>String(v.id)===String(id));
    if(l?.deleted || r?.deleted) map[id] = {...map[id], deleted:true};
    if(l?.rembourse || r?.rembourse) map[id] = {...map[id], rembourse:true};
  });
  return Object.values(map).sort((a,b) => new Date(a.date) - new Date(b.date));
};

function SyncStatus() {
  const [status, setStatus] = useState("syncing");
  const [lastSync, setLastSync] = useState(null);

  useEffect(()=>{
    const check = async ()=>{
      setStatus("syncing");
      try {
        const r = await fetch(GOOGLE_URL);
        await r.json();
        setStatus("ok");
        setLastSync(new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"}));
      } catch(e){ setStatus("error"); }
    };
    check();
    const interval = setInterval(check, 30000);
    const onFocus = ()=>check();
    window.addEventListener("focus", onFocus);
    return ()=>{ clearInterval(interval); window.removeEventListener("focus", onFocus); };
  },[]);

  if(status==="ok") return (
    <span style={{fontSize:11,color:"var(--color-text-success)",marginLeft:4}} title={`Dernière sync : ${lastSync}`}>
      ● sync {lastSync}
    </span>
  );
  if(status==="syncing") return <span style={{fontSize:11,color:"var(--color-text-secondary)",marginLeft:4}}>● sync...</span>;
  return <span style={{fontSize:11,color:"var(--color-text-danger)",marginLeft:4}} title="Hors ligne — données sauvegardées localement">● hors ligne</span>;
}

export default function App() {
  const [tab, setTab] = useState("caisse");
  const [ventes, setVentes] = useState([]);
  const [produits, setProduits] = useState(PRODUITS);
  const [cbcData, setCbcData] = useState(CBC_CBD);
  const [params, setParams] = useState(defaultParams);
  const [courses, setCourses] = useState([]);
  const [journalCaisse, setJournalCaisse] = useState([]);
  const [achats, setAchats] = useState([]); // historique vrais prix d'achat
  const [loaded, setLoaded] = useState(false);
  const [nbres, setNbres] = useState(()=>{
    const d={};
    PRODUITS.forEach(p=>{ d[p.id]=p.categorie==="sam"?50:p.categorie==="sandwich"?30:p.categorie==="boisson"?40:30; });
    return d;
  });

  // Ref pour accéder aux ventes courantes dans le merge sans recréer l'effect
  const ventesRef = useRef([]);
  useEffect(()=>{ ventesRef.current = ventes; },[ventes]);

  useEffect(()=>{
    // 1. Charge localStorage immédiatement
    const local = loadLocal();
    if(local){
      if(local.ventes?.length) setVentes(local.ventes);
      if(local.produits?.length) setProduits(local.produits);
      if(local.cbcData?.length) setCbcData(local.cbcData);
      if(local.params) setParams(local.params);
      if(local.nbres) setNbres(local.nbres);
      if(local.courses?.length) setCourses(local.courses);
      if(local.journalCaisse?.length) setJournalCaisse(local.journalCaisse);
      if(local.achats?.length) setAchats(local.achats);
    }
    setLoaded(true);

    // Merge intelligent : on fusionne les ventes sans écraser
    const syncRemote = async () => {
      const remote = await loadRemote();
      if(!remote) return;
      // Ventes : merge union (jamais d'écrasement)
      setVentes(current => {
        const merged = mergeVentes(current, remote.ventes||[]);
        return merged;
      });
      // Config : on prend remote seulement si local est vide
      setNbres(current => remote.nbres && Object.keys(current).length===0 ? remote.nbres : current);
      setParams(current => remote.params ? remote.params : current);
      // Merge journal caisse : union par id
      if(remote.journalCaisse?.length) setJournalCaisse(current => {
        const map = {};
        current.forEach(e => { if(e?.id) map[e.id] = e; });
        remote.journalCaisse.forEach(e => { if(e?.id) map[e.id] = e; });
        return Object.values(map).sort((a,b) => a.id - b.id);
      });
      // Merge achats
      if(remote.achats?.length) setAchats(current => {
        const map = {};
        current.forEach(a => { if(a?.id) map[a.id] = a; });
        remote.achats.forEach(a => { if(a?.id) map[a.id] = a; });
        return Object.values(map).sort((a,b) => a.id - b.id);
      });
      setCourses(current => {
        if(!remote.courses?.length) return current;
        const map = {};
        current.forEach(c=>{ if(c?.id) map[c.id]=c; });
        remote.courses.forEach(c=>{ if(c?.id) map[c.id]=c; });
        return Object.values(map);
      });
    };

    syncRemote();

    // 2. Resync au focus et visibilitychange
    const onVisible = () => {
      if(document.visibilityState==="visible") syncRemote();
    };
    const onFocus = () => syncRemote();
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onFocus);

    // 3. Polling toutes les 20s
    const interval = setInterval(syncRemote, 20000);

    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onFocus);
      clearInterval(interval);
    };
  },[]);

  useEffect(()=>{
    if(!loaded) return;
    const data = {ventes, produits, cbcData, params, nbres, courses, journalCaisse, achats};
    saveLocal(data);      // immédiat
    saveRemote(data);     // async Google Sheets
  },[ventes, produits, cbcData, params, nbres, courses, journalCaisse, achats, loaded]);

  const addVente = useCallback((v)=>{ setVentes(prev=>[...prev, {...v, id:Date.now(), date:new Date().toISOString()}]); },[]);
  const deleteVente = useCallback((id)=>{
    setVentes(prev=>prev.map(v=>v.id===id ? {...v, deleted:true} : v));
  },[]);
  const addJournalEvent = useCallback((event) => {
    const newEvent = {...event, id: Date.now()};
    setJournalCaisse(prev => [...prev, newEvent]);
    // Envoi immédiat à Google Sheets (sans attendre le useEffect de 20s)
    saveRemote({action:"save_journee_event", event: newEvent});
  },[]);

  const rembourserVente = useCallback((id)=>{
    setVentes(prev=>prev.map(v=>v.id===id ? {...v, rembourse:true} : v));
  },[]);

  const tabs = [
    {id:"caisse", label:"Caisse", icon:"ti-cash"},
    {id:"dashboard", label:"Stats", icon:"ti-chart-bar"},
    {id:"recettes", label:"Recettes", icon:"ti-clipboard-list"},
    {id:"planif", label:"Planif", icon:"ti-shopping-cart"},
    {id:"compta", label:"Compta", icon:"ti-file-invoice"},
    {id:"cbc", label:"CBC/CBD", icon:"ti-leaf"},
    {id:"allergenes", label:"Allergènes", icon:"ti-alert-triangle"},
    {id:"params", label:"Paramètres", icon:"ti-settings"},
  ];

  if(!loaded) return <div style={{padding:"2rem",color:"var(--color-text-secondary)"}}>Chargement...</div>;

  return (
    <div style={{fontFamily:"var(--font-sans)",maxWidth:900,margin:"0 auto",padding:"0 0 3rem"}}>
      <div style={{background:"var(--color-background-primary)",borderBottom:"0.5px solid var(--color-border-tertiary)",padding:"1rem 1rem 0",position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.75rem"}}>
          <span style={{fontSize:20,fontWeight:500,color:"var(--color-text-primary)"}}>☕ Sam</span>
          <span style={{fontSize:13,color:"var(--color-text-secondary)",marginLeft:4}}>Café & CBD</span>
          <SyncStatus/>
        </div>
        <div style={{display:"flex",gap:4,overflowX:"auto",paddingBottom:"0"}}>
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{
              border:"none",background:tab===t.id?"var(--color-background-secondary)":"transparent",
              color:tab===t.id?"var(--color-text-primary)":"var(--color-text-secondary)",
              padding:"6px 12px",borderRadius:"var(--border-radius-md) var(--border-radius-md) 0 0",
              cursor:"pointer",fontSize:13,fontWeight:tab===t.id?500:400,whiteSpace:"nowrap",
              borderBottom:tab===t.id?"2px solid var(--color-text-primary)":"2px solid transparent"
            }}>
              <i className={`ti ${t.icon}`} style={{marginRight:5,fontSize:14}} aria-hidden="true"/>
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{padding:"1.5rem 1rem"}}>
        {tab==="caisse" && <Caisse produits={produits} cbcData={cbcData} onAdd={addVente} ventes={ventes} onDelete={deleteVente} onRembourser={rembourserVente} journalCaisse={journalCaisse} addJournalEvent={addJournalEvent}/>}
        {tab==="dashboard" && <Dashboard ventes={ventes} produits={produits}/>}
        {tab==="recettes" && <Recettes produits={produits} setProduits={setProduits} nbres={nbres} achats={achats}/>}
        {tab==="planif" && <Planif produits={produits} nbres={nbres} setNbres={setNbres} achats={achats} setAchats={setAchats} setCourses={setCourses} ventes={ventes}/>}
        {tab==="compta" && <Compta ventes={ventes} params={params} produits={produits} courses={courses} setCourses={setCourses}/>}
        {tab==="cbc" && <cbc cbcData={cbcData} setCbcData={setCbcData}/>}
        {tab==="allergenes" && <Allergenes produits={produits}/>}
        {tab==="params" && <Parametres params={params} setParams={setParams}/>}
      </div>
    </div>
  );
}
