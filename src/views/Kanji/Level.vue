<template>
  <c-view>
    <c-header icon=":arrow-back" @iconClick="() => router.back()">
      Kanji Level {{ levelId }}
    </c-header>
    <c-content>
      <div class="locked-message" v-if="showLockedMessage">
        This level is not included in your subscription plan.
      </div>
      <k-grid v-bind="{ kanji: level }" @selectedKanji="updateKanjiDetails" />
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
        class="details-card"
        ref="detailsEl"
        v-if="kanjiDetails.b"
        v-bind="{ kanji: kanjiDetails.b, radicalLookup }"
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
import { GetUser, GetLevelComp, GetSubjects } from '@/lib/Local';
import { SKanji, SRadical } from '@/lib/AltTypes';

export default defineComponent({
  name: 'KLevel',
  components: { CView, CHeader, CContent, KGrid, KDetails },
  data () {
    const router = useRouter();
    const route = useRoute();
    const levelId = Number(route.params.levelId);
    const level: Ref<SKanji[]> = ref([]);
    const kanjiDetails: Ref<{ a: boolean; b?: SKanji }> = ref({ a: false });
    const radicalLookup: Ref<SRadical[]> = ref([]);
    return {
      router,
      levelId,
      level,
      kanjiDetails,
      radicalLookup,
      showLockedMessage: false
    };
  },
  methods: {
    updateKanjiDetails (k?: SKanji) {
      if (!this.radicalLookup.length) {
        GetLevelComp(this.levelId).then(lvlComp => {
          const ids = lvlComp[3];
          console.log(ids);
          GetSubjects(ids).then(lvl => {
            this.radicalLookup = (lvl as SRadical[]).sort(
              (a, b) => a.pos - b.pos + (a.srs - b.srs) * 1000
            );
          });
        });
      }
      if (k) {
        this.kanjiDetails = { a: true, b: k };
        console.log(k);
      } else this.kanjiDetails.a = false;
    }
  },
  created () {
    GetLevelComp(this.levelId).then(lvlComp => {
      const ids = lvlComp[1];
      console.log(ids);
      GetSubjects(ids).then(lvl => {
        this.level = (lvl as SKanji[]).sort(
          (a, b) => a.pos - b.pos + (a.srs - b.srs) * 1000
        );
      });
    });
    GetUser().then(async user => {
      if (this.levelId > user.subscription.max_level_granted) {
        this.showLockedMessage = true;
      }
    });
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

.locked-message {
  padding: 0.8rem;
  margin: 5px;
  background: var(--c-color-bad);
  border: 1px solid var(--c-tint-bad);
  border-radius: 10px;
}
</style>
