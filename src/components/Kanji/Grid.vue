<template>
  <table class="k-grid">
    <tr v-for="row in rows" :key="row.i">
      <td v-for="k in row.k" :key="k.id">
        <c-card @click="()=>$emit('selectedKanji', k)">
          <k-image v-bind="{ kanji: k }" />
        </c-card>
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import { SKanji } from '@/lib/AltTypes';
import { defineComponent } from 'vue';
import CCard from '../CCard.vue';
import KImage from './Image.vue';

export default defineComponent({
  name: 'KGrid',
  components: { CCard, KImage },
  props: {
    kanji: {
      type: Array,
      default: () => []
    }
  },
  emits: ['selectedKanji'],
  computed: {
    rows () {
      const l: { i: number; k: SKanji[] }[] = [];
      const row = [];
      for (let i = 0; i < this.kanji.length; i++) {
        row.push(this.kanji[i] as SKanji);
        if (row.length >= 3) l.push({ i: l.length, k: row.splice(0) });
      }
      if (row.length) l.push({ i: l.length, k: row });
      return l;
    }
  }
});
</script>

<style scoped>
table {
  width: 100%;
}

td {
  text-align: center;
  font-size: 2em;
  padding: 0.4rem;
}
</style>
