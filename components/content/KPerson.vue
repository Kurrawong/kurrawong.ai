<template>
    <KCard imgPosition="right" class="mb-6">
        <template #header>
            <ContentSlot :use="$slots.name" unwrap="p" />
            <CardDescription><ContentSlot :use="$slots.position" unwrap="p" /></CardDescription>
        </template>
        <slot />
        <template #img>
            <ContentSlot :use="$slots.img" unwrap="p" />
        </template>
    </KCard>
</template>
