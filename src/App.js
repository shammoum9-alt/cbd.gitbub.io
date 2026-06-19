import "./styles/layout.css";
import React, { useState, useCallback } from "react";
import Header from "./components/header";
import Caisse from "./components/caisse";
import Dashboard from "./components/dashboard";
import Recettes from "./components/recette";
import Planif from "./components/planif";
import Compta from "./components/compta";
import Cbc from "./components/cbc";
import Allergenes from "./components/allergenes";
import Parametres from "./components/param";

import { CBC_CBD, PRODUITS } from "./data/produit";

const defaultParams = {
  taux_cotisation_acre: 0.062,
  taux_cfp: 0.001,
  taux_ir: 0.01,
  abattement: 0.71,
  charges_fixes: [
    { label: "Emplacement marché", montant: 220 },
    { label: "Location food truck", montant: 1600 },
    { label: "Assurance Pro", montant: 73 },
    { label: "SumUp / TPE", montant: 40 },
  ],
  charges_variables_fixes: [
    { label: "Fournitures diverses", montant: 86 },
    { label: "Déplacements/Essence", montant: 227 },
  ],
};

export default function App() {
  const [tab, setTab] = useState("caisse");

  const [ventes, setVentes] = useState([]);
  const [produits] = useState(PRODUITS);
  const [cbcData] = useState(CBC_CBD);
  const [params, setParams] = useState(defaultParams);
  const [courses, setCourses] = useState([]);
  const [journalCaisse, setJournalCaisse] = useState([]);

  // 🔥 ajout nécessaire pour Planif
  const [nbres, setNbres] = useState(() => {
    const d = {};
    PRODUITS.forEach((p) => {
      d[p.id] =
        p.categorie === "sam"
          ? 50
          : p.categorie === "sandwich"
          ? 30
          : p.categorie === "boisson"
          ? 40
          : 30;
    });
    return d;
  });

  const [achats, setAchats] = useState([]);

  // ----------------------------
  // actions globales
  // ----------------------------
  const addVente = useCallback((v) => {
    setVentes((prev) => [
      ...prev,
      { ...v, id: Date.now(), date: new Date().toISOString() },
    ]);
  }, []);

  const deleteVente = useCallback((id) => {
    setVentes((prev) =>
      prev.map((v) => (v.id === id ? { ...v, deleted: true } : v))
    );
  }, []);

  const rembourserVente = useCallback((id) => {
    setVentes((prev) =>
      prev.map((v) => (v.id === id ? { ...v, rembourse: true } : v))
    );
  }, []);

  const addJournalEvent = useCallback((event) => {
    setJournalCaisse((prev) => [...prev, { ...event, id: Date.now() }]);
  }, []);

  // ----------------------------
  // props globales propres
  // ----------------------------
  const sharedProps = {
    ventes,
    setVentes,

    produits,

    cbcData,

    params,
    setParams,

    courses,
    setCourses,

    journalCaisse,
    addJournalEvent,

    onAdd: addVente,
    onDelete: deleteVente,
    onRembourser: rembourserVente,

    // 🔥 indispensables Planif
    nbres,
    setNbres,
    achats,
    setAchats,
  };

  // ----------------------------
  // routing propre
  // ----------------------------
  const routes = {
    caisse: Caisse,
    dashboard: Dashboard,
    recettes: Recettes,
    planif: Planif,
    compta: Compta,
    cbc: Cbc,
    allergenes: Allergenes,
    params: Parametres,
  };

  const tabs = [
    { id: "caisse", label: "Caisse" },
    { id: "dashboard", label: "Stats" },
    { id: "recettes", label: "Recettes" },
    { id: "planif", label: "Planif" },
    { id: "compta", label: "Compta" },
    { id: "cbc", label: "CBC/CBD" },
    { id: "allergenes", label: "Allergènes" },
    { id: "params", label: "Paramètres" },
  ];

  const Page = routes[tab];

  if (!Page) {
    return <div>Page introuvable</div>;
  }

  return (
    <div>
      <Header tab={tab} setTab={setTab} tabs={tabs} />
        <div className="page-container">
          <Page {...sharedProps} />
        </div>
    </div>
  );
}