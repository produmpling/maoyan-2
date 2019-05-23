<template>
  <div
    class="xg-main banner-page"
    v-loading="isListLoading">
    <div
      v-show="list.length > 0"
      class="xg-user__list">
      <el-table
        ref="userTable"
        style="width:1200px;"
        :data="list"
        header-row-class-name="u-table-tit">
        <el-table-column
          prop="comment_id"
          width="50px"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="name"
          show-overflow-tooltip
          label="影片">
        </el-table-column>
        <el-table-column
          prop="content"
          show-overflow-tooltip
          label="评论内容">
        </el-table-column>
        <el-table-column
          prop="rating"
          show-overflow-tooltip
          label="评分">
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
                    @click.native="removeComment(scope.row.comment_id)">
                    <span class="icon iconfont icon-delete"></span>
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 列表为空时 -->
    <no-record v-if="showNoRecord"/>
  </div>
</template>
<script>
import CommentProxy from '@/proxies/comment';

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
        name: '',
        city: '',
        location: '',
        labels: '',
        min_price: 0,
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
    // 获取列表
    async getComments() {
      this.isListLoading = true;
      this.list = [];
      try {
        const res = await CommentProxy.getComments();
        this.list = res.data;
        this.isListLoading = false;
      } catch (error) {
        this.isListLoading = false;
        this.$message.error('获取影评列表出错!');
      }
    },
    async removeComment(id) {
      const params = {
        id,
      };
      const res = await CommentProxy.removeComment(params);
      if (!res.fail) {
        this.$message.success(res.message);
        // 刷新列表
        this.getComments();
        this.dialogFormVisible = false;
      }
    },
  },
  created() {
    this.getComments();
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
