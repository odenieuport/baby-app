# Bébé Suivi

Une PWA (Progressive Web App) pour le suivi quotidien d'un nouveau-né : siestes, biberons,
visites médicales, étapes de développement, températures, selles et mesures de croissance,
avec des graphiques prêts à présenter au pédiatre.

## Fonctionnalités

- **Journal** : siestes (avec minuteur), biberons/allaitement, selles (par type), températures
  (avec seuil de fièvre), visites médicales, étapes de développement (physique, psychomoteur,
  cognitif, langage, social).
- **Accueil** : actions rapides en un tap, activité récente, résumé du jour.
- **Croissance** : saisie du poids, de la taille et du périmètre crânien avec courbes d'évolution.
- **Rapport pédiatre** : vue synthétique et imprimable (export PDF via l'impression du
  navigateur) combinant courbes de croissance, sommeil, alimentation, température, selles et
  étapes de développement, filtrable sur 7/14/30/90 jours.
- **Installable** : fonctionne hors-ligne et s'installe sur l'écran d'accueil (PWA).
- Toutes les données sont stockées localement sur l'appareil (aucun serveur), avec export/import
  JSON pour la sauvegarde.

## Développement

```bash
npm install
npm run dev      # serveur de développement
npm run build     # build de production
npm run lint      # oxlint
```

## Stack technique

React 19, TypeScript, Vite, Tailwind CSS v4, Zustand (persist en `localStorage`), React Router,
Recharts, vite-plugin-pwa.
