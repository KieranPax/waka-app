<template>
  <c-view>
    <c-header icon=":arrow-back" @iconClick="() => router.back()">
      Kanji Levels
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
  name: 'KHome',
  components: { CView, CHeader, CContent, CTextlist },
  data () {
    const router = useRouter();
    const lines = [];
    for (let i = 1; i <= 60; i++) {
      lines.push({
        t: 'Level ' + i,
        l: '/kanji/l/' + i,
        h: false
      });
    }
    return { router, lines };
  }
});
</script>

<style scoped></style>
