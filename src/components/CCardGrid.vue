<template>
  <table class="c-card-grid">
    <tr v-for="rrow in grid" :key="rrow.i">
      <td v-for="card in rrow.row" :key="card.title">
        <c-card @click="card.func">
          <template #head>
            <div
              class="card-head"
              lang="ja"
              :style="{ background: 'var(--c-color-' + card.color + ')' }"
            >
              {{ card.icon }}
            </div>
          </template>
          <span class="card-title">{{ card.title }}</span><br>
          <span class="card-desc">{{ card.desc }}</span>
        </c-card>
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import { defineComponent, h } from 'vue';
import CCard from './CCard.vue';

interface Card {
  title: string;
  desc: string;
  icon?: string;
  color?: string;
  func?: () => void;
}

export default defineComponent({
  props: {
    width: { type: Number, default: 1 },
    cards: { type: Array, required: true }
  },
  components: { CCard },
  computed: {
    grid (): { i: number; row: Card[] }[] {
      const grid: { i: number; row: Card[] }[] = [];
      for (let i = 0; i < this.cards.length;) {
        const row = [];
        for (let j = 0; j < this.width; j++) {
          row.push(this.cards[i++] as Card);
          if (i >= this.cards.length) break;
        }
        grid.push({ i: grid.length, row });
      }
      return grid;
    }
  }
});
</script>

<style scoped>
table {
  width: 100%;
}

c-card {
  margin-bottom: 1rem;
}

.card-head {
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
