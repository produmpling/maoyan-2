<template>
  <aside v-if="showLeftbar" class="xg-leftbar">
    <el-menu
      :default-active="defaultActive"
      class="xg-leftbar__menu"
      background-color="#fff"
      text-color="#303133">
      <template v-for="(item, index) in leftbar">
        <el-submenu :index="index.toString()" :key="index" v-if="item.submenus && item.submenus.length > 0">
          <template slot="title">{{item.name}}</template>
          <el-menu-item
            :index="index + '-' + idx"
            v-for="(sub, idx) in item.submenus"
            :key="index + '-' + idx">
            <!-- {{sub.name}} -->
            <router-link :to="sub.href">{{ sub.name }}</router-link>
          </el-menu-item>
        </el-submenu>
        <el-menu-item :index="index.toString()" :key="index" v-else>
          <!-- <span slot="title">{{}}</span> -->
          <router-link :to="item.href">{{ item.name }}</router-link>
        </el-menu-item>
      </template>

    </el-menu>
  </aside>
</template>
<script>
import menus from '@/constants/menus';

export default {
  name: 'leftbar',
  data() {
    return {
      // 是否显示左边菜单
      showLeftbar: false,
      leftbar: [],
      defaultActive: '',
    };
  },
  watch: {
    $route: {
      handler(val) {
        const path = val.path;
        this.init(path);
      },
      immediate: true,
    },
  },
  methods: {
    init(path) {
      const metaInfo = this.$route.meta;
      const parentMenuId = metaInfo.parentMenuId;
      this.showLeftbar = !!metaInfo.showLeftbar;
      if (this.showLeftbar) {
        this.leftbar = menus.find(i => i.id === parentMenuId).submenus;
        this.getActive(path);
      }
    },
    // 返回被点击的菜单
    getActive(path) {
      this.leftbar.forEach((item, index) => {
        if (item.href === path) {
          this.defaultActive = `${index}`;
        }
        if (item.submenus && item.submenus.length > 0) {
          item.submenus.forEach((sub, sIdx) => {
            if (sub.href === path) {
              this.defaultActive = `${index}-${sIdx}`;
            }
          });
        }
      });
    },
  },
};
</script>
<style lang="scss">
  @include b(leftbar) {
    width: 206px;
    border-right: solid 1px #eee;
    min-height: calc(100vh - 210px);
    background-color: #fff;
    &.has_bread{ // 有面包屑的时候
      min-height: calc(100vh - 250px);
    }
    .el-menu-item {
      margin-bottom: 10px;
      height: 40px;
      line-height: 40px;
    }
    @include e(menu) {
      border-right: none;
      .el-submenu {
        > .el-submenu__title,
        > .el-menu {
          border-right: 0 !important;
        }
        .el-menu-item {
          position: relative;
          padding: 0 !important;

          &:after {
            position: absolute;
            top: 0;
            right: 0px;
            content: '';
            width: 0;
            height: 40px;
            background-color: #fff;
          }
          > a {
            display: block;
            padding: 0 45px;
          }

        }
      }
      > .el-menu-item {
        // border-right: 2px solid #fff;
        position: relative;
        &:after {
          position: absolute;
          top: 0;
          right: 0px;
          content: '';
          width: 0;
          height: 40px;
          background-color: #fff;
        }
        padding: 0 !important;
        > a {
          display: block !important;
          padding-left: 28px;
          width: 206px;
          box-sizing: border-box;
        }
      }
      .el-submenu__title:hover,
      .el-menu-item:hover {
        background-color: $color-primary-light !important;
      }
      .el-menu-item.is-active {
        background-color: $color-primary-light !important;
        // border-right: 2px solid $color-primary;
        &:after {
          left: -1px;
          width: 3px;
          background-color: $color-primary;
        }
      }

      .el-submenu__title{
        height: 40px;
        line-height: 40px;
      }

    }
  }
</style>


