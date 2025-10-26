# Emploi du Temps - Application Moderne de Gestion d'Horaires

Une application web moderne et intuitive pour gérer votre emploi du temps avec drag & drop, stockage local et interface élégante.

## Aperçu

Cette application vous permet de créer et gérer votre emploi du temps de manière simple et efficace avec une interface drag & drop moderne.

## Fonctionnalités Principales

- **Interface Drag & Drop** : Déplacez vos cours facilement en les glissant-déposant
- **Stockage Local** : Vos données restent sur votre appareil (localStorage)
- **Gestion des Matières** : Créez et personnalisez vos matières avec des couleurs
- **Configuration Flexible** : Modifiez les jours de la semaine et les créneaux horaires selon vos besoins
- **Import/Export** : Sauvegardez et restaurez vos emplois du temps
- **Interface Moderne** : Design élégant et responsive avec TailwindCSS
- **100% TypeScript** : Code type-safe pour une meilleure fiabilité

## Technologies

- React 18 + TypeScript
- Vite pour un build ultra-rapide
- TailwindCSS 4 avec @tailwindcss/postcss
- @dnd-kit pour le drag & drop
- Lucide React pour les icônes
- Local Storage API pour la persistance

## Installation et Développement

### Prérequis

- Node.js 18+ et npm

### Installation

```bash
cd schedule-app
npm install
```

### Développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

### Build de Production

```bash
npm run build
```

## Déploiement sur Vercel

### Option 1 : Déploiement en un clic

1. Connectez votre repository GitHub à Vercel
2. Configurez le projet :
   - **Root Directory** : `schedule-app`
   - **Framework Preset** : Vite
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`
3. Déployez !

### Option 2 : Via Vercel CLI

```bash
cd schedule-app
npm i -g vercel
vercel
```

## Utilisation

### Ajouter un cours

1. Cliquez sur une case vide dans l'emploi du temps
2. Sélectionnez ou créez une matière
3. Remplissez les détails (heure, salle, professeur, notes)
4. Validez

### Déplacer un cours

Glissez-déposez simplement le cours vers un autre créneau

### Gérer les matières

1. Onglet "Matières"
2. Ajoutez, modifiez ou supprimez des matières
3. Personnalisez les couleurs

### Configurer l'emploi du temps

1. Onglet "Paramètres"
2. Gérez les jours de la semaine
3. Gérez les créneaux horaires

### Exporter/Importer

- **Exporter** : Sauvegardez votre emploi du temps en JSON
- **Importer** : Restaurez un emploi du temps précédemment exporté

## Structure du Projet

```
schedule-app/
├── src/
│   ├── components/         # Composants React
│   │   ├── Modal.tsx
│   │   ├── ScheduleGrid.tsx
│   │   ├── SlotModal.tsx
│   │   ├── SubjectsPanel.tsx
│   │   └── SettingsPanel.tsx
│   ├── hooks/             # Hooks personnalisés
│   │   ├── useLocalStorage.ts
│   │   └── useSchedule.ts
│   ├── types/             # Types TypeScript
│   │   └── index.ts
│   ├── App.tsx           # Composant principal
│   └── main.tsx         # Point d'entrée
├── public/
├── vercel.json          # Configuration Vercel
└── package.json
```

## Bonnes Pratiques Implémentées

- TypeScript strict mode
- Hooks React modernes
- Architecture modulaire et réutilisable
- Code splitting avec Vite
- Responsive design
- Accessibilité (clavier, ARIA)
- Optimisation des performances

## Licence

MIT

## Auteur

Créé avec Claude Code
