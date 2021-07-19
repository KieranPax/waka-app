<template>
  <c-card @click.stop="" class="r-details">
    <div class="details-head">
      <r-image v-bind="{ radical }" class="radical-char" /><br>
      <span class="radical-name">{{ radical ? radical.name : '' }}</span>
    </div>
    <div v-if="altMeanings.length" class="extra-holder">
      <ul v-for="m in altMeanings" :key="m" class="alt-meaning">
        {{
          m
        }}
      </ul>
    </div>
    <div v-if="radical" class="extra-holder">
      <mnemonic :m="radical.mM" />
    </div>
  </c-card>
</template>

<script lang="ts">
import { Radical } from '@/ja_types';
import { defineComponent } from 'vue';
import CCard from '../CCard.vue';
import RImage from './Image.vue';
import Mnemonic from '../Misc/Mnemonic.vue';

export default defineComponent({
  name: 'RDetails',
  components: { CCard, RImage, Mnemonic },
  props: {
    radical: {
      type: Object,
      default: () => undefined
    }
  },
  computed: {
    altMeanings (): string[] {
      if (!this.radical) return [];
      return (this.radical as Radical).m
        .filter(i => i[1] === 6)
        .map(i => i[0]);
    }
  }
});
</script>

<style scoped>
c-card {
  width: 15em;
  --override-card-background: var(--c-color-radical);
  --override-card-padding: 4px;
}

.details-head {
  background: var(--c-color-radical);
  text-align: center;
  padding: 20px;
}

.radical-char {
  font-size: 5em;
}

.radical-name {
  font-size: 1em;
  text-transform: capitalize;
}

.extra-holder {
  background: var(--c-card-background);
  font-size: 0.6em;
  border-radius: 4px;
  padding: 5px;
  margin-top: 0.5rem;
  line-height: 1.5;
}

.alt-meaning {
  margin: 0;
  padding: 5px;
  color: var(--c-color-step-700);
}
</style>
