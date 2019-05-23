<template>
  <div
    class="xg-main withdraw-page"
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
          prop="money"
          label="金额">
          <template slot-scope="scope">
            {{scope.row.money}} 元
          </template>
        </el-table-column>
        <el-table-column
          prop="user_id"
          key="user_id"
          label="用户ID"
          width="100px">
        </el-table-column>
        <el-table-column
          prop="truename"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="withdraw_type"
          key="withdraw_type"
          width="150px"
          show-overflow-tooltip
          label="提现方式">
          <template slot-scope="scope">
            {{scope.row.withdraw_type}} {{scope.row.withdraw_remark}}
          </template>
        </el-table-column>
        <el-table-column
          prop="withdraw_account"
          key="withdraw_account"
          show-overflow-tooltip
          width="300px"
          label="提现账号">
        </el-table-column>
        <el-table-column
          label="收款二维码"
          width="180">
          <template slot-scope="scope" v-if="scope.row.withdraw_image">
            <el-popover trigger="hover" placement="top">
              <img style="height:200px;" :src="scope.row.withdraw_image | getQiniuFullUrl">
              <div slot="reference">
                <img class="image-mini" :src="scope.row.withdraw_image | getQiniuFullUrl">
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="handle_by"
          key="handle_by"
          label="处理人">
        </el-table-column>
        <el-table-column
          prop="created_at"
          key="created_at"
          label="创建时间"
          show-overflow-tooltip
          width="100px">
          <template slot-scope="scope">
            {{scope.row.created_at | transLocalTime}}
          </template>
        </el-table-column>
        <el-table-column
          prop="handle_at"
          key="handle_at"
          show-overflow-tooltip
          label="审核时间"
          width="100px">
          <template slot-scope="scope">
            {{scope.row.handle_at | transLocalTime}}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          key="status"
          label="状态">
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.status == 1">提现中</el-tag>
            <el-tag size="small" type="success" v-else-if="scope.row.status == 2">已提现</el-tag>
            <el-tooltip v-else-if="scope.row.status == 3" class="item" effect="dark" :content="scope.row.withdraw_remark" placement="top">
              <el-tag size="small" type="info">已驳回</el-tag>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right">
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
                  :disabled="scope.row.status != 1"
                  @click.native="withdrawResolve(scope.row.id, scope.row.user_id, scope.row.task_id, scope.row.money)">
                  <span class="icon iconfont icon-check-circle"></span>
                  提现通过
                </el-dropdown-item>
                <el-dropdown-item
                  class="xg-popover-list__item"
                  :disabled="scope.row.status != 1"
                  @click.native="showDialog(scope.row)">
                  <span class="icon iconfont icon-close-circle"></span>
                  驳回
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="totalRecordCount > 0"
        background
        :layout="pageconf.simpleLayout"
        :page-sizes="pageconf.sizes"
        :page-size.sync="size"
        :current-page.sync="page"
        :total="totalRecordCount"
        @size-change="getWithdraw"
        @current-change="getWithdraw">
      </el-pagination>
    </div>
    <el-dialog title="驳回" :visible.sync="dialogFormVisible">
      <el-form :model="form" style="max-width:500px">
        <el-form-item label="理由" label-width="120px">
          <el-input v-model="form.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="withdrawReject">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 列表为空时 -->
    <no-record v-if="showNoRecord"/>
  </div>
</template>
<script>
import PAGECONFIG from '@/constants/pagination';
import WithdrawManageProxy from '@/proxies/withdraw';

export default {
  name: 'withdraw-list',
  data() {
    return {
      form: {
        id: null,
        remark: '',
        userId: null,
        taskId: null,
      },
      dialogFormVisible: false,
      // 列表
      list: [],
      isListLoading: false,
      // 总条数
      totalRecordCount: 0,
      // 翻页数据
      pageconf: PAGECONFIG,
      // 当前页码
      page: PAGECONFIG.defaultPage,
      // 页容量
      size: 10,
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
    showDialog(row) {
      this.dialogFormVisible = true;
      this.form.id = row.id;
      this.form.userId = row.user_id;
      this.form.taskId = row.task_id;
    },
    // 获取列表
    async getWithdraw() {
      const params = {
        page: this.page,
        size: this.size,
      };
      this.isListLoading = true;
      this.list = [];
      try {
        const {
          data: { list, totalCount },
        } = await WithdrawManageProxy.getWithdraw(params);
        this.list = list;
        this.totalRecordCount = totalCount;
        this.isListLoading = false;
      } catch (error) {
        this.isListLoading = false;
        this.$message.error('获取提现列表出错!');
      }
    },
    async withdrawResolve(id, userId, taskId, money) {
      const handleBy = this.handleBy;
      const params = {
        id,
        userId,
        taskId,
        handleBy,
        money,
      };
      const res = await WithdrawManageProxy.withdrawResolve(params);
      if (!res.fail) {
        this.$message.success(res.message);
        // 刷新列表
        this.getWithdraw();
      }
    },
    async withdrawReject() {
      this.form.handleBy = this.handleBy;
      const res = await WithdrawManageProxy.withdrawReject(this.form);
      if (!res.fail) {
        this.$message.success(res.message);
        // 刷新列表
        this.getWithdraw();
        this.dialogFormVisible = false;
      }
    },
  },
  created() {
    this.getWithdraw();
  },
};
</script>
<style lang="scss">
.withdraw-page {
  .image-mini {
    height: 50px;
    width: auto;
  }
}
@include b(user) {
  width: 100%;
  padding-left: 0!important;
  @include e(filter) {
    margin-top: 20px;
    .el-input-group,
    .el-input {
      width: 315px;
    }
  }
  @include e(list) {
    .el-table .cell {
      word-break: keep-all;
    }
  }
  .el-tabs__nav-wrap::after {
    display: none;
  }
}
</style>
