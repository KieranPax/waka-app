<template>
  <c-view>
    <c-header icon=":arrow-back" @iconClick="() => router.back()">
      Vocab Level {{ levelId }}
    </c-header>
    <c-content>
      <div class="locked-message" v-if="showLockedMessage">
        This level is not included in your subscription plan.
      </div>
      <v-grid v-bind="{ vocabs: level }" @selectedVocab="updateVocabDetails" />
    </c-content>
    <div
      class="screen-cover"
      :style="{
        opacity: vocabDetails.a ? 1 : 0,
        'pointer-events': vocabDetails.a ? 'all' : 'none'
      }"
      @click="() => updateVocabDetails()"
    >
      <v-details
        class="details-card"
        v-if="vocabDetails.b"
        v-bind="{ vocab: vocabDetails.b }"
      />
    </div>
  </c-view>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { CView, CHeader, CContent } from '@/components';
import VGrid from '@/components/Vocab/Grid.vue';
import VDetails from '@/components/Vocab/Details.vue';
import {
  GetUser,
  GetLevelComp,
  GetSubjects,
  GetLevelOnline
} from '@/lib/Local';
import { SVocab } from '@/lib/AltTypes';

export default defineComponent({
  name: 'VLevel',
  components: { CView, CHeader, CContent, VGrid, VDetails },
  data () {
    const router = useRouter();
    const route = useRoute();
    const levelId = Number(route.params.levelId);
    const level: Ref<SVocab[]> = ref([]);
    const vocabDetails: Ref<{ a: boolean; b?: SVocab }> = ref({ a: false });
    return { router, levelId, level, vocabDetails, showLockedMessage: false };
  },
  methods: {
    updateVocabDetails (v?: SVocab) {
      if (v) {
        this.vocabDetails = { a: true, b: v };
        console.log(v);
      } else this.vocabDetails.a = false;
    }
  },
  created () {
    GetLevelComp(this.levelId)
      .then(lvlComp => {
        const ids = lvlComp[2];
        console.log(lvlComp);
        GetSubjects(ids).then(lvl => {
          this.level = (lvl as SVocab[]).sort(
            (a, b) => a.pos - b.pos + (a.srs - b.srs) * 1000
          );
        });
      })
      .catch(() => {
        GetLevelOnline(this.levelId, 'vocabulary').then(lvl => {
          this.level = (lvl as SVocab[]).sort(
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
  --header-icon-color: var(--c-color-vocab);
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
  background: var(--c-color-vocab);
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
  --question-color: var(--c-color-vocab);
}

.locked-message {
  padding: 0.8rem;
  margin: 5px;
  background: var(--c-color-bad);
  border: 1px solid var(--c-tint-bad);
  border-radius: 10px;
}
</style>
