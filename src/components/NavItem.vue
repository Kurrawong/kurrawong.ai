<template>
  <li class="list-none">
    <a
      :href="href"
      class="py-4 px-4 text-[#980000] font-medium hover:underline hover:bg-[#9800002d] hover:cursor-pointer"
      >{{ label }}</a
    >
  </li>
</template>

<script setup lang="ts">
defineProps<{ label: string; href: string }>();
</script>
