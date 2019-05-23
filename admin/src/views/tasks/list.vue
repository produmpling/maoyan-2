<template>
  <div
    v-loading="isListLoading"
    class="xg-main task-list-page">
      <div class="main-header">
        <el-button size="medium" type="primary"  @click="toadd">添加任务</el-button>
      </div>
      <!-- 列表 -->
      <div
        v-show="list.length > 0"
        class="xg-group__list">
        <el-table
          empty-text="-"
          ref="newsTable"
          :data="list"
          header-row-class-name="u-table-tit">
          <el-table-column
            prop="sort"
            label="排序">
          </el-table-column>
          <el-table-column
            prop="id"
            label="任务ID">
          </el-table-column>
          <el-table-column
            prop="title"
            label="标题"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <p class="news-title">{{ scope.row.title | filterBlank }}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="description"
            show-overflow-tooltip
            label="简介">
            <template slot-scope="scope">
              {{ scope.row.description | filterBlank }}
            </template>
          </el-table-column>
          <el-table-column
            prop="labels"
            show-overflow-tooltip
            label="标签">
          </el-table-column>
          <el-table-column
            prop="money"
            label="赏金">
            <template slot-scope="scope">
              {{ scope.row.money }} 元
            </template>
          </el-table-column>
          <el-table-column
            prop="limited_time"
            label="限制时间">
            <template slot-scope="scope">
              {{ scope.row.limited_time }}分钟
            </template>
          </el-table-column>
          <el-table-column
            prop="spend"
            label="预计耗时">
          </el-table-column>
          <el-table-column
            prop="type"
            label="类型">
            <template slot-scope="scope">
               {{ getTypeName(scope.row.type) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="created_at"
            show-overflow-tooltip
            label="发布时间">
            <template slot-scope="scope">
               {{ scope.row.created_at | transLocalTime}}
            </template>
          </el-table-column>
          <el-table-column
            prop="updated_at"
            show-overflow-tooltip
            label="更新时间">
            <template slot-scope="scope">
              {{ scope.row.updated_at | transLocalTime}}
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态">
            <template slot-scope="scope">
              <el-tag size="small" type="success" v-if="scope.row.status == 1">已上架</el-tag>
              <el-tag size="small" type="info" v-else>已下架</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="100">
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
                    @click.native="edit(scope.row)">
                    <span class="icon iconfont icon-edit-square"></span>
                    编辑
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="scope.row.status == 1"
                    class="xg-popover-list__item"
                    @click.native="updateStatus(scope.row)">
                    <span class="icon iconfont icon-vertical-align-botto"></span>
                    下架
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-else
                    class="xg-popover-list__item"
                    @click.native="updateStatus(scope.row)">
                    <span class="icon iconfont icon-vertical-align-top"></span>
                    上架
                  </el-dropdown-item>
                  <el-dropdown-item
                    class="xg-popover-list__item"
                    @click.native="delConfirm(scope.row)">
                    <span class="icon iconfont icon-delete"></span>
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
          v-if="totalCount > 0"
          background
          :layout="pageconf.simpleLayout"
          :page-sizes="pageconf.sizes"
          :page-size.sync="size"
          :current-page.sync="page"
          :total="totalCount"
          @size-change="getTasks"
          @current-change="getTasks">
        </el-pagination>

      </div>
      <!-- 列表为空时 -->
      <no-record v-if="showNoRecord"/>
  </div>
</template>
<script>
  import PAGECONFIG from '@/constants/pagination';
  import TasksManageProxy from '@/proxies/tasks';
  import CommonProxy from '@/proxies/common';

  export default {
    name: 'task-list',
    data() {
      return {
        // 列表
        list: [],
        isListLoading: false,
        showPopover: false,
        curPopover: -1,
        // 翻页数据
        pageconf: PAGECONFIG,
        // 默认页起点
        defaultpage: PAGECONFIG.defaultpage,
        // 当前页码
        page: PAGECONFIG.defaultpage,
        // 页容量
        size: PAGECONFIG.defaultsize,
        // 总条数
        totalCount: 0,
        types: [],
        // 草稿箱数量
        draftCount: 0,
      };
    },
    computed: {
      showNoRecord() {
        // 列表为空，且不是正在加载中
        return this.list.length < 1 && !this.isListLoading;
      },
    },
    methods: {
      // 去发任务
      toadd() {
        this.$router.push({
          name: 'task.add',
        });
      },
      // 编辑
      edit(row) {
        this.$router.push({
          name: 'task.edit',
          params: {
            id: row.id,
          },
        });
      },
      // 删除
      delConfirm(account) {
        const title = '删除任务';
        const tips = '确定要删除这个任务吗？';

        this.showPopover = false;

        this.$confirm(tips, title, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.del(account);
          })
          .catch(() => {
          });
      },
      async del(row) {
        const params = {
          taskId: row.id,
        };
        const res = await TasksManageProxy.removeTask(params);
        if (!res.fail) {
          this.$message.success('删除成功!');
          // 刷新列表
          this.getTasks();
        }
      },
      async updateStatus(row) {
        const params = {
          taskId: row.id,
          status: row.status === 1 ? 2 : 1,
        };
        const res = await TasksManageProxy.updateTaskStatus(params);
        if (!res.fail) {
          this.$message.success('更新成功!');
          // 刷新列表
          this.getTasks();
        }
      },
      async getTasks() {
        const params = {
          page: this.page,
          size: this.size,
        };
        this.isListLoading = true;
        const res = await TasksManageProxy.getTasks(params);
        this.list = res.data.list;
        this.totalCount = res.data.totalCount;
        this.isListLoading = false;
      },
      getTypeName(id) {
        const item = this.types.filter(type => type.id === id);
        return item[0].name;
      },
      async getTypes() {
        const res = await CommonProxy.getTypes();
        this.types = res.data;
      },
      // 修改页容量
      handleSizeChange(newsize) {
        this.size = newsize;
        // 重新获取列表
        this.getTasks(this.defaultpage);
      },
    },
    created() {
      this.getTypes();
      this.getTasks();
    },
  };
</script>
<style lang="scss">
  .task-list-page {
    .main-header {
      margin: 20px;
    }
  }
</style>
