<template>
  <div>
    <div
      class="xg-upload-img__wrap"
      :style="{
        width: width + 'px',
        height: height + 'px',
      }">
      <!-- 有图片时 -->
      <div
        v-if="fileId">
        <img
          class="xg-upload-img__img"
          :style="{
            width: width + 'px',
            height: height + 'px',
          }"
          :src="imgSrc" />
        <div class="xg-upload-img__close" @click="delImg">
        </div>
      </div>

      <!-- 上传进度 -->
      <el-progress
        v-if="isUploading"
        type="circle"
        :percentage="percentage"></el-progress>

      <!-- 没有图片且未上传时-->
      <template v-if="!fileId && !isUploading">
        <i class="el-icon-upload2"></i>
      </template>
    </div>
    <el-upload
      :action="uploadSrc"
      :before-upload="beforeUploadCheck"
      :on-success="uploadSuccess"
      :on-error="uploadFail"
      :on-progress="uploadProgress"
      :accept="acceptTypes"
      :file-list="fileList"
      :show-file-list="false"
      :auto-upload="true">
      <el-button slot="trigger" size="small" type="primary">
        {{ uploadBtnTxt }}
      </el-button>
      <div slot="tip" class="xg-upload-img__tips">
        <div v-html="tips"></div>
      </div>
    </el-upload>
  </div>
</template>
<script>
import acceptTypes from '@/constants/accept-types';
import { getItem } from '@/utils/storage';

export default {
  name: 'upload-img',
  props: {
    // 组件的宽度
    width: {
      type: Number,
      default: 500,
    },
    // 组件的高度
    height: {
      type: Number,
      default: 102,
    },
    // 图片宽度
    imgWidth: {
      type: Number,
    },
    // 图片高度
    imgHeight: {
      type: Number,
    },
    // 上传可接受的类型
    acceptTypes: {
      type: String,
      default: acceptTypes.acceptImageTypes,
    },
    // 图片大小
    imgSize: {
      type: Number,
      default: 2 * 1024 * 1024,
    },
    // 上传提示
    tips: {
      type: String,
      default: '图片尺寸为1920x390px，大小不超过2M',
    },
    // 图片id
    oldFileId: {
      type: String,
      default: '',
    },
    checkImgWH: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      // 文件id
      fileId: '',
      // 文件url
      filePath: '',
      // 上传文件列表
      fileList: [],
      // 是否正在上传
      isUploading: false,
      // 上传进度
      percentage: 0,
      groupId: getItem('groupId'),
    };
  },
  computed: {
    // 图片实际宽度
    imgRealWidth() {
      return this.imgWidth || this.width;
    },
    // 图片实际宽度
    imgRealHeight() {
      return this.imgHeight || this.height;
    },
    // 上传地址
    uploadSrc() {
      return `${window.API_CONFIG['app']}/fileUpload/upload`;
    },
    // 图片地址
    imgSrc() {
      return `${window.API_CONFIG['app']}/fileUpload/getDiskFileStream?groupId=${this.groupId}&fileId=${this.fileId}`;
    },
    // 按钮文字
    uploadBtnTxt() {
      // 正在上传
      if (this.isUploading) {
        return '上传中…';
      }

      // 已上传
      if (this.fileId) {
        return '重新上传';
      }

      // 未成功上传过
      return '上传图片';
    },
  },
  watch: {
    fileId() {
      this.$emit('uploaded', this.fileId);
      this.$emit('getUrl', this.filePath);
    },
    oldFileId() {
      this.initFileSrc();
    },
  },
  methods: {
    // 删除图片
    delImg() {
      this.fileList = [];
      this.fileId = '';
    },
    // 文件检查
    beforeUploadCheck(file) {
      const fileType = file.type;

      // 判断图片类型
      if (!fileType || this.acceptTypes.indexOf(fileType) === -1) {
        this.$message.error('暂时不支持该类型的文件');
        return false;
      }

      // 超过文件大小
      if (file.size > this.imgSize) {
        this.$message.error('文件过大，请重新上传');
        return false;
      }

      // 检查图片尺寸是否符合规格
      if (this.checkImgWH) {
        return this.checkImgWidthAndHeight(file);
      }

      return true;
    },
    // 检查图片的宽和高
    checkImgWidthAndHeight(file) {
      return new Promise((resolve, reject) => {
        // 读取图片数据
        const reader = new FileReader();
        reader.onload = (e) => {
          // 加载图片获取图片真实宽度和高度
          const image = new Image();
          image.src = e.target.result;
          image.onload = () => {
            console.log(image.width, image.height);
            const width = this.imgRealWidth;
            const height = this.imgRealHeight;
            if (image.width !== width || image.height !== height) {
              this.$message.error(`请上传尺寸为${width}*${height}的图片！`);
              reject();
            } else {
              resolve();
            }
          };
        };
        reader.readAsDataURL(file);
      });
    },
    // 上传成功
    uploadSuccess(res, file) {
      if (res.retCode === '000000') {
        const { fileId, filePath } = res.data;
        this.fileId = fileId;
        this.fileList = [file];
        this.filePath = filePath;
      } else {
        this.$message.error(res.retDesc || '上传出错!');
      }
      this.isUploading = false;
    },
    // 上传失败
    uploadFail(err, file) {
      this.isUploading = false;
      this.$message.error(`${file.name}上传失败!`);
    },
    // 上传中
    uploadProgress(event, file) {
      this.percentage = Math.floor(file.percentage);
      this.isUploading = true;
    },
    // 初始化已有图片
    initFileSrc() {
      if (this.oldFileId) {
        this.fileId = this.oldFileId;
      }
    },
  },
};
</script>
<style lang="scss">
@import './index.scss';
</style>

