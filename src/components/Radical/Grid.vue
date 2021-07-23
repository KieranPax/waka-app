<template>
  <table class="r-grid">
    <tr v-for="row in rows" :key="row.i">
      <td v-for="r in row.r" :key="r.id">
        <c-card @click="()=>$emit('selectedRadical', r)">
          <r-image v-bind="{ radical: r }" />
        </c-card>
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import { SRadical } from '@/lib/AltTypes';
import { defineComponent } from 'vue';
import CCard from '../CCard.vue';
import RImage from './Image.vue';

export default defineComponent({
  name: 'RGrid',
  components: { CCard, RImage },
  props: {
    radicals: {
      type: Array,
      default: () => []
    }
  },
  emits: ['selectedRadical'],
  computed: {
    rows () {
      const l: { i: number; r: SRadical[] }[] = [];
      const row = [];
      for (let i = 0; i < this.radicals.length; i++) {
        row.push(this.radicals[i] as SRadical);
        if (row.length >= 3) l.push({ i: l.length, r: row.splice(0) });
      }
      if (row.length) l.push({ i: l.length, r: row });
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
