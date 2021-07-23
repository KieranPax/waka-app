<template>
  <div class="c-textlist">
    <router-link
      class="list-item"
      v-for="i in lines"
      :key="i.t"
      :class="{ highlighted: i.h===1, disabled: i.h===2 }"
      :to="i.l ? i.l : 0"
    >
      {{ i.t }}
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CTextlist',
  props: {
    lines: { type: Array, required: true }
  }
});
</script>

<style scoped>
.list-item {
  display: inline-block;
  width: 100%;
  padding: 0.8em;
  border: none;
  border-bottom: 1px solid var(--c-border-color);
  color: var(--c-text-color);
  text-align: left;
  transition: background 0.4s;
  cursor: pointer;
  font-size: 0.9em;
  text-decoration: none;
}

.list-item:hover {
  background: var(--c-color-hover);
}

.highlighted {
  background: var(--c-color-medium);
  border-radius: 2px;
}

.disabled {
  color: var(--c-text-dim-color);
  border-radius: 2px;
}
</style>
