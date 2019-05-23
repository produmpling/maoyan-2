<template>
  <div
    class="xg-main banner-page"
    v-loading="isListLoading">
    <div class="main-header">
      <el-button size="medium" type="primary" @click="showDialog">添加轮播图</el-button>
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
          prop="image"
          key="image"
          label="图片">
          <template slot-scope="scope">
            <img style="height: 60px" :src="scope.row.image">
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          show-overflow-tooltip
          label="标题">
        </el-table-column>
        <el-table-column
          prop="url"
          key="url"
          label="页面路径">
        </el-table-column>
        <el-table-column
          prop="created_at"
          key="created_at"
          label="创建时间">
          <template slot-scope="scope">
            {{scope.row.created_at | transLocalTime}}
          </template>
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
                    @click.native="removeBanner(scope.row.id)">
                    <span class="icon iconfont icon-delete"></span>
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="添加轮播图" :visible.sync="dialogFormVisible">
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
            <img v-if="form.image" :src="form.image">
            <div v-else class="el-default">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或
                <em>点击上传</em>
              </div>
            </div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过2MB</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="页面路径">
          <el-input v-model="form.url" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="addBanner">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 列表为空时 -->
    <no-record v-if="showNoRecord"/>
  </div>
</template>
<script>
import CommonProxy from '@/proxies/common';
import BannersProxy from '@/proxies/banners';

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
        image: '',
        title: '',
        url: '',
        createdBy: this.$storage.getItem('username'),
      },
      dialogFormVisible: false,
      // 列表
      list: [],
      isListLoading: false,
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
    handleImageSuccess(res) {
      this.form.image = window.API_CONFIG['qiniu_download'] + res.key;
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
      this.dialogFormVisible = true;
    },
    // 获取列表
    async getBanners() {
      this.isListLoading = true;
      this.list = [];
      try {
        const res = await BannersProxy.getBanners();
        this.list = res.data;
        this.isListLoading = false;
      } catch (error) {
        this.isListLoading = false;
        this.$message.error('获取轮播列表出错!');
      }
    },
    async addBanner() {
      const res = await BannersProxy.addBanner(this.form);
      if (!res.fail) {
        this.$message.success(res.message);
        // 刷新列表
        this.getBanners();
        this.dialogFormVisible = false;
      }
    },
    async removeBanner(id) {
      const params = {
        id,
      };
      const res = await BannersProxy.removeBanner(params);
      if (!res.fail) {
        this.$message.success(res.message);
        // 刷新列表
        this.getBanners();
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
    this.getBanners();
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
