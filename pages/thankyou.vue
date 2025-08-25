<script setup>
definePageMeta({
  layout: "custom",
});

const messages = [
  "trims ya ges 😉",
  "trims ya lur 😁",
  "trims ya gengs 🙌",
  "trims ya rek 😁",
  "trims ya temen² 😁",
  "trims ya squad 🙌",
  "trims ya tim 🚀",
  "trims ya semua ✨",
  "trims ya bang 🔥",
];
const funnyTexts = [
  "yuk bisa yuk klik dulu",
  "ini endingnya bagus nih",
  "banyak juga ya waktu kalian, coba klik lagi",
  "asli beneran gaboong ada endingnya",
  "coba aja klik lagi",
  "beneran deh suer",
  "asli dikit lagi",
];
const statusText = computed(() => {
  if (clicks.value >= 10) return "Love You All ❤️";
  if (clicks.value >= 7) return `klik ${10 - clicks.value} kali lagi`;
  // rotasi text sesuai jumlah klik
  return funnyTexts[clicks.value % funnyTexts.length];
});
// pilih random
const message = messages[Math.floor(Math.random() * messages.length)];
// posisi tombol (pakai persen biar fleksibel)
const posX = ref(50);
const posY = ref(70);
const clicks = ref(0);
function moveButton() {
  clicks.value++;
  if (clicks.value < 10) {
    posX.value = Math.floor(Math.random() * 70) + 10;
    posY.value = Math.floor(Math.random() * 70) + 10;
  }
}
</script>

<template>
  <div
    class="relative flex flex-col items-center justify-center min-h-screen bg-white overflow-hidden"
  >
    <p class="text-xl md:text-3xl font-semibold text-gray-800">{{ message }}</p>
    <span class="mt-2 text-sm md:text-base text-gray-400">from: dias</span>
    <span class="mt-1 text-sm md:text-base text-pink-500 font-medium">
      {{ statusText }}
    </span>
    <!-- Button random -->
    <button
      v-if="clicks < 10"
      @click="moveButton"
      class="absolute px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md transition-all"
      :style="{ left: posX + '%', top: posY + '%' }"
    >
      Coba Klik Deh
    </button>
  </div>
</template>
