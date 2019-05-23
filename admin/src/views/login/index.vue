<template>
  <xg-layout class="xg-layout">
    <form class="xg-login__form">
      <h2 class="xg-form__title">
          影票多多后台管理
      </h2>
      <div class="xg-form__item">
          <el-input
            placeholder="请输入用户名"
            v-model="form.username">
          </el-input>
      </div>
      <div class="xg-form__item">
          <el-input
            type="password"
            placeholder="请输入密码"
            v-model="form.password">
          </el-input>
      </div>
      <div class="xg-form__group">
          <label class="xg-checkbox" :class="isRemember ? 'active': ''" @click="rememberUser(isRemember = !isRemember)">
              <el-checkbox v-model="isRemember">记住账号</el-checkbox>
          </label>
      </div>
      <div class="xg-form__item">
          <el-button type="primary" @click.prevent.stop="login(form)" :disabled="!isPassValidate" :loading="isLoading">登录</el-button>
      </div>
    </form>
  </xg-layout>
</template>

<script>
/**
 * 登录页
*/
import XgLayout from '@/components/common/layouts/minimal';
import AuthProxy from '@/proxies/auth';

export default {

  name: 'login-index',
  data() {
    return {
      isRemember: false,
      isLoading: false,
      form: {
        username: null,
        password: null,
      },
      ruleForm: {
        userId: '',
        oldPwd: '',
        newPwd: '',
        checkPass: '',
      },
      rules: {
      },
    };
  },
  computed: {
    // 是否通过验证
    isPassValidate() {
      return this.form.username && this.form.password;
    },
    groupId() {
      return this.$route.params.groupId;
    },
    logoFileId() {
      return this.$store.state.system.systemInfo.logoFileId;
    },
    logo() {
      return `${window.API_CONFIG['app']}/fileUpload/getDiskFileStream?groupId=${this.groupId}&fileId=${this.logoFileId}`;
    },
  },
  methods: {
    /**
     * 登录
     *
     * @param {Object} form 用户登录信息
     */
    async login(form) {
      this.isLoading = true;
      this.rememberUser(this.isRemember);
      const params = {
        ...form,
      };
      const res = await AuthProxy.login(params);
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
      if (!res.fail) {
        this.$store.dispatch('auth/login', res.data);
      } else {
        this.$message.error('账号或密码错误');
      }
    },
    // 记住账号
    rememberUser(isRemember) {
      if (isRemember) {
        localStorage.setItem('username', this.form.username);
      } else {
        localStorage.removeItem('username');
      }
    },
  },
  mounted() {
    const username = localStorage.getItem('username') || '';
    if (username && username !== 'null') {
      this.form.username = username;
      this.isRemember = true;
    }
  },
  components: {
    XgLayout,
  },
};
</script>

<style lang="scss" scoped>
@include b(layout) {
  background-color: $color-primary-light;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  min-height: 100vh;
}
@include b(login) {
    @include e(form) {
      width: 360px;
      box-sizing: border-box;
      background-color: #fff;
      box-shadow: 0 15px 35px rgba(0,0,0, .1);
      border-radius: 5px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
}

@include b(form) {
    float: left;
    width: 650px;
    box-sizing: border-box;
    @include e(title) {
        height:23px;
        font-size:24px;
        font-weight: normal;
        color:#333;
        line-height:22px;
        text-align: center;
        margin: 30px 0;
        img {
          height: 35px;
          margin-left: 90px;
        }
    }
    @include e(item) {
        position: relative;
        width: 280px;
        height: 48px;
        margin: 16px auto;
        box-sizing: border-box;
        button {
          width: 100%;
          height: 40px;
          border-radius:3px;
          outline: none;
          cursor: pointer;
        }
    }
    @include e(group) {
        position: relative;
        width: 280px;
        height: 40px;
        margin: 16px auto;
        box-sizing: border-box;
    }
}

@include b(checkbox) {
    font-size: 14px;
    color: #333;
    cursor: pointer;
}
</style>
