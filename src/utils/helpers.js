// Fonctions utilitaires

export function fmt(n, dec=2){ return isNaN(n) ? "—" : Number(n).toFixed(dec); }

export function fmtE(n){ return isNaN(n) ? "—" : Number(n).toFixed(2)+"€"; }

export function calcCR(p) {
  const somme = p.ingredients.reduce((s,i)=>s+i.q*i.pu, 0);
  if(p.feuille_brick) return (somme + 0.05*p.nbre_par_fournee) / p.nbre_par_fournee;
  if(p.nbre_par_fournee > 1) return somme / p.nbre_par_fournee;
  return somme;
}
