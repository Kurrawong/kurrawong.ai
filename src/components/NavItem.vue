<template>
  <li class="list-none">
    <a
      :href="href"
      class="py-4 px-4 font-medium hover:underline hover:bg-[#3366ff23] hover:cursor-pointer"
      >{{ label }}</a
    >
  </li>
</template>

<script setup lang="ts">
defineProps<{ label: string; href: string }>();
</script>
