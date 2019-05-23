<template>
  <header class="xg-header">
    <div class="xg-wrap">
      <!-- logo -->
      <h1 class="xg-logo">
        <span class="icon iconfont icon-Dollar"></span>
        影票多多管理系统
      </h1>

      <div class="xg-header--right">
        <!-- menu -->
        <xg-menu></xg-menu>

        <!-- userInfo -->
        <el-dropdown
          v-if="userInfo.userName"
          class="xg-header__personal"
          @command="handleCommand"
          trigger="click">
          <span class="el-dropdown-link">
            <img v-if="userInfo.portraitUrl" class="xg-header__portrait--defined" :src="userInfo.portraitUrl" />
            <span v-else class="xg-header__portrait"></span>
            {{ userInfo.userName }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="logout">
                <span class="icon iconfont icon-logout"></span> 退出
              </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div v-else class="xg-header__personal">游客，您好！请<a @click.prevent="showLoginBox" class="xg-header__login">登录</a></div>

      </div>

    </div>
    <el-dialog
        title="修改密码"
        :visible.sync="dialogVisible"
        width="40%">
        <el-form :rules="rules" ref="form" :model="updatePasswordParams" label-width="100px">
          <el-form-item label="原密码" prop="oldPwd">
            <el-input type="password" v-model="updatePasswordParams.oldPwd"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPwd">
            <el-input type="password" v-model="updatePasswordParams.newPwd"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="repeatPwd">
            <el-input type="password" v-model="updatePasswordParams.repeatPwd"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="medium" plain @click="dialogVisible = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="updatePassword">确 定</el-button>
        </span>
      </el-dialog>
  </header>
</template>
<script>
import UsersProxy from '@/proxies/users';
import XgMenu from '@/components/common/menu';
import {
  getItem,
} from '@/utils/storage';

export default {
  name: 'Header',
  components: {
    XgMenu,
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入确认密码'));
      } else if (value !== this.updatePasswordParams.newPwd) {
        callback(new Error('两次输入的密码不正确'));
      } else {
        callback();
      }
    };
    return {
      dialogVisible: false,
      userInfo: {
        userName: getItem('username'),
      },
      updatePasswordParams: {
        oldPwd: '',
        newPwd: '',
      },
      // 表单验证
      rules: {
        oldPwd: [
          { required: true, trigger: 'blur', message: '请输入原密码' },
        ],
        newPwd: [
          { required: true, validator: this.ElementValidator.passwordCustom, trigger: 'blur' },
        ],
        repeatPwd: [
          { required: true, validator: validatePass, trigger: 'blur' },
        ],
      },
    };
  },
  computed: {
    frontSiteUrl() {
      return this.$store.state.system.systemInfo.url;
    },
    groupId() {
      return getItem('groupId');
    },
    logoFileId() {
      return this.$store.state.system.systemInfo.logoFileId;
    },
    logo() {
      return `${window.API_CONFIG['app']}/fileUpload/getDiskFileStream?groupId=${this.groupId}&fileId=${this.logoFileId}`;
    },
  },
  methods: {
    // 个人信息的下拉菜单操作
    handleCommand(command) {
      if (command === 'logout') {
        this.showLogOutDialog();
      } else if (command === 'update') {
        this.dialogVisible = true;
      }
    },
    // 显示退出弹框
    showLogOutDialog() {
      this.$confirm('确定退出登录？', '提示', {
        confirmButtonText: '退出登录',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.logout();
      }).catch(() => {
        //
      });
    },
    // 退出
    logout() {
      this.$store.dispatch('auth/logout', getItem('groupId'));
    },
    // 显示登录弹窗
    showLoginBox() {
      this.$loginBox();
    },
    // 修改密码
    async updatePassword() {
      const params = {
        ...this.updatePasswordParams,
        userId: getItem('userId'),
        username: getItem('username'),
      };
      const res = await UsersProxy.updatePassword(params);
      if (res && !res.fail) {
        this.$message.success('修改成功，请重新登录');
        setTimeout(() => {
          this.logout();
        }, 1000);
      } else {
        this.$message.error(res.retDesc);
      }
    },
  },
};
</script>
<style lang="scss">
  @import './index.scss';
</style>


