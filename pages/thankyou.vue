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

// pilih random
const message = messages[Math.floor(Math.random() * messages.length)];
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-white">
    <p class="text-xl md:text-3xl font-semibold text-gray-800">{{ message }}</p>
    <span class="mt-2 text-sm md:text-base text-gray-400">from: dias</span>
  </div>
</template>
