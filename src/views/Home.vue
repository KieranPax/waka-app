<template>
  <c-view>
    <c-header>
      Homepage
    </c-header>
    <c-content>
      <c-card
        v-for="card in cards"
        :key="card.title"
        class="mode-card"
        @click="card.func"
      >
        <template #head>
          <div
            class="mode-head" lang="ja"
            :style="{ background: 'var(--c-color-' + card.color + ')' }"
          >
            {{ card.icon }}
          </div>
        </template>
        <span class="card-title">{{ card.title }}</span><br>
        <span class="card-desc">{{ card.desc }}</span>
      </c-card>
    </c-content>
  </c-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { CView, CHeader, CContent, CCard } from '@/components';

export default defineComponent({
  name: 'Home',
  components: { CView, CHeader, CContent, CCard },
  data () {
    const router = useRouter();
    return {
      router,
      cards: [
        {
          title: 'Radicals',
          desc: 'Test your Radical naming skills here',
          color: 'radical',
          icon: '部首',
          func: () => router.push('radical')
        },
        {
          title: 'Kanji',
          desc: 'Test your Kanji knowledge here',
          color: 'medium',
          icon: '漢字',
          func: () => router.push('kanji')
        },
        {
          title: 'Vocabulary',
          desc: 'Test your vocabulary knowledge here',
          color: 'medium',
          icon: '単語',
          func: () => router.push('vocab')
        }
      ]
    };
  }
});
</script>

<style scoped>
.mode-card {
  margin-bottom: 1rem;
}

.mode-head {
  padding: 20px;
  text-align: center;
  font-size: 4em;
}

.card-title {
  font-size: 1.2em;
  line-height: 2em;
}

.card-desc {
  font-size: 0.8em;
  color: var(--c-text-fade-color);
}
</style>
