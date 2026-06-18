// Composant SyncStatus
import React, { useState, useEffect } from "react";
import { GOOGLE_URL } from "../utils/sync";

export default function SyncStatus() {
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

