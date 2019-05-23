<template>
  <div>
    <xg-header></xg-header>

    <xg-breadcrumb></xg-breadcrumb>

    <el-container class="xg-wrap">
      <xg-leftbar></xg-leftbar>

      <router-view></router-view>
    </el-container>
  </div>
</template>

<script>
/* ============
  * Default Layout
  * ============
  */
import XgHeader from '@/components/common/header';
import XgBreadcrumb from '@/components/common/breadcrumb';
import XgLeftbar from '@/components/common/leftbar';

export default {
  name: 'default-layout',

  components: {
    XgHeader,
    XgBreadcrumb,
    XgLeftbar,
  },

  data() {
    return {
      activeIndex: '1',
      menuCollapsed: false,
    };
  },

  methods: {
    logout() {
      this.$store.dispatch('auth/logout');
    },
  },
};
</script>
