<template>
  <c-view>
    <c-header icon=":arrow-back" @iconClick="() => router.back()">
      Study Mode
    </c-header>
    <c-content>
      <div class="card-holder">
        <c-card
          v-for="card in cards"
          :key="card.i"
          class="q-card"
          :style="{
            left: ['110vmin', '0', '-110vmin'][card.pos]
          }"
        >
          <template #head>
            <div
              class="q-head"
              :style="{ background: `var(--c-color-${card.type})` }"
            >
              <span class="q-head-number">{{ card.i + 1 }}.</span>
              <q-title :card="card" />
            </div>
          </template>
          <q-body
            :card="card"
            @answered="
              c => {
                scrollQuestions();
                score[c ? 0 : 1]++;
              }
            "
          />
        </c-card>
      </div>
    </c-content>
  </c-view>
</template>
<script lang="ts">
import { defineComponent, ref, Ref } from 'vue';
import { CView, CHeader, CContent, CCard } from '@/components';
import { WKUser } from '@/lib/WKAPI';
import { GetUser } from '@/lib/Local';
import { useRouter, useRoute } from 'vue-router';
import QTitle from '@/components/Study/QTitle.vue';
import QBody from '@/components/Study/QBody.vue';
import { QuestionGenerator, QuestionInfo } from '@/lib/StudyMode';

export default defineComponent({
  name: 'SMode',
  components: { CView, CHeader, CContent, CCard, QTitle, QBody },
  data () {
    const user: Ref<null | WKUser> = ref(null);
    const router = useRouter();
    const route = useRoute();
    const settings = (route.params.settings as string).split(',').map(Number);
    const levelSelection = settings.splice(0, 2) as [number, number];
    const cards: Ref<QuestionInfo[]> = ref([]);
    const generator = new QuestionGenerator(levelSelection, settings);
    const score: Ref<number[]> = ref([0, 0]);
    return { levelSelection, user, settings, router, cards, generator, score };
  },
  created () {
    GetUser().then(user => {
      this.user = user;
      this.user.subscription.max_level_granted = 60;
    });
    this.generator.Generate().then(c => {
      c ? this.cards.push(c) : 0;
      setTimeout(this.scrollQuestions, 1);
    });
  },
  methods: {
    scrollQuestions () {
      this.generator.Generate().then(c => (c ? this.cards.push(c) : 0));
      for (let i = this.cards.length - 1; i >= 0; i--) {
        if (++this.cards[i].pos >= 3) this.cards.splice(i, 1);
      }
    }
  }
});
</script>

<style scoped>
.c-header {
  --header-icon-color: var(--c-color-navy);
}

.card-holder {
  position: relative;
  left: 0;
  top: 0;
  overflow: visible;
}

.q-card {
  width: 100%;
  position: absolute;
  transition: left 1.2s;
}

.q-head {
  background: var(--c-color-medium);
  padding: 0.5em;
}

.q-head-number {
  position: absolute;
  left: 0.75ch;
  top: 0.25ch;
}

q-title {
  display: inline-block;
  text-align: center;
  width: 100%;
}

q-title:deep(r-image),
q-title:deep(k-image) {
  font-size: 4em;
}

q-body:deep(r-image),
q-body:deep(k-image) {
  font-size: 2.5em;
}

q-title:deep(span),
q-body:deep(span),
q-body:deep(button) {
  text-transform: capitalize;
  font-size: 1.2em;
}

q-body:deep(.multi-select button) {
  width: 100%;
  margin: 1px;
  padding: 0.5em;
  font-size: 1em;
  border: 1px solid var(--c-border-color);
  background: var(--c-color-step-100);
  color: var(--c-text-color);
  border-radius: 0.1em;
}
</style>
