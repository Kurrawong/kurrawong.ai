<!-- 
  The main container component used for the dominant content inside a <main> element.

  Center content horizontally with a min width of 320px and a max-width of 
  Tailwind's max-w-screen-md.

  This component's min height is set to the current screen's height.
-->

<template>
  <div class="container mx-auto min-h-screen min-w-[320px] w-full">
    <main class="max-w-screen-md px-2 pt-2 mx-auto">
      <slot />
    </main>
  </div>
</template>

<script lang setup="ts"></script>
