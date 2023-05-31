<template>
  <div style="background-color: aliceblue;">
    <div style="display: flex;margin-bottom: 10px;">
      <a-input v-model:value="blogInfo.title" show-count :maxlength="20" class="input" />
      <a-button type="primary" shape="round" size="large" @click="changeAdd()" class="button">发布文章</a-button>
      <a-addBlog v-model:addBlogVisible="addBlogVisible" :blogInfo="blogInfo"></a-addBlog>
      <a-button ghost shape="round" size="large" @click="switchMarkDown" class="button">
        <a-spin v-if="loading" />
        <a-span v-else style="color: black;">切换MarkDown</a-span>
      </a-button>
    </div>
    <div style="border: 1px solid #ccc;text-align:start;" class="write">
      <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
      <div>
        <Editor style="height: 750px; overflow-y: hidden" v-model="blogInfo.content" :defaultConfig="editorConfig"
          :mode="mode" @onCreated="handleCreated" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
// 引入 css
import { onBeforeUnmount, ref, shallowRef } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { DomEditor, IDomEditor } from '@wangeditor/core';
import { marked } from 'marked'
import AAddBlog from '../components/addBlog.vue'
import { AddBlogReq } from '../model/blogModel';
import { useUserInfo } from '../store/userInfo';
import { message } from 'ant-design-vue';
const loading = ref(false)
const userInfo = useUserInfo()
const addBlogVisible = ref(false)
const blogInfo = ref<AddBlogReq>({
  userId: userInfo.id,
  title: '',
  content: '',
  cover: '',
  author: userInfo.username,
  description: '',
})
const mode = ref('default')
const editorRef = shallowRef()

const toolbarConfig = {}

const editorConfig = { placeholder: '请输入内容...' }

const changeAdd = () => {
  if (!blogInfo.value.title) {
    message.error("文章标题未填写")
  } else if (blogInfo.value.content.length < 200) {
    message.error("文章内容过少")
  }
  else {
    addBlogVisible.value = addBlogVisible.value ? false : true;
  }
}
const switchMarkDown = async () => {
  loading.value = true
  const editor: IDomEditor = editorRef.value;
  const text = editor.getText()
  const html = marked.parse(text);
  await new Promise(resolve => setTimeout(resolve, 1000));
  blogInfo.value.content = html
  loading.value = false
  message.success("切换成功")
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor: IDomEditor) => {
  const toolbar = DomEditor.getToolbar(editor)
  const curToolbarConfig = toolbar?.getConfig()
  editorRef.value = editor
}
</script>    
<style scoped>
.write {
  border: 1px solid #ccc;
  text-align: start;
}

.input {
  border-radius: 10px;
}

.input .button {
  margin-left: 5px;
}
</style>