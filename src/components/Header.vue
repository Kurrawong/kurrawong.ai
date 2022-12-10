<template>
  <div class="bg-[#fcdcad] border-solid border-b-2 border-[#fddca9]">
    <div class="container mx-auto min-w-[320px]">
      <header class="flex justify-between items-center">
        <div class="flex items-center">
          <a href="/">
            <img src="/KurrawongAI_250.svg" alt="Kurrawong AI logo" />
          </a>
        </div>
        <nav class="pr-3">
          <ul class="flex items-center m-0">
            <NavItem
              v-for="item in items"
              :label="item.label"
              :href="item.href"
            />
          </ul>
        </nav>
      </header>
    </div>
  </div>
</template>

<script setup lang="ts">
import NavItem from "./NavItem.vue";

defineProps<{ items: { label: string; href: string }[] }>();
</script>
