<template>
  <c-card @click.stop="" class="k-details">
    <div class="details-head">
      <k-image
        v-if="!showRadicals || radicals.length <= 1"
        v-bind="{ kanji }"
        @click="toggleRadicals"
      />
      <div
        v-else
        class="radical-holder"
        :style="{ 'line-height': radicals.length <= 3 ? '2em' : '' }"
        @click="toggleRadicals"
      >
        <r-image
          v-for="radical in radicals"
          :key="radical.id"
          :style="{ 'font-size': radicals.length <= 2 ? '1.2em' : '' }"
          v-bind="{ radical }"
        />
      </div>
      <br>
      <span class="kanji-name">{{ kanji.meanings.find(i => i.a === 3).t }}</span>
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
      <mnemonic :m="kanji.mnemonics[0]" />
    </div>
    <div class="splitter" />
    <div class="extra-holder">
      <span class="reading-type">On:</span>
      <span
        v-for="r in readings[0]"
        :key="r.r"
        class="reading"
        :class="{ 'primary-reading': r.a === 2 }"
      >
        {{ r.r }}
      </span>
      <br>
      <span class="reading-type">Kun:</span>
      <span
        v-for="r in readings[1]"
        :key="r.r"
        class="reading"
        :class="{ 'primary-reading': r.a === 2 }"
      >
        {{ r.r }}
      </span>
    </div>
    <div class="extra-holder">
      <mnemonic :m="kanji.mnemonics[1]" />
    </div>
  </c-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CCard from '../CCard.vue';
import KImage from './Image.vue';
import RImage from '../Radical/Image.vue';
import Mnemonic from '../Misc/Mnemonic.vue';
import { SKanji, SRadical, KReading } from '@/lib/AltTypes';

export default defineComponent({
  name: 'KDetails',
  components: { CCard, KImage, RImage, Mnemonic },
  props: {
    kanji: {
      type: Object,
      required: true
    },
    radicalLookup: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return { showRadicals: false };
  },
  methods: {
    toggleRadicals () {
      this.showRadicals = !this.showRadicals;
    }
  },
  computed: {
    altMeanings (): string[] {
      return (this.kanji as SKanji).meanings
        .filter(i => i.a === 2)
        .map(i => i.t);
    },
    radicals (): SRadical[] {
      if (!this.radicalLookup.length) return [];
      return (this.radicalLookup as SRadical[]).filter(i =>
        (this.kanji as SKanji).comp.includes(i.id)
      );
    },
    readings (): KReading[][] {
      return [
        (this.kanji as SKanji).readings.filter(i => i.t === 'o'),
        (this.kanji as SKanji).readings.filter(i => i.t === 'k')
      ];
    }
  }
});
</script>

<style scoped>
c-card {
  width: 15em;
  --override-card-background: var(--c-color-kanji);
  --override-card-padding: 4px;
  max-height: 60vh;
}

.details-head {
  background: var(--c-color-kanji);
  text-align: center;
  padding: 20px;
}

k-image {
  font-size: 5em;
}

.kanji-name {
  font-size: 1em;
  text-transform: capitalize;
}

.radical-holder {
  display: inline-block;
  font-size: 2.9em;
  min-height: 2.5em;
  line-height: 1em;
  width: 100%;
}

r-image {
  margin: 0 0.4em;
  font-size: 0.7em;
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
  background: var(--c-tint-kanji);
  height: 2px;
  opacity: 0.4;
  margin-top: 0.5rem;
  box-shadow: var(--c-tint-kanji) 0 0 3px;
}
</style>
