<template>
  <div
    class="bg-[#ffffff] border-solid border-b-2 border-[#ffffff] drop-shadow-md"
  >
    <div class="container mx-auto min-w-[320px]">
      <header class="flex justify-between items-center px-2">
        <div class="flex items-center min-w-[175px]">
          <a href="/">
            <img
              src="/KurrawongAI_350.png"
              alt="Kurrawong AI logo"
              width="350"
              height="143"
            />
          </a>
        </div>
        <nav class="pr-3 overflow-x-auto py-4">
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
