<template>
  <c-view>
    <c-header icon=":arrow-back" @iconClick="() => router.back()">
      Radical Level {{ levelId }}
    </c-header>
    <c-content>
      <r-grid
        v-bind="{ radicals: level }"
        @selectedRadical="updateRadicalDetails"
      />
    </c-content>
    <div
      class="screen-cover"
      :style="{
        opacity: radicalDetails.a ? 1 : 0,
        'pointer-events': radicalDetails.a ? 'all' : 'none'
      }"
      @click="() => updateRadicalDetails()"
    >
      <r-details class="details-card" v-bind="{ radical: radicalDetails.b }" />
    </div>
  </c-view>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { CView, CHeader, CContent } from '@/components';
import RGrid from '@/components/Radical/Grid.vue';
import RDetails from '@/components/Radical/Details.vue';
import { GetRadicalStore } from '@/store_lib';
import { Radical } from '@/ja_types';

export default defineComponent({
  name: 'RLevel',
  components: { CView, CHeader, CContent, RGrid, RDetails },
  data () {
    const router = useRouter();
    const route = useRoute();
    const levelId = Number(route.params.levelId);
    const level: Ref<Radical[]> = ref([]);
    const radicalDetails: Ref<{ a: boolean; b: Radical | undefined }> = ref({
      a: false,
      b: undefined
    });
    GetRadicalStore().then(async store => {
      level.value = await store.byLevel([levelId]);
    });
    return { router, levelId, level, radicalDetails };
  },
  methods: {
    updateRadicalDetails (r?: Radical) {
      if(r) this.radicalDetails = {a:true,b:r};
      else this.radicalDetails.a = false;
    }
  }
});
</script>

<style scoped>
.c-header {
  --header-icon-color: var(--c-color-radical);
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
  background: var(--c-color-radical);
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
  --question-color: var(--c-color-radical);
}
</style>
