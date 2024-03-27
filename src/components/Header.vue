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
            <DropdownMenu 
              title="Products" 
              href="/products" 
              :items="[
                { label: 'Products', href: '/products'},
                { label: ' - Fuseki', href: '/products/fuseki' },
                { label: ' - Olis', href: '/products/olis' },
                { label: ' - Prez', href: '/products/prez' }
              ]">
            </DropdownMenu>
             <DropdownMenu 
              title="Services" 
              href="/services" 
              :items="[
                { label: 'Services', href: '/services' },
                { label: ' - Data Governance', href: '/services/data-governance' },
                { label: ' - Vocabularies', href: '/services/vocabularies' },
                { label: ' - Data Modelling', href: '/services/data-modelling' },
                { label: ' - System Design & Implementation', href: '/services/system-design' },
                { label: ' - Support', href: '/services/support' },
                { label: ' - Tools', href: '/services/tools' },
                { label: ' - Training', href: '/services/training' }
              ]">
            </DropdownMenu>
            <NavItem
              v-for="item in items"
              :label="item.label"
              :href="item.href"
              :outline="item.outline"
            />
          </ul>
        </nav>
        <nav class="-mr-2 -my-2 min-[940px]:hidden">
          <button
            @click="handleMenuClick"
            class="bg-white hover:bg-gray-100 hover:text-gray-500 inline-flex items-center justify-center p-2 rounded-md text-gray-400 focus:outline-none"
            aria-label="Open menu"
            type="button"
            :aria-expanded="isOpen"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              class="h-6 w-6 stroke-gray-900"
              fill="none"
              focusable="false"
              xmlns="http://www.w3.org/2000/svg"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </button>
        </nav>
      </div>
    </div>
    <NavMenuMobile :is-open="isOpen" @closed="setIsOpenFalse"></NavMenuMobile>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import NavItem from "./NavItem.vue";
import DropdownMenu from "./DropdownMenu.vue";
import NavMenuMobile from "./NavMenuMobile.vue";

defineProps<{ items: { label: string; href: string; outline?: boolean }[] }>();

const isOpen = ref(false);

const handleMenuClick = () => {
  isOpen.value = !isOpen.value;
};

const setIsOpenFalse = () => {
  isOpen.value = false;
};
</script>
