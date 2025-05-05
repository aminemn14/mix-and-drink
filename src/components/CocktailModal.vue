<style scoped>
/* Transitions d'ouverture et fermeture */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Personnalisation du scrollbar dans la modal */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 180, 0, 0.5);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 180, 0, 0.7);
}
</style>

<template>
  <Transition name="modal">
    <!-- Fond sombre cliquable pour fermer la modal -->
    <div
      class="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black bg-black/80"
      @click="$emit('close')"
    >
      <!-- Zone invisible pour fermer au clic hors du contenu -->
      <div class="absolute inset-0" @click="$emit('close')"></div>

      <!-- Conteneur principal centré, empêche la propagation du clic -->
      <div
        class="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-gray-800 rounded-lg shadow-xl"
        @click.stop
        ref="modalContent"
      >
        <!-- Bouton fermer en haut à droite -->
        <button
          @click="$emit('close')"
          class="group absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-700 hover:bg-white transition-all shadow-md"
        >
          <XIcon class="h-5 w-5 text-gray-400 group-hover:text-gray-700" />
        </button>

        <!-- Bouton favoris à côté du close -->
        <button
          @click="$emit('toggle-favorite', cocktail)"
          class="absolute top-4 right-16 z-10 p-2 rounded-full bg-gray-700 hover:bg-white transition-all shadow-md"
        >
          <HeartIcon
            :class="[
              isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400',
              'h-5 w-5',
            ]"
          />
        </button>

        <div class="md:flex">
          <!-- Section image et étiquettes -->
          <div class="md:w-2/5 relative">
            <div class="h-64 md:h-full min-h-[300px] overflow-hidden">
              <img
                :src="cocktail.strDrinkThumb"
                :alt="cocktail.strDrink"
                class="w-full h-full object-cover"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
              ></div>
              <!-- Étiquettes catégorie, alcoolisé, type de verre -->
              <div class="absolute bottom-0 left-0 right-0 p-4 text-white">
                <div class="flex flex-wrap gap-2 mb-2">
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full bg-amber-500/90 text-white"
                  >
                    {{ cocktail.strCategory || "Uncategorized" }}
                  </span>
                  <span
                    v-if="cocktail.strAlcoholic"
                    class="px-2 py-1 text-xs font-medium rounded-full bg-blue-500/90 text-white"
                  >
                    {{ cocktail.strAlcoholic }}
                  </span>
                  <span
                    v-if="cocktail.strGlass"
                    class="px-2 py-1 text-xs font-medium rounded-full bg-green-500/90 text-white"
                  >
                    {{ cocktail.strGlass }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Section détails, ingrédients et instructions -->
          <div class="md:w-3/5 p-6 relative" ref="contentSection">
            <!-- Titre du cocktail -->
            <h2 class="text-2xl font-bold text-white mb-1">
              {{ cocktail.strDrink }}
            </h2>
            <!-- Affichage des tags s'ils existent -->
            <p v-if="cocktail.strTags" class="text-sm text-gray-400 mb-4">
              {{ formatTags(cocktail.strTags) }}
            </p>

            <!-- Liste des ingrédients dynamiquement générée -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-2 text-amber-400">
                Ingredients
              </h3>
              <ul class="space-y-2">
                <li
                  v-for="(ingredient, index) in ingredients"
                  :key="index"
                  class="flex items-start p-2 rounded-md bg-gray-700"
                >
                  <!-- Image de l'ingrédient -->
                  <div
                    class="h-8 w-8 rounded-md overflow-hidden flex-shrink-0 bg-white"
                  >
                    <img
                      :src="getIngredientImage(ingredient.name)"
                      :alt="ingredient.name"
                      class="h-full w-full object-cover"
                    />
                  </div>
                  <!-- Nom et mesure -->
                  <div class="ml-3">
                    <span class="font-medium text-white">
                      {{ ingredient.name }}
                    </span>
                    <span
                      v-if="ingredient.measure"
                      class="ml-2 text-sm text-gray-300"
                    >
                      {{ ingredient.measure }}
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Instructions de préparation -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-2 text-amber-400">
                Instructions
              </h3>
              <div class="prose-invert max-w-none">
                <p class="text-gray-300">
                  {{ cocktail.strInstructions }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
// Hooks Vue et GSAP pour animations d'entrée
import { ref, computed, onMounted, nextTick } from "vue";
import { XIcon, HeartIcon, ExternalLinkIcon } from "lucide-vue-next";
import gsap from "gsap";

// Propriétés passées depuis le parent
const props = defineProps({
  cocktail: {
    type: Object,
    required: true,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
});

// Événements émis : fermeture et basculement favori
defineEmits(["close", "toggle-favorite"]);

// Animation d'apparition de la modal et des ingrédients
onMounted(() => {
  nextTick(() => {
    if (modalContent.value) {
      gsap.fromTo(
        modalContent.value,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
      );
    }

    if (contentSection.value) {
      const ingredientElements = contentSection.value.querySelectorAll("li");
      gsap.fromTo(
        ingredientElements,
        { x: -20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.2,
        }
      );
    }
  });
});

// Références DOM pour animation
const modalContent = ref(null);
const contentSection = ref(null);

// Construction de la liste d'ingrédients depuis les clés dynamiques
const ingredients = computed(() => {
  const result = [];
  for (let i = 1; i <= 15; i++) {
    const ingredientKey = `strIngredient${i}`;
    const measureKey = `strMeasure${i}`;

    if (props.cocktail[ingredientKey]) {
      result.push({
        name: props.cocktail[ingredientKey],
        measure: props.cocktail[measureKey] || "",
      });
    }
  }

  return result;
});

// Formatage des tags en hashtags
const formatTags = (tags) => {
  if (!tags) return "";
  return tags
    .split(",")
    .map((tag) => `#${tag.trim()}`)
    .join(" ");
};

// URL de l'image d'ingrédient depuis l'API
const getIngredientImage = (name) => {
  if (!name) return "";
  return `https://www.thecocktaildb.com/images/ingredients/${encodeURIComponent(
    name
  )}-Small.png`;
};
</script>
