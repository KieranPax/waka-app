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

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CCard'
});
</script>

<style scoped>
div.card-main {
  background: var(--override-card-background, var(--c-card-background));
  border: 1px solid var(--c-border-color);
  border-radius: 4px;
  overflow: hidden;
}

.card-body {
  padding: var(--override-card-padding, 10px);
}
</style>
