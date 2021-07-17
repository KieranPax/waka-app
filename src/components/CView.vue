<template>
  <div class="view-holder">
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
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow: hidden;
  background: var(--c-background-color);
}
</style>
