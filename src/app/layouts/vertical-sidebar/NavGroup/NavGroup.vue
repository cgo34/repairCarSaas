<script setup>
const props = defineProps({ item: { type: Object, default: undefined } });
</script>

<template>
  <v-list-subheader
    color="darkText"
    class="smallCap"
  >
    {{ props.item.header }}
  </v-list-subheader>
</template>
