import { useMemo, useState } from "react";

const todayStr = new Date().toISOString().slice(0, 10);

export function usePlanif({ produits, nbres, achats, ventes }) {
  const [coursesSession, setCoursesSession] = useState(() => {
    const map = {};
    produits.forEach((p) =>
      p.ingredients.forEach((ing) => {
        if (!map[ing.n]) {
          map[ing.n] = {
            checked: false,
            prix_reel: "",
            unite: ing.u,
            pu_ref: ing.pu,
            pu_max: ing.pu_max || 0,
          };
        }
      })
    );
    return map;
  });

  // ventes du jour
  const venduAujourd = useMemo(() => {
    const map = {};

    (ventes || [])
      .filter(
        (v) => !v.deleted && !v.rembourse && v.date?.startsWith(todayStr)
      )
      .forEach((v) => {
        v.items?.forEach((it) => {
          map[it.produit] = (map[it.produit] || 0) + it.qte;
        });
      });

    return map;
  }, [ventes]);

  // courses calcul
  const coursesMap = useMemo(() => {
    const map = {};

    produits.forEach((p) => {
      const n = nbres[p.id] || 0;
      if (!n) return;

      const factor =
        p.nbre_par_fournee > 0 ? n / p.nbre_par_fournee : n;

      p.ingredients.forEach((ing) => {
        if (!map[ing.n]) {
          map[ing.n] = {
            qte: 0,
            unite: ing.u,
            pu: ing.pu,
            pu_max: ing.pu_max || 0,
          };
        }

        map[ing.n].qte += ing.q * factor;
      });
    });

    return map;
  }, [produits, nbres]);

  return {
    coursesSession,
    setCoursesSession,
    venduAujourd,
    coursesMap,
    todayStr,
  };
}