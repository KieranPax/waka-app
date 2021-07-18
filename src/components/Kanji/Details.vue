<template>
  <c-card @click.stop="" class="k-details">
    <div class="details-head">
      <k-image v-bind="{ kanji }" class="kanji-char" /><br>
      <span class="kanji-name">{{ kanji ? kanji.name : '' }}</span>
    </div>
    <div v-if="altMeanings.length" class="extra-holder">
      <ul v-for="m in altMeanings" :key="m">
        {{
          m
        }}
      </ul>
    </div>
    <div v-if="kanji" class="extra-holder">
      <mnemonic :m="kanji.mM" />
    </div>
    <div class="splitter" />
    <div v-if="readings[0]" class="extra-holder">
      <span
        v-for="r in readings[1]" :key="r"
        class="onyomi-reading"
      >
        {{ r }}
      </span>
      <br>
      <span
        v-for="r in readings[2]" :key="r"
        class="kunyomi-reading"
      >
        {{ r }}
      </span>
    </div>
    <div v-if="kanji" class="extra-holder">
      <mnemonic :m="kanji.rM" />
    </div>
  </c-card>
</template>

<script lang="ts">
import { Kanji, KReading } from '@/ja_types';
import { defineComponent } from 'vue';
import CCard from '../CCard.vue';
import KImage from './Image.vue';
import Mnemonic from '../Misc/Mnemonic.vue';

export default defineComponent({
  name: 'KDetails',
  components: { CCard, KImage, Mnemonic },
  props: {
    kanji: {
      type: Object,
      default: () => undefined
    }
  },
  computed: {
    altMeanings (): string[] {
      if (!this.kanji) return [];
      return (this.kanji as Kanji).m
        .filter(i => !(i[1] & 1) && i[1] & 2)
        .map(i => i[0]);
    },
    readings (): [boolean, string[], string[]] {
      if (!this.kanji) return [false, [], []];
      return [
        true,
        this.kanji.r
          .filter((i: KReading) => i[1] === 'o')
          .map((i: KReading) => i[0]),
        this.kanji.r
          .filter((i: KReading) => i[1] === 'k')
          .map((i: KReading) => i[0])
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
}

.details-head {
  background: var(--c-color-kanji);
  text-align: center;
  padding: 20px;
}

.kanji-char {
  font-size: 5em;
}

.kanji-name {
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

ul {
  margin: 0;
  padding: 5px;
}

.onyomi-reading {
  padding-right: 10px;
  padding-left: 5px;
  font-size: 1.1em;
}

.kunyomi-reading {
  padding-right: 10px;
  padding-left: 5px;
  color: var(--c-color-step-700);
  font-size: 0.9em;
}
.splitter {
  position: relative;
  width: 96%;
  left: 2%;
  background: var(--c-tint-kanji);
  height: 1px;
  opacity: 0.4;
  margin-top: 0.5rem;
}
</style>
