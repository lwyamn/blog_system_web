<template>
  <a-tabs v-model:activeKey="activeKey">
    <a-tab-pane key="blog" tab="文章">
      <a-blogInfoList style="margin:10px;" :blogInfo="blogInfo" @getBlogInfo="getBlogInfo"/>
    </a-tab-pane>
    <a-tab-pane key="collect" tab="收藏">
      <a-blogInfoList style="margin:10px;" :blogInfo="collect"/>
    </a-tab-pane>
    <a-tab-pane key="follow" tab="关注" v-if="userId===useUserInfo().id">
      <followList style="margin:10px;"/>
    </a-tab-pane>
    <a-tab-pane key="fans" tab="粉丝" v-if="userId===useUserInfo().id">
      <fansList style="margin:10px;"/>
    </a-tab-pane>
  </a-tabs>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRequest } from 'vue-request';
import { PageDTO, useResult } from '../model/frontModel';
import {  QueryBlogResp } from '../model/blogModel';
import { queryBlog, blogCollect } from '../api/blogAPi'
import ABlogInfoList from './blogInfoLIst.vue'
import router from '../router/router';
import followList from '../components/followList.vue'
import { useUserInfo } from '../store/userInfo';
import fansList from './fansList.vue';
const userId = computed(() => router.currentRoute.value.params.userId);
const queryBlogReq = ref({
  userId: userId,
  currentPage: 1,
  pageSize: 100,
})
const activeKey = ref('blog')
const { data: BlogCollect} = useRequest<useResult<QueryBlogResp>>(() => blogCollect(userId.value))
const { data: BlogInfo,run:getBlogInfo} = useRequest<useResult<PageDTO<QueryBlogResp>>>(() =>queryBlog(queryBlogReq.value))

const blogInfo = computed(() => {
  return BlogInfo.value?.data.data.dataVO || [];
})

const collect = computed(() => {
  return BlogCollect.value?.data.data || [];
})
</script>