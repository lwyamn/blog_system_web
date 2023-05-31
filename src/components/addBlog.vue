<template>
  <a-modal :visible="addBlogVisible" title="发布博客" cancelText="取消发布" okText="发布文章" @ok="addBlog()" @cancel="onCancel">
    <a-form>
      <a-form-item label="文章封面">
        <a-uploadPic ref="cover" text="上传封面"></a-uploadPic>
      </a-form-item>
      <a-form-item label="文章简述">
        <a-textarea v-model:value="addBlogInfo.description" show-count :maxlength="200"></a-textarea>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup lang="ts">

import { useRequest } from 'vue-request';
import { AddBlogReq } from '../model/blogModel';
import { useResult } from '../model/frontModel';
import request from '../utils/request';
import AUploadPic from '../components/uploadPic.vue'
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import router from '@/router/router';

const props = defineProps<{ addBlogVisible: boolean; blogInfo: AddBlogReq }>()
const addBlogInfo = ref<AddBlogReq>(props.blogInfo);
const emit = defineEmits(['update:addBlogVisible'])
const cover = ref();
const addBlog = () => {
  if (!cover.value.getImage()) {
    message.error("博客图片未上传")
  }else if(!addBlogInfo.value.description){
    message.error("博客描述未填写")
  } else{
    addBlogInfo.value.cover = cover.value.getImage()
    add();
    emit('update:addBlogVisible', false)
  }

}
function onCancel() {
  emit('update:addBlogVisible', false)
}
const { run: add } = useRequest<useResult<string>>(() =>
  request.post('/BLOG/blog/add', addBlogInfo.value).catch(resp=>{
    if(resp.data.data.code===1){
      router.push('/main/home')
    }
    return resp;
  }),
  {
    manual: true
  }
)
</script>