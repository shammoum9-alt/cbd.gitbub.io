import React, { useState, useMemo, useRef } from "react";

const GOOGLE_URL =
  "https://script.google.com/macros/s/AKfycbz2lcDc_0K3Ax95Ffj-MnNmu1CKuKAxXlsNOYsj6A_DkIZfwz54QsMRSVZ6oLfIvivNUw/exec";

const safeArray = (v) => (Array.isArray(v) ? v : []);
const safeObj = (v) => (v && typeof v === "object" ? v : {});

const saveRemote = (data) => {
  try {
    const payload = JSON.stringify(
      data?.action ? data : { action: "save_all", ...data }
    );

    fetch(GOOGLE_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain" },
      body: payload,
    });
  } catch (e) {}
};

export default function Planif({
  produits = [],
  nbres = {},
  achats = [],
  setAchats,
  courses,
  setCourses,
  ventes = [],
}) {
  const today = new Date().toISOString().slice(0, 10);
  const fileRef = useRef(null);

  const [session, setSession] = useState({});

  const produitsSafe = safeArray(produits);
  const ventesSafe = safeArray(ventes);
  const achatsSafe = safeArray(achats);
  const nbresSafe = safeObj(nbres);

  // -----------------------------
  // VENTES DU JOUR
  // -----------------------------
  const venduAujourd = useMemo(() => {
    const map = {};

    ventesSafe
      .filter((v) => !v.deleted && !v.rembourse && v.date?.startsWith(today))
      .forEach((v) => {
        v.items?.forEach((it) => {
          map[it.produit] = (map[it.produit] || 0) + (it.qte || 0);
        });
      });

    return map;
  }, [ventesSafe, today]);

  // -----------------------------
  // COURSES THÉORIQUES
  // -----------------------------
  const coursesMap = useMemo(() => {
    const map = {};

    produitsSafe.forEach((p) => {
      const n = nbresSafe[p.id] || 0;
      if (!n) return;

      const factor = p.nbre_par_fournee
        ? n / p.nbre_par_fournee
        : n;

      (p.ingredients || []).forEach((ing) => {
        if (!map[ing.n]) {
          map[ing.n] = {
            qte: 0,
            pu: ing.pu || 0,
            pu_max: ing.pu_max || 0,
            unite: ing.u || "",
          };
        }

        map[ing.n].qte += (ing.q || 0) * factor;
      });
    });

    return map;
  }, [produitsSafe, nbresSafe]);

  // -----------------------------
  // ACHATS DU JOUR
  // -----------------------------
  const getAchete = (nom) =>
    achatsSafe
      .filter((a) => a.ingredient === nom && a.date === today)
      .reduce((s, a) => s + (a.qte_achetee || 0), 0);

  const getLastPrice = (nom) =>
    [...achatsSafe]
      .filter((a) => a.ingredient === nom)
      .sort((a, b) => b.id - a.id)[0]?.prix_unitaire;

  // -----------------------------
  // UI STATE
  // -----------------------------
  const toggle = (nom) => {
    setSession((prev) => ({
      ...prev,
      [nom]: {
        ...(prev[nom] || {}),
        checked: !prev[nom]?.checked,
      },
    }));
  };

  const setPrice = (nom, value) => {
    setSession((prev) => ({
      ...prev,
      [nom]: {
        ...(prev[nom] || {}),
        prix: value,
      },
    }));
  };

  // -----------------------------
  // VALIDATION ACHATS
  // -----------------------------
  const valider = () => {
    const rows = Object.entries(session).filter(
      ([, v]) => v.checked && v.prix
    );

    if (!rows.length) return;

    const newAchats = rows.map(([nom, v]) => ({
      id: Date.now() + Math.random(),
      ingredient: nom,
      prix_unitaire: parseFloat(v.prix),
      date: today,
      qte_achetee: coursesMap[nom]?.qte || 0,
    }));

    setAchats((p) => [...p, ...newAchats]);

    if (setCourses) {
      setCourses((p) => [
        ...p,
        {
          id: Date.now(),
          date: today,
          commercant: "Courses du jour",
          montant: newAchats.reduce(
            (s, a) => s + a.prix_unitaire * a.qte_achetee,
            0
          ),
          mois: new Date().getMonth(),
        },
      ]);
    }

    saveRemote({ action: "save_achats", achats: newAchats });

    setSession({});
  };

  // -----------------------------
  // RENDER SAFE
  // -----------------------------
  const entries = Object.entries(coursesMap);

  if (!entries.length) {
    return (
      <div style={{ padding: 20, color: "#666" }}>
        Aucune donnée disponible
      </div>
    );
  }

  return (
    <div>
      <h3>Planification</h3>

      {/* TABLE PRINCIPALE */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th></th>
            <th>Ingrédient</th>
            <th>Besoin</th>
            <th>Vendu</th>
            <th>Reste</th>
            <th>Dernier prix</th>
            <th>Prix réel</th>
          </tr>
        </thead>

        <tbody>
          {entries.map(([nom, v]) => {
            const achete = getAchete(nom);
            const vendu = venduAujourd[nom] || 0;
            const reste = Math.max(0, v.qte - achete);
            const s = session[nom] || {};
            const lastPrice = getLastPrice(nom);

            return (
              <tr key={nom}>
                <td>
                  <input
                    type="checkbox"
                    checked={!!s.checked}
                    onChange={() => toggle(nom)}
                  />
                </td>

                <td>{nom}</td>

                <td>{v.qte.toFixed(2)}</td>

                {/* VENTES */}
                <td>{vendu || "-"}</td>

                <td>{reste.toFixed(2)}</td>

                <td>
                  {lastPrice ? `${lastPrice.toFixed(2)}€` : "—"}
                </td>

                <td>
                  {s.checked && (
                    <input
                      type="number"
                      value={s.prix || ""}
                      onChange={(e) => setPrice(nom, e.target.value)}
                      style={{ width: 80 }}
                    />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ACTION */}
      <button
        onClick={valider}
        style={{
          marginTop: 20,
          padding: "8px 16px",
          cursor: "pointer",
        }}
      >
        Valider les achats
      </button>

      {/* UPLOAD FACTURE (conservé proprement) */}
      <div style={{ marginTop: 20 }}>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,application/pdf"
          style={{ display: "none" }}
        />

        <button
          onClick={() => fileRef.current?.click()}
          style={{ padding: "6px 12px" }}
        >
          📎 Ajouter facture
        </button>
      </div>
    </div>
  );
}