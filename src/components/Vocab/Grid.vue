<template>
  <table class="v-grid">
    <tr v-for="row in rows" :key="row.i">
      <td v-for="v in row.r" :key="v.id">
        <c-card @click="()=>$emit('selectedVocab', v)">
          <v-image v-bind="{ vocab: v }" />
        </c-card>
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import { SVocab } from '@/lib/AltTypes';
import { defineComponent } from 'vue';
import CCard from '../CCard.vue';
import VImage from './Image.vue';

export default defineComponent({
  name: 'VGrid',
  components: { CCard, VImage },
  props: {
    vocabs: {
      type: Array,
      default: () => []
    }
  },
  emits: ['selectedVocab'],
  computed: {
    rows () {
      const l: { i: number; r: SVocab[] }[] = [];
      const row = [];
      for (let i = 0; i < this.vocabs.length; i++) {
        row.push(this.vocabs[i] as SVocab);
        if (row.length >= 2) l.push({ i: l.length, r: row.splice(0) });
      }
      if (row.length) l.push({ i: l.length, r: row });
      console.log(l);
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
  font-size: 1em;
  padding: 0.2rem;
  width: 50%;
}

c-card{
  --override-card-padding: 0.3rem 0;
}
</style>
