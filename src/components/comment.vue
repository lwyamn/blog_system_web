<template>
  <div style="margin: 20px;">
    <AddComment type="GENERAL" :blogId="props.blogId" @getCommentList="getCommentList"></AddComment>
  </div>
  <div style="margin: 20px;text-align: left;">
    <a-list v-if="getComment().length" :data-source="getComment()" :header="`${getComment().length} 回复`"
      item-layout="horizontal">
      <template #footer>
        <div style="text-align: center;">
          <b>没有更多评论了</b>
        </div>
      </template>
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
        <a-reply v-model:reply="reply" @getCommentList="getCommentList" style="left:40px ;"
          :commentList="getReply(item.id)" v-if="getReply(item.id).length != 0" />
        <AddComment style="left:40px ;position: relative;" v-if="reply == item.id" :commentId="reply" type="REPLY"
          :blogId="item.blogId" @getCommentList="getCommentList" />
      </template>
    </a-list>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRequest } from 'vue-request';
import { ViewCommentReq, ViewCommentResp } from '../model/commentModel';
import { useResult } from '../model/frontModel';
import request from '../utils/request';
import AddComment from '../components/addComment.vue'
import AIcon from '../utils/icon';
import { useUserInfo } from '../store/userInfo';
import AReply from '../components/reply.vue'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
const props = defineProps<{ blogId: any }>()
const userInfo = useUserInfo();
const reply = ref<string>('')

const getReply = (id: string) => {
  return commentList.value.filter(comment => comment.commentId == id);
}
const getComment = () => {
  return commentList.value.filter(comment => comment.type != 'REPLY')
}
const change = (id: string) => {
  reply.value = reply.value == id ? '' : id
}

const viewCommentReq = ref<ViewCommentReq>({
  id: '',
  userId: '',
  blogId: props.blogId,
  type: '',
  currentPage: 1,
  pageSize: 10,
})
const { data: comment, run: getCommentList } = useRequest<useResult<Array<ViewCommentResp>>>(() =>
  request.post('/BLOG/mongo/comment/view', viewCommentReq.value).finally(()=>{
    console.log('666');
    
    reply.value=''
  })
)

const { run: deleteComment } = useRequest<useResult<string>>((id: string) =>
  request.post('/BLOG/mongo/comment/delete', {
    id: id
  }).finally(() => {
    getCommentList()
  }),
  {
    manual: true
  }
)

const commentList = computed(() => {
  return comment.value?.data.data || [];
})
</script>
<style>
.ant-list-item-action-split {
  position: unset;
}

element.style {
  display: inline;
}
</style>