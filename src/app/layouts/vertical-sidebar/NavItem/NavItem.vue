<script setup>
import { useI18n } from 'vue-i18n';
import Icon from '@/app/layouts/vertical-sidebar/IconSet.vue';

const { t, te } = useI18n();

const props = defineProps({
  item: { type: Object, default: undefined },
  level: { type: Number, default: undefined }
});
</script>

<template>
  <!---Single Item-->
  <v-list-item
    :to="item.type === 'external' ? '' : item.to"
    :href="item.type === 'external' ? item.to : ''"
    rounded
    class="mb-1"
    color="primary"
    :disabled="item.disabled"
    :target="item.type === 'external' ? '_blank' : ''"
  >
    <!---If icon-->
    <template #prepend>
      <Icon
        :item="props.item.icon"
        :level="props.level"
      />
    </template>
    <v-list-item-title>{{ $t(item.title) }}</v-list-item-title>
    <!---If Caption-->
    <v-list-item-subtitle
      v-if="item.subCaption"
      class="text-caption mt-n1 hide-menu"
    >
      {{ item.subCaption }}
    </v-list-item-subtitle>
    <!---If any chip or label-->
    <template
      v-if="item.chip || item.alert"
      #append
    >
      <span
        v-if="item.alert"
        class="profile-alert-badge hide-menu"
      >
        <v-icon
          icon="mdi-exclamation"
          size="18"
          color="white"
        />
      </span>
      <v-chip
        v-if="item.chip"
        :color="item.chipColor"
        class="sidebarchip hide-menu"
        :size="item.chipIcon ? 'small' : 'default'"
        :variant="item.chipVariant"
        :prepend-icon="item.chipIcon"
      >
        {{ te(item.chip) ? t(item.chip) : item.chip }}
      </v-chip>
    </template>
  </v-list-item>
</template>

<style scoped>
.profile-alert-badge :deep(.v-icon) {
  margin: 0 !important;
  line-height: 1;
}
.profile-alert-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #ff8a00;
}
.v-list-item :deep(.v-list-item__append) {
  align-self: center;
  align-items: center;
  display: flex;
  margin: 0;
}
</style>
