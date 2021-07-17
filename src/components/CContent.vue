<template>
  <div class="content-box">
    <div class="content-flex">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CContent',
  components: {}
});
</script>

<style scoped>
div.content-box {
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  top: 3.6em;
  bottom: 0;
  overflow-x: hidden;
  overflow-y: scroll;
}

div.content-flex {
  position: absolute;
  padding: 10px;
  left: 0;
  right: 0;
  top: 0;
}
</style>
