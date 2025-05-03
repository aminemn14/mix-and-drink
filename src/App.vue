<template>
  <div>
    <SplashScreen v-if="showSplash" @complete="onSplashComplete" />

    <div
      v-else
      class="min-h-screen transition-colors duration-700"
      :class="
        theme === 'dark'
          ? 'bg-gray-900 text-white'
          : 'bg-gradient-to-br from-amber-50 to-orange-100 text-gray-800'
      "
    >
      <header class="py-6 px-4 sm:px-6 relative z-10">
        <nav class="max-w-7xl mx-auto flex justify-between items-center">
          <div class="header-logo flex items-center space-x-2" @click="goHome">
            <div class="flex items-center">
              <img
                src="/src/assets/logo.svg"
                alt="Mix & Drink Logo"
                class="h-10 w-10"
              />
              <h1 class="text-2xl font-bold ml-2 tracking-tight">
                Mix & Drink
              </h1>
            </div>
            <span
              class="hidden sm:inline-block text-sm px-2 py-1 rounded-full bg-amber-200 text-amber-800 dark:bg-amber-900 dark:bg-opacity-50 dark:text-amber-200"
              >Discover. Mix. Enjoy.</span
            >
          </div>

          <div class="flex items-center space-x-4">
            <button
              @click="goHome"
              class="p-2 rounded-full hover:bg-opacity-10 hover:bg-white hover:text-gray-900 dark:hover:text-gray-900 transition-colors duration-300"
            >
              <HomeIcon class="h-6 w-6" />
            </button>
            <button
              @click="toggleFavorites"
              class="p-2 rounded-full hover:bg-opacity-10 hover:bg-white hover:text-gray-900 dark:hover:text-gray-900 transition-colors duration-300 relative"
              :class="showFavorites ? 'text-amber-500' : ''"
            >
              <span
                v-if="favorites.length > 0"
                class="absolute top-0 right-0 bg-amber-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                {{ favorites.length }}
              </span>
              <HeartIcon class="h-6 w-6" />
            </button>
            <button
              @click="toggleSearchMode"
              class="p-2 rounded-full hover:bg-opacity-10 hover:bg-white hover:text-gray-900 dark:hover:text-gray-900 transition-colors duration-300"
              :class="searchMode ? 'text-amber-500' : ''"
            >
              <SearchIcon class="h-6 w-6" />
            </button>
            <button
              @click="toggleTheme"
              class="p-2 rounded-full hover:bg-opacity-10 hover:bg-white hover:text-gray-900 dark:hover:text-gray-900 transition-colors duration-300"
            >
              <SunIcon v-if="theme === 'dark'" class="h-6 w-6" />
              <MoonIcon v-else class="h-6 w-6" />
            </button>
          </div>
        </nav>
      </header>

      <main class="relative z-0">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div
            v-if="loading"
            class="flex flex-col items-center justify-center h-64"
          >
            <div class="cocktail-loader">
              <div class="loader-shaker"></div>
              <div class="loader-liquid"></div>
            </div>
            <p class="mt-6 animate-pulse">Mixing cocktails...</p>
          </div>

          <template v-else-if="error">
            <div
              class="p-6 bg-red-100 rounded-lg shadow-lg max-w-2xl mx-auto text-center"
            >
              <XCircleIcon class="h-12 w-12 text-red-500 mx-auto" />
              <h3 class="text-lg font-semibold text-red-800 mt-4">
                {{ error }}
              </h3>
              <button
                @click="fetchCocktails"
                class="mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg shadow hover:bg-amber-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </template>

          <template v-else>
            <div v-if="searchMode" class="mb-10 max-w-xl mx-auto">
              <div class="relative">
                <input
                  ref="searchInput"
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search for a cocktail..."
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                />
                <button
                  @click="triggerSearch()"
                  class="absolute right-2 top-2 p-1 rounded-full bg-amber-500 text-white"
                >
                  <SearchIcon class="h-5 w-5" />
                </button>
              </div>
            </div>

            <div v-if="showFavorites && favorites.length > 0">
              <h2 class="text-xl font-bold mb-6 flex items-center">
                <HeartIcon class="h-5 w-5 text-amber-500 mr-2" />
                Your Favorite Cocktails
              </h2>
              <CocktailGrid
                :cocktails="favorites"
                @view-details="showDetails"
                @toggle-favorite="toggleFavorite"
                :favorites="favorites"
              />
            </div>
            <div
              v-else-if="showFavorites && favorites.length === 0"
              class="text-center py-10"
            >
              <div
                class="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg max-w-md mx-auto"
              >
                <HeartIcon
                  class="h-12 w-12 text-gray-400 dark:text-gray-200 mx-auto"
                />
                <h3
                  class="text-lg font-medium mt-4 text-gray-900 dark:text-white"
                >
                  No favorites yet
                </h3>
                <p class="text-gray-500 dark:text-gray-300 mt-2">
                  Discover cocktails and save your favorites!
                </p>
                <button
                  @click="toggleFavorites"
                  class="mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg shadow hover:bg-amber-600 transition-colors"
                >
                  Discover Cocktails
                </button>
              </div>
            </div>

            <div v-else-if="searchMode && searchResults.length > 0">
              <h2 class="text-xl font-bold mb-6 flex items-center">
                <SearchIcon class="h-5 w-5 text-amber-500 mr-2" />
                Search Results
              </h2>
              <CocktailGrid
                :cocktails="searchResults"
                @view-details="showDetails"
                @toggle-favorite="toggleFavorite"
                :favorites="favorites"
              />
            </div>
            <div
              v-else-if="
                searchMode && searchQuery && searchResults.length === 0
              "
            >
              <div class="text-center py-10">
                <div
                  class="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg max-w-md mx-auto"
                >
                  <XCircleIcon class="h-12 w-12 text-gray-400 mx-auto" />
                  <h3 class="text-lg font-medium mt-4">No cocktails found</h3>
                  <p class="text-gray-500 dark:text-gray-400 mt-2">
                    Try a different search term
                  </p>
                </div>
              </div>
            </div>

            <div v-else>
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold flex items-center">
                  <span class="mr-2">✨</span>
                  Discover Random Cocktails
                </h2>
                <button
                  @click="fetchCocktails"
                  class="px-4 py-2 rounded-lg bg-amber-500 text-white flex items-center hover:bg-amber-600 transition-colors"
                >
                  <RefreshCw class="h-4 w-4 mr-1" />
                  Refresh
                </button>
              </div>
              <CocktailGrid
                :cocktails="cocktails"
                @view-details="showDetails"
                @toggle-favorite="toggleFavorite"
                :favorites="favorites"
              />
            </div>
          </template>
        </div>
      </main>

      <CocktailModal
        v-if="selectedCocktail"
        :cocktail="selectedCocktail"
        @close="selectedCocktail = null"
        @toggle-favorite="toggleFavorite"
        :is-favorite="isFavorite(selectedCocktail)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import {
  HomeIcon,
  HeartIcon,
  MoonIcon,
  SunIcon,
  SearchIcon,
  RefreshCw,
  XCircleIcon,
} from "lucide-vue-next";
import SplashScreen from "./components/SplashScreen.vue";
import CocktailGrid from "./components/CocktailGrid.vue";
import CocktailModal from "./components/CocktailModal.vue";
import debounce from "lodash/debounce";

const MIN_LOADING = 1000;

const showSplash = ref(true);
const cocktails = ref([]);
const loading = ref(true);
const error = ref(null);
const selectedCocktail = ref(null);
const theme = ref(localStorage.getItem("theme") || "light");
const favorites = ref(JSON.parse(localStorage.getItem("favorites") || "[]"));
const showFavorites = ref(false);
const searchMode = ref(false);
const searchQuery = ref("");
const searchResults = ref([]);

const splashContent = ref(null);
const loadingBar = ref(null);
const searchInput = ref(null);

function withMinDelay(promise) {
  return Promise.all([
    promise,
    new Promise((r) => setTimeout(r, MIN_LOADING)),
  ]).then(([res]) => res);
}

function onSplashComplete() {
  showSplash.value = false;
}

const debouncedSearch = debounce(async (q) => {
  if (!q.trim()) {
    searchResults.value = [];
    await nextTick();
    searchInput.value?.focus();
    return;
  }
  loading.value = true;
  error.value = null;
  try {
    const res = await fetch(
      `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
        q
      )}`
    );
    if (!res.ok) throw new Error();
    const json = await res.json();
    searchResults.value = json.drinks || [];
  } catch {
    error.value = "Failed to search cocktails. Please try again.";
  } finally {
    loading.value = false;
    await nextTick();
    searchInput.value?.focus();
  }
}, 300);

watch(searchQuery, (q) => {
  if (searchMode.value) debouncedSearch(q);
  else searchResults.value = [];
});
watch(
  favorites,
  (favs) => localStorage.setItem("favorites", JSON.stringify(favs)),
  { deep: true }
);

async function fetchCocktails() {
  loading.value = true;
  error.value = null;
  try {
    const promises = Array(3)
      .fill()
      .map(() =>
        fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php").then(
          (r) => {
            if (!r.ok) throw new Error();
            return r.json();
          }
        )
      );
    const results = await withMinDelay(Promise.all(promises));
    cocktails.value = results.map((r) => r.drinks[0]);
  } catch {
    error.value = "Failed to fetch cocktails. Please try again.";
  } finally {
    loading.value = false;
  }
}

const showDetails = (c) => (selectedCocktail.value = c);
const toggleTheme = () => {
  theme.value = theme.value === "light" ? "dark" : "light";
  document.documentElement.classList.toggle("dark", theme.value === "dark");
  localStorage.setItem("theme", theme.value);
};
const toggleFavorite = (c) => {
  const idx = favorites.value.findIndex((x) => x.idDrink === c.idDrink);
  if (idx === -1) favorites.value.push(c);
  else favorites.value.splice(idx, 1);
};
const isFavorite = (c) => favorites.value.some((x) => x.idDrink === c.idDrink);
const toggleFavorites = () => {
  showFavorites.value = !showFavorites.value;
  searchMode.value = false;
};
const toggleSearchMode = () => {
  searchMode.value = !searchMode.value;
  showFavorites.value = false;
  if (searchMode.value) nextTick(() => searchInput.value?.focus());
  else {
    searchQuery.value = "";
    searchResults.value = [];
  }
};
const goHome = () => {
  searchMode.value = false;
  showFavorites.value = false;
  searchQuery.value = "";
  searchResults.value = [];
  fetchCocktails();
};

onMounted(() => {
  fetchCocktails();
  if (theme.value === "dark") document.documentElement.classList.add("dark");
});
</script>

<style>
@keyframes shake {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-10deg);
  }
  75% {
    transform: rotate(10deg);
  }
}

@keyframes wave {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

.cocktail-loader {
  position: relative;
  width: 80px;
  height: 120px;
}

.loader-shaker {
  position: absolute;
  width: 60px;
  height: 100px;
  border: 3px solid currentColor;
  border-radius: 5px 5px 30px 30px;
  animation: shake 1.5s ease-in-out infinite;
}

.loader-liquid {
  position: absolute;
  bottom: 10px;
  left: 12px;
  width: 40px;
  height: 40px;
  background: linear-gradient(to right, #ffb347, #ffcc33);
  border-radius: 0 0 20px 20px;
  animation: wave 1.5s ease-in-out infinite;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.header-logo {
  cursor: pointer;
}

html {
  scroll-behavior: smooth;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 180, 0, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 180, 0, 0.7);
}
</style>
