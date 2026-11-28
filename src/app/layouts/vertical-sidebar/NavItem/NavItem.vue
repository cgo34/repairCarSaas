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
      <span class="position-relative d-inline-flex">
        <Icon
          :item="props.item.icon"
          :level="props.level"
        />
        <span
          v-if="item.alert"
          class="profile-alert-dot"
        >!</span>
      </span>
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
      v-if="item.chip"
      #append
    >
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
/* Pastille "!" sur l'icône (sidebar ouverte ou réduite) */
.profile-alert-dot {
  position: absolute;
  top: -6px;
  right: -8px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #ff8a00;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  line-height: 15px;
  text-align: center;
}

.v-list-item :deep(.v-list-item__append) {
  align-self: center;
  align-items: center;
  display: flex;
  margin: 0;
}
</style>
