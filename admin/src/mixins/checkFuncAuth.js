/* ============
 * 判断功能权限 Mixin
 * ============
 */
import menus from '@/constants/menus';

export default {
  methods: {
    checkFuncAuth(funcName) {
      const authRoleTypeForFunction = menus.find(c => c.href === this.$route.matched[0].path)
      .authRoleTypeForFunction;
      const role = this.$storage.getItem('role');
      return authRoleTypeForFunction[role].indexOf(funcName) > -1;
    },
  },
};
