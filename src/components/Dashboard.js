// Composant Dashboard
import React from "react";
import { fmt, fmtE } from "../utils/helpers";
import { cat_color, MOIS_LABELS } from "../data/constants";

export default function Dashboard({ventes, produits}){
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

