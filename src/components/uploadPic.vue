<template>
  <div>
    <a-upload v-model:file-list="file" action="http://121.36.104.226:8080/BLOG/file/upload"
      list-type="picture-card" @preview="handlePreview" @remove="removePic" @change="changePic">
      <div v-if="file.length<1">
        <a-icon icon="plusOutlined"></a-icon>
        <div style="margin-top: 8px">{{ text }}</div>
      </div>
    </a-upload>
    <a-modal :visible="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>
<script setup lang="ts">
import {  UploadChangeParam, UploadFile, message } from 'ant-design-vue';
import { ref } from 'vue';
import AIcon from '../utils/icon';
const props = defineProps<{text:string}>()
const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');

const file= ref<Array<UploadFile>>([]);

const handleCancel = () => {
  previewVisible.value = false;
};

const removePic = ()=>{
    file.value=[];
}

const changePic = (uploadFile: UploadChangeParam)=>{
  if(uploadFile.file.status == "done"){
    message.success("上传成功");
  }
}

const getImage = ()=>{
  return file?.value[0]?.response?.data || undefined;
}

const handlePreview = async (file: UploadFile) => {
  previewImage.value = file.response.data;
  previewVisible.value = true;
  previewTitle.value = file.name;
};
defineExpose({
  getImage
});
</script>