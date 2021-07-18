<script lang="ts">
import { defineComponent, h, RendererNode } from 'vue';
import { bind as WKBind } from 'wanakana';

export default defineComponent({
  render () {
    const o = h('kana-inp', [h('input')]);
    setTimeout(() => {
      WKBind((o.el as HTMLElement).children[0] as HTMLInputElement);
    }, 50);
    return o;
  }
});
</script>

<style scoped>
kana-inp input {
  padding: 10px;
  font-size: 1em;
  border-radius: 5px;
  border: 2px solid var(--c-border-color);
}
</style>
