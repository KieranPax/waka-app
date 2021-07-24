<template>
  <c-card @click.stop="" class="k-details">
    <div class="details-head">
      <v-image v-bind="{ vocab }" />
      <br>
      <span class="vocab-def">{{ vocab.meanings.find(i => i.a === 3).t }}</span>
    </div>
    <div v-if="altMeanings.length" class="extra-holder">
      <ul
        v-for="m in altMeanings" :key="m"
        class="alt-meaning"
      >
        {{
          m
        }}
      </ul>
    </div>
    <div class="extra-holder">
      <mnemonic :m="vocab.mnemonics[0]" />
    </div>
    <div class="splitter" />
    <div class="extra-holder">
      <span
        v-for="r in readings"
        :key="r.r"
        class="reading"
        :class="{ 'primary-reading': r.a === 2 }"
      >
        {{ r.r }}
      </span>
    </div>
    <div class="extra-holder">
      <mnemonic :m="vocab.mnemonics[1]" />
    </div>
  </c-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CCard from '../CCard.vue';
import VImage from './Image.vue';
import Mnemonic from '../Misc/Mnemonic.vue';
import { SVocab, VReading } from '@/lib/AltTypes';

export default defineComponent({
  name: 'VDetails',
  components: { CCard, VImage, Mnemonic },
  props: {
    vocab: {
      type: Object,
      required: true
    }
  },
  data () {
    return {};
  },
  methods: {},
  computed: {
    altMeanings (): string[] {
      return (this.vocab as SVocab).meanings
        .filter(i => i.a === 2)
        .map(i => i.t);
    },
    readings (): VReading[] {
      return (this.vocab as SVocab).readings.filter(i => i.a >= 1);
    }
  }
});
</script>

<style scoped>
c-card {
  width: 15em;
  --override-card-background: var(--c-color-vocab);
  --override-card-padding: 4px;
  max-height: 60vh;
}

.details-head {
  background: var(--c-color-vocab);
  text-align: center;
  padding: 20px;
}

v-image {
  font-size: 2em;
}

.vocab-def {
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

.onyomi-reading {
  padding-right: 1em;
  padding-left: 5px;
  font-size: 1.1em;
}

.reading-type {
  display: inline-block;
  padding-left: 5px;
  width: 4ch;
  font-size: 0.7em;
}

.reading {
  padding-right: 3ch;
  padding-left: 5px;
  color: var(--c-text-fade-color);
  font-size: 0.9em;
}

.primary-reading {
  padding-right: 1.5em;
  padding-left: 5px;
  color: var(--c-text-color);
  font-size: 1.1em;
}

.splitter {
  position: relative;
  width: 96%;
  left: 2%;
  background: var(--c-tint-vocab);
  height: 2px;
  opacity: 0.4;
  margin-top: 0.5rem;
  box-shadow: var(--c-tint-vocab) 0 0 3px;
}
</style>
