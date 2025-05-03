# Mix & Drink

Mix & Drink est une application web de découverte, recherche et personnalisation de cocktails, intégrant un écran de démarrage animé (SplashScreen), un thème clair/sombre, un système de favoris et une barre de chargement minimale.

## 🚀 Fonctionnalités

- SplashScreen animé avec logo et barre de progression
- Thème clair/sombre avec bascule et persistance en localStorage
- Découverte aléatoire de cocktails via l’API TheCocktailDB
- Recherche en direct de cocktails
- Favoris : ajout/suppression, persistance en localStorage et compteur
- Animations : loaders, transitions, GSAP
- Accessibilité : focus management, animations légères

## 🎬 Démonstration

1. Lancement de l'app → écran SplashScreen animé (logo + barre de chargement)
2. Chargement des cocktails aléatoires
3. Recherche via la barre de recherche
4. Ajout/suppression de favoris
5. Basculer entre thèmes clair et sombre

## ⚙️ Prérequis

- Node.js (>= 14.x)
- npm ou yarn
- Docker (optionnel pour conteneurisation)

## 🔧 Installation

```bash
git clone https://github.com/aminemn14/mix-and-drink.git
cd mix-and-drink
npm install  # ou yarn install
```

## ▶️ Utilisation (Développement)

```bash
npm run dev  # ou yarn dev
```

## 🧪 Tests

Pour exécuter les tests unitaires avec Vitest :

- **Tous les tests** :

  ```bash
  npm run test  # lance 'vitest run'
  ```

- **Tests ciblés** :

  ```bash
  npm run test:app      # App.vue
  npm run test:grid     # CocktailGrid.vue
  npm run test:modal    # CocktailModal.vue
  npm run test:splash   # SplashScreen.vue
  ```

- **Couverture** :

  ```bash
  npm run test:coverage  # 'vitest run --coverage'
  ```

## 📦 Docker

L’application peut être conteneurisée avec Docker :

1. **Construire l’image**

   ```bash
   docker build -t mix-drink-app .
   ```

2. **Lancer le conteneur sur http://localhost:8080**

   ```bash
   docker run -d --name mixdrink-test -p 8080:80 mix-drink-app
   ```

3. **Vérifier et arrêter**

   ```bash
   docker ps
   docker logs mixdrink-test
   docker stop mixdrink-test
   docker rm mixdrink-test
   ```

4. **Scans de sécurité** (optionnel)

   ```bash
   docker scan mix-drink-app
   trivy image mix-drink-app
   ```

## 📁 Structure du projet

```
mix-and-drink/
├─ public/
│  └─ logo.svg              # Logo de l'app
├─ src/                     # Images
│  ├─ assets/               # Images
│  ├─ components/
│  │  ├─ CocktailGrid.vue   # Grille de cocktails
│  │  ├─ CocktailModal.vue  # Modal de détails
│  │  └─ SplashScreen.vue   # Composant d'écran de démarrage
│  ├─ App.vue               # Composant racine (intègre splash + UI)
│  ├─ main.js
│  └─ style.css
├─ tests/                   # Dossier contenant les tests unitaires
│  ├─ components/
│  │  ├─ CocktailGrid.spec.js
│  │  ├─ CocktailModal.spec.js
│  │  └─ SplashScreen.spec.js
│  └─ App.spec.js
├─ .gitignore
├─ Dockerfile
├─ index.html
├─ package.json
├─ README.md
├─ vite.config.js
├─ vitest.config.js
└─ vitest.setup.js
```

## 🛠️ Technologies utilisées

- Vue 3 (Composition API)
- Tailwind CSS
- GSAP pour animations du SplashScreen
- Lodash.debounce pour la recherche live
- TheCocktailDB API pour données de cocktails
- localStorage pour persistance du thème et des favoris
- Lucide Vue Next pour les icônes
- Vitest pour les tests unitaires
- Docker pour la conteneurisation
