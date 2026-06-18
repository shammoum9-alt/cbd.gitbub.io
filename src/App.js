import { useState, useEffect, useCallback, useRef } from "react";

// Données
import { PRODUITS, CBC_CBD, defaultParams } from "./data/produits";

// Utils
import { loadLocal, saveLocal, loadRemote, saveRemote, mergeVentes } from "./utils/sync";

// Composant layout (navbar + rendu des onglets)
import Layout from "./components/Layout";

export default function App() {

  // ── State ──
  const [tab, setTab]                     = useState("caisse");
  const [ventes, setVentes]               = useState([]);
  const [produits, setProduits]           = useState(PRODUITS);
  const [cbcData, setCbcData]             = useState(CBC_CBD);
  const [params, setParams]               = useState(defaultParams);
  const [courses, setCourses]             = useState([]);
  const [journalCaisse, setJournalCaisse] = useState([]);
  const [achats, setAchats]               = useState([]);
  const [loaded, setLoaded]               = useState(false);
  const [nbres, setNbres]                 = useState(() => {
    const d = {};
    PRODUITS.forEach(p => {
      d[p.id] = p.categorie === "sam" ? 50 : p.categorie === "sandwich" ? 30 : p.categorie === "boisson" ? 40 : 30;
    });
    return d;
  });

  const ventesRef = useRef([]);
  useEffect(() => { ventesRef.current = ventes; }, [ventes]);

  // ── Chargement initial + sync Google Sheets ──
  useEffect(() => {
    const local = loadLocal();
    if (local) {
      if (local.ventes?.length)        setVentes(local.ventes);
      if (local.produits?.length)      setProduits(local.produits);
      if (local.cbcData?.length)       setCbcData(local.cbcData);
      if (local.params)                setParams(local.params);
      if (local.nbres)                 setNbres(local.nbres);
      if (local.courses?.length)       setCourses(local.courses);
      if (local.journalCaisse?.length) setJournalCaisse(local.journalCaisse);
      if (local.achats?.length)        setAchats(local.achats);
    }
    setLoaded(true);

    const syncRemote = async () => {
      const remote = await loadRemote();
      if (!remote) return;

      setVentes(current => mergeVentes(current, remote.ventes || []));

      if (remote.nbres) setNbres(current => {
        const defaults = {};
        Object.keys(current || {}).forEach(id => {
          const prod = PRODUITS.find(p => p.id === id);
          defaults[id] = prod ? (prod.categorie === "sam" ? 50 : prod.categorie === "sandwich" ? 30 : prod.categorie === "boisson" ? 40 : 30) : 30;
        });
        const isDefault = Object.keys(current || {}).every(id => current[id] === defaults[id]);
        return isDefault ? remote.nbres : current;
      });

      setParams(current => remote.params ? remote.params : current);

      if (remote.journalCaisse?.length) setJournalCaisse(current => {
        const map = {};
        current.forEach(e => { if (e?.id) map[e.id] = e; });
        remote.journalCaisse.forEach(e => { if (e?.id) map[e.id] = e; });
        return Object.values(map).sort((a, b) => a.id - b.id);
      });

      if (remote.achats?.length) setAchats(current => {
        const map = {};
        current.forEach(a => { if (a?.id) map[a.id] = a; });
        remote.achats.forEach(a => { if (a?.id) map[a.id] = a; });
        return Object.values(map).sort((a, b) => a.id - b.id);
      });

      setCourses(current => {
        if (!remote.courses?.length) return current;
        const map = {};
        current.forEach(c => { if (c?.id) map[c.id] = c; });
        remote.courses.forEach(c => { if (c?.id) map[c.id] = c; });
        return Object.values(map);
      });
    };

    syncRemote();
    const onVisible = () => { if (document.visibilityState === "visible") syncRemote(); };
    const onFocus   = () => syncRemote();
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onFocus);
    const interval = setInterval(syncRemote, 20000);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onFocus);
      clearInterval(interval);
    };
  }, []);

  // ── Sauvegarde automatique ──
  useEffect(() => {
    if (!loaded) return;
    const data = { ventes, produits, cbcData, params, nbres, courses, journalCaisse, achats };
    saveLocal(data);
    saveRemote(data);
  }, [ventes, produits, cbcData, params, nbres, courses, journalCaisse, achats, loaded]);

  // ── Actions ──
  const addVente = useCallback((v) => {
    setVentes(prev => [...prev, { ...v, id: Date.now(), date: new Date().toISOString() }]);
  }, []);

  const deleteVente = useCallback((id) => {
    setVentes(prev => prev.map(v => v.id === id ? { ...v, deleted: true } : v));
  }, []);

  const rembourserVente = useCallback((id) => {
    setVentes(prev => prev.map(v => v.id === id ? { ...v, rembourse: true } : v));
  }, []);

  const addJournalEvent = useCallback((event) => {
    const newEvent = { ...event, id: Date.now() };
    setJournalCaisse(prev => [...prev, newEvent]);
    saveRemote({ action: "save_journee_event", event: newEvent });
  }, []);

  // ── Rendu : délégué au Layout ──
  if (!loaded) return <div style={{ padding: "2rem", color: "var(--color-text-secondary)" }}>Chargement...</div>;

  return (
    <Layout
      tab={tab} setTab={setTab}
      ventes={ventes} produits={produits} setProduits={setProduits}
      cbcData={cbcData} setCbcData={setCbcData}
      params={params} setParams={setParams}
      courses={courses} setCourses={setCourses}
      journalCaisse={journalCaisse} achats={achats} setAchats={setAchats}
      nbres={nbres} setNbres={setNbres}
      addVente={addVente} deleteVente={deleteVente}
      rembourserVente={rembourserVente} addJournalEvent={addJournalEvent}
    />
  );
}
