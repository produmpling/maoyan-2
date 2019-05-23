<template>
  <div
    class="xg-main theater-page"
    v-loading="isListLoading">
    <div class="main-header">
      <el-button size="medium" type="primary" @click="showDialog">添加影院</el-button>
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
          prop="name"
          show-overflow-tooltip
          label="影院">
        </el-table-column>
        <el-table-column
          prop="city"
          width="50px"
          label="城市">
        </el-table-column>
        <el-table-column
          prop="location"
          show-overflow-tooltip
          label="地址">
        </el-table-column>
        <el-table-column
          prop="labels"
          show-overflow-tooltip
          label="标签">
        </el-table-column>
        <el-table-column
          prop="updated_at"
          key="updated_at"
          width="100px"
          label="排期">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="getTimetables(scope.row)">查看</el-button>
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
                    @click.native="removeTheater(scope.row.id)">
                    <span class="icon iconfont icon-delete"></span>
                    删除
                  </el-dropdown-item>
                  <el-dropdown-item
                    class="xg-popover-list__item"
                    @click.native="showTimetableDialog(scope.row.id)">
                    <span class="icon iconfont icon-time-circle"></span>
                    排期
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog width="80%" title="所有排期" :visible.sync="dialogTimetableDetailVisible">
      <el-table
        ref="timetable"
        :data="timetables"
        header-row-class-name="u-table-tit">
        <el-table-column
          prop="name"
          show-overflow-tooltip
          label="影片">
        </el-table-column>
        <el-table-column
          prop="play_date"
          show-overflow-tooltip
          label="播放日期">
        </el-table-column>
        <el-table-column
          prop="times"
          show-overflow-tooltip
          width="400px"
          label="节次">
          <template slot-scope="scope">
            <ul>
              <li v-for="(item,index) in scope.row.times" :key="index">
                <span>{{item.room}}影厅, {{item.effects}}, {{item.price}}元, {{item.start_time}}开始, {{item.end_time}}结束</span>
              </li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="removeTimetable(scope.row.timetable_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogTimetableDetailVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog width="80%" title="添加排期" :visible.sync="dialogTimetableVisible">
      <el-form :model="timetableForm" style="max-width:500px" label-width="120px">
        <el-form-item label="日期">
          <el-date-picker
            v-model="timetableForm.date"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="影片">
          <el-select v-model="timetableForm.movie_id" placeholder="请选择">
            <el-option
              v-for="item in movies"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          class="times"
          v-for="(item, index) in timetableForm.times"
          :label="'节次 ' + (index+1)"
          :key="`text${index}`">
          <el-input class="input" v-model="item.room" placeholder="影厅"></el-input>
          <el-input class="input" v-model="item.price" placeholder="价钱"></el-input>
          <el-input class="input" v-model="item.effects" placeholder="效果"></el-input>
          <el-input class="input" v-model="item.start_time" placeholder="开始时间，如11:30"></el-input>
          <el-input class="input" v-model="item.end_time" placeholder="结束时间，如13:30"></el-input>
          <el-button @click.prevent="removeTime(item)" type="text">删除</el-button>
        </el-form-item>
        <el-form-item label="">
          <el-button @click="addTime" size="small">新增节次</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogTimetableVisible = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="addTimetable">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加影院" :visible.sync="dialogFormVisible">
      <el-form :model="theaterForm" style="max-width:500px" label-width="120px">
        <el-form-item label="名称">
          <el-input v-model="theaterForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="城市">
          <el-input v-model="theaterForm.city" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="theaterForm.location" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="标签">
          <el-select
            v-model="theaterForm.labels"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请输入标签"
          ></el-select>
        </el-form-item>
        <el-form-item label="最少价格">
          <el-input v-model="theaterForm.min_price" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="addTheater">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 列表为空时 -->
    <no-record v-if="showNoRecord"/>
  </div>
</template>
<script>
import CommonProxy from '@/proxies/common';
import TheaterProxy from '@/proxies/theater';
import MovieProxy from '@/proxies/movie';
import TimetableProxy from '@/proxies/timetable';

export default {
  name: 'theater-list',
  data() {
    return {
      qiniuData: {
        token: '',
      },
      // 七牛云上传储存区域的上传域名（华东、华北、华南、北美、东南亚）
      uploadUrl: window.API_CONFIG['qiniu_upload'],
      theaterForm: {
        name: '',
        city: '',
        location: '',
        labels: '',
        min_price: 0,
      },
      timetableForm: {
        date: '',
        movie_id: null,
        times: [],
      },
      movies: [],
      dialogFormVisible: false,
      // 列表
      list: [],
      activeTheater: null,
      isListLoading: false,
      dialogTimetableVisible: false,
      dialogTimetableDetailVisible: false,
      timetables: [],
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
    addTime() {
      this.timetableForm.times.push({
        room: '',
        price: 0,
        effects: '',
        start_time: '',
        end_time: '',
      });
    },
    removeTime(item) {
      const index = this.timetableForm.times.indexOf(item);
      if (index !== -1) {
        this.timetableForm.times.splice(index, 1);
      }
    },
    handleImageSuccess(res) {
      this.theaterForm.cover = window.API_CONFIG['qiniu_download'] + res.key;
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
    showTimetableDialog(id) {
      this.dialogTimetableVisible = true;
      this.activeTheater = id;
      this.getMovies();
    },
    // 获取列表
    async getTheaters() {
      this.isListLoading = true;
      this.list = [];
      try {
        const res = await TheaterProxy.getTheaters();
        this.list = res.data;
        this.isListLoading = false;
      } catch (error) {
        this.isListLoading = false;
        this.$message.error('获取ying列表出错!');
      }
    },
    async getMovies() {
      this.movies = [];
      try {
        const res = await MovieProxy.getMovies();
        this.movies = res.data;
      } catch (error) {
        this.$message.error('获取影片列表出错!');
      }
    },
    async addTheater() {
      const params = {
        ...this.theaterForm,
      };
      params.labels = params.labels.join(',');
      const res = await TheaterProxy.addTheater(params);
      if (!res.fail) {
        this.$message.success(res.message);
        // 刷新列表
        this.getTheaters();
        this.dialogFormVisible = false;
      }
    },
    async removeTheater(id) {
      const params = {
        id,
      };
      const res = await TheaterProxy.removeTheater(params);
      if (!res.fail) {
        this.$message.success(res.message);
        // 刷新列表
        this.getTheaters();
        this.dialogFormVisible = false;
      }
    },
    async getQiniuToken() {
      const res = await CommonProxy.getQiniuUploadToken();
      if (res.success) {
        this.qiniuData.token = res.data.uptoken;
      }
    },
    async addTimetable() {
      this.timetableForm.theater_id = this.activeTheater;
      const res = await TimetableProxy.addTimetable(this.timetableForm);
      if (res.success) {
        this.$message.success('添加成功');
        this.dialogTimetableVisible = false;
        this.getTheaters();
      }
    },
    async getTimetables(row) {
      this.dialogTimetableDetailVisible = true;
      const params = {
        id: row.id,
      };
      const res = await TimetableProxy.listByTheater(params);
      if (res.success) {
        this.timetables = res.data;
        this.timetables.forEach((item) => {
          if (item.times) {
            item.times = JSON.parse(item.times);
          }
          item.play_date = new Date(item.play_date).toLocaleDateString();
        });
      }
    },
    async removeTimetable(id) {
      const params = {
        id,
      };
      const res = await TimetableProxy.removeTimetable(params);
      if (res.success) {
        this.timetables = this.timetables.filter(item => item.timetable_id !== id);
      }
    },
  },
  created() {
    this.getQiniuToken();
    this.getTheaters();
  },
};
</script>
<style lang="scss">
.theater-page {
  .main-header {
    margin: 20px;
  }
  .el-upload-dragger {
    img {
      max-height: 180px;
    }
  }
  .el-form {
    max-width: 100%!important;
  }
  .times {
    .input {
      width: 150px;
    }
  }
}
</style>
