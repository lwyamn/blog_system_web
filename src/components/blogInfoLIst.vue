<template>
  <a-config-provider>
    <template #renderEmpty>
    </template>
    <a-list item-layout="vertical" :data-source="blogInfo" style="text-align: left;">
    <template #renderItem="{ item }">
      <a-list-item>
        <template #actions>
          <span>发布博客:{{ item.createTime }}</span>
          <span>点赞数:{{ item.likeNumber }}</span>
          <span>收藏数:{{ item.collectNumber }}</span>
          <div v-if="isEqual(userId,homeUserId)">
            <a-space>
              <a>编辑</a>
              <a @click="delBlog(item.id)">删除</a>
            </a-space>
          </div>
        </template>
        <a-skeleton avatar :loading="!blogInfo" active>
          <a-list-item-meta :description="item.description">
            <template #title>
              <router-link :to="{ name: '博客', params: { blogId: item.id } }">{{ item.title }}</router-link>
            </template>
          </a-list-item-meta>
        </a-skeleton>
      </a-list-item>
    </template>
  </a-list>
  </a-config-provider>
</template>
<script setup lang="ts">
import { isEqual } from 'lodash';
import { QueryBlogResp } from '../model/blogModel';
import router, { userId } from '../router/router';
import { computed } from 'vue';
import { useRequest } from 'vue-request';
import { deleteBlog } from '../api/blogAPi'
const homeUserId = computed(() => router.currentRoute.value.params.userId);
defineProps<{ blogInfo: Array<QueryBlogResp> }>()
const emit = defineEmits(['getBlogInfo'])

const { run: delBlog } = useRequest((blogId: string) => deleteBlog({ blogIdLists: [blogId] }).finally(() => {
  emit('getBlogInfo');
}), { manual: true })


</script>