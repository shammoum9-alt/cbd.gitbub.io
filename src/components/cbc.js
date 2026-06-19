import React, { useState } from "react";

function fmt(n, dec=2){ return isNaN(n) ? "—" : Number(n).toFixed(dec); }
function fmtE(n){ return isNaN(n) ? "—" : Number(n).toFixed(2)+"€"; }

export default function CBC({cbcData, setCbcData}){
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