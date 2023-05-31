<template>
  <a-comment>
    <template #avatar>
      <a-avatar :src="useUserInfo().avatar" />
    </template>
    <template #content>
      <div style="display: flex;width: 600px;">
        <a-textarea v-model:value="comment.content" :rows="2" :autoSize="{ minRows: 2, maxRows: 2 }" style="bu"/>
        <a-button html-type="submit" type="primary" @click="addComment()" class="button">
          发布
        </a-button>
      </div>
    </template>
  </a-comment>
</template>
<script setup lang="ts">

import { ref } from 'vue';
import { useRequest } from 'vue-request';
import { AddCommentReq } from '../model/commentModel';
import { useResult } from '../model/frontModel';
import { useUserInfo } from '../store/userInfo';
import request from '../utils/request';

const props = defineProps<{ blogId: string, type: string, commentId?: string, replyId?: string, replyName?: string }>()
const userInfo = useUserInfo()
const emit = defineEmits(['getCommentList'])

const comment = ref<AddCommentReq>({
  userId: userInfo.id,
  blogId: props.blogId,
  avatar: userInfo.avatar,
  username: userInfo.username,
  commentId: props.commentId,
  replyId: props.replyId,
  replyName: props.replyName,
  content: '',
  type: props.type,
})

const { run: addComment } = useRequest<useResult<string>>(() =>
  request.post('/BLOG/mongo/comment/add', comment.value).finally(() => {
    comment.value.content = '';
    emit('getCommentList');
  }),
  {
    manual: true
  }
)
</script>
<style>
.button {
  height: auto;
  margin-left: 10px;
  border-radius: 5px;
}
</style>