<template>
  <div class="xg-main task-form">
    <el-form ref="form" :rules="rules" :model="form" label-width="80px">
      <h2>基本信息</h2>
      <el-form-item label="排序" prop="title">
        <el-input v-model="form.sort" type="number"></el-input>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="图标" prop="thumbnail">
        <el-upload
          drag
          :action="uploadUrl"
          :show-file-list="false"
          :on-success="handleThumbnailSuccess"
          :on-error="handleError"
          :before-upload="beforeImageUpload"
          :data="qiniuData">
          <img v-if="form.thumbnail" :src="form.thumbnail | getQiniuFullUrl">
          <div v-else class="el-default">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或
              <em>点击上传</em>
            </div>
          </div>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="赏金" prop="money">
        <el-input type="number" v-model="form.money" placeholder="元"></el-input>
      </el-form-item>
      <el-form-item label="预计耗时" prop="spend">
        <el-input v-model="form.spend"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description"></el-input>
      </el-form-item>
      <el-form-item label="结算周期">
        <el-radio-group v-model="form.type">
          <el-radio :label="item.id" v-for="(item, index) in types" :key="index">{{item.name}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="标签" prop="labels">
        <el-select
          v-model="form.labels"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="请输入标签"
        ></el-select>
      </el-form-item>
      <el-form-item label="时间限制" prop="limited_time">
        <el-input type="number" v-model="form.limited_time" placeholder="单位分钟"></el-input>
      </el-form-item>
      <el-form-item label="用于提审">
        <el-checkbox :true-label="1" :false-label="0" v-model="form.for_review"></el-checkbox>
      </el-form-item>
      <h2>操作步骤</h2>
      <el-form-item
        class="text-step"
        v-for="(item, index) in form.textStep"
        :label="'步骤 ' + (index+1)"
        :key="`text${index}`">
        <el-input v-model="item.value" placeholder="请输入详细的步骤"></el-input>
        &nbsp;<el-input v-model="item.copyText" placeholder="请输入一键复制的文本"></el-input>
        <el-button @click.prevent="removeTextStep(item)" type="text">删除</el-button>
      </el-form-item>
      <el-form-item label="">
        <el-button @click="addTextStep" size="small">新增文字步骤</el-button>
      </el-form-item>
      <h2>图片步骤</h2>
      <el-form-item
        v-for="(item, index) in form.imageStep"
        :label="'步骤 ' + (index+1)"
        :key="item.value">
        <el-upload
          drag
          :action="uploadUrl"
          :show-file-list="false"
          :on-success="(res,file)=>{return handleImageStepSuccess(res, file, index)}"
          :on-error="handleError"
          :before-upload="beforeImageUpload"
          :data="qiniuData">
          <img v-if="item.value" :src="item.value | getQiniuFullUrl">
          <div v-else class="el-default">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或
              <em>点击上传</em>
            </div>
          </div>
        </el-upload>
        <el-button @click.prevent="removeImageStep(item)" type="text">删除</el-button>
      </el-form-item>
      <el-form-item label="">
        <el-button @click="addImageStep" size="small">新增图片步骤</el-button>
      </el-form-item>
      <h2>提审步骤</h2>
      <el-form-item
        v-for="(item, index) in form.reviewStep"
        :label="'步骤 ' + (index+1)"
        :key="item.value">
        <el-input v-model="item.name"></el-input>
        <el-upload
          drag
          :action="uploadUrl"
          :show-file-list="false"
          :on-success="(res,file)=>{return handleReviewImageSuccess(res, file, index)}"
          :on-error="handleError"
          :before-upload="beforeImageUpload"
          :data="qiniuData">
          <img v-if="item.value" :src="item.value | getQiniuFullUrl">
          <div v-else class="el-default">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或
              <em>点击上传</em>
            </div>
          </div>
        </el-upload>
        <el-button @click.prevent="removeReviewStep(item)" type="text">删除</el-button>
      </el-form-item>
      <el-form-item label="">
        <el-button @click="addReviewStep" size="small">新增提审步骤</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" type="primary" @click="submit">提交</el-button>
        <el-button size="medium" @click="gotoList">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import CheckForm from '@/mixins/checkform';
import TasksManageProxy from '@/proxies/tasks';
import CommonProxy from '@/proxies/common';

export default {
  data() {
    return {
      qiniuData: {
        token: '',
      },
      // 七牛云上传储存区域的上传域名（华东、华北、华南、北美、东南亚）
      uploadUrl: window.API_CONFIG['qiniu_upload'],
      form: {
        sort: 0,
        title: '',
        thumbnail: '',
        money: null,
        spend: '',
        description: '',
        type: 1,
        limited_time: null,
        labels: [],
        textStep: [],
        imageStep: [],
        reviewStep: [],
        for_review: 0,
      },
      types: [],
      isEdit: false,
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'change' },
        ],
        thumbnail: [
          { required: true, message: '请上传任务图标', trigger: 'change' },
        ],
        money: [
          { required: true, message: '请输入赏金', trigger: 'change' },
        ],
        spend: [
          { required: true, message: '请输入预计耗时', trigger: 'change' },
        ],
        description: [
          { required: true, message: '请输入描述', trigger: 'change' },
        ],
        labels: [
          { required: true, message: '请输入标签', trigger: 'change' },
        ],
        limited_time: [
          { required: true, message: '请输入时间限制', trigger: 'change' },
        ],
      },
    };
  },
  mixins: [
    // 表单校验
    CheckForm,
  ],
  methods: {
    async getTypes() {
      const res = await CommonProxy.getTypes();
      this.types = res.data;
    },
    markReviewImage(item) {
      console.info(item);
    },
    removeTextStep(item) {
      const index = this.form.textStep.indexOf(item);
      if (index !== -1) {
        this.form.textStep.splice(index, 1);
      }
    },
    removeImageStep(step) {
      this.form.imageStep.forEach((item, index) => {
        if (item.key === step.key) {
          this.form.imageStep.splice(index, 1);
        }
      });
    },
    removeReviewStep(step) {
      this.form.reviewStep.forEach((item, index) => {
        if (item.key === step.key) {
          this.form.reviewStep.splice(index, 1);
        }
      });
    },
    addTextStep() {
      this.form.textStep.push({
        value: '',
        copyText: '',
        key: Date.now(),
      });
    },
    addImageStep() {
      this.form.imageStep.push({
        value: '',
        key: Date.now(),
      });
    },
    addReviewStep() {
      this.form.reviewStep.push({
        value: '',
        name: '',
        key: Date.now(),
      });
    },
    gotoList() {
      this.$router.push({
        path: '/tasks/list',
      });
    },
    async submit() {
      // 未通过校验
      if (!this.CheckForm('form')) {
        return;
      }
      const params = {
        ...this.form,
        status: 1,
        recommend: 0,
      };
      if (!params.textStep.length) {
        this.$message.error('请添加操作步骤');
        return;
      }
      if (!params.imageStep.length) {
        this.$message.error('请添加图片步骤');
        return;
      }
      if (!params.reviewStep.length) {
        this.$message.error('请添加审核步骤');
        return;
      }
      const res = await TasksManageProxy[this.isEdit ? 'updateTask' : 'addTask'](params);
      if (!res.fail) {
        this.$message.success('操作成功!');
        // 返回列表
        this.gotoList();
      }
    },
    async getDetail(taskId) {
      const res = await TasksManageProxy.getDetail({
        taskId,
      });
      if (!res.fail) {
        this.form = res.data;
        this.form.labels = res.data.labels.split(',');
        this.form.textStep = res.data.textStep.map((item) => {
          const textStep = {
            value: item.text,
            copyText: item.copy_text,
            key: item.id,
          };
          return textStep;
        });
        this.form.imageStep = res.data.imageStep.map((item) => {
          const imageStep = {
            value: item.image,
            key: item.id,
          };
          return imageStep;
        });
        this.form.reviewStep = res.data.reviewStep.map((item) => {
          const reviewStep = {
            value: item.image,
            name: item.text,
            key: item.id,
          };
          return reviewStep;
        });
      }
    },
    async getQiniuToken() {
      const res = await CommonProxy.getQiniuUploadToken();
      if (res.success) {
        this.qiniuData.token = res.data.uptoken;
      }
    },
    beforeImageUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isLt2M = file.size / 1024 < 500;
      let result = true;
      if (!isJPG && !isPNG) {
        this.$message.error('图片只能是 JPG/PNG 格式!');
        result = false;
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 500kb!');
        result = false;
      }
      return result;
    },
    handleThumbnailSuccess(res) {
      this.form.thumbnail = res.key;
    },
    handleReviewImageSuccess(res, file, index) {
      this.form.reviewStep[index].value = res.key;
    },
    handleImageStepSuccess(res, file, index) {
      this.form.imageStep[index].value = res.key;
    },
    handleError() {
      this.$message({
        showClose: true,
        message: '上传失败',
        duration: 2000,
        type: 'warning',
      });
    },
  },
  created() {
    this.getTypes();
    this.getQiniuToken();
    const taskId = this.$route.params.id;
    if (taskId) {
      this.getDetail(taskId);
      this.isEdit = true;
    }
  },
};
</script>
<style lang="scss" scoped>
@include b(main) {
  padding: 20px;
}
</style>
<style lang="scss">
  .task-form {
    .el-form {
      width: 500px;
      .el-input__inner {
        width: 420px;
      }
      .el-upload-dragger {
        width: 420px;
        margin: 10px 0;
        img {
          max-height: 180px;
          max-height: 180px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
    .text-step {
      .el-form-item__content {
        display: flex;
        .el-button {
          margin-left: 10px;
        }
      }
    }
  }
</style>
