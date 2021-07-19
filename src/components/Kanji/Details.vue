<template>
  <c-card @click.stop="" class="k-details">
    <div class="details-head">
      <k-image
        v-if="!showRadicals"
        v-bind="{ kanji }"
        @click="toggleRadicals"
      />
      <div
        v-else-if="radicals.length"
        class="radical-holder"
        @click="toggleRadicals"
      >
          <r-image
            v-for="radical in radicals"
            :key="radical.id"
            v-bind="{ radical }"
          />
      </div>
      <br>
      <span class="kanji-name">{{ kanji ? kanji.name : '' }}</span>
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
import { Kanji, KReading, Radical } from '@/ja_types';
import { defineComponent } from 'vue';
import CCard from '../CCard.vue';
import KImage from './Image.vue';
import RImage from '../Radical/Image.vue';
import Mnemonic from '../Misc/Mnemonic.vue';
import { GetRadicalStore } from '@/store_lib';

export default defineComponent({
  name: 'KDetails',
  components: { CCard, KImage, RImage, Mnemonic },
  props: {
    kanji: {
      type: Object,
      default: () => undefined
    }
  },
  data () {
    return { radicals: [] as Radical[], showRadicals: false };
  },
  methods: {
    updateKanji () {
      this.showRadicals = false;
      this.radicals = [];
    },
    toggleRadicals () {
      this.showRadicals = !this.showRadicals;
      if (!this.radicals.length) {
        GetRadicalStore().then(async store => {
          if (this.kanji) this.radicals = await store.byID(this.kanji.comp);
          else this.radicals = [];
        });
      }
    }
  },
  computed: {
    altMeanings (): string[] {
      if (!this.kanji) return [];
      return (this.kanji as Kanji).m.filter(i => i[1] === 6).map(i => i[0]);
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
  overflow-y: scroll;
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
