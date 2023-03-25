<template>
  <li class="list-none">
    <a
      :href="href"
      class="py-4 px-4 font-medium hover:cursor-pointer text-gray-600 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:bg-gray-100 focus:text-gray-700 visited:text-gray-700"
      >{{ label }}</a
    >
  </li>
</template>

<script setup lang="ts">
defineProps<{ label: string; href: string }>();
</script>
