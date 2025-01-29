<script lang="ts" setup>
const props = withDefaults(defineProps<{
    logo?: boolean;
}>(), {
    logo: false,
});
</script>

<template>
    <Card :class="`${$slots.img && !props.logo ? `flex flex-col-reverse sm:flex-row` : ''}`">
        <div class="flex-1">
            <CardHeader :class="$slots.img && props.logo ? `flex ${props.imgLeft ? 'flex-row-reverse justify-end' : 'flex-row justify-between'}` : ''">
                <div>
                    <CardTitle class="font-normal text-xl"><ContentSlot :use="$slots.title" unwrap="p" /></CardTitle>
                    <CardDescription><ContentSlot :use="$slots.description" unwrap="p" /></CardDescription>
                </div>
                <div v-if="$slots.img && props.logo" class="logo">
                    <ContentSlot :use="$slots.img" unwrap="p" />
                </div>
            </CardHeader>
            <CardContent :class="`card-body ${$slots.title ? '' : 'pt-6'}`">
                <slot />
            </CardContent>
        </div>
        <div v-if="$slots.img && !props.logo" class="flex-1 flex justify-center items-center p-3 img">
            <ContentSlot :use="$slots.img" unwrap="p" />
        </div>
    </Card>
</template>

<style scoped>
h3 {
    margin-top: 0;
}
p {
    margin: 0;
}
.card-body > :deep(p:first-child) {
    margin-top: 0;
}
.card-body > :deep(p:last-child) {
    margin-bottom: 0;
}
.logo :deep(img) {
    /* max-width: 80px; */
    margin: 0;
}
.img :deep(img) {
    margin: 0;
}
</style>