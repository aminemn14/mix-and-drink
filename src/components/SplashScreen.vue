<template>
  <div
    class="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-br from-amber-400 to-amber-600 dark:from-gray-900 dark:to-amber-900"
  >
    <!-- Conteneur centré pour le contenu de démarrage -->
    <div class="text-center" ref="splashContent">
      <!-- Animation du verre à cocktail et bulles -->
      <div class="relative mb-6 w-32 h-32 mx-auto">
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="cocktail-glass">
            <div class="glass-body rotate-180"></div>
            <div class="glass-stem"></div>
            <div class="glass-base rotate-180"></div>
            <div class="liquid"></div>
            <!-- Bulles animées dans le verre -->
            <div class="bubble bubble-1"></div>
            <div class="bubble bubble-2"></div>
            <div class="bubble bubble-3"></div>
            <div class="bubble bubble-4"></div>
            <div class="umbrella rotate-180"></div>
          </div>
        </div>
      </div>

      <!-- Titre de l'app et slogan -->
      <h1 class="text-4xl font-bold text-white mb-2 tracking-tight">
        Mix & Drink
      </h1>
      <p class="text-amber-100 dark:text-amber-200">Discover. Mix. Enjoy.</p>

      <!-- Barre de chargement animée -->
      <div class="mt-12">
        <div class="loading-bar">
          <div class="loading-progress" ref="loadingBar"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Références aux éléments DOM et émission d'événement de fin
import { ref, onMounted } from "vue";
import gsap from "gsap";

const splashContent = ref(null);
const loadingBar = ref(null);
const emit = defineEmits(["complete"]);

onMounted(() => {
  // Apparition du contenu (fade-in avec translation)
  gsap.fromTo(
    splashContent.value,
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, ease: "power1.out" }
  );

  // Timeline pour la progression puis disparition
  const loadingTl = gsap.timeline({
    onComplete: () => {
      // Disparition du contenu et déclenchement de l'événement
      gsap.to(splashContent.value, {
        y: -30,
        opacity: 0,
        duration: 0.6,
        ease: "power1.in",
        onComplete: () => emit("complete"),
      });
    },
  });

  // Animation de la barre de chargement sur 2 secondes
  loadingTl.to(loadingBar.value, {
    width: "100%",
    duration: 2,
    ease: "power1.inOut",
  });
});
</script>

<style scoped>
/* Style de la barre de chargement */
.loading-bar {
  width: 200px;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  overflow: hidden;
  margin: 0 auto;
}

.loading-progress {
  height: 100%;
  width: 0%;
  background-color: white;
  border-radius: 2px;
}

/* Animations du verre et des bulles */
.cocktail-glass {
  position: relative;
  width: 80px;
  height: 100px;
}

.glass-body {
  position: absolute;
  top: 0;
  width: 60px;
  height: 60px;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-bottom: none;
  border-radius: 5px 5px 0 0;
}

.glass-stem {
  position: absolute;
  top: 60px;
  left: 25px;
  width: 10px;
  height: 35px;
  background-color: rgba(255, 255, 255, 0.8);
}

.glass-base {
  position: absolute;
  bottom: 0;
  width: 40px;
  height: 5px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 0 0 50% 50%;
  left: 10px;
}

.liquid {
  position: absolute;
  bottom: 40px;
  left: 2px;
  width: 56px;
  height: 40px;
  background: linear-gradient(
    to top,
    rgba(255, 99, 71, 0.8),
    rgba(255, 165, 0, 0.8)
  );
  border-radius: 0 0 5px 5px;
  animation: wave 2s ease-in-out infinite;
}

.bubble {
  position: absolute;
  width: 6px;
  height: 6px;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  opacity: 0;
}

.bubble-1 {
  left: 10px;
  bottom: 50px;
  animation: bubbleRise 3s ease-in infinite;
  animation-delay: 0.2s;
}

.bubble-2 {
  left: 25px;
  bottom: 45px;
  animation: bubbleRise 2.5s ease-in infinite;
  animation-delay: 0.8s;
}

.bubble-3 {
  left: 40px;
  bottom: 48px;
  animation: bubbleRise 3.2s ease-in infinite;
  animation-delay: 1.2s;
}

.bubble-4 {
  left: 15px;
  bottom: 42px;
  animation: bubbleRise 2.8s ease-in infinite;
  animation-delay: 1.8s;
}

.straw {
  position: absolute;
  top: 0;
  left: 45px;
  width: 4px;
  height: 70px;
  background-color: rgba(255, 255, 255, 0.8);
  transform: rotate(15deg);
  transform-origin: bottom center;
}

.umbrella {
  position: absolute;
  top: 5px;
  left: 10px;
  width: 16px;
  height: 16px;
  background-color: rgba(255, 192, 203, 0.8);
  border-radius: 50%;
  transform: translateY(-50%);
}

/* Keyframes pour le mouvement des bulles et du liquide */
@keyframes wave {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes bubbleRise {
  0% {
    transform: translateY(0);
    opacity: 0;
  }
  20% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(-30px);
    opacity: 0;
  }
}
</style>
