<template>
  <header class="header-holder c-header">
    <span class="header-content">
      <c-icon
        v-if="icon"
        :name="icon"
        class="header-icon"
        @click="e => $emit('iconClick', e)"
      />
      <span class="header-title">
        <slot />
      </span>
    </span>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CIcon from './CIcon.vue';

export default defineComponent({
  name: 'CHeader',
  emits: ['iconClick'],
  props: {
    icon: { type: String, default: '' }
  },
  components: { CIcon }
});
</script>

<style scoped>
.header-holder {
  display: block;
  overflow: visible;

  font-size: 1.1em;
  line-height: 3em;

  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 3em;

  background: var(--c-header-background);
  border-bottom: 1px solid var(--c-border-color);
}

.header-title {
  padding-left: 0.2em;
}

.header-icon {
  --icon-color: var(--header-icon-color,var(--c-color-medium));
  --icon-scale: 1.4;
}

.header-content {
  vertical-align: text-bottom;
  padding-left: 0.5em;
}
</style>
