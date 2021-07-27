<script lang="ts">
import { QuestionInfo } from '@/lib/StudyMode';
import { defineComponent, h, VNode } from 'vue';

export default defineComponent({
  name: 'QBody',
  props: { card: { type: Object, required: true } },
  emits: ['answered'],
  render () {
    const c = this.card as QuestionInfo;
    return h('q-body', [
      this.card.body(c, () => {
        this.$forceUpdate();
        if (!c.answered) return;
        setTimeout(this.$emit, 800, 'answered', c.answered[1]);
      })
    ]);
  }
});
</script>
