<template>
  <a-layout>
    <a-layout-header>
      <a-row class="row">
        <a-col :span="10">
          <a-menu theme="dark" mode="horizontal" :style="{ lineHeight: '64px' }" :selectedKeys="state">
            <a-menu-item key="main">
              <a-icon icon="home-outlined"></a-icon>
              首页
              <router-link to="/main/home" />
            </a-menu-item>
            <a-menu-item key="write">
              <a-icon icon="form-outlined"></a-icon>
              写博客
              <router-link to="/main/write" />
            </a-menu-item>
            <a-menu-item key="home">
              <a-icon icon="user-outlined"></a-icon>
              个人首页
              <router-link :to="`/main/userHome/${userInfo.id}`" />
            </a-menu-item>
            <a-menu-item v-if="userInfo.userType == 1">
              <a-icon icon="bars-outlined"></a-icon>
              后台
              <router-link to="/back" />
            </a-menu-item>
          </a-menu>
        </a-col>
        <a-col :span="11">
          <a-search/>
        </a-col>
        <a-col :span="2" class="col">
          <a-menu theme="dark" mode="horizontal" :style="{ lineHeight: '64px' }" :selectedKeys="state">
            <a-menu-item key="message">
              <a-icon icon="comment-outlined"></a-icon>
              消息
              <router-link to="/main/message/" />
            </a-menu-item>
          </a-menu>
        </a-col>
        <a-col :span="1" class="col">
          <a-avatar></a-avatar>
        </a-col>
      </a-row>
    </a-layout-header>
    <a-layout-content style="padding: 50px 100px 20px;min-height: 800px;">
      <routebreadcrumb style="text-align: left;" />
      <div :style="{ background: '#fff', minHeight: '800px',borderRadius: '20px'}">
        <router-view />

      </div>
    </a-layout-content>
    <a-layout-footer style="text-align: center;">
      个人博客系统 ©2023 Created by 林志杰
    </a-layout-footer>
  </a-layout>
</template>
<script lang="ts" setup>
import AAvatar from "../components/avatar.vue"
import { useUserInfo } from "../store/userInfo";
import routebreadcrumb from "../components/routebreadcrumb.vue";
import AIcon from "../utils/icon";
import { onMounted, ref } from "vue";
import ASearch from '../components/search.vue'

const userInfo = useUserInfo()
onMounted(()=>{
  userInfo.get()
})
const state = ref([])
</script>
<style scoped>
.row .col{
  left: 40px;
}
</style>
  