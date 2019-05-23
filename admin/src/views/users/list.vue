<template>
  <div
    class="xg-main user-page"
    v-loading="isListLoading">
    <div class="filter">
      <el-form :inline="true">
        <el-form-item>
          <el-input placeholder="昵称" v-model="searchForm.nickname" clearable class="input-with-select"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="用户ID" v-model="searchForm.userId" clearable class="input-with-select"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button plain type="primary" @click="search(searchForm)">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div
      v-show="list.length > 0"
      class="list">
      <el-table
        ref="userTable"
        style="width:1200px;"
        :data="list"
        header-row-class-name="u-table-tit">
        <el-table-column
          fixed
          prop="id"
          label="ID"
          width="50px">
        </el-table-column>
        <el-table-column
          prop="openid"
          label="openid"
          show-overflow-tooltip
          width="150px">
        </el-table-column>
        <el-table-column
          fixed
          prop="nick_name"
          width="100px"
          show-overflow-tooltip
          label="昵称">
        </el-table-column>
        <el-table-column
          prop="avatar"
          key="avatar"
          label="头像"
          width="100px">
          <template slot-scope="scope">
            <img :src="scope.row.avatar" style="width:30px">
          </template>
        </el-table-column>
        <el-table-column
          prop="gender"
          label="性别">
          <template slot-scope="scope">
            {{scope.row.gender == 1 ? '男' : '女'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="country"
          key="country"
          label="国家">
        </el-table-column>
        <el-table-column
          prop="province"
          key="province"
          label="省份"
          width="150px">
        </el-table-column>
        <el-table-column
          prop="city"
          key="city"
          label="城市"
          width="150px">
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
          prop="updated_at"
          key="updated_at"
          show-overflow-tooltip
          label="更新时间"
          width="100px">
          <template slot-scope="scope">
            {{scope.row.updated_at | transLocalTime}}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          width="100px"
          label="状态">
          <template slot-scope="scope">
            <el-tag size="small" type="success" v-if="scope.row.status == 1">正常</el-tag>
            <el-tag size="small" type="info" v-else>冻结</el-tag>
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
        @size-change="getUserList"
        @current-change="getUserList">
      </el-pagination>
    </div>
    <el-dialog title="修改余额" :visible.sync="dialogFormVisible">
      <el-form style="max-width:500px" :model="form">
        <el-form-item label="余额" label-width="120px">
          <el-input type="number" min="0" v-model="form.account_amount" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="updateUserInfo('account_amount', form.account_amount, form.userId)">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 列表为空时 -->
    <no-record v-if="showNoRecord"/>
  </div>
</template>
<script>
import PAGECONFIG from '@/constants/pagination';
import UsersProxy from '@/proxies/users';
import checkFuncAuth from '@/mixins/checkFuncAuth';

export default {
  name: 'user-list',
  data() {
    return {
      form: {
        account_amount: 0,
        userId: null,
      },
      searchForm: {},
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
  },
  mixins: [
    // 判断功能权限
    checkFuncAuth,
  ],
  methods: {
    reset() {
      this.searchForm = {};
      this.getUserList();
    },
    search(params) {
      this.getUserList(params);
    },
    showDialog(row) {
      this.dialogFormVisible = true;
      this.form.account_amount = row.account_amount;
      this.form.userId = row.id;
    },
    // 获取列表
    async getUserList(filter) {
      const params = {
        page: this.page,
        size: this.size,
        ...filter,
      };
      this.isListLoading = true;
      this.list = [];
      try {
        const {
          data: { list, totalCount },
        } = await UsersProxy.getUserList(params);
        this.list = list;
        this.totalRecordCount = totalCount;
        this.isListLoading = false;
      } catch (error) {
        this.isListLoading = false;
        this.$message.error('获取用户列表出错!');
      }
    },
    async updateUserInfo(key, val, id) {
      const params = {
        userId: id,
        [key]: val,
      };
      const res = await UsersProxy.updateUser(params);
      if (!res.fail) {
        this.$message.success(res.message);
        // 刷新列表
        this.getUserList();
        this.dialogFormVisible = false;
      }
    },
  },
  created() {
    this.getUserList();
  },
};
</script>
<style lang="scss">
.user-page {
  width: 100%;
  .filter {
    margin-top: 15px;
    margin-left: 15px;
  }
  .list {
    .el-table .cell {
      word-break: keep-all;
    }
  }
  .el-tabs__nav-wrap::after {
    display: none;
  }
}
</style>
