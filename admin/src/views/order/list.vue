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
          prop="id"
          width="50px"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="theater_name"
          show-overflow-tooltip
          label="影院">
        </el-table-column>
        <el-table-column
          prop="movie_name"
          show-overflow-tooltip
          label="影片">
        </el-table-column>
        <el-table-column
          prop="user_id"
          show-overflow-tooltip
          label="用户ID">
        </el-table-column>
        <el-table-column
          prop="price"
          show-overflow-tooltip
          label="票价">
        </el-table-column>
        <el-table-column
          prop="date"
          show-overflow-tooltip
          label="日期">
        </el-table-column>
        <el-table-column
          prop="start_time"
          show-overflow-tooltip
          label="开播时间">
        </el-table-column>
        <el-table-column
          prop="room"
          show-overflow-tooltip
          label="影厅">
        </el-table-column>
        <el-table-column
          prop="seats"
          show-overflow-tooltip
          label="座位">
        </el-table-column>
        <el-table-column
          prop="status"
          show-overflow-tooltip
          label="状态">
          <template slot-scope="scope">
            <el-tag size="small" type="warning" v-if="scope.row.status == 1">待付款</el-tag>
            <el-tag size="small" type="success" v-else>已付款</el-tag>
          </template>
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
          prop="updated_at"
          key="updated_at"
          label="更新时间">
          <template slot-scope="scope">
            {{scope.row.updated_at | transLocalTime}}
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
                    @click.native="removeOrder(scope.row.id)">
                    <span class="icon iconfont icon-delete"></span>
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="添加影院" :visible.sync="dialogFormVisible">
      <el-form :model="form" style="max-width:500px" label-width="120px">
        <el-form-item label="名称">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="城市">
          <el-input v-model="form.city" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.location" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="标签">
          <el-select
            v-model="form.labels"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请输入标签"
          ></el-select>
        </el-form-item>
        <el-form-item label="最少价格">
          <el-input v-model="form.min_price" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="addOrder">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 列表为空时 -->
    <no-record v-if="showNoRecord"/>
  </div>
</template>
<script>
import CommonProxy from '@/proxies/common';
import OrderProxy from '@/proxies/order';

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
    handleImageSuccess(res) {
      this.form.cover = window.API_CONFIG['qiniu_download'] + res.key;
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
    async getOrders() {
      this.isListLoading = true;
      this.list = [];
      try {
        const res = await OrderProxy.getOrders();
        this.list = res.data;
        this.isListLoading = false;
      } catch (error) {
        this.isListLoading = false;
        this.$message.error('获取ying列表出错!');
      }
    },
    async addOrder() {
      const params = {
        ...this.form,
      };
      params.labels = params.labels.join(',');
      const res = await OrderProxy.addOrder(params);
      if (!res.fail) {
        this.$message.success(res.message);
        // 刷新列表
        this.getOrders();
        this.dialogFormVisible = false;
      }
    },
    async removeOrder(id) {
      const params = {
        id,
      };
      const res = await OrderProxy.removeOrder(params);
      if (!res.fail) {
        this.$message.success(res.message);
        // 刷新列表
        this.getOrders();
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
    this.getOrders();
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
