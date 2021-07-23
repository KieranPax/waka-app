<script lang="ts">
import { defineComponent, h } from 'vue';

export default defineComponent({
  name: 'Mnemonic',
  props: { m: { type: String, default: '' } },
  render () {
    const l = this.m.split(/<([^>]*)>/g).filter(s => !s.startsWith('/'));
    const c = [];
    for (let i = 0; i < l.length;) {
      c.push(l[i++]);
      if (i + 1 < l.length) {
        c.push(h(l[i++], [l[i++]]));
      }
    }
    return h('mnemonic', c);
  }
});
</script>

<style scoped>
radical,
kanji,
vocab,
meaning,
reading {
  padding: 0.05rem;
  border-radius: 4px;
  margin: 0 0.1rem;
}
radical {
  background: var(--c-color-radical);
  box-shadow: var(--c-tint-radical) 1px 1px 2px;
}
kanji {
  background: var(--c-color-kanji);
  box-shadow: var(--c-tint-kanji) 1px 1px 2px;
}
vocab {
  background: var(--c-color-vocab);
  box-shadow: var(--c-tint-vocab) 1px 1px 2px;
}
meaning,
reading {
  background: var(--c-color-medium);
  box-shadow: var(--c-text-color) 1px 1px 2px;
}
</style>
