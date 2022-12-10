<template>
  <div class="container mx-auto">
    <header class="flex justify-between items-center pt-5 px-4">
      <div class="flex items-center">
        <a href="/">
          <img src="/KurrawongAI_250.png" alt="Kurrawong AI logo" />
        </a>
      </div>
      <nav class="pr-3">
        <ul class="flex items-center gap-6 list-none">
          <li v-for="item in items">
            <a :href="item.href">{{ item.label }}</a>
          </li>
        </ul>
      </nav>
    </header>
  </div>
</template>

<script setup lang="ts">
defineProps<{ items: { label: string; href: string }[] }>();
</script>
