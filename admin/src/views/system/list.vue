<template>
  <div
    class="xg-main system-page"
    v-loading="isListLoading">
    <div class="main-header">
      <el-button size="medium" type="primary" @click="showDialog">添加管理员</el-button>
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
          prop="username"
          label="管理员账号">
        </el-table-column>
        <el-table-column
          prop="role"
          key="role"
          label="角色">
          <template slot-scope="scope">
            {{scope.row.role == 1 ? '超管' : '操作员'}}
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
          show-overflow-tooltip
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
                    v-if="scope.row.role != 1 || role == 1"
                    class="xg-popover-list__item"
                    @click.native="edit(scope.row)">
                    <span class="icon iconfont icon-edit-square"></span>
                    编辑
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="scope.row.role != 1"
                    class="xg-popover-list__item"
                    @click.native="removeAdmin(scope.row.id)">
                    <span class="icon iconfont icon-delete"></span>
                    删除
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
        @size-change="getAdminList"
        @current-change="getAdminList">
      </el-pagination>
    </div>
    <el-dialog :title="isEdit ? '编辑管理员': '添加管理员'" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules" style="max-width:500px" label-width="120px">
        <el-form-item label="账号" prop="username">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 列表为空时 -->
    <no-record v-if="showNoRecord"/>
  </div>
</template>
<script>
import CheckForm from '@/mixins/checkform';
import PAGECONFIG from '@/constants/pagination';
import SystemProxy from '@/proxies/system';

export default {
  name: 'system-list',
  data() {
    return {
      form: {
        username: '',
        password: '',
      },
      dialogFormVisible: false,
      isEdit: false,
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
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
        ],
      },
    };
  },
  mixins: [
    // 表单校验
    CheckForm,
  ],
  computed: {
    showNoRecord() {
      // 列表为空，且不是正在加载中
      return this.list.length < 1 && !this.isListLoading;
    },
    handleBy() {
      return localStorage.getItem('username');
    },
    role() {
      return localStorage.getItem('role');
    },
    id() {
      return localStorage.getItem('id');
    },
  },
  methods: {
    showDialog() {
      this.dialogFormVisible = true;
    },
    edit(data) {
      this.showDialog();
      this.isEdit = true;
      this.form.username = data.username;
      this.form.password = data.password;
      this.form.id = data.id;
    },
    // 获取列表
    async getAdminList() {
      const params = {
        page: this.page,
        size: this.size,
      };
      this.isListLoading = true;
      this.list = [];
      try {
        const {
          data: { list, totalCount },
        } = await SystemProxy.getAdminList(params);
        this.list = list;
        this.totalRecordCount = totalCount;
        this.isListLoading = false;
      } catch (error) {
        this.isListLoading = false;
        this.$message.error('获取管理员列表出错!');
      }
    },
    async withdrawResolve(id, userId, taskId) {
      const handleBy = this.handleBy;
      const params = {
        id,
        userId,
        taskId,
        handleBy,
      };
      const res = await SystemProxy.withdrawResolve(params);
      if (!res.fail) {
        this.$message.success(res.message);
        // 刷新列表
        this.getAdminList();
      }
    },
    async submit() {
      // 未通过校验
      if (!this.CheckForm('form')) {
        return;
      }
      const res = await SystemProxy[this.isEdit ? 'updateAdmin' : 'addAdmin'](this.form);
      if (!res.fail) {
        this.$message.success(res.message);
        // 刷新列表
        this.getAdminList();
        this.dialogFormVisible = false;
        this.isEdit = false;
      }
    },
    async removeAdmin(id) {
      const params = {
        id,
      };
      const res = await SystemProxy.removeAdmin(params);
      if (!res.fail) {
        this.$message.success(res.message);
        // 刷新列表
        this.getAdminList();
        this.dialogFormVisible = false;
      }
    },
  },
  created() {
    this.getAdminList();
  },
};
</script>
<style lang="scss">
.system-page {
  .main-header {
    margin: 20px;
  }
}
</style>
