function fmt(n, dec=2){ return isNaN(n) ? "—" : Number(n).toFixed(dec); }
function fmtE(n){ return isNaN(n) ? "—" : Number(n).toFixed(2)+"€"; }


export default function Params({params, setParams}){
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