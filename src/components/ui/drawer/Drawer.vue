<script lang="ts" setup>
import { useForwardPropsEmits } from "reka-ui";
import type { DrawerRootEmits, DrawerRootProps } from "vaul-vue";
import { DrawerRoot } from "vaul-vue";

const props = withDefaults(defineProps<DrawerRootProps>(), {
  shouldScaleBackground: true,
});

const emits = defineEmits<DrawerRootEmits>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const forwarded = useForwardPropsEmits(props, emits) as any;
</script>

<template>
  <DrawerRoot data-slot="drawer" v-bind="forwarded">
    <slot />
  </DrawerRoot>
</template>
