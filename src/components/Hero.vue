<template>
  <div class="bg-[#ffffff2d] py-14">
    <h1 class="text-7xl font-bold tracking-tighter">
      <slot />
    </h1>
    <div class="grid place-items-center pb-8 pt-12">
      <img
        src="graph.png"
        alt="An image of a graph with nodes and edges."
        height="163"
        width="339"
      />
    </div>
  </div>
</template>

<script lang setup="ts"></script>
