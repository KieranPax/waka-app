<script lang="ts">
/*
<v-image>
  <span v-if="!vocab" />
  <span v-else lang="ja">{{ vocab.char }}</span>
</v-image>
*/

import { defineComponent, h } from 'vue';

export default defineComponent({
  name: 'VImage',
  props: {
    vocab: {
      type: Object,
      default: () => ({})
    }
  },
  render () {
    if (!this.vocab) return h('v-image');
    return h('v-image', { lang: 'ja' }, this.vocab.char);
  }
});
</script>
