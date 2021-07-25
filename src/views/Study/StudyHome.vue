<template>
  <c-view>
    <c-header icon=":arrow-back" @iconClick="() => router.back()">
      Study
    </c-header>
    <c-content>
      <c-card class="settings-card">
        <template #head>
          <div class="card-head">
            Study Setup
          </div>
        </template>
        <select v-model="levelSelectionType" class="dropdown-a">
          <option value="single">
            Level [{{ levelSelection[1] }}]
          </option>
          <option value="upper">
            Up to Level [{{ levelSelection[1] }}]
          </option>
          <option value="lower">
            From Level [{{ levelSelection[1] }}]
          </option>
          <option value="between">
            Levels [{{ levelSelection[0] }}] -> [{{ levelSelection[1] }}] (
            total:
            {{ Math.max(0, levelSelection[1] - levelSelection[0]) + 1 }} )
          </option>
        </select>
        <input
          type="range"
          step="1"
          min="1"
          :max="user ? user.subscription.max_level_granted : 3"
          v-model="levelSelection[0]"
          class="slider-a"
          v-if="levelSelectionType === 'between'"
        >
        <input
          type="range"
          step="1"
          min="1"
          :max="user ? user.subscription.max_level_granted : 3"
          v-model="levelSelection[1]"
          class="slider-a"
        >
        <span
          v-if="user && user.subscription.max_level_granted < 60"
          class="free-user-warning"
        >
          Your free account has been limited to level 3 or below
        </span>
        <div class="settings-pane">
          <label class="checkbox-a">
            <input type="checkbox" v-model="settings[0]">
            <span />
            Radicals
          </label>
          <label class="checkbox-a checkbox-kanji">
            <input type="checkbox" v-model="settings[1]">
            <span />
            Kanji
          </label>
          <label class="checkbox-a checkbox-vocab">
            <input type="checkbox" v-model="settings[2]">
            <span />
            Vocab
          </label>
        </div>
        <div class="settings-pane checkbox-neutral">
          <label class="checkbox-a">
            <input type="checkbox" v-model="settings[3]">
            <span />
            Readings
          </label>
          <label class="checkbox-a checkbox-neutral">
            <input type="checkbox" v-model="settings[4]">
            <span />
            Meanings
          </label>
        </div>
        <button class="submit-button" @click="submit">
          Start
        </button>
      </c-card>
    </c-content>
  </c-view>
</template>
<script lang="ts">
import { defineComponent, ref, Ref } from 'vue';
import { CView, CHeader, CContent, CCard } from '@/components';
import { WKUser } from '@/lib/WKAPI';
import { GetUser } from '@/lib/Local';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'SHome',
  components: { CView, CHeader, CContent, CCard },
  data () {
    const user: Ref<null | WKUser> = ref(null);
    const router = useRouter();
    return {
      levelSelectionType: 'single',
      levelSelection: [1, 1],
      user,
      settings: new Array(5).fill(true),
      router
    };
  },
  created () {
    GetUser().then(user => {
      this.user = user;
      // this.user.subscription.max_level_granted = 60; // for testing purposes
      this.levelSelection[1] = user.level;
    });
  },
  methods: {
    submit () {
      if(!this.user) return;
      const s = this.settings;
      if (!(s[0] || s[1] || s[2])) return;
      if (!(s[1] || s[2])) s[3] = false;
      switch(this.levelSelectionType){
        case 'single': this.levelSelection[0] = this.levelSelection[1]; break;
        case 'upper': this.levelSelection[0] = 1; break;
        case 'lower': this.levelSelection = [this.levelSelection[1], this.user.subscription.max_level_granted]; break;
        default: break;
      }
      this.router.push(
        '/study/' +
          this.levelSelection +
          ',' +
          [...s.entries()].filter(i => i[1]).map(i => i[0])
      );
    }
  }
});
</script>

<style scoped>
.c-header {
  --header-icon-color: var(--c-color-navy);
}

.settings-card {
  width: 100%;
}

.card-head {
  background: var(--c-color-navy);
  text-align: center;
  padding: 0.5em;
}

.dropdown-a {
  font-size: 0.9em;
  border: 1px solid var(--c-border-color);
  background: var(--c-color-step-150);
  color: var(--c-text-color);
  border-radius: 0.2em;
  padding: 0.2em;
  width: 100%;
  box-shadow: rgba(0, 0, 0, 0.2) 1px 1px 4px;
  margin-top: 0.2em;
}

.slider-a {
  font-size: 1em;
  width: 100%;
  height: 2em;
  -webkit-appearance: none;
  background: none;
  margin-top: 0.2em;
}

.slider-a:focus {
  outline: none;
}

.slider-a::-webkit-slider-runnable-track {
  width: 100%;
  height: 14px;
  box-shadow: rgba(0, 0, 0, 0.2) 1px 1px 4px;
  background: var(--c-color-step-150);
  border-radius: 14px;
  border: none;
}

.slider-a::-webkit-slider-thumb {
  box-shadow: 0px 0px 0px #000000;
  border: 0px solid #000000;
  height: 25px;
  width: 40px;
  border-radius: 10px;
  background: var(--c-color-navy);
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -5.5px;
}

.free-user-warning {
  display: inline-block;
  background: var(--c-color-bad);
  border: 1px solid var(--c-tint-bad);
  padding: 0.4em;
  border-radius: 0.2em;
}

.settings-pane {
  margin-top: 0.4em;
  width: 50%;
  display: inline-block;
  vertical-align: top;
}

.checkbox-a {
  display: inline-block;
  position: relative;
  padding-left: 3.5ch;
  padding-bottom: 0.5em;
  cursor: pointer;
  user-select: none;
}

.checkbox-a input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkbox-a span {
  position: absolute;
  top: 0.15em;
  left: 0;
  height: 1em;
  width: 1em;
  background: var(--c-text-fade-color);
  border: 1px solid var(--c-text-dim-color);
  border-radius: 0.2em;
}

.checkbox-a input:checked ~ span {
  background: var(--c-color-radical);
  border: 1px solid var(--c-tint-radical);
}

.checkbox-kanji input:checked ~ span {
  background: var(--c-color-kanji);
  border: 1px solid var(--c-tint-kanji);
}

.checkbox-vocab input:checked ~ span {
  background: var(--c-color-vocab);
  border: 1px solid var(--c-tint-vocab);
}

.checkbox-neutral input:checked ~ span {
  background: var(--c-color-navy);
  border: 1px solid var(--c-tint-navy);
}

.submit-button {
  margin-top: 1em;
  font-size: 1em;
  width: 100%;
  background: var(--c-color-good);
  border: 1px solid var(--c-tint-good);
  color: var(--c-text-color);
  padding: 0.5em;
  border-radius: 5px;
}
</style>
