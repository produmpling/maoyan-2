<template>
  <div
    class="xg-main review-page"
    v-loading="isListLoading">
    <div class="filter">
      <el-form :inline="true">
        <el-form-item>
          <el-input placeholder="姓名" v-model="searchForm.truename" clearable class="input-with-select"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="任务标题" v-model="searchForm.taskTitle" clearable class="input-with-select"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="用户ID" v-model="searchForm.userId" clearable class="input-with-select"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="任务ID" v-model="searchForm.taskId" clearable class="input-with-select"></el-input>
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
      v-show="list.length > 0">
      <el-table
        ref="reviewTable"
        style="width:1200px;"
        :data="list"
        header-row-class-name="u-table-tit">
        <el-table-column
          prop="task_id"
          width="90px"
          label="任务ID">
        </el-table-column>
        <el-table-column
          prop="title"
          width="150px"
          show-overflow-tooltip
          label="任务标题">
        </el-table-column>
        <el-table-column
          prop="user_id"
          key="user_id"
          width="90px"
          label="用户ID">
        </el-table-column>

        <el-table-column
          prop="created_at"
          key="created_at"
          label="创建时间"
          show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.created_at | transLocalTime}}
          </template>
        </el-table-column>
        <el-table-column
          prop="updated_at"
          key="updated_at"
          show-overflow-tooltip
          label="审核时间">
          <template slot-scope="scope">
            {{scope.row.updated_at | transLocalTime}}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          key="status"
          label="状态">
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.status == 1">审核中</el-tag>
            <el-tag size="small" type="success" v-else-if="scope.row.status == 2">审核通过</el-tag>
            <el-tooltip v-else-if="scope.row.status == 3" class="item" effect="dark" :content="scope.row.remark" placement="top">
              <el-tag size="small" type="info">已驳回</el-tag>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="images"
          key="images"
          width="100px"
          label="审核资料">
          <template slot-scope="scope">
            <el-button type="text" @click="showReviewDetail(scope.row)">查看</el-button>
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
                    :disabled="scope.row.status != 1"
                    class="xg-popover-list__item"
                    @click.native="showDialog(scope.row)">
                    <span class="icon iconfont icon-close-circle"></span>
                    驳回
                  </el-dropdown-item>
                  <el-dropdown-item
                    :disabled="scope.row.status != 1"
                    class="xg-popover-list__item"
                    @click.native="reviewResolve(scope.row.id, scope.row.user_id, scope.row.task_id)">
                    <span class="icon iconfont icon-check-circle"></span>
                    审核通过
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
        @size-change="reviewTasks"
        @current-change="reviewTasks">
      </el-pagination>
    </div>
    <el-dialog title="驳回" :visible.sync="dialogFormVisible">
      <el-form :model="form" style="max-width:500px">
        <el-form-item label="理由" label-width="120px">
          <el-input v-model="form.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="reviewReject">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="截图资料" :visible.sync="dialogReviewVisible">
      <p>姓名：{{reviewDetail.truename}}</p>
      <p>手机：{{reviewDetail.phone}}</p>
      <p>备注：{{reviewDetail.additional_info}}</p>
      <div class="review" v-for="(item, index) in pictures" :key="index">
        <h2>{{item.textStep}}</h2>
        <div class="review-img">
          <img :src="item.imageStep | getQiniuFullUrl">
          <img :src="item.imageReview | getQiniuFullUrl">
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogReviewVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 列表为空时 -->
    <no-record v-if="showNoRecord"/>
  </div>
</template>
<script>
import PAGECONFIG from '@/constants/pagination';
import TasksManageProxy from '@/proxies/tasks';

export default {
  name: 'review-list',
  data() {
    return {
      form: {
        id: null,
        remark: '',
        userId: null,
        taskId: null,
      },
      reviewDetail: {},
      searchForm: {},
      dialogReviewVisible: false,
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
      pictures: [],
    };
  },
  computed: {
    showNoRecord() {
      // 列表为空，且不是正在加载中
      return this.list.length < 1 && !this.isListLoading;
    },
  },
  methods: {
    async showReviewDetail(row) {
      this.reviewDetail = row;
      this.dialogReviewVisible = true;
      const params = {
        id: row.task_id,
      };
      const res = await TasksManageProxy.getReviewStep(params);
      if (!res.fail) {
        const images = JSON.parse(row.images);
        this.pictures = res.data.map((item) => {
          const step = {
            imageStep: item.image,
            textStep: item.text,
            imageReview: images[item.id],
          };
          return step;
        });
      }
    },
    showDialog(row) {
      this.dialogFormVisible = true;
      this.form.id = row.id;
      this.form.userId = row.user_id;
      this.form.taskId = row.task_id;
    },
    search(params) {
      this.reviewTasks(params);
    },
    reset() {
      this.searchForm = {};
      this.reviewTasks();
    },
    // 获取列表
    async reviewTasks(search = {}) {
      const params = {
        page: this.page,
        size: this.size,
        ...search,
      };
      this.isListLoading = true;
      this.list = [];
      try {
        const {
          data: { list, totalCount },
        } = await TasksManageProxy.reviewTasks(params);
        this.list = list;
        this.totalRecordCount = totalCount;
        this.isListLoading = false;
      } catch (error) {
        this.isListLoading = false;
        this.$message.error('获取审核列表出错!');
      }
    },
    async reviewResolve(id, userId, taskId) {
      const params = {
        id,
        userId,
        taskId,
      };
      const res = await TasksManageProxy.reviewResolve(params);
      if (!res.fail) {
        this.$message.success(res.message);
        // 刷新列表
        this.reviewTasks();
      }
    },
    async reviewReject() {
      const res = await TasksManageProxy.reviewReject(this.form);
      if (!res.fail) {
        this.$message.success(res.message);
        // 刷新列表
        this.reviewTasks();
        this.dialogFormVisible = false;
      }
    },
  },
  created() {
    this.reviewTasks();
  },
};
</script>
<style lang="scss">
.review-page{
  width: 100%;
  .filter {
    margin-top: 15px;
    margin-left: 15px;
  }
  .review {
    .review-img{
      img {
        max-width: 200px;
      }
    }
  }
}
</style>
