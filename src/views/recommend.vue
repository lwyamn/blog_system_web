<template>
  <a-config-provider>
    <template #renderEmpty>
      <a-spin v-if="loading" style="text-align: center;" size="large"/>
    </template>
    <a-list item-layout="vertical" size="large" :pagination="pagination" :data-source="blogs" style="text-align: left;">
      <template #renderItem="{ item }">
        <a-list-item key="item.id" style="padding: 10px;">
          <a-list-item-meta :description="item.description">
            <template #title>
              <router-link :to="{ name: '博客', params: { blogId: item.id } }">{{ item.title }}</router-link>
            </template>
            <template #avatar>
              <router-link :to="{ name: '个人首页', params: { userId: item.userId }}">
                <a-avatar :src="item.userAvatar" :size="{ xs: 18, sm: 24, md: 30, lg: 48, xl: 60, xxl: 60 }"
                  :draggable="true"></a-avatar>
              </router-link>
            </template>
          </a-list-item-meta>
          <template #actions>
            <span style="font-size: 15px;margin-bottom: 10px;">
              <a-tooltip>
                <a-icon icon="star-filled" v-if="collectMessage.get(item.id)?.isCollect"
                  @click="cancelCollects(item.id, item.userId)" />
                <a-icon icon="star-outlined" v-else @click="addCollects(item.id, item.userId)" />
                {{ collectMessage.get(item.id)?.collectNumber }}
                <a-divider type="vertical" />
                <a-icon icon="like-filled" v-if="likeMessage.get(item.id)?.isLike"
                  @click="cancelLike(item.id, item.userId)" />
                <a-icon icon="Like-outlined" v-else @click="addLike(item.id, item.userId)" />
                {{ likeMessage?.get(item.id)?.likeNumber }}
                <span style="font-weight: 700;margin-left: 10px;">作者:</span>
                <router-link :to="{ name: '个人首页', params: { userId: item.userId }}">{{ item.author }}</router-link>
              </a-tooltip>
            </span>
          </template>
          <template #extra>
            <router-link :to="{ name: '博客', params: { blogId: item.id } }">
              <img width="200" height="100" alt="logo" :src="item.cover" />
            </router-link>
          </template>
        </a-list-item>
      </template>
    </a-list>
  </a-config-provider>
</template>
<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useRequest } from 'vue-request';
import { HomeBlogResp, QueryBlogReq } from '../model/blogModel';
import { PageDTO, Result, useResult } from '../model/frontModel';
import { LikeReq, LikeResp } from '../model/likeModel';
import { CollectReq, CollectResp } from '../model/collectModel'
import AIcon from '../utils/icon';
import request from '../utils/request';
import { message } from 'ant-design-vue';
const loading = ref<boolean>(true);
const queryBlogReq = ref<QueryBlogReq>({
  blogId: '',
  title: '',
  author: '',
  userId: '',
  currentPage: 1,
  pageSize: 5,
});
const likeReq = ref<LikeReq>({
  author: '',
  blogId: '',
  blogIds: [],
  userId: ''
})
const collectReq = ref<CollectReq>({
  author: '',
  blogId: '',
  userId: '',
  blogIds: [],
})
const collectMessage = ref<Map<string, CollectResp>>(new Map)
const likeMessage = ref<Map<string, LikeResp>>(new Map);

const { data: blog, run: searchBlog } = useRequest<useResult<PageDTO<HomeBlogResp>>>(() =>
  request.post("/BLOG/blog/home", queryBlogReq.value).finally(()=>{
    loading.value=false
  })
);
const { run: add } = useRequest<useResult<string>>((add: LikeReq) =>
  request.post("/BLOG/like/add", add),
  {
    manual: true
  }
)
const { run: cancel } = useRequest<useResult<string>>((cancel: LikeReq) =>
  request.post("/BLOG/like/cancel", cancel),
  {
    manual: true
  }
)
const searchLike = async () => {
  const resp = await request.post<Result<LikeResp[]>>("/BLOG/like/get", likeReq.value);
  return resp.data.data
}
//分页
const pagination = computed(() => {
  return {
    hideOnSinglePage:true,
    position:'bottom',
    current: queryBlogReq.value.currentPage, // 当前页
    pageSize: queryBlogReq.value.pageSize, // 页大小
    total: blog.value?.data.data.total,
    onChange: onChange
  };
});
const onChange = (current: number, size: number) => {
  loading.value=true
  queryBlogReq.value.currentPage = current ?? 1;
  queryBlogReq.value.pageSize = size ?? 5;
  searchBlog();
  getLikeAndCollect()
};

const blogs = computed(() => {
  return blog.value?.data.data.dataVO || [];
});
watch(blogs, () => {
  getLikeAndCollect()
})
const getLikeAndCollect = async () => {
  const ids = blogs.value.map(blog => blog.id);
  likeReq.value.blogIds = ids;
  collectReq.value.blogIds = ids;
  const likeVOs = await searchLike()
  const collectVOs = await searchCollect()
  likeVOs.forEach(likeVO => {
    likeMessage.value.set(likeVO.blogId, likeVO)
  })
  collectVOs.forEach(collectVO => {
    collectMessage.value.set(collectVO.blogId, collectVO)
  })
}
const addLike = (blogId: string, userId: string) => {
  add({
    blogId: blogId,
    author: userId
  });

  const like: LikeResp | undefined = likeMessage.value.get(blogId)
  if (like) {
    like.isLike = true;
    like.likeNumber++;
    likeMessage.value.set(blogId, like);
  }
}

const cancelLike = (blogId: string, userId: string) => {
  cancel({
    blogId: blogId,
    author: userId
  });

  const like: LikeResp | undefined = likeMessage.value.get(blogId)
  if (like) {
    like.isLike = false;
    like.likeNumber--;
    likeMessage.value.set(blogId, like);
  }
}


//收藏
const { run: addCollect } = useRequest<useResult<string>>((add: CollectReq) =>
  request.post("/BLOG/collect/addRedis", add),
  {
    manual: true
  }
)
const { run: cancelCollect } = useRequest<useResult<string>>((cancel: CollectReq) =>
  request.post("/BLOG/collect/cancelRedis", cancel),
  {
    manual: true
  }
)
const searchCollect = async () => {
  const resp = await request.post<Result<CollectResp[]>>("/BLOG/collect/getRedis", collectReq.value);
  return resp.data.data
}

const addCollects = (blogId: string, userId: string) => {
  if (collectMessage.value.get(blogId)?.isCollect) {
    message.error("已经收藏过了")
    return
  }
  addCollect({
    blogId: blogId,
    author: userId
  });

  const collect: CollectResp | undefined = collectMessage.value.get(blogId)
  if (collect) {
    collect.isCollect = true;
    collect.collectNumber++;
    collectMessage.value.set(blogId, collect);
  }
}

const cancelCollects = (blogId: string, userId: string) => {
  cancelCollect({
    author: userId,
    blogId: blogId
  });

  const collect: CollectResp | undefined = collectMessage.value.get(blogId)
  if (collect) {
    collect.isCollect = false;
    collect.collectNumber--;
    collectMessage.value.set(blogId, collect);
  }
}
</script>
<style scoped></style>

