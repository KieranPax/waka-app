<script lang="ts">
/*
<template>
  <div class="card-main">
    <div class="card-head">
      <slot name="head" />
    </div>
    <div class="card-body">
      <slot />
    </div>
  </div>
</template>
*/

import { defineComponent, h } from 'vue';

export default defineComponent({
  name: 'CCard',
  render () {
    const s = this.$slots;
    const children = [];
    if (s.head) {
      children.push(h('div', { class: 'card-head' }, s.head()));
    }
    if (s.default) {
      children.push(h('div', { class: 'card-body' }, s.default()));
    }
    return h('c-card', children);
  }
});
</script>

<style scoped>
c-card {
  display: block;
  background: var(--override-card-background, var(--c-card-background));
  border: 1px solid var(--c-border-color);
  border-radius: 4px;
  overflow: hidden;
}

.card-body {
  padding: var(--override-card-padding, 1rem);
}
</style>
