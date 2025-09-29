<template>
    <KCard imgPosition="right" class="mb-6">
        <template #title><slot name="name" mdc-unwrap="p" /></template>
        <template #description><slot name="position" mdc-unwrap="p" /></template>
        <slot />
        <template #img><slot name="img" mdc-unwrap="p" /></template>
    </KCard>
</template>
