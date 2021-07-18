<script lang="ts">
/*
<k-image>
  <span v-if="!kanji" />
  <span v-else lang="ja">{{ kanji.char }}</span>
</k-image>
*/

import { defineComponent, h } from 'vue';

export default defineComponent({
  name: 'KImage',
  props: {
    kanji: {
      type: Object,
      default: () => ({})
    }
  },
  render () {
    if (!this.kanji) return h('k-image');
    return h('k-image', { lang: 'ja' }, this.kanji.char);
  }
});
</script>
