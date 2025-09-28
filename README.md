# Application de Gestion des Salaires - Frontend

Frontend React complet pour une application de gestion des salaires multi-entreprises, développée selon les principes SOLID et DRY.

## Comment l'Application a été Codée

### Architecture et Choix Technologiques

L'application frontend a été développée avec une architecture modulaire et scalable :

#### Technologies Principales
- **React 19** : Framework JavaScript moderne avec hooks pour la gestion d'état
- **Vite** : Outil de build rapide avec HMR (Hot Module Replacement)
- **TypeScript** : Typage statique pour une meilleure maintenabilité
- **Tailwind CSS** : Framework CSS utilitaire pour un styling rapide et cohérent
- **React Query** : Gestion optimisée des requêtes API et cache
- **Zustand** : Store léger pour l'état global (authentification)
- **React Router v6** : Routing avec protection des routes
- **TanStack Table** : Tableaux avancés avec pagination, tri et filtrage
- **Recharts** : Graphiques interactifs pour le dashboard
- **shadcn/ui** : Composants UI accessibles et personnalisables
- **Zod + React Hook Form** : Validation robuste des formulaires

#### Structure Modulaire
```
src/
├── api/           # Couche d'abstraction pour les appels API
├── components/    # Composants réutilisables (Layout, UI)
├── pages/         # Pages principales de l'application
├── providers/     # Context providers (React Query)
├── store/         # État global (Zustand)
└── lib/           # Utilitaires (cn function pour Tailwind)
```

#### Principes de Développement
- **SOLID** : Chaque composant/service a une responsabilité unique
- **DRY** : Réutilisation maximale du code
- **Separation of Concerns** : API, logique métier, UI séparés
- **Type Safety** : TypeScript pour éviter les erreurs runtime
- **Accessibility** : HTML sémantique, navigation clavier
- **Performance** : Lazy loading, cache React Query, optimisations

### Implémentation des Fonctionnalités

#### 1. Authentification
- Store Zustand pour la gestion du token JWT
- Routes protégées avec redirection automatique
- Intercepteur API pour ajouter le token automatiquement

#### 2. Gestion des Données
- React Query pour les requêtes CRUD optimisées
- Cache intelligent avec invalidation automatique
- Gestion d'erreurs centralisée

#### 3. Interface Utilisateur
- shadcn/ui pour une cohérence visuelle
- Tables TanStack avec fonctionnalités avancées
- Formulaires validés avec Zod
- Exports CSV/PDF intégrés

#### 4. Dashboard
- KPIs calculés côté backend
- Graphiques Recharts pour l'évolution
- Mise à jour en temps réel

## Comment Utiliser l'Application

### Prérequis
- Node.js 18+
- npm ou yarn
- Backend en cours d'exécution (voir `../backend`)

### Installation

1. **Cloner le repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration**
   - Vérifier `src/api/client.js` pour l'URL du backend
   - Variables d'environnement si nécessaire

4. **Démarrer le serveur de développement**
   ```bash
   npm run dev
   ```
   L'application sera accessible sur `http://localhost:5173`

### Utilisation

#### Connexion
- Utiliser les identifiants fournis par l'administrateur
- Rôles : SUPER_ADMIN, ADMIN, CASHIER, EMPLOYEE

#### Navigation
- **Dashboard** : Vue d'ensemble avec KPIs et graphiques
- **Employés** : Gestion complète (CRUD, activation)
- **Cycles de Paie** : Création et gestion des périodes
- **Bulletins** : Consultation et export des bulletins
- **Paiements** : Enregistrement et suivi des paiements
- **Documents** : Accès aux PDF générés

#### Fonctionnalités Clés
- **Filtres et Recherche** : Sur toutes les listes
- **Exports** : CSV pour les données, PDF pour les documents
- **Pagination** : Gestion automatique des grandes listes
- **Responsive** : Fonctionne sur mobile et desktop

### Scripts Disponibles

```bash
npm run dev      # Développement avec HMR
npm run build    # Build de production
npm run preview  # Prévisualisation du build
npm run lint     # Vérification du code
```

### Déploiement

#### Frontend
```bash
npm run build
# Déployer le dossier dist sur Vercel/Netlify
```

#### Backend
- Docker disponible dans `../backend`
- Variables d'environnement dans `.env`

### API Endpoints Principaux

#### Authentification
- `POST /auth/login` - Connexion

#### Employés
- `GET /employees` - Liste avec pagination
- `POST /employees` - Création
- `PUT /employees/:id` - Modification
- `PATCH /employees/:id/toggle-active` - Activation/désactivation

#### Cycles de Paie
- `POST /payruns` - Création
- `POST /payruns/:id/generate-payslips` - Génération bulletins
- `PATCH /payruns/:id/approve` - Approbation

#### Bulletins
- `GET /payslips` - Liste
- `PUT /payslips/:id` - Modification (si brouillon)
- `GET /payslips/:id/export-pdf` - Export PDF

#### Paiements
- `POST /payments` - Création
- `GET /payments/:id/receipt` - Reçu PDF

#### Dashboard
- `GET /dashboard/kpis` - Indicateurs clés
- `GET /dashboard/evolution` - Évolution sur 6 mois

### Exemples d'Utilisation

#### Créer un Employé
1. Aller dans "Employés"
2. Cliquer "Ajouter un employé"
3. Remplir le formulaire (validation automatique)
4. Soumettre

#### Générer des Bulletins
1. Créer un cycle de paie
2. Cliquer "Générer bulletins"
3. Approuver le cycle
4. Exporter en PDF si nécessaire

#### Enregistrer un Paiement
1. Aller dans "Paiements"
2. Sélectionner un bulletin
3. Choisir méthode de paiement
4. Télécharger le reçu automatiquement généré

## Maintenance et Évolution

### Ajouter une Nouvelle Fonctionnalité
1. Créer l'endpoint backend
2. Ajouter l'API frontend
3. Créer la page/composant
4. Ajouter la route
5. Mettre à jour la navigation

### Tests
- Tests unitaires avec React Testing Library
- Tests d'intégration pour les API
- Linting avec ESLint

### Performance
- Code splitting automatique avec Vite
- Lazy loading des routes
- Optimisation des images et bundles

Cette application suit les meilleures pratiques du développement React moderne et est prête pour la production.
