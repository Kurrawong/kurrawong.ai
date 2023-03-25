<template>
  <TransitionRoot
    enter="transition-opacity duration-300"
    enter-from="opacity-0"
    enter-to="opacity-100"
    leave="transition-opacity duration-300"
    leave-from="opacity-100"
    leave-to="opacity-0"
    :show="isOpen"
  >
    <div
      class="absolute max-w-sm transform z-10 min-[940px]:hidden origin-top-right p-2 right-0 top-0 transition w-full"
    >
      <div
        class="bg-white rounded-lg shadow-lg divide-gray-50 divide-y-2 ring-1 ring-black ring-opacity-5"
      >
        <div class="pt-5 pb-6 px-5">
          <div class="flex items-center justify-between">
            <div class="flex justify-start min-[940px]:flex-1 min-[940px]:w-0">
              <a href="/">
                <img
                  src="/KurrawongAI_350.png"
                  alt="Kurrawong AI logo"
                  width="130"
                />
              </a>
            </div>
            <div class="-mr-2">
              <button
                @click="$emit('closed')"
                class="bg-white hover:bg-gray-100 hover:text-gray-500 inline-flex items-center justify-center p-2 rounded-md text-gray-400"
                aria-label="Close menu"
                type="button"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  class="h-6 w-6 stroke-gray-900"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <path
                    d="M6 18L18 6M6 6l12 12"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
          <div class="mt-6 space-y-4">
            <div class="grid gap-2">
              <a
                href="/products"
                class="hover:bg-gray-100 hover:text-gray-700 font-medium text-gray-700 visited:text-gray-700 rounded py-2 px-3"
                ><span class="border-transparent border-b-0"
                  >Product Range
                </span></a
              ><a
                href="/supported-products"
                class="hover:bg-gray-100 hover:text-gray-700 font-medium text-gray-700 visited:text-gray-700 rounded py-2 px-3"
                ><span class="border-transparent border-b-0"
                  >Supported Products
                </span></a
              ><a
                href="/services"
                class="hover:bg-gray-100 hover:text-gray-700 font-medium text-gray-700 visited:text-gray-700 rounded py-2 px-3"
                ><span class="border-transparent border-b-0">Services</span></a
              ><a
                href="/people"
                class="hover:bg-gray-100 hover:text-gray-700 font-medium text-gray-700 visited:text-gray-700 rounded py-2 px-3"
                ><span class="border-transparent border-b-0">People</span></a
              ><a
                href="/projects"
                class="hover:bg-gray-100 hover:text-gray-700 font-medium text-gray-700 visited:text-gray-700 rounded py-2 px-3"
                ><span class="border-transparent border-b-0">Projects</span></a
              >
            </div>
            <hr />
            <div>
              <a
                href="/contact"
                class="flex items-center focus-visible:ring-2 focus-visible:ring-offset-1 focus:outline-none justify-center no-link shrink-0 text-md focus:rounded-md hover:bg-gray-100 hover:text-gray-700 font-medium text-gray-700 visited:text-gray-700 px-4 py-2 rounded-md"
                >Contact Us</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { TransitionRoot } from "@headlessui/vue";

defineProps<{ isOpen: boolean }>();
</script>
