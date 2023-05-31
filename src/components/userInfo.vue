<template>
  <a-modal :visible="userInfoVisible" title="个人信息" footer="">
    <a-avatar :size="{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }" :src="userInfo.avatar">
      {{ userInfo.avatar ? undefined : userInfo.username }}
    </a-avatar>
    <a-divider type="horizontal" orientation="center"></a-divider>
    <div class="modal">
      <div>ID:{{ userInfo.id }}</div><br>
      <div>用户名: {{ userInfo.username }}</div><br>
      <div>邮箱: {{ userInfo.email }}</div><br>
      <div>手机号: {{ userInfo.phone }}</div><br>
      <div>个人描述: {{ userInfo.personalProfile }}</div><br>
      <div>创建时间: {{ userInfo.createTime }}</div><br>
      <div>用户类型: <a-tag :color="verifyUserType(userInfo.userType).color">{{ verifyUserType(userInfo.userType).userType
      }}</a-tag></div>
      <br>
      <a-button type="primary" href="/main/userCenter/userInfo">修改个人信息</a-button>
    </div>
  </a-modal>
</template>
<script lang="ts" setup>
import { QueryUserResp } from '../model/userModel';
import { verifyUserType } from '../utils/verify';
defineProps<{ userInfo: QueryUserResp, userInfoVisible: boolean }>()
</script>
<style scoped>
.modal {
  position: relative;
  text-align: left;
  font-weight: 800;
}
</style>