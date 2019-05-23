<template>
  <div>
    <div class="xg-img-layer" @click="zoomOut">
      <img :src="currentImg" alt="" />
      <div class="xg-img-layer__close" @click="zoomOut">
        <span class="icon iconfont icon-close-circle"></span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: [
    'currentImg',
    'show',
  ],
  methods: {
    zoomOut() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss">
@include b(img-layer) {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background:rgba(0, 0, 0, 0.5);
  z-index: 99;

  img {
    position: absolute;
    left: 50%;
    top: 50%;
    cursor: zoom-out;
    transform: translate(-50%, -50%);
  }

  @include e(close) {
    position: absolute;
    right: 10px;
    top: 10px;
    width: 18px;
    height: 18px;
    line-height: 18px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    color: #ccc;
    text-align: center;
    cursor: pointer;
    &:hover {
      background: rgba(0, 0, 0, 0.8);
      color: #fff;
    }
    i {
      display: block;
      transform: scale(.5);
    }
  }
}
</style>
