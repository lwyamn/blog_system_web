<template>
  <a-list item-layout="vertical" :data-source="props.commentList">
    <template #renderItem="{ item }">
      <a-list-item>
        <a-comment>
          <template #actions>
            <span style="cursor:pointer;" @click="change(item.id)">回复</span>
            <a-dropdown :trigger="['click']" v-if="item.userId == userInfo.id">
              <a-icon icon="more-outlined" @click.prevent />
              <template #overlay>
                <a-menu>
                  <a-menu-item style="width: 100px;">
                    <span @click="deleteComment(item.id)">删除</span>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
          <template #author>
            <a>{{ item.username }}</a>
            <span v-if="item.replyId"> 回复 </span>
            <a style="color:blue;">{{ item.replyName }}</a>
          </template>
          <template #avatar>
            <a-avatar :src="item.avatar" :alt="item.username" />
          </template>
          <template #content>
            <p>
              {{ item.content }}
            </p>
          </template>
          <template #datetime>
            <a-tooltip :title="dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')">
              <span>{{ dayjs(item.createTime).fromNow() }}</span>
            </a-tooltip>
          </template>
        </a-comment>
      </a-list-item>
      <AddComment style="left:40px ;position: relative;" v-if="item.id == reply" :commentId="item.commentId" type="REPLY"
        :blogId="item.blogId" :replyName="item.username" :replyId="item.userId" @getCommentList="getCommentList" />
    </template>
  </a-list>
</template>
<script setup lang="ts">
import { useRequest } from 'vue-request';
import { ViewCommentResp } from '../model/commentModel';
import { useUserInfo } from '../store/userInfo';
import { useResult } from '../model/frontModel';
import request from '../utils/request';
import AIcon from '../utils/icon';
import dayjs from 'dayjs';
import AddComment from '../components/addComment.vue'


const props = defineProps<{ commentList: Array<ViewCommentResp>; reply: string }>()
const userInfo = useUserInfo()
const emit = defineEmits(['getCommentList', 'update:reply'])

const change = (id: string) => {
  emit('update:reply', id)
}

const getCommentList = () => {
  emit('getCommentList')
}

const { run: deleteComment } = useRequest<useResult<string>>((id: string) =>
  request.post('/BLOG/mongo/comment/delete', {
    id: id
  }).finally(() => {
    emit('getCommentList');
  }),
  {
    manual: true
  }
)
</script>