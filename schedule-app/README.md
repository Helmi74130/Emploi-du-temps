# Emploi du Temps - Application Moderne de Gestion d'Horaires

Une application web moderne et intuitive pour gérer votre emploi du temps avec drag & drop, stockage local et interface élégante.

## Fonctionnalités

- **Drag & Drop** : Déplacez vos cours facilement par glisser-déposer
- **Stockage Local** : Toutes vos données sont sauvegardées dans votre navigateur
- **Gestion des Matières** : Créez et personnalisez vos matières avec des couleurs
- **Configuration Flexible** : Modifiez les jours de la semaine et les créneaux horaires
- **Import/Export** : Sauvegardez et restaurez vos emplois du temps
- **Interface Moderne** : Design élégant avec TailwindCSS
- **TypeScript** : Code type-safe pour une meilleure maintenabilité

## Technologies

- **React 18** avec TypeScript
- **Vite** pour un build ultra-rapide
- **TailwindCSS** pour le styling
- **@dnd-kit** pour le drag & drop moderne
- **Lucide React** pour les icônes
- **Local Storage API** pour la persistance des données

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## Build

```bash
npm run build
```

## Déploiement sur Vercel

### Déploiement en un clic

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

### Déploiement manuel

1. Installez Vercel CLI : `npm i -g vercel`
2. Exécutez : `vercel`
3. Suivez les instructions

### Via GitHub

1. Connectez votre repository GitHub à Vercel
2. Vercel détectera automatiquement les paramètres de build
3. Chaque push sur la branche main déclenchera un déploiement automatique

## Utilisation

### Ajouter un cours

1. Cliquez sur une case vide dans l'emploi du temps
2. Sélectionnez ou créez une matière
3. Remplissez les détails (heure, salle, professeur, etc.)
4. Cliquez sur "Ajouter"

### Déplacer un cours

Glissez-déposez un cours vers une autre case pour le déplacer

### Modifier un cours

Cliquez sur l'icône de modification sur un cours pour éditer ses détails

### Gérer les matières

1. Allez dans l'onglet "Matières"
2. Ajoutez, modifiez ou supprimez des matières
3. Changez les couleurs en cliquant sur le carré de couleur

### Configurer l'emploi du temps

1. Allez dans l'onglet "Paramètres"
2. Ajoutez ou supprimez des jours de la semaine
3. Ajoutez ou supprimez des créneaux horaires

### Exporter/Importer

- **Exporter** : Cliquez sur le bouton "Exporter" pour sauvegarder votre emploi du temps en JSON
- **Importer** : Cliquez sur "Importer" et sélectionnez un fichier JSON précédemment exporté

## Structure du Projet

```
src/
├── components/          # Composants React
│   ├── Modal.tsx       # Composant modal réutilisable
│   ├── ScheduleGrid.tsx # Grille de l'emploi du temps
│   ├── SlotModal.tsx   # Modal pour ajouter/modifier un cours
│   ├── SubjectsPanel.tsx # Panneau de gestion des matières
│   └── SettingsPanel.tsx # Panneau de configuration
├── hooks/              # Hooks personnalisés
│   ├── useLocalStorage.ts # Hook pour le localStorage
│   └── useSchedule.ts  # Hook principal pour la gestion de l'emploi du temps
├── types/              # Types TypeScript
│   └── index.ts       # Définitions des types
├── App.tsx            # Composant principal
└── main.tsx          # Point d'entrée
```

## Bonnes Pratiques 2025

- **TypeScript strict** : Type safety complet
- **Hooks modernes** : Utilisation exclusive des hooks React
- **Code modulaire** : Composants réutilisables et séparation des responsabilités
- **Performance** : Optimisation avec useMemo et useCallback où nécessaire
- **Accessibilité** : Support du clavier et ARIA labels
- **Responsive** : Design adaptatif pour tous les écrans
- **DX friendly** : HMR ultra-rapide avec Vite

## Licence

MIT
