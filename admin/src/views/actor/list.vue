<template>
  <div
    class="xg-main banner-page"
    v-loading="isListLoading">
    <div class="main-header">
      <el-button size="medium" type="primary" @click="showDialog">添加演员</el-button>
    </div>
    <div
      v-show="list.length > 0"
      class="xg-user__list">
      <el-table
        ref="userTable"
        style="width:1200px;"
        :data="list"
        header-row-class-name="u-table-tit">
        <el-table-column
          prop="actor_id"
          width="50px"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="avatar"
          key="avatar"
          label="头像">
          <template slot-scope="scope">
            <img style="height: 60px" :src="scope.row.avatar">
          </template>
        </el-table-column>
        <el-table-column
          prop="actor_name"
          show-overflow-tooltip
          label="名字">
        </el-table-column>
        <el-table-column
          prop="movie_name"
          key="movie_name"
          label="电影">
        </el-table-column>
        <el-table-column
          prop="role"
          key="role"
          label="角色">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
              <el-dropdown
                trigger="click"
                placement="bottom">
                <span class="el-dropdown-link">
                  <span class="icon iconfont icon-ellipsis"></span>
                </span>
                <el-dropdown-menu
                  slot="dropdown"
                  class="xg-popover-list">
                  <el-dropdown-item
                    class="xg-popover-list__item"
                    @click.native="removeActor(scope.row.actor_id)">
                    <span class="icon iconfont icon-delete"></span>
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="添加演员" :visible.sync="dialogFormVisible">
      <el-form :model="form" style="max-width:500px" label-width="120px">
        <el-form-item label="图片">
          <el-upload
            drag
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleImageSuccess"
            :on-error="handleError"
            :before-upload="beforeImageUpload"
            :data="qiniuData">
            <img v-if="form.avatar" :src="form.avatar">
            <div v-else class="el-default">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或
                <em>点击上传</em>
              </div>
            </div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过2MB</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="影片">
          <el-select v-model="form.movie_id" placeholder="请选择">
            <el-option
              v-for="item in movies"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名字">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-input v-model="form.role" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="addActor">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 列表为空时 -->
    <no-record v-if="showNoRecord"/>
  </div>
</template>
<script>
import CommonProxy from '@/proxies/common';
import ActorProxy from '@/proxies/actor';
import MovieProxy from '@/proxies/movie';

export default {
  name: 'banner-list',
  data() {
    return {
      qiniuData: {
        token: '',
      },
      // 七牛云上传储存区域的上传域名（华东、华北、华南、北美、东南亚）
      uploadUrl: window.API_CONFIG['qiniu_upload'],
      form: {
        avatar: '',
        name: '',
        movie_id: null,
        role: '',
      },
      dialogFormVisible: false,
      // 列表
      list: [],
      isListLoading: false,
      movies: [],
    };
  },
  computed: {
    showNoRecord() {
      // 列表为空，且不是正在加载中
      return this.list.length < 1 && !this.isListLoading;
    },
    handleBy() {
      return localStorage.getItem('username');
    },
  },
  methods: {
    async getMovies() {
      this.movies = [];
      try {
        const res = await MovieProxy.getMovies();
        this.movies = res.data;
      } catch (error) {
        this.$message.error('获取影片列表出错!');
      }
    },
    handleImageSuccess(res) {
      this.form.avatar = window.API_CONFIG['qiniu_download'] + res.key;
    },
    handleError() {
      this.$message({
        showClose: true,
        message: '上传失败',
        duration: 2000,
        type: 'warning',
      });
    },
    beforeImageUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
      let result = true;
      if (!isJPG && !isPNG) {
        this.$message.error('图片只能是 JPG/PNG 格式!');
        result = false;
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 2M!');
        result = false;
      }
      return result;
    },
    showDialog() {
      this.getMovies();
      this.dialogFormVisible = true;
    },
    // 获取列表
    async getActors() {
      this.isListLoading = true;
      this.list = [];
      try {
        const res = await ActorProxy.getActors();
        this.list = res.data;
        this.isListLoading = false;
      } catch (error) {
        this.isListLoading = false;
        this.$message.error('获取演员列表出错!');
      }
    },
    async addActor() {
      const res = await ActorProxy.addActor(this.form);
      if (!res.fail) {
        this.$message.success(res.message);
        // 刷新列表
        this.getActors();
        this.dialogFormVisible = false;
      }
    },
    async removeActor(id) {
      const params = {
        id,
      };
      const res = await ActorProxy.removeActor(params);
      if (!res.fail) {
        this.$message.success(res.message);
        // 刷新列表
        this.getActors();
        this.dialogFormVisible = false;
      }
    },
    async getQiniuToken() {
      const res = await CommonProxy.getQiniuUploadToken();
      if (res.success) {
        this.qiniuData.token = res.data.uptoken;
      }
    },
  },
  created() {
    this.getQiniuToken();
    this.getActors();
  },
};
</script>
<style lang="scss">
.banner-page {
  .main-header {
    margin: 20px;
  }
  .el-upload-dragger {
    img {
      max-height: 180px;
    }
  }
}
</style>
