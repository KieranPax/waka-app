<script lang="ts">
import { defineComponent, h, VNode } from 'vue';

export default defineComponent({
  name: 'QTitle',
  props: { card: { type: Object, required: true } },
  render () {
    return h('q-title', [this.card.title as VNode]);
  }
});
</script>
