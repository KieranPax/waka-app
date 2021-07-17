<script lang="ts">
/*
<r-image>
  <span v-if="!radical" />
  <span v-else-if="radical.char" lang="ja">{{ radical.char }}</span>
  <c-icon
    v-else :name="'@' + radical.img"
    class="rad-img"
  />
</r-image>
*/

import { defineComponent, h } from 'vue';
import CIcon from '../CIcon.vue';

export default defineComponent({
  name: 'RadicalImage',
  components: { CIcon },
  props: {
    radical: {
      type: Object,
      default: () => ({})
    }
  },
  render () {
    if (!this.radical) return h('r-image');
    if (this.radical.char) {
      return h('r-image', { lang: 'ja' }, this.radical.char);
    }

    return h(
      'r-image',
      { class: 'rad-img' },
      h(CIcon, { name: '@' + this.radical.img })
    );
  }
});
</script>

<style scoped>
.rad-img {
  display: inline-block;
  --icon-color: var(--c-text-color);
  --icon-scale: 1;

  fill: none;
  stroke: currentColor;
  stroke-linecap: square;
  stroke-miterlimit: 2;
  stroke-width: 80px;

  transform: translate(0, -2px);
}
</style>
