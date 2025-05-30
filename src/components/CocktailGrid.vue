<template>
  <!-- Conteneur grille responsive : 1 à 3 colonnes selon la taille d'écran -->
  <div
    ref="gridContainer"
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
  >
    <!-- Carte pour chaque cocktail avec animation d'apparition -->
    <div
      v-for="(cocktail, index) in cocktails"
      :key="cocktail.idDrink"
      class="relative group"
      :class="animationClasses[index]"
    >
      <!-- Carte avec scale au survol -->
      <div
        class="h-full bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 group-hover:scale-[1.02] group-hover:shadow-xl"
      >
        <!-- Image du cocktail avec effet zoom et overlay au survol -->
        <div class="relative h-56 md:h-64 overflow-hidden">
          <div
            class="absolute inset-0 bg-gradient-to-t from-amber-500/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"
          ></div>
          <img
            :src="cocktail.strDrinkThumb"
            :alt="cocktail.strDrink"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <!-- Bouton favoris en haut à droite -->
          <div class="absolute top-3 right-3 z-20">
            <button
              @click.stop="$emit('toggle-favorite', cocktail)"
              class="p-2 bg-gray-800 rounded-full shadow-md hover:bg-gray-700 transition-colors"
            >
              <HeartIcon
                :class="[
                  isFavorite(cocktail)
                    ? 'text-red-500 fill-red-500'
                    : 'text-gray-400',
                  'h-5 w-5',
                ]"
              />
            </button>
          </div>
        </div>

        <!-- Corps de la carte : titre, catégories, extrait instructions et bouton détail -->
        <div class="p-4 md:p-5">
          <!-- Nom du cocktail, tronqué sur une ligne -->
          <h3 class="text-lg font-bold text-white mb-2 line-clamp-1">
            {{ cocktail.strDrink }}
          </h3>

          <!-- Catégorie et alcoolisé -->
          <div class="flex flex-wrap gap-2 mb-3">
            <span
              class="px-2 py-1 text-xs font-medium rounded-fullbg-amber-900/50 text-amber-200"
            >
              {{ cocktail.strCategory || "Uncategorized" }}
            </span>
            <span
              v-if="cocktail.strAlcoholic"
              class="px-2 py-1 text-xs font-medium rounded-full bg-blue-900/50 text-blue-200"
            >
              {{ cocktail.strAlcoholic }}
            </span>
          </div>

          <!-- Extrait des instructions sur 3 lignes max -->
          <div class="h-16 overflow-hidden">
            <p class="text-sm text-gray-300 line-clamp-3">
              {{ cocktail.strInstructions }}
            </p>
          </div>

          <!-- Bouton pour voir la recette complète -->
          <div class="mt-4 pt-4 border-t border-gray-700">
            <button
              @click="$emit('view-details', cocktail)"
              class="w-full py-2 rounded-lg bg-amber-500 text-white font-medium hover:bg-amber-600 transition-colors flex items-center justify-center"
            >
              <span class="mr-1">View Recipe</span>
              <ChevronRightIcon class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Import des refs et animations GSAP
import { ref, onMounted } from "vue";
import { HeartIcon, ChevronRightIcon } from "lucide-vue-next";
import gsap from "gsap";

// Props : liste de cocktails et favoris pour état du cœur
const props = defineProps({
  cocktails: {
    type: Array,
    required: true,
  },
  favorites: {
    type: Array,
    required: true,
  },
});

defineEmits(["view-details", "toggle-favorite"]);

const gridContainer = ref(null);
// Classes pour décalage des animations en cascade
const animationClasses = ref(["fade-in-up-1", "fade-in-up-2", "fade-in-up-3"]);

// Vérifie si un cocktail est en favoris
const isFavorite = (cocktail) => {
  return props.favorites.some((fav) => fav.idDrink === cocktail.idDrink);
};

// Animation d'apparition des cartes au montage
onMounted(() => {
  if (gridContainer.value) {
    const cards = gridContainer.value.querySelectorAll(".group");

    gsap.fromTo(
      cards,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
      }
    );
  }
});
</script>

<style scoped>
/* Classes pour retarder l'animation fadeInUp */
.fade-in-up-1 {
  --animation-delay: 0ms;
}

.fade-in-up-2 {
  --animation-delay: 200ms;
}

.fade-in-up-3 {
  --animation-delay: 400ms;
}

/* Animation keyframes et application aux groupes */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.group {
  animation: fadeInUp 0.6s ease-out forwards;
  animation-delay: var(--animation-delay);
  opacity: 0;
}
</style>
