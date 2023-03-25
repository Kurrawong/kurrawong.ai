<template>
  <header
    class="bg-white border-b border-gray-200 fixed h-16 inset-x-0 min-[940px]:border-0 min-[940px]:h-auto min-[940px]:relative top-0 z-10"
  >
    <div class="mx-auto max-w-7xl h-full px-4 sm:px-6">
      <div
        class="flex items-center justify-between h-full min-[940px]:py-6 xl:justify-start xl:space-x-10"
      >
        <div class="flex justify-start min-[940px]:flex-1 min-[940px]:w-0">
          <a href="/">
            <img
              src="/KurrawongAI_350.png"
              alt="Kurrawong AI logo"
              width="130"
            />
          </a>
        </div>

        <nav class="hidden min-[940px]:flex items-center space-x-8">
          <ul class="flex items-center m-0">
            <DropdownMenu></DropdownMenu>
            <NavItem
              v-for="item in items"
              :label="item.label"
              :href="item.href"
            />
          </ul>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import NavItem from "./NavItem.vue";
import DropdownMenu from "./DropdownMenu.vue";

defineProps<{ items: { label: string; href: string }[] }>();
</script>
