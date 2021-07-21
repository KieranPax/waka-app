<script lang="ts">
import { defineComponent, h } from 'vue';

const iconCache = new Map();

export default defineComponent({
  name: 'CIcon',
  props: {
    name: { type: String, required: true }
  },
  created () {
    (async () => {
      let f = '';

      if (this.name.startsWith(':')) {
        f = await (
          await fetch('/icons/' + this.name.substring(1) + '.svg')
        ).text();
        if (!f.startsWith('<svg')) f = '';
      } else if (this.name.startsWith('@')) {
        f = await (await fetch(this.name.substring(1))).text();
      }

      if (f) {
        this.$el.innerHTML = f;
        iconCache.set(this.name, f);
      } else console.error('invalid icon name:', this.name);
    })();
  },
  render () {
    if (iconCache.has(this.name)) { return h('c-icon', { domProps: { innerHTML: iconCache.get(this.name) } }) }
    return h('c-icon');
  }
});
</script>

<style scoped>
c-icon:deep() svg {
  color: var(--icon-color, var(--c-text-color, #f0f));
  height: calc(1em * var(--icon-scale, 1));
  position: relative;
  vertical-align: calc(-0.15em - ((var(--icon-scale, 1) - 1) * 0.5em));
}
</style>
