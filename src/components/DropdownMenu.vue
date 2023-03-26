<script lang="ts" setup>
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
</script>

<template>
  <Menu as="div" class="relative inline-block">
    <MenuButton
      class="py-3 px-4 font-medium hover:cursor-pointer flex justify-center rounded text-gray-600 hover:bg-gray-100 hover:text-gray-700"
    >
      <span>Products</span>
      <svg
        class="hi-solid hi-chevron-down inline-block w-5 h-5 opacity-50"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </MenuButton>

    <transition
      enter-active-class="transition ease-out duration-150"
      enter-from-class="transform opacity-0 scale-75"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-75"
    >
      <MenuItems
        class="absolute origin-top-left mt-2 shadow-xl rounded whitespace-nowrap z-50 focus:outline-none"
      >
        <div
          class="bg-white ring-1 ring-black ring-opacity-5 rounded divide-y divide-gray-100"
        >
          <div class="p-2 space-y-1">
            <MenuItem v-slot="{ active }">
              <a
                href="/products"
                class="flex items-center space-x-2 rounded py-2 px-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-700"
                :class="{
                  'text-gray-700 bg-gray-100 visited:text-gray-700': active,
                  'text-gray-600 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:bg-gray-100 focus:text-gray-700 visited:text-gray-700':
                    !active,
                }"
              >
                <span>Product Range</span>
              </a>
            </MenuItem>
            <MenuItem v-slot="{ active }">
              <a
                href="/supported-products"
                class="flex items-center space-x-2 rounded py-2 px-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-700"
                :class="{
                  'text-gray-700 bg-gray-100 visited:text-gray-700': active,
                  'text-gray-600 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:bg-gray-100 focus:text-gray-700 visited:text-gray-700':
                    !active,
                }"
              >
                <span>Supported Products</span>
              </a>
            </MenuItem>
          </div>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>
