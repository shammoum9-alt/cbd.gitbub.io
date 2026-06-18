// Synchronisation localStorage + Google Sheets

const GOOGLE_URL = "https://script.google.com/macros/s/AKfycbz2lcDc_0K3Ax95Ffj-MnNmu1CKuKAxXlsNOYsj6A_DkIZfwz54QsMRSVZ6oLfIvivNUw/exec";

export const loadLocal = () => {
  try { const r = localStorage.getItem("sam_data"); return r ? JSON.parse(r) : null; } catch(e){ return null; }
};

export const saveLocal = (data) => {
  try { localStorage.setItem("sam_data", JSON.stringify(data)); } catch(e){}
};

export const loadRemote = async () => {
  try {
    const r = await fetch(GOOGLE_URL + "?t=" + Date.now(), { method: "GET", cache: "no-store" });
    if(!r.ok) return null;
    const d = await r.json();
    return (d && d.status !== "error") ? d : null;
  } catch(e){ return null; }
};

export const saveRemote = (data) => {
  try {
    const payload = data.action
      ? JSON.stringify(data)
      : JSON.stringify({action:"save_all", ...data});
    fetch(GOOGLE_URL, { method:"POST", mode:"no-cors", headers:{"Content-Type":"text/plain"}, body:payload });
  } catch(e){}
};

export const mergeVentes = (local=[], remote=[]) => {
  const map = {};
  remote.forEach(v => { if(v?.id) map[v.id] = v; });
  local.forEach(v => { if(v?.id) map[v.id] = v; });
  Object.keys(map).forEach(id => {
    const l = local.find(v=>String(v.id)===String(id));
    const r = remote.find(v=>String(v.id)===String(id));
    if(l?.deleted || r?.deleted) map[id] = {...map[id], deleted:true};
    if(l?.rembourse || r?.rembourse) map[id] = {...map[id], rembourse:true};
  });
  return Object.values(map).sort((a,b) => new Date(a.date) - new Date(b.date));
};

export { GOOGLE_URL };
