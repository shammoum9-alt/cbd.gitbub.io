import React, { useState, useEffect, useCallback, useRef } from "react";

const GOOGLE_URL = "https://script.google.com/macros/s/AKfycbz2lcDc_0K3Ax95Ffj-MnNmu1CKuKAxXlsNOYsj6A_DkIZfwz54QsMRSVZ6oLfIvivNUw/exec";

const PRODUITS = [
  { id:"sam_choc", nom:"Sam Choc", prix:1.5, categorie:"sam", allergenes:["gluten","oeufs","lait","fruits_a_coque"],
    ingredients:[{n:"Chocolat noir",q:0.205,u:"kg",pu:10.86,pu_max:13.03},{n:"Sucre",q:0.15,u:"kg",pu:2.03,pu_max:2.44},{n:"Farine",q:0.1,u:"kg",pu:1.41,pu_max:1.69},{n:"Beurre salé",q:0.085,u:"kg",pu:11.2,pu_max:13.44},{n:"Oeuf",q:2,u:"unit",pu:0.36,pu_max:0.43},{n:"Extrait de vanille",q:0.03,u:"litre",pu:5.53,pu_max:6.64},{n:"Sucre glace",q:0.05,u:"kg",pu:2.0,pu_max:2.4}],
    feuille_brick:true, nbre_par_fournee:18, poids_total:680 },
  { id:"sam_match", nom:"Sam Match", prix:1.5, categorie:"sam", allergenes:["gluten","oeufs","lait","fruits_a_coque"],
    ingredients:[{n:"Chocolat blanc",q:0.3,u:"kg",pu:15.64,pu_max:18.77},{n:"Sucre",q:0.05,u:"kg",pu:2.03,pu_max:2.44},{n:"Farine",q:0.1,u:"kg",pu:1.41,pu_max:1.69},{n:"Beurre demi sel",q:0.085,u:"kg",pu:11.2,pu_max:13.44},{n:"Oeuf",q:2,u:"unit",pu:0.36,pu_max:0.43},{n:"Framboise",q:0.125,u:"kg",pu:16.88,pu_max:20.26},{n:"Matcha",q:0.008,u:"kg",pu:58.0,pu_max:69.6},{n:"Sucre glace",q:0.05,u:"kg",pu:2.0,pu_max:2.4}],
    feuille_brick:true, nbre_par_fournee:19, poids_total:778 },
  { id:"oncle_sam", nom:"Oncle Sam", prix:1.5, categorie:"sam", allergenes:["gluten","lait","celeri","moutarde","sesame","sulfites"],
    ingredients:[{n:"Viande hachée",q:1,u:"kg",pu:12.0,pu_max:14.4},{n:"Cheddar",q:0.3,u:"kg",pu:10.2,pu_max:12.24},{n:"Oignon",q:0.26,u:"kg",pu:1.99,pu_max:2.39},{n:"Sauce barbecue",q:0.24,u:"kg",pu:6.22,pu_max:7.46},{n:"Tomate",q:0.54,u:"kg",pu:2.79,pu_max:3.35},{n:"Sel",q:0.01,u:"kg",pu:3.51,pu_max:4.21},{n:"Paprika",q:0.01,u:"kg",pu:12.76,pu_max:15.31}],
    feuille_brick:true, nbre_par_fournee:48, poids_total:2360 },
  { id:"cookie", nom:"Cookie", prix:1.5, categorie:"sucre", allergenes:["gluten","oeufs","lait"],
    ingredients:[{n:"Farine",q:0.2,u:"kg",pu:1.41,pu_max:1.69},{n:"Beurre demi sel",q:0.15,u:"kg",pu:11.2,pu_max:13.44},{n:"Sucre",q:0.15,u:"kg",pu:2.03,pu_max:2.44},{n:"Oeuf",q:1,u:"unit",pu:0.36,pu_max:0.43},{n:"Pépites de chocolat",q:0.15,u:"kg",pu:11.92,pu_max:14.3},{n:"Extrait de vanille",q:0.005,u:"litre",pu:5.53,pu_max:6.64}],
    feuille_brick:false, nbre_par_fournee:12, poids_total:710 },
  { id:"cake", nom:"Cake (part)", prix:2.5, categorie:"sucre", allergenes:["gluten","oeufs","lait"],
    ingredients:[{n:"Farine",q:0.25,u:"kg",pu:1.41,pu_max:1.69},{n:"Beurre demi sel",q:0.15,u:"kg",pu:11.2,pu_max:13.44},{n:"Sucre",q:0.2,u:"kg",pu:2.03,pu_max:2.44},{n:"Oeuf",q:3,u:"unit",pu:0.36,pu_max:0.43},{n:"Chocolat noir",q:0.2,u:"kg",pu:10.86,pu_max:13.03},{n:"Extrait de vanille",q:0.01,u:"litre",pu:5.53,pu_max:6.64}],
    feuille_brick:false, nbre_par_fournee:10, poids_total:975 },
  { id:"sandwich_poulet", nom:"Sandwich Poulet", prix:4.0, categorie:"sandwich", allergenes:["gluten","lait"],
    ingredients:[{n:"Poulet",q:0.15,u:"kg",pu:10.0,pu_max:12.0},{n:"Saint Moret",q:0.05,u:"kg",pu:12.57,pu_max:15.08},{n:"Tomate",q:0.08,u:"kg",pu:2.79,pu_max:3.35},{n:"Sel",q:0.003,u:"kg",pu:3.51,pu_max:4.21},{n:"Paprika",q:0.002,u:"kg",pu:12.76,pu_max:15.31},{n:"Herbes de Provence",q:0.002,u:"kg",pu:14.4,pu_max:17.28},{n:"Baguette (1/2)",q:0.5,u:"unité",pu:0.6,pu_max:0.72}],
    feuille_brick:false, nbre_par_fournee:1, poids_total:0 },
  { id:"sandwich_thon", nom:"Sandwich Thon", prix:4.0, categorie:"sandwich", allergenes:["gluten","poisson"],
    ingredients:[{n:"Thon",q:0.08,u:"kg",pu:13.0,pu_max:15.6},{n:"Tomate",q:0.08,u:"kg",pu:2.79,pu_max:3.35},{n:"Salade",q:0.03,u:"kg",pu:3.0,pu_max:3.6},{n:"Sel",q:0.002,u:"kg",pu:3.51,pu_max:4.21},{n:"Herbes de Provence",q:0.002,u:"kg",pu:14.4,pu_max:17.28},{n:"Baguette (1/2)",q:0.5,u:"unité",pu:0.6,pu_max:0.72}],
    feuille_brick:false, nbre_par_fournee:1, poids_total:0 },
  { id:"sandwich_legumes", nom:"Sandwich Légumes", prix:3.5, categorie:"sandwich", allergenes:["gluten","lait"],
    ingredients:[{n:"Ratatouille",q:0.12,u:"kg",pu:2.79,pu_max:3.35},{n:"Tomate",q:0.08,u:"kg",pu:2.79,pu_max:3.35},{n:"Saint Moret",q:0.05,u:"kg",pu:12.57,pu_max:15.08},{n:"Sel",q:0.002,u:"kg",pu:3.51,pu_max:4.21},{n:"Herbes de Provence",q:0.002,u:"kg",pu:14.4,pu_max:17.28},{n:"Baguette (1/2)",q:0.5,u:"unité",pu:0.6,pu_max:0.72}],
    feuille_brick:false, nbre_par_fournee:1, poids_total:0 },
  { id:"expresso", nom:"Expresso", prix:1.5, categorie:"boisson", allergenes:[],
    ingredients:[{n:"Café espresso",q:0.007,u:"kg",pu:18.0,pu_max:21.6}],
    feuille_brick:false, nbre_par_fournee:1, poids_total:0 },
  { id:"latte", nom:"Latte", prix:3.0, categorie:"boisson", allergenes:["lait"],
    ingredients:[{n:"Café espresso",q:0.007,u:"kg",pu:18.0,pu_max:21.6},{n:"Lait",q:0.2,u:"litre",pu:1.1,pu_max:1.32}],
    feuille_brick:false, nbre_par_fournee:1, poids_total:0 },
  { id:"matcha_latte", nom:"Matcha Latte", prix:4.0, categorie:"boisson", allergenes:["lait"],
    ingredients:[{n:"Matcha (poudre)",q:0.003,u:"kg",pu:58.0,pu_max:69.6},{n:"Lait",q:0.2,u:"litre",pu:1.1,pu_max:1.32},{n:"Sucre",q:0.01,u:"kg",pu:2.03,pu_max:2.44}],
    feuille_brick:false, nbre_par_fournee:1, poids_total:0 },
  { id:"chai_latte", nom:"Chai Latte", prix:4.0, categorie:"boisson", allergenes:["lait"],
    ingredients:[{n:"Chai (épices)",q:0.005,u:"kg",pu:30.0,pu_max:36.0},{n:"Lait",q:0.2,u:"litre",pu:1.1,pu_max:1.32},{n:"Sucre",q:0.01,u:"kg",pu:2.03,pu_max:2.44}],
    feuille_brick:false, nbre_par_fournee:1, poids_total:0 },
  { id:"black_sesame", nom:"Black Sesame Latte", prix:4.5, categorie:"boisson", allergenes:["lait","sesame"],
    ingredients:[{n:"Pâte sésame noir",q:0.02,u:"kg",pu:25.0,pu_max:30.0},{n:"Lait",q:0.2,u:"litre",pu:1.1,pu_max:1.32},{n:"Sucre",q:0.01,u:"kg",pu:2.03,pu_max:2.44}],
    feuille_brick:false, nbre_par_fournee:1, poids_total:0 },
];

const CBC_CBD = [
  { id:"cbc_fleur_10", nom:"CBC Fleur 10%", type:"fleur", taux:"10%", famille:"CBC", poids:1, prix_achat:3.0, prix_vente:9.0 },
  { id:"cbc_fleur_20", nom:"CBC Fleur 20%", type:"fleur", taux:"20%", famille:"CBC", poids:1, prix_achat:5.0, prix_vente:15.0 },
  { id:"cbc_fleur_30", nom:"CBC Fleur 30%", type:"fleur", taux:"30%", famille:"CBC", poids:1, prix_achat:7.0, prix_vente:21.0 },
  { id:"cbc_resine_10", nom:"CBC Résine 10%", type:"résine", taux:"10%", famille:"CBC", poids:1, prix_achat:3.5, prix_vente:10.5 },
  { id:"cbc_resine_20", nom:"CBC Résine 20%", type:"résine", taux:"20%", famille:"CBC", poids:1, prix_achat:6.0, prix_vente:18.0 },
  { id:"cbc_resine_30", nom:"CBC Résine 30%", type:"résine", taux:"30%", famille:"CBC", poids:1, prix_achat:9.0, prix_vente:27.0 },
  { id:"cbd_fleur_10", nom:"CBD Fleur 10%", type:"fleur", taux:"10%", famille:"CBD", poids:1, prix_achat:3.0, prix_vente:9.0 },
  { id:"cbd_fleur_20", nom:"CBD Fleur 20%", type:"fleur", taux:"20%", famille:"CBD", poids:1, prix_achat:5.0, prix_vente:15.0 },
  { id:"cbd_fleur_30", nom:"CBD Fleur 30%", type:"fleur", taux:"30%", famille:"CBD", poids:1, prix_achat:7.0, prix_vente:21.0 },
  { id:"cbd_resine_10", nom:"CBD Résine 10%", type:"résine", taux:"10%", famille:"CBD", poids:1, prix_achat:3.5, prix_vente:10.5 },
  { id:"cbd_resine_20", nom:"CBD Résine 20%", type:"résine", taux:"20%", famille:"CBD", poids:1, prix_achat:6.0, prix_vente:18.0 },
  { id:"cbd_resine_30", nom:"CBD Résine 30%", type:"résine", taux:"30%", famille:"CBD", poids:1, prix_achat:9.0, prix_vente:27.0 },
];

const ALLERGENES_MAP = {
  gluten:"Gluten/Blé", crustaces:"Crustacés", oeufs:"Oeufs", poisson:"Poisson",
  arachides:"Arachides", soja:"Soja", lait:"Lait", fruits_a_coque:"Fruits à coque",
  celeri:"Céleri", moutarde:"Moutarde", sesame:"Sésame", sulfites:"Sulfites", lupin:"Lupin"
};

const cat_color = { sam:"#1F4E79", sucre:"#7030A0", sandwich:"#C55A11", boisson:"#375623" };
const cat_bg = { sam:"#BDD7EE", sucre:"#E2C6F5", sandwich:"#FCE4D6", boisson:"#E2EFDA" };

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
        {tab==="cbc" && <CBC cbcData={cbcData} setCbcData={setCbcData}/>}
        {tab==="allergenes" && <Allergenes produits={produits}/>}
        {tab==="params" && <Params params={params} setParams={setParams}/>}
      </div>
    </div>
  );
}

function Caisse({produits, cbcData, onAdd, ventes, onDelete: deleteVente, onRembourser, journalCaisse, addJournalEvent}){
  const todayStr = new Date().toISOString().slice(0,10);

  // ── États saisie vente ──
  const [lignes, setLignes] = useState([{produit:"",qte:1}]);
  const [paiement, setPaiement] = useState("CB");
  const [espece_donnee, setEspeceDonnee] = useState("");
  const [nomClient, setNomClient] = useState("");
  const [saved, setSaved] = useState(false);

  // ── Modals ──
  const [showFacture, setShowFacture] = useState(null);
  const [editVente, setEditVente] = useState(null);
  const [showOuverture, setShowOuverture] = useState(false);
  const [showFermeture, setShowFermeture] = useState(false);

  // ── Ouverture ──
  const [dateOuverture, setDateOuverture] = useState(todayStr);
  const [fondOuvertureSaisie, setFondOuvertureSaisie] = useState("");

  // ── Fermeture ──
  const [fondFermetureSaisie, setFondFermetureSaisie] = useState("");

  // Trouver l'ouverture et fermeture du jour sélectionné
  const ouvertureToday = journalCaisse.filter(e=>e.type==="ouverture" && e.date===todayStr).slice(-1)[0]||null;
  const fermetureToday = journalCaisse.filter(e=>e.type==="fermeture" && e.date===todayStr).slice(-1)[0]||null;

  // Première visite du jour sans ouverture → proposer ouverture
  React.useEffect(()=>{
    if(!ouvertureToday) setShowOuverture(true);
  },[todayStr]);

  // ── Helpers ──
  const getPrix = (id) => { const p=produits.find(x=>x.id===id)||(cbcData||[]).find(x=>x.id===id); return p?.prix||p?.prix_vente||0; };
  const getNom  = (id) => { const p=produits.find(x=>x.id===id)||(cbcData||[]).find(x=>x.id===id); return p?.nom||id; };

  // ── Calculs vente ──
  const total = lignes.reduce((s,l)=> s + getPrix(l.produit)*l.qte, 0);
  const monnaie = paiement==="Espèce" && espece_donnee ? parseFloat(espece_donnee)-total : null;

  const addLigne = ()=>setLignes(prev=>[...prev,{produit:"",qte:1}]);
  const removeLigne = (i)=>setLignes(prev=>prev.filter((_,j)=>j!==i));
  const updateLigne = (i,k,v)=>setLignes(prev=>prev.map((l,j)=>j===i?{...l,[k]:v}:l));

  const valider = ()=>{
    const items = lignes.filter(l=>l.produit);
    if(!items.length) return;
    onAdd({items, total, paiement, espece_donnee:parseFloat(espece_donnee)||0, nomClient:nomClient.trim()});
    setLignes([{produit:"",qte:1}]); setPaiement("CB"); setEspeceDonnee(""); setNomClient("");
    setSaved(true); setTimeout(()=>setSaved(false),1800);
  };

  // ── KPIs jour ──
  const ventesAujourdhui = ventes.filter(v=>!v.deleted&&v.date&&v.date.startsWith(todayStr));
  const caJour    = ventesAujourdhui.filter(v=>!v.rembourse).reduce((s,v)=>s+v.total,0);
  const caCB      = ventesAujourdhui.filter(v=>!v.rembourse&&v.paiement==="CB").reduce((s,v)=>s+v.total,0);
  const caEspece  = ventesAujourdhui.filter(v=>!v.rembourse&&v.paiement==="Espèce").reduce((s,v)=>s+v.total,0);
  const nbJour    = ventesAujourdhui.filter(v=>!v.rembourse).length;

  // Première et dernière vente du jour (pour calcul délai)
  const ventesOrdonnees = [...ventesAujourdhui].sort((a,b)=>new Date(a.date)-new Date(b.date));
  const premiereVente = ventesOrdonnees[0];
  const derniereVente = ventesOrdonnees[ventesOrdonnees.length-1];

  const diffMin = (dateA, heureB) => {
    if(!dateA || !heureB) return null;
    const [h,m] = heureB.split(":").map(Number);
    const ref = new Date(dateA); ref.setHours(h,m,0,0);
    return Math.round((new Date(dateA)-ref)/60000);
  };

  // ── Ouverture caisse ──
  const confirmerOuverture = () => {
    const fond = parseFloat(fondOuvertureSaisie)||0;
    const heure = new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"});
    addJournalEvent({type:"ouverture", date:dateOuverture, heure, fond});
    setShowOuverture(false); setFondOuvertureSaisie("");
  };

  // ── Fermeture caisse ──
  const fondOuv = ouvertureToday?.fond||0;
  const theorique = fondOuv + caEspece;
  const fondFerm = parseFloat(fondFermetureSaisie)||0;
  const ecart = fondFermetureSaisie ? fondFerm - theorique : null;

  const confirmerFermeture = () => {
    const heure = new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"});
    addJournalEvent({type:"fermeture", date:todayStr, heure, fond:fondFerm, fondOuverture:fondOuv, caJour, caCB, caEspece, theorique, ecart, nbVentes:nbJour});
    setShowFermeture(false); setFondFermetureSaisie("");
  };

  // ── Export CSV ──
  const exportCSV = () => {
    const rows = [["Date","Heure","Client","Produits","Total","Paiement","Remboursé"]];
    ventes.filter(v=>!v.deleted).forEach(v=>{
      const prods = v.items?.map(it=>`${it.qte}x ${getNom(it.produit)}`).join("|")||"";
      const h = new Date(v.date).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"});
      rows.push([new Date(v.date).toLocaleDateString("fr-FR"), h, v.nomClient||"", prods, v.total.toFixed(2), v.paiement, v.rembourse?"Oui":"Non"]);
    });
    const csv = rows.map(r=>r.map(c=>`"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv],{type:"text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob); const a = document.createElement("a");
    a.href=url; a.download=`ventes_sam_${todayStr}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  const cats = [...new Set(produits.map(p=>p.categorie))];
  const Dropdown = ({value, onChange}) => (
    <select value={value} onChange={e=>onChange(e.target.value)}
      style={{flex:2,padding:"6px 8px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-tertiary)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:14}}>
      <option value="">— Produit —</option>
      {cats.map(cat=>(
        <optgroup key={cat} label={cat.charAt(0).toUpperCase()+cat.slice(1)}>
          {produits.filter(p=>p.categorie===cat).map(p=>(
            <option key={p.id} value={p.id}>{p.nom} — {p.prix}€</option>
          ))}
        </optgroup>
      ))}
      {(cbcData||[]).length>0&&(<>
        <optgroup label="── CBC Fleurs">{cbcData.filter(x=>x.famille==="CBC"&&x.type==="fleur").map(x=><option key={x.id} value={x.id}>{x.nom} — {x.prix_vente}€</option>)}</optgroup>
        <optgroup label="── CBC Résines">{cbcData.filter(x=>x.famille==="CBC"&&x.type==="résine").map(x=><option key={x.id} value={x.id}>{x.nom} — {x.prix_vente}€</option>)}</optgroup>
        <optgroup label="── CBD Fleurs">{cbcData.filter(x=>x.famille==="CBD"&&x.type==="fleur").map(x=><option key={x.id} value={x.id}>{x.nom} — {x.prix_vente}€</option>)}</optgroup>
        <optgroup label="── CBD Résines">{cbcData.filter(x=>x.famille==="CBD"&&x.type==="résine").map(x=><option key={x.id} value={x.id}>{x.nom} — {x.prix_vente}€</option>)}</optgroup>
      </>)}
    </select>
  );

  const btnSt = (color="default") => ({
    fontSize:12, padding:"4px 12px", display:"flex", alignItems:"center", gap:4, cursor:"pointer",
    borderRadius:"var(--border-radius-md)",
    border: color==="danger"?"0.5px solid rgba(220,53,69,0.4)":color==="warning"?"0.5px solid rgba(255,152,0,0.4)":color==="primary"?"0.5px solid var(--color-border-primary)":"0.5px solid var(--color-border-tertiary)",
    background: color==="danger"?"rgba(220,53,69,0.08)":color==="warning"?"rgba(255,152,0,0.10)":color==="primary"?"var(--color-background-secondary)":"var(--color-background-secondary)",
    color: color==="danger"?"#dc3545":color==="warning"?"#e65100":"var(--color-text-secondary)",
  });

  return (
    <div>
      {/* ══ MODAL OUVERTURE ══ */}
      {showOuverture&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem"}}>
          <div style={{background:"#ffffff",color:"#111",borderRadius:"var(--border-radius-lg)",padding:"2rem",maxWidth:380,width:"100%",boxShadow:"0 8px 40px rgba(0,0,0,0.2)"}}>
            <div style={{fontSize:20,fontWeight:600,marginBottom:4}}>☀️ Ouverture de caisse</div>
            <div style={{fontSize:13,color:"#666",marginBottom:"1.5rem"}}>Saisissez le fond de départ</div>

            <label style={{fontSize:12,color:"#555",display:"block",marginBottom:4}}>Date d'ouverture</label>
            <input type="date" value={dateOuverture} onChange={e=>setDateOuverture(e.target.value)}
              style={{width:"100%",padding:"8px 10px",fontSize:14,border:"1px solid #ddd",borderRadius:8,marginBottom:12,color:"#111",background:"#fafafa"}}/>

            <label style={{fontSize:12,color:"#555",display:"block",marginBottom:4}}>Fond de caisse (€)</label>
            <input type="number" step="0.50" min="0" placeholder="Ex: 150.00" value={fondOuvertureSaisie}
              onChange={e=>setFondOuvertureSaisie(e.target.value)} autoFocus
              style={{width:"100%",padding:"10px 12px",fontSize:18,border:"1px solid #ddd",borderRadius:8,marginBottom:16,color:"#111",background:"#fafafa"}}/>

            <button onClick={confirmerOuverture}
              style={{width:"100%",padding:"12px",background:"#111",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontSize:15,fontWeight:600,marginBottom:8}}>
              Ouvrir la caisse
            </button>
            <button onClick={()=>setShowOuverture(false)}
              style={{width:"100%",padding:"8px",background:"none",border:"none",cursor:"pointer",fontSize:13,color:"#888"}}>
              Passer
            </button>
          </div>
        </div>
      )}

      {/* ══ MODAL FERMETURE ══ */}
      {showFermeture&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem"}} onClick={()=>setShowFermeture(false)}>
          <div style={{background:"#ffffff",color:"#111",borderRadius:"var(--border-radius-lg)",padding:"2rem",maxWidth:440,width:"100%",boxShadow:"0 8px 40px rgba(0,0,0,0.2)"}} onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:20,fontWeight:600,marginBottom:"1.5rem"}}>🌙 Fermeture de caisse</div>

            <div style={{background:"#f8f8f8",borderRadius:8,padding:"1rem",marginBottom:"1.5rem",fontSize:13}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:"6px 0"}}>
                {[
                  ["Fond d'ouverture", fmtE(fondOuv)],
                  ["Heure d'ouverture", ouvertureToday?.heure||"—"],
                  ["1ère vente", premiereVente ? new Date(premiereVente.date).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"}) : "—"],
                  ["Dernière vente", derniereVente ? new Date(derniereVente.date).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"}) : "—"],
                  ["CA espèces", fmtE(caEspece)],
                  ["CA CB", fmtE(caCB)],
                  ["CA total", fmtE(caJour)],
                  ["Nb ventes", nbJour],
                  ["Théorique en caisse", fmtE(theorique)],
                ].map(([label, val])=>(
                  <React.Fragment key={label}>
                    <span style={{color:"#666"}}>{label}</span>
                    <span style={{textAlign:"right",fontWeight:500,color:"#111"}}>{val}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>

            <label style={{fontSize:12,color:"#555",display:"block",marginBottom:4}}>Fond compté réel (€)</label>
            <input type="number" step="0.50" min="0" placeholder="Montant en caisse" value={fondFermetureSaisie}
              onChange={e=>setFondFermetureSaisie(e.target.value)} autoFocus
              style={{width:"100%",padding:"10px 12px",fontSize:18,border:"1px solid #ddd",borderRadius:8,marginBottom:12,color:"#111",background:"#fafafa"}}/>

            {ecart!==null&&(
              <div style={{
                padding:"10px 14px",borderRadius:8,marginBottom:12,fontWeight:600,fontSize:15,
                display:"flex",justifyContent:"space-between",
                background:Math.abs(ecart)<0.5?"#e8f5e9":ecart>0?"#e3f2fd":"#fdecea",
                color:Math.abs(ecart)<0.5?"#2e7d32":ecart>0?"#1565c0":"#c62828"
              }}>
                <span>Écart</span>
                <span>{ecart>0?"+":""}{fmtE(ecart)} {Math.abs(ecart)<0.5?"✓":ecart>0?"(excédent)":"(manquant)"}</span>
              </div>
            )}

            <button onClick={confirmerFermeture} disabled={!fondFermetureSaisie}
              style={{width:"100%",padding:"12px",background:fondFermetureSaisie?"#111":"#ccc",color:"#fff",border:"none",borderRadius:8,cursor:fondFermetureSaisie?"pointer":"default",fontSize:15,fontWeight:600,marginBottom:8}}>
              Clôturer la journée
            </button>
            <button onClick={()=>setShowFermeture(false)}
              style={{width:"100%",padding:"8px",background:"none",border:"none",cursor:"pointer",fontSize:13,color:"#888"}}>
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* ══ BANDEAU ÉTAT CAISSE ══ */}
      <div style={{background:"var(--color-background-secondary)",borderRadius:"var(--border-radius-md)",padding:"10px 14px",marginBottom:"1rem",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
        <div style={{fontSize:13}}>
          {ouvertureToday ? (
            <>
              <span style={{fontWeight:500}}>☀️ Ouverte</span>
              <span style={{color:"var(--color-text-secondary)",marginLeft:6}}>à {ouvertureToday.heure} — Fond: {fmtE(ouvertureToday.fond)}</span>
              {fermetureToday&&<span style={{color:"#e65100",marginLeft:8}}>· 🌙 Clôturée à {fermetureToday.heure}</span>}
            </>
          ) : (
            <span style={{color:"var(--color-text-secondary)"}}>Caisse non ouverte aujourd'hui</span>
          )}
        </div>
        <div style={{display:"flex",gap:6}}>
          {!ouvertureToday&&<button onClick={()=>setShowOuverture(true)} style={{...btnSt("primary"),fontWeight:500}}>☀️ Ouvrir</button>}
          {ouvertureToday&&!fermetureToday&&<button onClick={()=>setShowFermeture(true)} style={{...btnSt("warning"),fontWeight:500}}>🌙 Fermer la caisse</button>}
        </div>
      </div>

      {/* ══ KPIs ══ */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:10,marginBottom:"1.5rem"}}>
        {[
          {label:"CA aujourd'hui",val:fmtE(caJour)},
          {label:"CB",val:fmtE(caCB)},
          {label:"Espèce",val:fmtE(caEspece)},
          {label:"Nb ventes",val:nbJour},
          {label:"Ticket moyen",val:nbJour?fmtE(caJour/nbJour):"—"},
        ].map(k=>(
          <div key={k.label} style={{background:"var(--color-background-secondary)",borderRadius:"var(--border-radius-md)",padding:"0.75rem 1rem"}}>
            <div style={{fontSize:11,color:"var(--color-text-secondary)",marginBottom:4}}>{k.label}</div>
            <div style={{fontSize:18,fontWeight:500}}>{k.val}</div>
          </div>
        ))}
      </div>

      {/* ══ FORMULAIRE NOUVELLE VENTE ══ */}
      <div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-lg)",padding:"1.25rem",marginBottom:"1.5rem"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem"}}>
          <div style={{fontSize:11,fontWeight:500,color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:1}}>Nouvelle vente</div>
          <button onClick={exportCSV} style={btnSt()}><i className="ti ti-download"/>Export CSV</button>
        </div>

        <input placeholder="Nom client (facultatif)" value={nomClient} onChange={e=>setNomClient(e.target.value)}
          style={{width:"100%",padding:"6px 10px",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-md)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:13,marginBottom:10}}/>

        {lignes.map((l,i)=>(
          <div key={i} style={{display:"flex",gap:8,marginBottom:8,alignItems:"center"}}>
            <Dropdown value={l.produit} onChange={v=>updateLigne(i,"produit",v)}/>
            <input type="number" min="1" step="1" value={l.qte} onChange={e=>updateLigne(i,"qte",parseInt(e.target.value)||1)}
              style={{width:55,padding:"6px 8px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-tertiary)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:14,textAlign:"center"}}/>
            <span style={{fontSize:14,color:"var(--color-text-secondary)",minWidth:50,textAlign:"right"}}>
              {l.produit ? fmtE(getPrix(l.produit)*l.qte) : ""}
            </span>
            <button onClick={()=>removeLigne(i)} disabled={lignes.length===1}
              style={{...btnSt("danger"),opacity:lignes.length===1?0.3:1,padding:"5px 8px"}}>
              <i className="ti ti-x"/>
            </button>
          </div>
        ))}

        <button onClick={addLigne} style={{fontSize:13,color:"var(--color-text-secondary)",background:"none",border:"0.5px dashed var(--color-border-tertiary)",borderRadius:"var(--border-radius-md)",padding:"6px 14px",cursor:"pointer",marginBottom:"1rem",width:"100%"}}>
          <i className="ti ti-plus" style={{marginRight:4}}/> Ajouter un produit
        </button>

        <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:"0.75rem",flexWrap:"wrap"}}>
          <select value={paiement} onChange={e=>{setPaiement(e.target.value);setEspeceDonnee("");}}
            style={{padding:"6px 10px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-tertiary)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:14}}>
            <option>CB</option><option>Espèce</option>
          </select>
          {paiement==="Espèce"&&(
            <div style={{display:"flex",gap:8,alignItems:"center",flex:1}}>
              <input type="number" placeholder={`Donné (min ${fmtE(total)})`} value={espece_donnee}
                onChange={e=>setEspeceDonnee(e.target.value)} min={total} step="0.50"
                style={{flex:1,padding:"6px 8px",borderRadius:"var(--border-radius-md)",border:"0.5px solid "+(monnaie!==null&&monnaie<0?"#dc3545":"var(--color-border-tertiary)"),background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:14}}/>
              {monnaie!==null&&(
                <div style={{padding:"6px 14px",borderRadius:"var(--border-radius-md)",background:monnaie>=0?"var(--color-background-success)":"rgba(220,53,69,0.08)",color:monnaie>=0?"var(--color-text-success)":"#dc3545",fontWeight:500,fontSize:16,whiteSpace:"nowrap"}}>
                  {monnaie>=0?`Rendu : ${fmtE(monnaie)}`:`Manque : ${fmtE(-monnaie)}`}
                </div>
              )}
            </div>
          )}
          <span style={{marginLeft:"auto",fontSize:18,fontWeight:500}}>{fmtE(total)}</span>
        </div>

        <button onClick={valider} disabled={!lignes.some(l=>l.produit)||(paiement==="Espèce"&&monnaie!==null&&monnaie<0)} style={{
          width:"100%",padding:"10px",borderRadius:"var(--border-radius-md)",
          background:saved?"var(--color-background-success)":lignes.some(l=>l.produit)&&!(paiement==="Espèce"&&monnaie!==null&&monnaie<0)?"var(--color-text-primary)":"var(--color-background-secondary)",
          color:saved?"var(--color-text-success)":lignes.some(l=>l.produit)?"var(--color-background-primary)":"var(--color-text-secondary)",
          border:"none",cursor:"pointer",fontSize:15,fontWeight:500,transition:"all 0.2s"
        }}>
          {saved?<><i className="ti ti-check" style={{marginRight:6}}/>Enregistré</>:"Valider la vente"}
        </button>
      </div>

      {/* ══ HISTORIQUE DU JOUR ══ */}
      {ventesAujourdhui.length>0&&(
        <div>
          <div style={{fontSize:11,fontWeight:500,color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:1,marginBottom:"0.75rem"}}>
            Ventes du jour — {new Date().toLocaleDateString("fr-FR")}
          </div>
          {[...ventesAujourdhui].reverse().map(v=>(
            <div key={v.id} style={{padding:"10px 12px",marginBottom:8,borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-tertiary)",background:v.rembourse?"var(--color-background-secondary)":"var(--color-background-primary)",opacity:v.rembourse?0.6:1}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                <div style={{flex:1}}>
                  {v.nomClient&&<div style={{fontSize:11,fontWeight:500,color:"var(--color-text-secondary)",marginBottom:4}}>👤 {v.nomClient}</div>}
                  <div style={{fontSize:11,color:"var(--color-text-secondary)",marginBottom:4}}>{new Date(v.date).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})}</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                    {v.items?.map((it,i)=>(
                      <span key={i} style={{padding:"2px 8px",borderRadius:"var(--border-radius-md)",background:"var(--color-background-secondary)",fontSize:12,textDecoration:v.rembourse?"line-through":""}}>
                        {it.qte}× {getNom(it.produit)}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6,marginLeft:8}}>
                  <span style={{fontSize:14,fontWeight:500,textDecoration:v.rembourse?"line-through":""}}>{fmtE(v.total)}</span>
                  <span style={{fontSize:11,padding:"2px 8px",borderRadius:"var(--border-radius-md)",background:v.paiement==="CB"?"var(--color-background-info)":"var(--color-background-success)",color:v.paiement==="CB"?"var(--color-text-info)":"var(--color-text-success)"}}>{v.paiement}</span>
                  {v.rembourse&&<span style={{fontSize:11,padding:"2px 8px",borderRadius:"var(--border-radius-md)",background:"var(--color-background-warning)",color:"var(--color-text-warning)"}}>Remboursé</span>}
                </div>
              </div>
              <div style={{display:"flex",gap:6,justifyContent:"flex-end",flexWrap:"wrap"}}>
                <button onClick={()=>setShowFacture(v)} style={btnSt()}><i className="ti ti-file-invoice"/>Facture</button>
                {!v.rembourse&&<button onClick={()=>setEditVente({...v,items:[...v.items]})} style={btnSt("primary")}><i className="ti ti-edit"/>Modifier</button>}
                {!v.rembourse&&<button onClick={()=>{if(window.confirm("Rembourser ?")) onRembourser(v.id);}} style={btnSt("warning")}><i className="ti ti-arrow-back-up"/>Rembourser</button>}
                <button onClick={()=>{if(window.confirm("Supprimer ?")) deleteVente(v.id);}} style={btnSt("danger")}><i className="ti ti-trash"/>Suppr.</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══ MODAL ÉDITION VENTE ══ */}
      {editVente&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem"}} onClick={()=>setEditVente(null)}>
          <div style={{background:"#ffffff",color:"#111",borderRadius:"var(--border-radius-lg)",padding:"1.5rem",maxWidth:480,width:"100%",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 8px 40px rgba(0,0,0,0.18)"}} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem"}}>
              <span style={{fontSize:15,fontWeight:600,color:"#111"}}>Modifier la vente</span>
              <button onClick={()=>setEditVente(null)} style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:"#888"}}><i className="ti ti-x"/></button>
            </div>
            <input placeholder="Nom client (facultatif)" value={editVente.nomClient||""} onChange={e=>setEditVente({...editVente,nomClient:e.target.value})}
              style={{width:"100%",padding:"6px 10px",border:"1px solid #ddd",borderRadius:8,fontSize:13,marginBottom:10,color:"#111",background:"#fafafa"}}/>
            {editVente.items.map((it,i)=>(
              <div key={i} style={{display:"flex",gap:8,marginBottom:8,alignItems:"center"}}>
                <Dropdown value={it.produit} onChange={v=>{const a=[...editVente.items];a[i]={...a[i],produit:v};setEditVente({...editVente,items:a});}}/>
                <input type="number" min="1" value={it.qte} onChange={e=>{const a=[...editVente.items];a[i]={...a[i],qte:parseInt(e.target.value)||1};setEditVente({...editVente,items:a});}}
                  style={{width:55,padding:"6px 8px",borderRadius:6,border:"1px solid #ddd",fontSize:14,textAlign:"center",color:"#111"}}/>
                <span style={{minWidth:50,textAlign:"right",fontSize:13,color:"#888"}}>{fmtE(getPrix(it.produit)*it.qte)}</span>
                <button onClick={()=>{
                  const reste=editVente.items.filter((_,j)=>j!==i);
                  if(reste.length===0){if(window.confirm("Rembourser la vente ?")){ onRembourser(editVente.id); setEditVente(null);} return;}
                  setEditVente({...editVente,items:reste});
                }} style={{background:"rgba(220,53,69,0.08)",border:"1px solid rgba(220,53,69,0.3)",cursor:"pointer",color:"#dc3545",fontSize:13,padding:"4px 8px",borderRadius:6}}>
                  <i className="ti ti-trash"/>
                </button>
              </div>
            ))}
            <button onClick={()=>setEditVente({...editVente,items:[...editVente.items,{produit:"",qte:1}]})}
              style={{fontSize:13,color:"#888",background:"none",border:"1px dashed #ddd",borderRadius:6,padding:"5px 14px",cursor:"pointer",marginBottom:"1rem",width:"100%"}}>
              + Ajouter un produit
            </button>
            <div style={{display:"flex",justifyContent:"space-between",fontWeight:500,marginBottom:"1rem",fontSize:14,color:"#111"}}>
              <span>Nouveau total</span>
              <span>{fmtE(editVente.items.reduce((s,it)=>s+getPrix(it.produit)*it.qte,0))}</span>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>{
                const items=editVente.items.filter(it=>it.produit);
                const newTotal=items.reduce((s,it)=>s+getPrix(it.produit)*it.qte,0);
                onAdd({...editVente,items,total:newTotal,id:editVente.id,date:editVente.date});
                deleteVente(editVente.id); setEditVente(null);
              }} style={{flex:1,padding:"9px",background:"#111",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontSize:14,fontWeight:600}}>Enregistrer</button>
              <button onClick={()=>setEditVente(null)} style={{padding:"9px 16px",background:"none",border:"1px solid #ddd",borderRadius:8,cursor:"pointer",fontSize:14,color:"#888"}}>Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ MODAL FACTURE ══ */}
      {showFacture&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem"}} onClick={()=>setShowFacture(null)}>
          <div style={{background:"#ffffff",color:"#111",borderRadius:"var(--border-radius-lg)",padding:"2rem",maxWidth:420,width:"100%",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 8px 40px rgba(0,0,0,0.18)"}} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem"}}>
              <div><div style={{fontSize:16,fontWeight:600,color:"#111"}}>Facture / Reçu</div><div style={{fontSize:12,color:"#666"}}>SAM — Café & CBD</div></div>
              <button onClick={()=>setShowFacture(null)} style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:"#888"}}><i className="ti ti-x"/></button>
            </div>
            <div style={{fontSize:12,color:"#666",marginBottom:"1rem",paddingBottom:"1rem",borderBottom:"1px solid #eee"}}>
              <div>{new Date(showFacture.date).toLocaleDateString("fr-FR",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</div>
              <div>{new Date(showFacture.date).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})}</div>
              {showFacture.nomClient&&<div style={{marginTop:4,fontWeight:600,color:"#111"}}>Client : {showFacture.nomClient}</div>}
            </div>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,marginBottom:"1rem"}}>
              <thead><tr style={{borderBottom:"1px solid #eee"}}>
                <th style={{textAlign:"left",padding:"5px 0",fontWeight:400,color:"#888"}}>Produit</th>
                <th style={{textAlign:"center",padding:"5px 8px",fontWeight:400,color:"#888"}}>Qté</th>
                <th style={{textAlign:"right",padding:"5px 0",fontWeight:400,color:"#888"}}>P.U.</th>
                <th style={{textAlign:"right",padding:"5px 0",fontWeight:400,color:"#888"}}>Total</th>
              </tr></thead>
              <tbody>
                {showFacture.items?.map((it,i)=>{
                  const pu=getPrix(it.produit);
                  return(<tr key={i} style={{borderBottom:"1px solid #f0f0f0"}}>
                    <td style={{padding:"8px 0",color:"#111"}}>{getNom(it.produit)}</td>
                    <td style={{textAlign:"center",padding:"8px 8px",color:"#111"}}>{it.qte}</td>
                    <td style={{textAlign:"right",padding:"8px 0",color:"#888"}}>{pu}€</td>
                    <td style={{textAlign:"right",padding:"8px 0",fontWeight:600,color:"#111"}}>{fmtE(pu*it.qte)}</td>
                  </tr>);
                })}
              </tbody>
            </table>
            <div style={{borderTop:"2px solid #111",paddingTop:"0.75rem"}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:16,fontWeight:700,marginBottom:6,color:"#111"}}><span>Total</span><span>{fmtE(showFacture.total)}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:"#666"}}><span>Paiement</span><span>{showFacture.paiement}</span></div>
              {showFacture.paiement==="Espèce"&&showFacture.espece_donnee>0&&(<>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:"#666"}}><span>Donné</span><span>{fmtE(showFacture.espece_donnee)}</span></div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:"#2e7d32",fontWeight:500}}><span>Rendu</span><span>{fmtE(showFacture.espece_donnee-showFacture.total)}</span></div>
              </>)}
              {showFacture.rembourse&&<div style={{marginTop:8,textAlign:"center",fontSize:12,color:"#e65100",fontWeight:600}}>⚠ Cette vente a été remboursée</div>}
            </div>
            <div style={{marginTop:"1.5rem",textAlign:"center",fontSize:11,color:"#888",borderTop:"1px solid #eee",paddingTop:"1rem"}}>
              TVA non applicable — Article 293B du CGI
            </div>
            <button onClick={()=>window.print()} style={{marginTop:"1rem",width:"100%",padding:"10px",background:"#111",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontSize:14,fontWeight:600}}>
              <i className="ti ti-printer" style={{marginRight:6}}/>Imprimer / PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


function Dashboard({ventes, produits}){
  const now = new Date();
  const moisActuel = now.getMonth();
  const anneeActuelle = now.getFullYear();

  const ventesMois = ventes.filter(v=>{
    if(!v.date || v.deleted) return false;
    const d = new Date(v.date);
    return d.getMonth()===moisActuel && d.getFullYear()===anneeActuelle;
  });

  const caTotal = ventesMois.reduce((s,v)=>s+v.total,0);
  const nbVentes = ventesMois.length;
  const ticketMoyen = nbVentes ? caTotal/nbVentes : 0;

  const ventesParProduit = {};
  ventesMois.forEach(v=>v.items?.forEach(it=>{
    if(!ventesParProduit[it.produit]) ventesParProduit[it.produit]={qte:0,ca:0};
    const p = produits.find(x=>x.id===it.produit);
    ventesParProduit[it.produit].qte += it.qte;
    ventesParProduit[it.produit].ca += it.qte*(p?.prix||0);
  }));

  const topProduits = Object.entries(ventesParProduit)
    .map(([id,v])=>({id,...v,nom:produits.find(x=>x.id===id)?.nom||id}))
    .sort((a,b)=>b.qte-a.qte);

  const maxQte = topProduits[0]?.qte||1;

  const venteParJour = {};
  ventesMois.forEach(v=>{
    const d = v.date?.slice(0,10);
    if(d){ venteParJour[d]=(venteParJour[d]||0)+v.total; }
  });

  const cbParMois = ventesMois.filter(v=>v.paiement==="CB").reduce((s,v)=>s+v.total,0);
  const espParMois = ventesMois.filter(v=>v.paiement==="Espèce").reduce((s,v)=>s+v.total,0);

  const kpis = [
    {label:`CA ${MOIS_LABELS[moisActuel]}`, val:fmtE(caTotal)},
    {label:"Nb ventes", val:nbVentes},
    {label:"Ticket moyen", val:nbVentes?fmtE(ticketMoyen):"—"},
    {label:"CB", val:fmtE(cbParMois)},
    {label:"Espèce", val:fmtE(espParMois)},
  ];

  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10,marginBottom:"2rem"}}>
        {kpis.map(k=>(
          <div key={k.label} style={{background:"var(--color-background-secondary)",borderRadius:"var(--border-radius-md)",padding:"0.75rem 1rem"}}>
            <div style={{fontSize:12,color:"var(--color-text-secondary)",marginBottom:4}}>{k.label}</div>
            <div style={{fontSize:20,fontWeight:500}}>{k.val}</div>
          </div>
        ))}
      </div>

      {topProduits.length>0 ? (
        <>
          <div style={{fontSize:11,fontWeight:500,color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:1,marginBottom:"1rem"}}>Ventes par produit — {MOIS_LABELS[moisActuel]}</div>
          {topProduits.map(p=>{
            const prod = produits.find(x=>x.id===p.id);
            
            return (
              <div key={p.id} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:3}}>
                  <span style={{display:"flex",alignItems:"center",gap:6}}>
                    <span style={{width:8,height:8,borderRadius:"50%",background:cat_color[prod?.categorie]||"#888",display:"inline-block"}}/>
                    {p.nom}
                  </span>
                  <span style={{color:"var(--color-text-secondary)"}}>{p.qte} unités — {fmtE(p.ca)}</span>
                </div>
                <div style={{height:6,background:"var(--color-background-secondary)",borderRadius:3,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${(p.qte/maxQte)*100}%`,background:cat_color[prod?.categorie]||"#888",borderRadius:3,transition:"width 0.3s"}}/>
                </div>
              </div>
            );
          })}

          <div style={{marginTop:"2rem",fontSize:11,fontWeight:500,color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:1,marginBottom:"1rem"}}>CA par jour</div>
          {Object.entries(venteParJour).sort().map(([d,ca])=>(
            <div key={d} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"0.5px solid var(--color-border-tertiary)",fontSize:13}}>
              <span style={{color:"var(--color-text-secondary)"}}>{new Date(d).toLocaleDateString("fr-FR",{weekday:"short",day:"numeric",month:"short"})}</span>
              <span style={{fontWeight:500}}>{fmtE(ca)}</span>
            </div>
          ))}
        </>
      ) : (
        <div style={{textAlign:"center",padding:"3rem",color:"var(--color-text-secondary)",fontSize:14}}>
          <i className="ti ti-chart-bar" style={{fontSize:40,display:"block",marginBottom:"1rem",opacity:0.3}} aria-hidden="true"/>
          Aucune vente ce mois-ci.<br/>Enregistrez vos ventes dans l'onglet Caisse.
        </div>
      )}
    </div>
  );
}

function Recettes({produits, setProduits, nbres, achats}){
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState(null);

  const p = selected ? produits.find(x=>x.id===selected) : null;
  const cr = p ? calcCR(p) : 0;

  const startEdit = ()=>{ setEditData(JSON.parse(JSON.stringify(p))); setEditing(true); };
  const saveEdit = ()=>{
    setProduits(prev=>prev.map(x=>x.id===editData.id?editData:x));
    setEditing(false);
  };

  const cats = [...new Set(produits.map(p=>p.categorie))];
  const catLabels = {sam:"Les Sams",sucre:"Sucrés",sandwich:"Sandwichs",boisson:"Boissons"};

  return (
    <div style={{display:"grid",gridTemplateColumns:selected?"260px 1fr":"1fr",gap:"1.5rem"}}>
      <div>
        {cats.map(cat=>(
          <div key={cat} style={{marginBottom:"1rem"}}>
            <div style={{fontSize:11,fontWeight:500,color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:1,padding:"4px 0",marginBottom:4}}>{catLabels[cat]||cat}</div>
            {produits.filter(x=>x.categorie===cat).map(prod=>(
              <button key={prod.id} onClick={()=>{setSelected(prod.id);setEditing(false);}} style={{
                display:"block",width:"100%",textAlign:"left",padding:"8px 12px",
                border:"0.5px solid "+(selected===prod.id?"var(--color-border-primary)":"var(--color-border-tertiary)"),
                borderRadius:"var(--border-radius-md)",marginBottom:4,cursor:"pointer",
                background:selected===prod.id?"var(--color-background-secondary)":"var(--color-background-primary)",
                color:"var(--color-text-primary)",fontSize:13
              }}>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <span>{prod.nom}</span>
                  <span style={{color:"var(--color-text-secondary)",fontWeight:500}}>{prod.prix}€</span>
                </div>
                <div style={{fontSize:11,color:"var(--color-text-secondary)",marginTop:2}}>
                  CR: {fmtE(calcCR(prod))} — marge: {fmt((1-calcCR(prod)/prod.prix)*100,0)}%
                </div>
              </button>
            ))}
          </div>
        ))}
      </div>

      {p && (
        <div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-lg)",padding:"1.25rem"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1rem"}}>
            <div>
              <h2 style={{margin:0,fontSize:17,fontWeight:500}}>{p.nom}</h2>
              <span style={{fontSize:12,padding:"2px 8px",borderRadius:"var(--border-radius-md)",background:cat_bg[p.categorie],color:cat_color[p.categorie],fontWeight:500}}>{p.categorie}</span>
            </div>
            <button onClick={startEdit} style={{border:"0.5px solid var(--color-border-tertiary)",background:"none",cursor:"pointer",padding:"6px 12px",borderRadius:"var(--border-radius-md)",fontSize:13,color:"var(--color-text-secondary)"}}>
              <i className="ti ti-edit" style={{marginRight:4}} aria-hidden="true"/> Modifier
            </button>
          </div>

          {!editing ? (
            <>
              <div style={{fontSize:11,color:"var(--color-text-secondary)",marginBottom:6,fontWeight:500}}>
                RECETTE DE BASE — 1 fournée de {p.nbre_par_fournee} pièce{p.nbre_par_fournee>1?"s":""}
              </div>
              <table style={{width:"100%",fontSize:13,borderCollapse:"collapse"}}>
                <thead>
                  <tr style={{borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
                    <th style={{textAlign:"left",padding:"4px 0",color:"var(--color-text-secondary)",fontWeight:400}}>Ingrédient</th>
                    <th style={{textAlign:"right",padding:"4px 8px",color:"var(--color-text-secondary)",fontWeight:400}}>Qté</th>
                    <th style={{textAlign:"right",padding:"4px 0",color:"var(--color-text-secondary)",fontWeight:400}}>Unité</th>
                    <th style={{textAlign:"right",padding:"4px 0",color:"var(--color-text-secondary)",fontWeight:400}}>Prix/u</th>
                    <th style={{textAlign:"right",padding:"4px 0",color:"var(--color-text-secondary)",fontWeight:400}}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {p.ingredients.map((ing,i)=>(
                    <tr key={i} style={{borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
                      <td style={{padding:"6px 0"}}>{ing.n}</td>
                      <td style={{textAlign:"right",padding:"6px 8px"}}>{ing.q}</td>
                      <td style={{textAlign:"right",padding:"6px 0",color:"var(--color-text-secondary)"}}>{ing.u}</td>
                      <td style={{textAlign:"right",padding:"6px 0",color:"var(--color-text-secondary)"}}>{ing.pu}€</td>
                      <td style={{textAlign:"right",padding:"6px 0",fontWeight:400}}>{fmtE(ing.q*ing.pu)}</td>
                    </tr>
                  ))}
                  {p.feuille_brick&&(
                    <tr style={{borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
                      <td style={{padding:"6px 0",color:"var(--color-text-secondary)"}}>Feuille brick <span style={{fontSize:11}}>(1/Sam, 0.1€÷2)</span></td>
                      <td style={{textAlign:"right",padding:"6px 8px"}}>{p.nbre_par_fournee}</td>
                      <td style={{textAlign:"right",padding:"6px 0",color:"var(--color-text-secondary)"}}>feuilles</td>
                      <td style={{textAlign:"right",padding:"6px 0",color:"var(--color-text-secondary)"}}>0.05€</td>
                      <td style={{textAlign:"right",padding:"6px 0"}}>{fmtE(p.nbre_par_fournee*0.05)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
              {(()=>{
                // Marge réelle basée sur derniers achats connus
                const crReel = p.ingredients.reduce((s,ing)=>{
                  // Chercher le dernier achat connu pour cet ingrédient
                  const dernier = (achats||[]).filter(a=>a.ingredient===ing.n).sort((a,b)=>b.id-a.id)[0];
                  const prixReel = dernier ? dernier.prix_unitaire : ing.pu;
                  const qteUnit = p.nbre_par_fournee>1 ? ing.q/p.nbre_par_fournee : ing.q;
                  return s + qteUnit * prixReel;
                },0) + (p.feuille_brick ? 0.05 : 0);
                const margeReel = (1 - crReel/p.prix)*100;
                const hasRealData = (achats||[]).some(a=>p.ingredients.some(i=>i.n===a.ingredient));
                return (
                  <div style={{marginTop:"1rem",display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8}}>
                    {p.nbre_par_fournee>1&&<div style={{background:"var(--color-background-secondary)",borderRadius:"var(--border-radius-md)",padding:"8px 12px"}}>
                      <div style={{fontSize:11,color:"var(--color-text-secondary)"}}>Par fournée</div>
                      <div style={{fontSize:15,fontWeight:500}}>{p.nbre_par_fournee} pièces</div>
                    </div>}
                    <div style={{background:"var(--color-background-secondary)",borderRadius:"var(--border-radius-md)",padding:"8px 12px"}}>
                      <div style={{fontSize:11,color:"var(--color-text-secondary)"}}>CR théorique</div>
                      <div style={{fontSize:15,fontWeight:500}}>{fmtE(cr)}</div>
                    </div>
                    <div style={{background:"var(--color-background-secondary)",borderRadius:"var(--border-radius-md)",padding:"8px 12px"}}>
                      <div style={{fontSize:11,color:"var(--color-text-secondary)"}}>Marge théorique</div>
                      <div style={{fontSize:15,fontWeight:500,color:"var(--color-text-success)"}}>{fmt((1-cr/p.prix)*100,0)}%</div>
                    </div>
                    <div style={{background:hasRealData?(margeReel<20?"rgba(220,53,69,0.08)":margeReel<35?"rgba(255,152,0,0.08)":"rgba(46,125,50,0.08)"):"var(--color-background-secondary)",borderRadius:"var(--border-radius-md)",padding:"8px 12px",border:hasRealData?(margeReel<20?"1px solid rgba(220,53,69,0.3)":margeReel<35?"1px solid rgba(255,152,0,0.3)":"none"):"none"}}>
                      <div style={{fontSize:11,color:"var(--color-text-secondary)"}}>Marge réelle {hasRealData?"":"(pas d'achat)"}</div>
                      <div style={{fontSize:15,fontWeight:500,color:hasRealData?(margeReel<20?"#dc3545":margeReel<35?"#e65100":"#2e7d32"):"var(--color-text-secondary)"}}>
                        {hasRealData?`${fmt(margeReel,0)}%`:"—"}
                      </div>
                    </div>
                  </div>
                );
              })()}
              {(()=>{
                const n = (nbres && nbres[p.id]) || 0;
                const factor = p.nbre_par_fournee > 1 ? n/p.nbre_par_fournee : n;
                const fournees = p.nbre_par_fournee > 1 ? Math.ceil(n/p.nbre_par_fournee) : null;
                const totalMatieres = p.ingredients.reduce((s,i)=>s+i.q*factor*i.pu,0)+(p.feuille_brick?n*0.05:0);
                return (
                  <div style={{marginTop:"1rem",border:"0.5px solid var(--color-border-secondary)",borderRadius:"var(--border-radius-md)",overflow:"hidden"}}>
                    <div style={{background:"var(--color-text-primary)",padding:"8px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{fontSize:12,fontWeight:500,color:"var(--color-background-primary)"}}>Courses pour production</span>
                      <span style={{fontSize:12,color:"var(--color-background-secondary)"}}>
                        {n > 0 ? `${n} pièces${fournees ? ` — ${fournees} fournée${fournees>1?"s":""}` : ""}` : "→ Saisir dans Planif"}
                      </span>
                    </div>
                    {n > 0 ? (
                      <table style={{width:"100%",fontSize:13,borderCollapse:"collapse"}}>
                        <thead>
                          <tr style={{borderBottom:"0.5px solid var(--color-border-tertiary)",background:"var(--color-background-secondary)"}}>
                            <th style={{textAlign:"left",padding:"6px 12px",color:"var(--color-text-secondary)",fontWeight:400,fontSize:11}}>Ingrédient</th>
                            <th style={{textAlign:"right",padding:"6px 8px",color:"var(--color-text-secondary)",fontWeight:400,fontSize:11}}>Quantité à préparer</th>
                            <th style={{textAlign:"right",padding:"6px 12px",color:"var(--color-text-secondary)",fontWeight:400,fontSize:11}}>Coût</th>
                          </tr>
                        </thead>
                        <tbody>
                          {p.ingredients.map((ing,i)=>(
                            <tr key={i} style={{borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
                              <td style={{padding:"7px 12px"}}>{ing.n}</td>
                              <td style={{textAlign:"right",padding:"7px 8px",fontWeight:500,fontSize:14,color:"var(--color-text-primary)"}}>
                                {fmt(ing.q*factor, ing.u==="unit"?1:3)} {ing.u}
                              </td>
                              <td style={{textAlign:"right",padding:"7px 12px",color:"var(--color-text-secondary)"}}>{fmtE(ing.q*factor*ing.pu)}</td>
                            </tr>
                          ))}
                          {p.feuille_brick&&(
                            <tr style={{borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
                              <td style={{padding:"7px 12px"}}>Feuille brick <span style={{fontSize:11,color:"var(--color-text-secondary)"}}>(1/Sam, découpée en 2)</span></td>
                              <td style={{textAlign:"right",padding:"7px 8px",fontWeight:500,fontSize:14,color:"var(--color-text-primary)"}}>{fmt(n,0)} feuilles</td>
                              <td style={{textAlign:"right",padding:"7px 12px",color:"var(--color-text-secondary)"}}>{fmtE(n*0.05)}</td>
                            </tr>
                          )}
                        </tbody>
                        <tfoot>
                          <tr style={{background:"var(--color-background-secondary)"}}>
                            <td style={{padding:"7px 12px",fontSize:12,fontWeight:500}}>Total matières</td>
                            <td/>
                            <td style={{textAlign:"right",padding:"7px 12px",fontWeight:500}}>{fmtE(totalMatieres)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    ) : (
                      <div style={{padding:"1rem 12px",fontSize:13,color:"var(--color-text-secondary)",textAlign:"center"}}>
                        Va dans <strong>Planif</strong> et saisis le nombre souhaité — les quantités apparaîtront ici.
                      </div>
                    )}
                  </div>
                );
              })()}
              {p.allergenes?.length>0&&(
                <div style={{marginTop:"1rem"}}>
                  <div style={{fontSize:11,color:"var(--color-text-secondary)",marginBottom:4}}>Allergènes</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                    {p.allergenes.map(a=>(
                      <span key={a} style={{fontSize:12,padding:"2px 8px",borderRadius:"var(--border-radius-md)",background:"var(--color-background-warning)",color:"var(--color-text-warning)"}}>{ALLERGENES_MAP[a]||a}</span>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div>
              <div style={{marginBottom:"1rem",display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                <div>
                  <label style={{fontSize:12,color:"var(--color-text-secondary)"}}>Prix de vente (€)</label>
                  <input type="number" step="0.1" value={editData.prix}
                    onChange={e=>setEditData({...editData,prix:parseFloat(e.target.value)||0})}
                    style={{display:"block",width:"100%",marginTop:4,padding:"6px 8px",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-md)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:13}}/>
                </div>
                {editData.nbre_par_fournee>1&&<div>
                  <label style={{fontSize:12,color:"var(--color-text-secondary)"}}>Pièces / fournée</label>
                  <input type="number" step="1" value={editData.nbre_par_fournee}
                    onChange={e=>setEditData({...editData,nbre_par_fournee:parseInt(e.target.value)||1})}
                    style={{display:"block",width:"100%",marginTop:4,padding:"6px 8px",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-md)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:13}}/>
                </div>}
              </div>
              <div style={{fontSize:12,color:"var(--color-text-secondary)",marginBottom:4}}>Ingrédients</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 70px 60px 70px 70px 24px",gap:4,marginBottom:4}}>
                {["Nom","Qté","Unité","Prix réf.","Prix max",""].map(h=>(
                  <div key={h} style={{fontSize:10,color:"var(--color-text-secondary)",fontWeight:500}}>{h}</div>
                ))}
              </div>
              {editData.ingredients.map((ing,i)=>(
                <div key={i} style={{marginBottom:8}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 70px 60px 70px 70px 24px",gap:4,marginBottom:2,alignItems:"center"}}>
                    <input value={ing.n} onChange={e=>{const a=[...editData.ingredients];a[i]={...a[i],n:e.target.value};setEditData({...editData,ingredients:a});}}
                      placeholder="Ingrédient"
                      style={{padding:"5px 7px",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-md)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:12}}/>
                    <input type="number" step="0.001" value={ing.q} onChange={e=>{const a=[...editData.ingredients];a[i]={...a[i],q:parseFloat(e.target.value)||0};setEditData({...editData,ingredients:a});}}
                      placeholder="Qté"
                      style={{padding:"5px 7px",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-md)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:12}}/>
                    <input value={ing.u} onChange={e=>{const a=[...editData.ingredients];a[i]={...a[i],u:e.target.value};setEditData({...editData,ingredients:a});}}
                      placeholder="Unité"
                      style={{padding:"5px 7px",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-md)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:12}}/>
                    <input type="number" step="0.01" value={ing.pu} onChange={e=>{const a=[...editData.ingredients];a[i]={...a[i],pu:parseFloat(e.target.value)||0};setEditData({...editData,ingredients:a});}}
                      placeholder="Réf €"
                      style={{padding:"5px 7px",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-md)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:12}}/>
                    <input type="number" step="0.01" value={ing.pu_max||""} onChange={e=>{const a=[...editData.ingredients];a[i]={...a[i],pu_max:parseFloat(e.target.value)||0};setEditData({...editData,ingredients:a});}}
                      placeholder="Max €"
                      style={{padding:"5px 7px",border:"0.5px solid rgba(220,53,69,0.3)",borderRadius:"var(--border-radius-md)",background:"rgba(220,53,69,0.03)",color:"#dc3545",fontSize:12}}/>
                    <button onClick={()=>{const a=editData.ingredients.filter((_,j)=>j!==i);setEditData({...editData,ingredients:a});}}
                      style={{background:"none",border:"none",cursor:"pointer",color:"var(--color-text-secondary)",fontSize:14}}>
                      <i className="ti ti-x" aria-hidden="true"/>
                    </button>
                  </div>
                  <div style={{display:"flex",gap:8,fontSize:10,color:"var(--color-text-secondary)",paddingLeft:2}}>
                    <span>Prix réf: {ing.pu}€/u</span>
                    {ing.pu_max&&<span style={{color:"#dc3545"}}>Max: {ing.pu_max}€/u</span>}
                  </div>
                </div>
              ))}
              <button onClick={()=>setEditData({...editData,ingredients:[...editData.ingredients,{n:"",q:0,u:"kg",pu:0}]})}
                style={{fontSize:12,color:"var(--color-text-secondary)",background:"none",border:"0.5px dashed var(--color-border-tertiary)",borderRadius:"var(--border-radius-md)",padding:"5px 12px",cursor:"pointer",marginBottom:"1rem"}}>
                + Ajouter
              </button>
              <div style={{display:"flex",gap:8}}>
                <button onClick={saveEdit} style={{flex:1,padding:"8px",background:"var(--color-text-primary)",color:"var(--color-background-primary)",border:"none",borderRadius:"var(--border-radius-md)",cursor:"pointer",fontSize:13,fontWeight:500}}>Enregistrer</button>
                <button onClick={()=>setEditing(false)} style={{padding:"8px 16px",background:"none",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-md)",cursor:"pointer",fontSize:13,color:"var(--color-text-secondary)"}}>Annuler</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Planif({produits, nbres, setNbres, achats, setAchats, setCourses, ventes}){
  const todayStr = new Date().toISOString().slice(0,10);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState(null);
  const fileRef = React.useRef(null);

  // État cochage + prix réels
  const [coursesSession, setCoursesSession] = useState(()=>{
    const map = {};
    produits.forEach(p=>p.ingredients.forEach(ing=>{
      if(!map[ing.n]) map[ing.n]={checked:false, prix_reel:"", unite:ing.u, pu_ref:ing.pu, pu_max:ing.pu_max||0};
    }));
    return map;
  });

  // Ventes du jour — info affichage uniquement, ne réduit PAS le besoin courses
  // (les ventes écoulent le stock déjà produit, pas le prévisionnel)
  const venduAujourd = {};
  (ventes||[]).filter(v=>!v.deleted&&!v.rembourse&&v.date&&v.date.startsWith(todayStr))
    .forEach(v=>v.items?.forEach(it=>{
      venduAujourd[it.produit] = (venduAujourd[it.produit]||0) + it.qte;
    }));

  const totalProduits = Object.values(nbres).reduce((s,v)=>s+v,0);

  // Calcul liste de courses
  const coursesMap = {};
  produits.forEach(p=>{
    const n = nbres[p.id]||0;
    if(n<=0) return;
    const factor = p.nbre_par_fournee>0 ? n/p.nbre_par_fournee : n;
    p.ingredients.forEach(ing=>{
      const key = ing.n;
      if(!coursesMap[key]) coursesMap[key]={qte:0,unite:ing.u,pu:ing.pu,pu_max:ing.pu_max||0};
      coursesMap[key].qte += ing.q * factor;
    });
    if(p.feuille_brick){
      if(!coursesMap["Feuille brick"]) coursesMap["Feuille brick"]={qte:0,unite:"unit",pu:0.1,pu_max:0.15};
      coursesMap["Feuille brick"].qte += n/2;
    }
  });
  const emb = totalProduits/8;
  if(!coursesMap["Serviette"]) coursesMap["Serviette"]={qte:0,unite:"unit",pu:0.015,pu_max:0.02};
  coursesMap["Serviette"].qte += emb;
  if(!coursesMap["Barquette"]) coursesMap["Barquette"]={qte:0,unite:"unit",pu:0.07,pu_max:0.10};
  coursesMap["Barquette"].qte += emb;

  const totalCoursesTh = Object.values(coursesMap).reduce((s,v)=>s+v.qte*v.pu,0);

  // Dernier prix connu pour un ingrédient
  const getLastPrix = (nom) => {
    const a = (achats||[]).filter(x=>x.ingredient===nom).sort((a,b)=>b.id-a.id)[0];
    return a ? a.prix_unitaire : null;
  };

  // Stock acheté aujourd'hui pour un ingrédient
  const getStockAchete = (nom) => {
    return (achats||[])
      .filter(x=>x.ingredient===nom && x.date===todayStr)
      .reduce((s,x)=>s+x.qte_achetee, 0);
  };

  // Upload facture vers Drive dossier "CBD Flandres"
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if(!file) return;
    setUploading(true); setUploadMsg(null);
    try {
      const base64 = await new Promise((res,rej)=>{
        const r = new FileReader();
        r.onload = ()=>res(r.result.split(",")[1]);
        r.onerror = ()=>rej(new Error("Lecture échouée"));
        r.readAsDataURL(file);
      });
      const mois = todayStr.slice(0,7);
      const fileName = "facture_" + todayStr + "_" + file.name;
      const payload = JSON.stringify({action:"upload_drive", fileName, mois, mimeType:file.type, data:base64});
      
      // On utilise fetch sans no-cors pour pouvoir lire la réponse
      // Apps Script doit avoir CORS activé (Access-Control-Allow-Origin)
      let success = false;
      try {
        const resp = await fetch(GOOGLE_URL, {
          method:"POST",
          headers:{"Content-Type":"text/plain"},
          body: payload
        });
        const result = await resp.json();
        success = result.status === "ok";
      } catch(corsErr){
        // CORS bloqué → fallback no-cors (on ne peut pas lire la réponse mais ça passe)
        await fetch(GOOGLE_URL, {
          method:"POST", mode:"no-cors",
          headers:{"Content-Type":"text/plain"},
          body: payload
        });
        success = true; // on suppose que ça a marché
      }
      
      if(success){
        setUploadMsg("✅ Facture envoyée dans CBD Flandres/" + mois + "/");
      } else {
        setUploadMsg("❌ Erreur lors de l'envoi au Drive");
      }
    } catch(err){
      setUploadMsg("❌ " + err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // Valider les achats cochés
  const validerAchats = () => {
    const coches = Object.entries(coursesSession).filter(([,v])=>v.checked && v.prix_reel);
    if(!coches.length) return;
    const nouveauxAchats = coches.map(([nom,v])=>({
      id: Date.now() + Math.random(),
      ingredient: nom,
      prix_unitaire: parseFloat(v.prix_reel)||0,
      unite: v.unite,
      date: todayStr,
      qte_achetee: coursesMap[nom]?.qte||0
    }));
    const totalReel = coches.reduce((acc,[nom,v])=>
      acc + (parseFloat(v.prix_reel)||0)*(coursesMap[nom]?.qte||0), 0);

    setAchats(prev=>[...prev, ...nouveauxAchats]);
    setCourses(prev=>[...prev,{
      id: Date.now(),
      date: new Date().toLocaleDateString("fr-FR"),
      commercant: "Courses du " + new Date().toLocaleDateString("fr-FR"),
      montant: totalReel.toFixed(2),
      mois: new Date().getMonth()
    }]);
    saveRemote({action:"save_achats", achats: nouveauxAchats});
    // Reset
    setCoursesSession(prev=>{
      const next={};
      Object.entries(prev).forEach(([k,v])=>{ next[k]={...v,checked:false,prix_reel:""}; });
      return next;
    });
    alert(nouveauxAchats.length + " achats enregistrés — Total réel : " + totalReel.toFixed(2) + "€");
  };

  const cats = [...new Set(produits.map(p=>p.categorie))];
  const alerteCount = Object.entries(coursesSession).filter(([nom,v])=>{
    const pu_max = coursesMap[nom]?.pu_max||0;
    return v.checked && v.prix_reel && pu_max>0 && parseFloat(v.prix_reel)>pu_max;
  }).length;

  return (
    <div>
      {/* Quantités souhaitées */}
      <div style={{marginBottom:"1.5rem"}}>
        <div style={{fontSize:11,fontWeight:500,color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:1,marginBottom:"0.75rem"}}>Quantités souhaitées</div>
        {cats.map(cat=>(
          <div key={cat} style={{marginBottom:"1rem"}}>
            <div style={{fontSize:12,color:"var(--color-text-secondary)",marginBottom:4,fontWeight:500}}>{cat.charAt(0).toUpperCase()+cat.slice(1)}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:8}}>
              {produits.filter(p=>p.categorie===cat).map(p=>(
                <div key={p.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-md)"}}>
                  <span style={{flex:1,fontSize:13}}>{p.nom}</span>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                    <input type="number" min="0" step="1" value={nbres[p.id]||0}
                      onChange={e=>setNbres(prev=>({...prev,[p.id]:parseInt(e.target.value)||0}))}
                      style={{width:55,padding:"4px 6px",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-md)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:13,textAlign:"center"}}/>
                    {(()=>{
                      const prevu = nbres[p.id]||0;
                      const vendu = venduAujourd[p.id]||0;
                      const restant = prevu - vendu;
                      if(prevu===0) return null;
                      return (
                        <span style={{fontSize:10,fontWeight:500,color:restant<=0?"#dc3545":restant<prevu?"#e65100":"#dc3545"}}>
                          {restant<=0?"✓ tout vendu":"→ "+restant+" restants"}
                        </span>
                      );
                    })()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Courses du jour — liste cochable */}
      <div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-lg)",padding:"1.25rem",marginBottom:"1.5rem"}}>

        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem",flexWrap:"wrap",gap:8}}>
          <div>
            <div style={{fontSize:14,fontWeight:500}}>🛒 Courses du jour</div>
            <div style={{fontSize:11,color:"var(--color-text-secondary)"}}>Cochez et saisissez le prix réel payé par unité</div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <input ref={fileRef} type="file" accept="image/*,application/pdf" onChange={handleUpload} style={{display:"none"}}/>
            <button onClick={()=>fileRef.current?.click()} disabled={uploading}
              style={{fontSize:12,padding:"5px 12px",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-md)",background:"var(--color-background-secondary)",cursor:"pointer",color:"var(--color-text-secondary)",display:"flex",alignItems:"center",gap:5}}>
              <i className="ti ti-upload"/>{uploading?"Envoi...":"📎 Déposer facture"}
            </button>
          </div>
        </div>

        {uploadMsg&&(
          <div style={{padding:"7px 12px",borderRadius:"var(--border-radius-md)",marginBottom:12,fontSize:12,
            background:uploadMsg.startsWith("✅")?"rgba(46,125,50,0.07)":"rgba(220,53,69,0.07)",
            color:uploadMsg.startsWith("✅")?"#2e7d32":"#dc3545",
            border:"0.5px solid "+(uploadMsg.startsWith("✅")?"rgba(46,125,50,0.3)":"rgba(220,53,69,0.3)")}}>
            {uploadMsg}
          </div>
        )}

        {/* Table */}
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",fontSize:13,borderCollapse:"collapse",minWidth:480}}>
            <thead>
              <tr style={{borderBottom:"1px solid var(--color-border-tertiary)",background:"var(--color-background-secondary)"}}>
                <th style={{padding:"7px 8px",width:32}}></th>
                <th style={{textAlign:"left",padding:"7px 8px",fontWeight:500}}>Ingrédient</th>
                <th style={{textAlign:"right",padding:"7px 8px",fontWeight:400,color:"var(--color-text-secondary)",fontSize:11}}>Besoin</th>
                <th style={{textAlign:"right",padding:"7px 8px",fontWeight:400,color:"#2e7d32",fontSize:11}}>Acheté</th>
                <th style={{textAlign:"right",padding:"7px 8px",fontWeight:500,fontSize:11}}>Reste</th>
                <th style={{textAlign:"right",padding:"7px 8px",fontWeight:400,color:"var(--color-text-secondary)",fontSize:11}}>Réf.</th>
                <th style={{textAlign:"right",padding:"7px 8px",fontWeight:400,color:"#dc3545",fontSize:11}}>Max</th>
                <th style={{textAlign:"right",padding:"7px 8px",fontWeight:400,color:"var(--color-text-secondary)",fontSize:11}}>Dernier</th>
                <th style={{textAlign:"right",padding:"7px 8px",fontWeight:500,fontSize:12}}>Prix réel /u</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(coursesMap).sort((a,b)=>a[0].localeCompare(b[0])).map(([nom,v])=>{
                const sess = coursesSession[nom]||{checked:false,prix_reel:"",unite:v.unite,pu_ref:v.pu,pu_max:v.pu_max};
                const prixReel = parseFloat(sess.prix_reel)||0;
                const lastPrix = getLastPrix(nom);
                const depasse = sess.prix_reel && v.pu_max>0 && prixReel>v.pu_max;
                const perim = nom.toLowerCase().includes("viande")||nom.toLowerCase().includes("poulet")||nom.toLowerCase().includes("framboise")?"🔴":
                              nom.toLowerCase().includes("lait")||nom.toLowerCase().includes("oeuf")?"🟡":"🟢";
                return (
                  <tr key={nom} style={{
                    borderBottom:"0.5px solid var(--color-border-tertiary)",
                    background:depasse?"rgba(220,53,69,0.04)":sess.checked?"rgba(46,125,50,0.02)":"transparent",
                    transition:"background 0.15s"
                  }}>
                    <td style={{padding:"7px 8px",textAlign:"center"}}>
                      <input type="checkbox" checked={!!sess.checked}
                        onChange={e=>setCoursesSession(prev=>({...prev,[nom]:{...(prev[nom]||sess),checked:e.target.checked}}))}
                        style={{width:16,height:16,cursor:"pointer"}}/>
                    </td>
                    <td style={{padding:"7px 8px",fontWeight:sess.checked?500:400}}>
                      <span style={{marginRight:5}}>{perim}</span>{nom}
                    </td>
                    {(()=>{
                      const achete = getStockAchete(nom);
                      const reste = Math.max(0, v.qte - achete);
                      return (<>
                        <td style={{textAlign:"right",padding:"7px 8px",color:"var(--color-text-secondary)",fontSize:12}}>
                          {fmt(v.qte,2)} {v.unite}
                        </td>
                        <td style={{textAlign:"right",padding:"7px 8px",fontSize:12,color:achete>0?"#2e7d32":"var(--color-text-secondary)",fontWeight:achete>0?500:400}}>
                          {achete>0?fmt(achete,2)+" "+v.unite:"—"}
                        </td>
                        <td style={{textAlign:"right",padding:"7px 8px",fontSize:12,fontWeight:reste>0?500:400,color:reste===0?"#2e7d32":reste<v.qte?"#e65100":"var(--color-text-primary)"}}>
                          {reste===0?"✓ OK":fmt(reste,2)+" "+v.unite}
                        </td>
                      </>);
                    })()}
                    <td style={{textAlign:"right",padding:"7px 8px",color:"var(--color-text-secondary)",fontSize:12}}>{v.pu}€</td>
                    <td style={{textAlign:"right",padding:"7px 8px",fontSize:12,fontWeight:v.pu_max>0?500:400,color:v.pu_max>0?"#dc3545":"var(--color-text-secondary)"}}>
                      {v.pu_max>0?v.pu_max+"€":"—"}
                    </td>
                    <td style={{textAlign:"right",padding:"7px 8px",fontSize:12}}>
                      {lastPrix
                        ? <span style={{color:v.pu_max>0&&lastPrix>v.pu_max?"#dc3545":lastPrix>v.pu?"#e65100":"#2e7d32",fontWeight:500}}>{lastPrix}€</span>
                        : <span style={{color:"var(--color-text-secondary)"}}>—</span>}
                    </td>
                    <td style={{padding:"7px 4px",textAlign:"right"}}>
                      {sess.checked&&(
                        <div style={{display:"flex",alignItems:"center",gap:4,justifyContent:"flex-end"}}>
                          <input type="number" step="0.01" min="0" placeholder="0.00"
                            value={sess.prix_reel}
                            onChange={e=>setCoursesSession(prev=>({...prev,[nom]:{...(prev[nom]||sess),prix_reel:e.target.value}}))}
                            style={{
                              width:72,padding:"4px 6px",textAlign:"right",fontSize:13,
                              border:"0.5px solid "+(depasse?"#dc3545":"var(--color-border-tertiary)"),
                              borderRadius:"var(--border-radius-md)",
                              background:depasse?"rgba(220,53,69,0.05)":"var(--color-background-primary)",
                              color:depasse?"#dc3545":"var(--color-text-primary)"
                            }}/>
                          {depasse&&<span style={{fontSize:10,color:"#dc3545",whiteSpace:"nowrap",fontWeight:600}}>
                            ⚠ +{((prixReel/v.pu_max-1)*100).toFixed(0)}%
                          </span>}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Barre de validation */}
        {Object.values(coursesSession).some(v=>v.checked)&&(
          <div style={{marginTop:"1rem",padding:"10px 14px",background:"var(--color-background-secondary)",borderRadius:"var(--border-radius-md)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
            <div style={{fontSize:13}}>
              <span style={{fontWeight:500}}>{Object.values(coursesSession).filter(v=>v.checked).length} articles cochés</span>
              {alerteCount>0&&<span style={{marginLeft:10,fontSize:12,color:"#dc3545"}}>⚠ {alerteCount} prix au-dessus du seuil max</span>}
            </div>
            <button onClick={validerAchats}
              style={{padding:"8px 20px",background:"var(--color-text-primary)",color:"var(--color-background-primary)",border:"none",borderRadius:"var(--border-radius-md)",cursor:"pointer",fontSize:13,fontWeight:500}}>
              Valider les achats
            </button>
          </div>
        )}
      </div>

      {/* Résumé stock */}
      {(()=>{
        const totalAchete = Object.keys(coursesMap).reduce((s,nom)=>{
          return s + getStockAchete(nom)*(coursesMap[nom].pu||0);
        },0);
        const restant = Object.keys(coursesMap).filter(nom=>getStockAchete(nom)<coursesMap[nom].qte).length;
        if(totalAchete===0) return null;
        return (
          <div style={{background:"rgba(46,125,50,0.06)",border:"0.5px solid rgba(46,125,50,0.3)",borderRadius:"var(--border-radius-md)",padding:"10px 14px",marginBottom:"1rem",display:"flex",gap:16,flexWrap:"wrap",fontSize:13}}>
            <span>✅ <strong>{fmtE(totalAchete)}</strong> achetés aujourd'hui</span>
            {restant>0&&<span style={{color:"#e65100"}}>⏳ <strong>{restant}</strong> ingrédient{restant>1?"s":""} encore à compléter</span>}
            {restant===0&&<span style={{color:"#2e7d32",fontWeight:500}}>🎉 Toutes les courses sont faites !</span>}
          </div>
        );
      })()}

      {/* Liste théorique */}
      <div style={{fontSize:11,fontWeight:500,color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:1,marginBottom:"0.75rem"}}>
        Liste théorique — {fmtE(totalCoursesTh)}
      </div>
      <table style={{width:"100%",fontSize:13,borderCollapse:"collapse"}}>
        <thead>
          <tr style={{borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
            {["Ingrédient","Quantité","Unité","Prix réf.","Total","Périm."].map(h=>(
              <th key={h} style={{textAlign:h==="Ingrédient"?"left":"right",padding:"4px 8px",color:"var(--color-text-secondary)",fontWeight:400,fontSize:12}}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(coursesMap).sort((a,b)=>a[0].localeCompare(b[0])).map(([nom,v])=>(
            <tr key={nom} style={{borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
              <td style={{padding:"6px 8px"}}>{nom}</td>
              <td style={{textAlign:"right",padding:"6px 8px"}}>{fmt(v.qte,3)}</td>
              <td style={{textAlign:"right",padding:"6px 8px",color:"var(--color-text-secondary)"}}>{v.unite}</td>
              <td style={{textAlign:"right",padding:"6px 8px",color:"var(--color-text-secondary)"}}>{v.pu}€</td>
              <td style={{textAlign:"right",padding:"6px 8px",fontWeight:500}}>{fmtE(v.qte*v.pu)}</td>
              <td style={{textAlign:"right",padding:"6px 8px",fontSize:11}}>
                {nom.toLowerCase().includes("viande")||nom.toLowerCase().includes("poulet")||nom.toLowerCase().includes("framboise")?"🔴":
                 nom.toLowerCase().includes("lait")||nom.toLowerCase().includes("oeuf")?"🟡":"🟢"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


function Compta({ventes, params, produits, courses, setCourses}){
  const now = new Date();
  const moisActuel = now.getMonth();
  const anneeActuelle = now.getFullYear();

  const [selectedMois, setSelectedMois] = useState(moisActuel);
  const [newCourse, setNewCourse] = useState({date:"",montant:"",commercant:""});
  const [showAddCourse, setShowAddCourse] = useState(false);

  const ventesMois = ventes.filter(v=>{
    if(!v.date || v.deleted) return false;
    const d = new Date(v.date);
    return d.getMonth()===selectedMois && d.getFullYear()===anneeActuelle;
  });

  const caVentes = ventesMois.reduce((s,v)=>s+v.total,0);
  const coursesMois = courses.filter(c=>c.mois===selectedMois);
  const totalCourses = coursesMois.reduce((s,c)=>s+parseFloat(c.montant||0),0);

  const totalChargesFixes = params.charges_fixes.reduce((s,c)=>s+c.montant,0);
  const totalChargesVarFixes = params.charges_variables_fixes.reduce((s,c)=>s+c.montant,0);

  const charges_sociales = caVentes * params.taux_cotisation_acre;
  const cfp = caVentes * params.taux_cfp;
  const ir = caVentes * params.taux_ir;

  const totalCharges = totalCourses + totalChargesFixes + totalChargesVarFixes + charges_sociales + cfp;
  const resultat_net = caVentes - totalCharges;
  const resultat_comptable = resultat_net - ir;

  const addCourse = ()=>{
    if(!newCourse.montant) return;
    setCourses(prev=>[...prev,{...newCourse,mois:selectedMois,id:Date.now()}]);
    setNewCourse({date:"",montant:"",commercant:""});
    setShowAddCourse(false);
  };

  const Row = ({label, val, sub=false, bold=false, color=null})=>(
    <tr style={{borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
      <td style={{padding:"6px 8px",fontSize:sub?12:13,paddingLeft:sub?24:8,color:sub?"var(--color-text-secondary)":"var(--color-text-primary)",fontWeight:bold?500:400}}>{label}</td>
      <td style={{textAlign:"right",padding:"6px 8px",fontSize:13,fontWeight:bold?500:400,color:color||"var(--color-text-primary)"}}>{fmtE(val)}</td>
    </tr>
  );

  return (
    <div>
      <div style={{display:"flex",gap:8,marginBottom:"1.5rem",flexWrap:"wrap"}}>
        {MOIS_LABELS.map((m,i)=>(
          <button key={i} onClick={()=>setSelectedMois(i)} style={{
            padding:"5px 12px",border:"0.5px solid "+(selectedMois===i?"var(--color-border-primary)":"var(--color-border-tertiary)"),
            borderRadius:"var(--border-radius-md)",background:selectedMois===i?"var(--color-background-secondary)":"none",
            cursor:"pointer",fontSize:13,color:"var(--color-text-primary)",fontWeight:selectedMois===i?500:400
          }}>{m}</button>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.5rem"}}>
        <div>
          <div style={{fontSize:11,fontWeight:500,color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:1,marginBottom:"0.75rem"}}>Compte de résultat — {MOIS_LABELS[selectedMois]}</div>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <tbody>
              <tr style={{background:"var(--color-background-secondary)"}}>
                <td style={{padding:"6px 8px",fontSize:11,fontWeight:500,color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:1}} colSpan={2}>Produits</td>
              </tr>
              <Row label="Ventes" val={caVentes} bold/>
              <tr style={{background:"var(--color-background-secondary)",marginTop:8}}>
                <td style={{padding:"6px 8px",fontSize:11,fontWeight:500,color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:1}} colSpan={2}>Charges</td>
              </tr>
              <Row label="Marchandises (courses)" val={totalCourses} sub/>
              {params.charges_fixes.map((c,i)=><Row key={i} label={c.label} val={c.montant} sub/>)}
              {params.charges_variables_fixes.map((c,i)=><Row key={i} label={c.label} val={c.montant} sub/>)}
              <Row label={`Cotisations ACRE (${(params.taux_cotisation_acre*100).toFixed(1)}%)`} val={charges_sociales} sub/>
              <Row label={`CFP (${(params.taux_cfp*100).toFixed(1)}%)`} val={cfp} sub/>
              <Row label="Total charges" val={totalCharges} bold/>
              <Row label="Résultat net" val={resultat_net} bold color={resultat_net>=0?"var(--color-text-success)":"var(--color-text-danger)"}/>
              <Row label={`IR versement libératoire (${(params.taux_ir*100).toFixed(1)}%)`} val={ir} sub/>
              <Row label="Résultat net comptable" val={resultat_comptable} bold color={resultat_comptable>=0?"var(--color-text-success)":"var(--color-text-danger)"}/>
            </tbody>
          </table>
        </div>

        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.75rem"}}>
            <div style={{fontSize:11,fontWeight:500,color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:1}}>Courses — {MOIS_LABELS[selectedMois]}</div>
            <button onClick={()=>setShowAddCourse(!showAddCourse)} style={{fontSize:12,padding:"4px 10px",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-md)",background:"none",cursor:"pointer",color:"var(--color-text-secondary)"}}>
              + Ajouter
            </button>
          </div>

          {showAddCourse&&(
            <div style={{background:"var(--color-background-secondary)",borderRadius:"var(--border-radius-md)",padding:"0.75rem",marginBottom:"0.75rem"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:6}}>
                <input placeholder="Date (jj/mm)" value={newCourse.date} onChange={e=>setNewCourse({...newCourse,date:e.target.value})}
                  style={{padding:"5px 8px",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-md)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:12}}/>
                <input type="number" placeholder="Montant TTC (€)" value={newCourse.montant} onChange={e=>setNewCourse({...newCourse,montant:e.target.value})}
                  style={{padding:"5px 8px",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-md)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:12}}/>
              </div>
              <input placeholder="Commerçant (Metro, Lidl...)" value={newCourse.commercant} onChange={e=>setNewCourse({...newCourse,commercant:e.target.value})}
                style={{width:"100%",padding:"5px 8px",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-md)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:12,marginBottom:6}}/>
              <button onClick={addCourse} style={{padding:"5px 14px",background:"var(--color-text-primary)",color:"var(--color-background-primary)",border:"none",borderRadius:"var(--border-radius-md)",cursor:"pointer",fontSize:12}}>Ajouter</button>
            </div>
          )}

          {coursesMois.map(c=>(
            <div key={c.id} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"0.5px solid var(--color-border-tertiary)",fontSize:13}}>
              <span><span style={{color:"var(--color-text-secondary)",marginRight:8}}>{c.date}</span>{c.commercant}</span>
              <span style={{fontWeight:500}}>{fmtE(parseFloat(c.montant||0))}</span>
            </div>
          ))}
          {coursesMois.length===0&&<div style={{fontSize:13,color:"var(--color-text-secondary)",padding:"1rem 0"}}>Aucune course enregistrée ce mois.</div>}
          {coursesMois.length>0&&<div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",fontSize:13,fontWeight:500,borderTop:"0.5px solid var(--color-border-primary)"}}>
            <span>Total courses</span><span>{fmtE(totalCourses)}</span>
          </div>}
        </div>
      </div>
    </div>
  );
}

function CBC({cbcData, setCbcData}){
  const familles = [...new Set(cbcData.map(p=>p.famille))];
  const [editing, setEditing] = useState(null);

  const update = (id, key, val)=>{
    setCbcData(prev=>prev.map(p=>p.id===id?{...p,[key]:parseFloat(val)||0}:p));
  };

  const famColors = {CBC:{bg:"#BDD7EE",fg:"#1F4E79"},CBD:{bg:"#E2C6F5",fg:"#7030A0"}};

  return (
    <div>
      <div style={{fontSize:13,color:"var(--color-text-secondary)",marginBottom:"1.5rem"}}>
        Tableau des produits CBC/CBD — sans recette. Mettez à jour les prix selon vos tarifs fournisseurs.
      </div>
      {familles.map(fam=>(
        <div key={fam} style={{marginBottom:"2rem"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:"0.75rem"}}>
            <span style={{padding:"3px 12px",borderRadius:"var(--border-radius-md)",background:famColors[fam]?.bg||"#EEE",color:famColors[fam]?.fg||"#333",fontSize:12,fontWeight:500}}>{fam}</span>
          </div>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead>
              <tr style={{borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
                {["Produit","Taux","Poids (g)","Prix achat (€)","Prix vente (€)","Marge (%)"].map(h=>(
                  <th key={h} style={{textAlign:h==="Produit"?"left":"right",padding:"6px 8px",color:"var(--color-text-secondary)",fontWeight:400,fontSize:12}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cbcData.filter(p=>p.famille===fam).map(p=>{
                const marge = p.prix_vente>0 ? (p.prix_vente-p.prix_achat)/p.prix_vente*100 : 0;
                const isEdit = editing===p.id;
                return (
                  <tr key={p.id} style={{borderBottom:"0.5px solid var(--color-border-tertiary)",cursor:"pointer",background:isEdit?"var(--color-background-secondary)":"transparent"}}
                    onClick={()=>setEditing(isEdit?null:p.id)}>
                    <td style={{padding:"8px 8px",fontWeight:400}}>{p.nom}</td>
                    <td style={{textAlign:"right",padding:"8px 8px"}}><span style={{background:famColors[fam]?.bg||"#EEE",color:famColors[fam]?.fg||"#333",padding:"2px 8px",borderRadius:"var(--border-radius-md)",fontSize:11}}>{p.taux}</span></td>
                    <td style={{textAlign:"right",padding:"8px 8px"}}>
                      {isEdit?<input type="number" value={p.poids} onChange={e=>update(p.id,"poids",e.target.value)} onClick={e=>e.stopPropagation()} style={{width:55,padding:"3px 5px",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-md)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:12,textAlign:"right"}}/>:p.poids}
                    </td>
                    <td style={{textAlign:"right",padding:"8px 8px"}}>
                      {isEdit?<input type="number" step="0.01" value={p.prix_achat} onChange={e=>update(p.id,"prix_achat",e.target.value)} onClick={e=>e.stopPropagation()} style={{width:65,padding:"3px 5px",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-md)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:12,textAlign:"right"}}/>:fmtE(p.prix_achat)}
                    </td>
                    <td style={{textAlign:"right",padding:"8px 8px"}}>
                      {isEdit?<input type="number" step="0.01" value={p.prix_vente} onChange={e=>update(p.id,"prix_vente",e.target.value)} onClick={e=>e.stopPropagation()} style={{width:65,padding:"3px 5px",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-md)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:12,textAlign:"right"}}/>:<span style={{fontWeight:500}}>{fmtE(p.prix_vente)}</span>}
                    </td>
                    <td style={{textAlign:"right",padding:"8px 8px",color:marge>50?"var(--color-text-success)":"var(--color-text-warning)"}}>{fmt(marge,0)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
      <div style={{fontSize:12,color:"var(--color-text-secondary)",marginTop:"0.5rem"}}>
        <i className="ti ti-info-circle" style={{marginRight:4}} aria-hidden="true"/>
        Cliquer sur une ligne pour modifier les prix.
      </div>
    </div>
  );
}

function Allergenes({produits}){
  const allergenes = Object.keys(ALLERGENES_MAP);
  const cats = [...new Set(produits.map(p=>p.categorie))];

  return (
    <div style={{overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
        <thead>
          <tr style={{borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
            <th style={{textAlign:"left",padding:"6px 8px",minWidth:120,fontWeight:500}}>Produit</th>
            {allergenes.map(a=>(
              <th key={a} style={{textAlign:"center",padding:"6px 4px",minWidth:50,fontWeight:400,color:"var(--color-text-secondary)",fontSize:11,writingMode:"vertical-rl",height:80}}>
                {ALLERGENES_MAP[a]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cats.map(cat=>(
            <>
              <tr key={`h-${cat}`}>
                <td colSpan={allergenes.length+1} style={{padding:"8px 8px 4px",fontSize:11,fontWeight:500,color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:1,background:"var(--color-background-secondary)"}}>{cat.charAt(0).toUpperCase()+cat.slice(1)}</td>
              </tr>
              {produits.filter(p=>p.categorie===cat).map(p=>(
                <tr key={p.id} style={{borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
                  <td style={{padding:"6px 8px",fontWeight:400}}>{p.nom}</td>
                  {allergenes.map(a=>(
                    <td key={a} style={{textAlign:"center",padding:"6px 4px"}}>
                      {p.allergenes?.includes(a) ? <span style={{color:"var(--color-text-warning)",fontSize:14}}>⚠</span> : <span style={{color:"var(--color-border-tertiary)"}}>·</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Params({params, setParams}){
  const upd = (key, val)=>setParams(prev=>({...prev,[key]:parseFloat(val)||0}));
  const updCharge = (type, i, key, val)=>{
    setParams(prev=>{
      const arr = [...prev[type]];
      arr[i]={...arr[i],[key]: key==="montant"?parseFloat(val)||0:val};
      return {...prev,[type]:arr};
    });
  };
  const addCharge = (type)=>setParams(prev=>({...prev,[type]:[...prev[type],{label:"Nouveau frais",montant:0}]}));
  const delCharge = (type, i)=>setParams(prev=>({...prev,[type]:prev[type].filter((_,j)=>j!==i)}));

  return (
    <div>
      <div style={{marginBottom:"2rem"}}>
        <div style={{fontSize:11,fontWeight:500,color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:1,marginBottom:"1rem"}}>Taux fiscaux & sociaux</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12}}>
          {[
            {label:"Cotisations ACRE (%)",key:"taux_cotisation_acre",mult:100},
            {label:"CFP (%)",key:"taux_cfp",mult:100},
            {label:"IR versement libératoire (%)",key:"taux_ir",mult:100},
            {label:"Abattement fiscal (%)",key:"abattement",mult:100},
          ].map(f=>(
            <div key={f.key}>
              <label style={{display:"block",fontSize:12,color:"var(--color-text-secondary)",marginBottom:4}}>{f.label}</label>
              <input type="number" step="0.1" value={fmt(params[f.key]*f.mult,1)}
                onChange={e=>upd(f.key,(parseFloat(e.target.value)||0)/f.mult)}
                style={{width:"100%",padding:"7px 10px",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-md)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:13}}/>
            </div>
          ))}
        </div>
      </div>

      {[
        {type:"charges_fixes",label:"Charges fixes mensuelles"},
        {type:"charges_variables_fixes",label:"Charges variables récurrentes"},
      ].map(({type,label})=>(
        <div key={type} style={{marginBottom:"2rem"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.75rem"}}>
            <div style={{fontSize:11,fontWeight:500,color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:1}}>{label}</div>
            <button onClick={()=>addCharge(type)} style={{fontSize:12,padding:"4px 10px",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-md)",background:"none",cursor:"pointer",color:"var(--color-text-secondary)"}}>+ Ajouter</button>
          </div>
          {params[type].map((c,i)=>(
            <div key={i} style={{display:"flex",gap:8,marginBottom:8,alignItems:"center"}}>
              <input value={c.label} onChange={e=>updCharge(type,i,"label",e.target.value)}
                style={{flex:1,padding:"6px 10px",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-md)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:13}}/>
              <input type="number" step="0.01" value={c.montant} onChange={e=>updCharge(type,i,"montant",e.target.value)}
                style={{width:90,padding:"6px 10px",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-md)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:13,textAlign:"right"}}/>
              <span style={{fontSize:12,color:"var(--color-text-secondary)"}}>€/mois</span>
              <button onClick={()=>delCharge(type,i)} style={{background:"none",border:"none",cursor:"pointer",color:"var(--color-text-secondary)",fontSize:14}}>
                <i className="ti ti-trash" aria-hidden="true"/>
              </button>
            </div>
          ))}
          <div style={{textAlign:"right",fontSize:13,fontWeight:500,borderTop:"0.5px solid var(--color-border-tertiary)",paddingTop:8}}>
            Total: {fmtE(params[type].reduce((s,c)=>s+c.montant,0))} / mois
          </div>
        </div>
      ))}
    </div>
  );
}
