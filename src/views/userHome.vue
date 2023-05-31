<template>
  <a-layout>
    <a-layout-header class="header">
      <div>
        <a-avatar :src="userInfo?.avatar" :size="{ xs: 32, sm: 40, md: 50, lg: 80, xl: 100, xxl: 125 }">{{
          userInfo?.avatar ? undefined : userInfo?.username }}</a-avatar>
      </div>
      <div style="margin: 10px;">
        <a-descriptions :title="userInfo?.username" style="text-align: left;" :column="4">
          <template #extra>
            <a-span v-if="userId == useUserInfo().id">
              <a-button type="primary" href="/main/userCenter/userInfo">编辑资料</a-button>
            </a-span>
            <a-space v-else>
              <a-button type="primary" v-if="!followVisable" @Click="add()">关注</a-button>
              <a-button type="primary" v-else @Click="cancel()">已关注</a-button>
              <a-button type="primary"><router-link :to="`/main/message/${userId}`">私信</router-link></a-button>
            </a-space>
          </template>
          <a-descriptions-item :span="4">
            <a-tag color="red">{{ personal?.fansNumber }}粉丝</a-tag>
            <a-tag color="green">{{ personal?.blogNumber }}博客</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="ID" :span="4">{{ userInfo?.id }}</a-descriptions-item>
          <a-descriptions-item label="个人描述" :span="4">
            {{ userInfo?.personalProfile }}
          </a-descriptions-item>
          <a-descriptions-item label="手机号">{{ userInfo?.phone }}</a-descriptions-item>
          <a-descriptions-item label="邮箱">{{ userInfo?.email }}</a-descriptions-item>
          <a-descriptions-item label="创建时间">{{ userInfo?.createTime }}</a-descriptions-item>
        </a-descriptions>
      </div>

    </a-layout-header>
    <a-layout-content style="padding-top: 30px;">
      <a-layout>
        <a-layout-sider class="sider">
          <a-userInfoCard></a-userInfoCard>
        </a-layout-sider>
        <a-layout-content class="content">
          <myblog style="margin: 30px;"></myblog>
        </a-layout-content>
      </a-layout>
    </a-layout-content>
  </a-layout>
</template>
<script lang="ts" setup>
import { useRequest } from 'vue-request';
import Myblog from '../components/myBlog.vue';
import AUserInfoCard from '../components/userHomeCard.vue'
import { useResult } from '../model/frontModel';
import { QueryUserResp } from '../model/userModel';
import { getUserById } from '../api/userAPi';
import { computed, ref, watch, onMounted } from 'vue';
import router from '../router/router';
import { useUserInfo } from '../store/userInfo';
import { addFollow, cancelFollow, isFollow } from '../api/followAPI';
import { getPersonal } from '../api/commonAPi';
import { PersonalResp } from '../model/commonModel';
const followVisable = ref()
const userId = computed(() => router.currentRoute.value.params.userId as string);
const { data } = useRequest<useResult<QueryUserResp>>(() => getUserById(userId.value))
const { } = useRequest<useResult<boolean>>(() => isFollow({ followUserId: userId.value }).then(resp => {
  followVisable.value = resp.data.data
  return resp;
}))
const userInfo = computed(() => {
  return data.value?.data.data
})
const { run: add } = useRequest(() => addFollow({ followUserId: userId.value }).then(resp => {
  followVisable.value = true
  return resp;
}), { manual: true })
const { run: cancel } = useRequest(() => cancelFollow({ followUserId: userId.value }).then(resp => {
  followVisable.value = false
  return resp;
}), { manual: true })
const { data: personalMsg } = useRequest<useResult<PersonalResp>>(() => getPersonal(userId.value))
const personal = computed(() => {
  return personalMsg.value?.data.data
})
watch(userId, () => {
  if (userId.value) {
    router.go(0)
  }
})
</script>
<style scoped>
.header {
  padding: 20px;
  height: 100%;
  background: #fff;
  display: flex;
  border-radius: 10px;
}

.content {
  background: #fff;
  margin-left: 24px;
  border-radius: 15px;
}

.sider {
  background: rgb(241, 242, 246);
  min-height: 470px;
}
</style>