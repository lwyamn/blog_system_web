<template>
  <a-layout>
    <a-layout-content style="padding-top: 30px;">
      <a-layout>
        <a-layout-sider class="sider">
          <userInfoCard :userId="blogInfo?.userId" />
        </a-layout-sider>
        <a-layout-content class="content">
          <div>
            <h1>{{ blogInfo?.title }}</h1>
            <h4>
              <a-icon icon="user-outlined"></a-icon>
              作者:{{ blogInfo?.author }}
            </h4>
            <h4>
              <a-icon icon="hourglass-outlined"></a-icon>
              创作时间:{{ blogInfo?.createTime }}
            </h4>
            <h4>
              <a-icon icon="Like-outlined" />
              点赞数:{{ blogInfo?.likeNumber }} |
              <a-icon icon="star-outlined" />
              收藏数:{{ blogInfo?.collectNumber }}
            </h4>
          </div>
          <a-typography-text type="success">{{ blogInfo?.description }}</a-typography-text>
          <div style="text-align:start;margin: 20px 40px 20px 40px">
            <div v-html="htmlValue" style="min-height: 500px;word-break: break-all;" />
          </div>
          <div style="margin-left: 30px;">
            <a-comment :blogId="blogId" />
          </div>
        </a-layout-content>
      </a-layout>
    </a-layout-content>
  </a-layout>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRequest } from 'vue-request';
import { QueryBlogResp } from '../model/blogModel';
import { useResult } from '../model/frontModel';
import userInfoCard from '../components/userInfoCard.vue';
import AComment from '../components/comment.vue'
import router from '../router/router';
import request from '../utils/request';
import AIcon from '../utils/icon';
const htmlValue = ref()
const blogId = computed(() => router.currentRoute.value.params.blogId);
const { data } = useRequest<useResult<QueryBlogResp>>(() =>
  request.get(`/BLOG/blog/detail/${blogId.value}`)
)

const blogInfo = computed(() => {
  htmlValue.value = data.value?.data.data.content;
  return data.value?.data.data;
})
watch(blogId,()=>{
  if(blogId.value){
    router.go(0)
  }
})
</script>
<style scoped>
.content {
  background: #fff;
  margin-left: 40px;
  padding: 30px;
  border-radius: 20px;
}

.sider {
  background: rgb(241, 242, 246);
  min-height: 300px;
}
</style>