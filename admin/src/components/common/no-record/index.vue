<template>
  <div class="xg-norecord">
    <div class="xg-norecord__tips" v-if="showTips">
      <slot v-if="hasSlot('tips')" name="tips"></slot>
      <template v-else>{{ tips }}</template>
    </div>
  </div>
</template>
<script>
/**
 * 列表无记录时的显示
 * 1. 可自定义无记录时的插槽内容 slot name="tips"
 * 2. 或通过showTips(是否显示文字提示)/tips(提示文字)来控制显示
 */
import SlotMixin from '@/mixins/slot';

export default {
  name: 'NoRecord',
  props: {
    // 是否显示文字提示
    showTips: {
      type: Boolean,
      default: true,
    },
    // 无记录时的提示文字
    tips: {
      type: String,
      default: '暂无数据',
    },
  },
  mixins: [
    SlotMixin,
  ],
};
</script>
<style lang="scss">
  @import './index.scss';
</style>
