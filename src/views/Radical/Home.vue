<template>
  <c-view>
    <c-header icon=":arrow-back" @iconClick="() => router.back()">
      Radical Levels
    </c-header>
    <c-content>
      <c-textlist :lines="lines" />
    </c-content>
  </c-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { CView, CHeader, CContent, CTextlist } from '@/components';

export default defineComponent({
  name: 'RHome',
  components: { CView, CHeader, CContent, CTextlist },
  data () {
    const router = useRouter();
    const lines = [];
    for (let i = 1; i <= 60; i++) {
      lines.push({
        t: 'Level ' + i,
        l: '/radical/l/' + i,
        h: false
      });
    }
    return { router, lines };
  }
});
</script>

<style scoped>
.c-header {
  --header-icon-color: var(--c-color-radical);
}
</style>
