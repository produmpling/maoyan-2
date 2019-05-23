<template>
  <div
    v-show="showBreadcrumb"
    class="xg-wrap">
    <el-breadcrumb
      class="xg-breadcrumb"
      separator="/">
      <el-breadcrumb-item
        v-for="(item, index) in list"
        :key="index"
        :to="{ name: item.name }">{{ item.menuName }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<script>
export default {
  name: 'breadcrumb',
  data() {
    return {
      list: [],
      showBreadcrumb: true,
    };
  },
  watch: {
    $route: {
      handler() {
        this.init();
      },
      immediate: true,
    },
  },
  methods: {
    init() {
      const rList = this.$route.matched;
      const menuNames = rList.map(i => i.meta.menuName);
      const optItems = menuNames[menuNames.length - 1].split('/');
      const list = [];
      let curItem;

      // 是否显示面包屑
      const showBreadcrumb = this.$route.meta.showBreadcrumb;
      if (showBreadcrumb === false) {
        this.showBreadcrumb = showBreadcrumb;
      } else {
        this.showBreadcrumb = true;
      }

      for (let i = 0, rLen = rList.length; i < rLen; i++) {
        curItem = rList[i];
        if (i === rLen - 1 && optItems.length > 1) {
          list.push({
            name: curItem.meta.parentName,
            menuName: optItems[0],
          });
          list.push({
            menuName: optItems[1],
          });
        } else {
          list.push({
            name: curItem.name,
            menuName: curItem.meta.menuName,
          });
        }
      }
      this.list = list;
    },
  },
  mounted() {
  },
};
</script>
<style lang="scss">
@include b(breadcrumb) {
  padding: 14px 0;
  font-size: .7rem;
}
</style>


