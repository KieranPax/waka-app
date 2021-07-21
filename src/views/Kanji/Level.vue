<template>
  <c-view>
    <c-header icon=":arrow-back" @iconClick="() => router.back()">
      Kanji Level {{ levelId }}
    </c-header>
    <c-content>
      <k-grid
        v-bind="{ kanji: level }"
        @selectedKanji="updateKanjiDetails"
      />
    </c-content>
    <div
      class="screen-cover"
      :style="{
        opacity: kanjiDetails.a ? 1 : 0,
        'pointer-events': kanjiDetails.a ? 'all' : 'none'
      }"
      @click="() => updateKanjiDetails()"
    >
      <k-details
        class="details-card" v-bind="{ kanji: kanjiDetails.b }"
        ref="detailsEl"
      />
    </div>
  </c-view>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { CView, CHeader, CContent } from '@/components';
import KGrid from '@/components/Kanji/Grid.vue';
import KDetails from '@/components/Kanji/Details.vue';
import { GetKanjiStore } from '@/oldLib/store_lib';
import { Kanji } from '@/oldLib/ja_types';

export default defineComponent({
  name: 'KLevel',
  components: { CView, CHeader, CContent, KGrid, KDetails },
  data () {
    const router = useRouter();
    const route = useRoute();
    const levelId = Number(route.params.levelId);
    const level: Ref<Kanji[]> = ref([]);
    const kanjiDetails: Ref<{ a: boolean; b: Kanji | undefined }> = ref({
      a: false,
      b: undefined
    });
    GetKanjiStore().then(async store => {
      level.value = await store.byLevel([levelId]);
    });
    return { router, levelId, level, kanjiDetails };
  },
  methods: {
    updateKanjiDetails (k?: Kanji) {
      if (k) this.kanjiDetails = { a: true, b: k };
      else this.kanjiDetails.a = false;
      (this.$refs.detailsEl as typeof KDetails).updateKanji();
    }
  }
});
</script>

<style scoped>
.c-header {
  --header-icon-color: var(--c-color-kanji);
}

.screen-cover {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  transition: opacity 0.4s;
}

.details-card {
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.button-holder {
  padding: 5px;
  padding-bottom: 25px;
}

.start-button {
  background: var(--c-color-kanji);
  color: var(--text-color);
  border: none;
  border-radius: 4px;
  padding: 10px;
  width: 100%;
  font-size: 1em;
}

.question-selector {
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  --question-color: var(--c-color-kanji);
}
</style>
