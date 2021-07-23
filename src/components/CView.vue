<template>
  <div class="view-holder c-view">
    <slot>
      Insert HTML DOM into view component
    </slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CView',
  components: {}
});
</script>

<style scoped>
div.view-holder {
  position: relative;
  left: 0;
  width: 100%;
  top: 0;
  height: 100%;
  overflow: hidden;
  background: var(--c-background-color);
}
</style>
