// Layout — navbar + routing des onglets
// Tout le HTML/JSX de la structure principale est ici
import React from "react";
import SyncStatus from "./SyncStatus";
import Caisse     from "./Caisse";
import Dashboard  from "./Dashboard";
import Recettes   from "./Recettes";
import Planif     from "./Planif";
import Compta     from "./Compta";
import CBC        from "./CBC";
import Allergenes from "./Allergenes";
import Params     from "./Params";

const TABS = [
  { id: "caisse",    label: "Caisse",     icon: "ti-cash" },
  { id: "dashboard", label: "Stats",      icon: "ti-chart-bar" },
  { id: "recettes",  label: "Recettes",   icon: "ti-clipboard-list" },
  { id: "planif",    label: "Planif",     icon: "ti-shopping-cart" },
  { id: "compta",    label: "Compta",     icon: "ti-file-invoice" },
  { id: "cbc",       label: "CBC/CBD",    icon: "ti-leaf" },
  { id: "allergenes",label: "Allergènes", icon: "ti-alert-triangle" },
  { id: "params",    label: "Paramètres", icon: "ti-settings" },
];

export default function Layout({
  tab, setTab,
  ventes, produits, setProduits,
  cbcData, setCbcData,
  params, setParams,
  courses, setCourses,
  journalCaisse, achats, setAchats,
  nbres, setNbres,
  addVente, deleteVente, rembourserVente, addJournalEvent,
}) {
  return (
    <div style={{ fontFamily: "var(--font-sans)", maxWidth: 900, margin: "0 auto", padding: "0 0 3rem" }}>

      {/* ── Navbar ── */}
      <header style={{
        background: "var(--color-background-primary)",
        borderBottom: "0.5px solid var(--color-border-tertiary)",
        padding: "1rem 1rem 0",
        position: "sticky", top: 0, zIndex: 10
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <span style={{ fontSize: 20 }}>☕</span>
          <span style={{ fontSize: 13, color: "var(--color-text-secondary)", marginLeft: 4 }}>Café & CBD</span>
          <SyncStatus />
        </div>
        <nav style={{ display: "flex", gap: 4, overflowX: "auto" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              border: "none",
              background: tab === t.id ? "var(--color-background-secondary)" : "transparent",
              color: tab === t.id ? "var(--color-text-primary)" : "var(--color-text-secondary)",
              padding: "6px 12px",
              borderRadius: "var(--border-radius-md) var(--border-radius-md) 0 0",
              cursor: "pointer", fontSize: 13,
              fontWeight: tab === t.id ? 500 : 400,
              whiteSpace: "nowrap",
              borderBottom: tab === t.id ? "2px solid var(--color-text-primary)" : "2px solid transparent"
            }}>
              <i className={`ti ${t.icon}`} style={{ marginRight: 5, fontSize: 14 }} aria-hidden="true" />
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      {/* ── Contenu ── */}
      <main style={{ padding: "1.5rem 1rem" }}>
        {tab === "caisse"     && <Caisse     produits={produits} cbcData={cbcData} onAdd={addVente} ventes={ventes} onDelete={deleteVente} onRembourser={rembourserVente} journalCaisse={journalCaisse} addJournalEvent={addJournalEvent} />}
        {tab === "dashboard"  && <Dashboard  ventes={ventes} produits={produits} />}
        {tab === "recettes"   && <Recettes   produits={produits} setProduits={setProduits} nbres={nbres} achats={achats} />}
        {tab === "planif"     && <Planif     produits={produits} nbres={nbres} setNbres={setNbres} achats={achats} setAchats={setAchats} setCourses={setCourses} ventes={ventes} />}
        {tab === "compta"     && <Compta     ventes={ventes} params={params} produits={produits} courses={courses} setCourses={setCourses} />}
        {tab === "cbc"        && <CBC        cbcData={cbcData} setCbcData={setCbcData} />}
        {tab === "allergenes" && <Allergenes produits={produits} />}
        {tab === "params"     && <Params     params={params} setParams={setParams} />}
      </main>

    </div>
  );
}
