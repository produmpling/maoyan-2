<template>
  <div
    class="xg-main banner-page"
    v-loading="isListLoading">
    <div class="main-header">
      <el-button size="medium" type="primary" @click="showDialog">添加影片</el-button>
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
          prop="id"
          width="50px"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="cover"
          key="image"
          label="封面">
          <template slot-scope="scope">
            <img style="height: 60px" :src="scope.row.cover">
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          show-overflow-tooltip
          label="片名">
        </el-table-column>
        <el-table-column
          prop="summary"
          show-overflow-tooltip
          label="摘要">
        </el-table-column>
        <el-table-column
          prop="types"
          show-overflow-tooltip
          label="类别">
        </el-table-column>
        <el-table-column
          prop="rating"
          show-overflow-tooltip
          label="评分">
        </el-table-column>
        <el-table-column
          prop="duration"
          show-overflow-tooltip
          label="时长">
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
                    @click.native="showUploadStillDialog(scope.row.id)">
                    <span class="icon iconfont icon-image"></span>
                    上传剧照
                  </el-dropdown-item>
                  <el-dropdown-item
                    class="xg-popover-list__item"
                    @click.native="removeMovie(scope.row.id)">
                    <span class="icon iconfont icon-delete"></span>
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="添加剧照" :visible.sync="uploadStillDialogVisible">
      <el-form :model="stillForm" style="max-width:500px" label-width="120px">
        <el-form-item label="剧照">
          <el-upload
            drag
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleStillImageSuccess"
            :on-error="handleError"
            :before-upload="beforeImageUpload"
            :data="qiniuData">
            <img v-if="stillForm.image" :src="stillForm.image">
            <div v-else class="el-default">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或
                <em>点击上传</em>
              </div>
            </div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过2MB</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="uploadStillDialogVisible = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="addStill">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加影片" :visible.sync="dialogFormVisible">
      <el-form :model="form" style="max-width:500px" label-width="120px">
        <el-form-item label="封面">
          <el-upload
            drag
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleImageSuccess"
            :on-error="handleError"
            :before-upload="beforeImageUpload"
            :data="qiniuData">
            <img v-if="form.cover" :src="form.cover">
            <div v-else class="el-default">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或
                <em>点击上传</em>
              </div>
            </div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过2MB</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="中文片名">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="英文片名">
          <el-input v-model="form.en_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="类别">
          <el-input v-model="form.types" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="评分">
          <el-input v-model="form.rating" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="摘要">
          <el-input v-model="form.summary" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="介绍">
          <el-input v-model="form.description" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="时长">
          <el-input type="number" min="0" v-model="form.duration" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="主演">
          <el-input v-model="form.actors" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.onsale">
            <el-radio :label="0">未上映</el-radio>
            <el-radio :label="1">已上映</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="addMovie">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 列表为空时 -->
    <no-record v-if="showNoRecord"/>
  </div>
</template>
<script>
import CommonProxy from '@/proxies/common';
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
        cover: '',
        name: '',
      },
      dialogFormVisible: false,
      // 列表
      list: [],
      isListLoading: false,
      uploadStillDialogVisible: false,
      stillForm: {
        movie_id: '',
        image: '',
      },
      activeMovieId: null,
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
    showUploadStillDialog(id) {
      this.uploadStillDialogVisible = true;
      this.activeMovieId = id;
    },
    handleImageSuccess(res) {
      this.form.cover = window.API_CONFIG['qiniu_download'] + res.key;
    },
    handleStillImageSuccess(res) {
      this.stillForm.image = window.API_CONFIG['qiniu_download'] + res.key;
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
    async getMovies() {
      this.isListLoading = true;
      this.list = [];
      try {
        const res = await MovieProxy.getMovies();
        this.list = res.data;
        this.isListLoading = false;
      } catch (error) {
        this.isListLoading = false;
        this.$message.error('获取影片列表出错!');
      }
    },
    async addMovie() {
      const res = await MovieProxy.addMovie(this.form);
      if (!res.fail) {
        this.$message.success(res.message);
        // 刷新列表
        this.getMovies();
        this.dialogFormVisible = false;
      }
    },
    async removeMovie(id) {
      const params = {
        id,
      };
      const res = await MovieProxy.removeMovie(params);
      if (!res.fail) {
        this.$message.success(res.message);
        // 刷新列表
        this.getMovies();
        this.dialogFormVisible = false;
      }
    },
    async getQiniuToken() {
      const res = await CommonProxy.getQiniuUploadToken();
      if (res.success) {
        this.qiniuData.token = res.data.uptoken;
      }
    },
    async addStill() {
      const params = {
        ...this.stillForm,
        movie_id: this.activeMovieId,
      };
      const res = await MovieProxy.addStill(params);
      if (res.success) {
        this.$message.success(res.message);
        this.stillForm.image = '';
      }
    },
  },
  created() {
    this.getQiniuToken();
    this.getMovies();
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
