<template>
  <a-layout>
    <a-layout-header class="header">
      <a-row class="row">
        <a-col :span="22">
          <a-menu theme="dark" mode="horizontal" :style="{ lineHeight: '64px' }">
            <a-menu-item key="main">
              <a-icon icon="home-outlined"></a-icon>
              首页
              <router-link to="/main/home" />
            </a-menu-item>
          </a-menu>
        </a-col>
        <a-col :span="2" class="col">
          <a-avater />
        </a-col>
      </a-row>
    </a-layout-header>
    <a-layout-content style="padding: 50px 40px 20px;min-height: 81vh;">
      <routebreadcrumb style="text-align: left;" />
      <a-layout style="background: #fff;">
        <a-layout-sider width="200" style="padding:0;background: #fff;">
          <a-menu theme="dark" mode="inline" style="height: 100%;">
            <a-sub-menu key="user" title="用户管理">
              <a-menu-item key="userList">
                <a-icon icon="user-outlined"></a-icon>
                用户列表
                <router-link to="/back/userList" />
              </a-menu-item>
              <a-menu-item key="addUser">
                <a-icon icon="user-add-outlined"></a-icon>
                添加用户
                <router-link to="/back/addUser" />
              </a-menu-item>
            </a-sub-menu>
            <a-sub-menu key="blog" title="博客管理">
              <a-menu-item key="blogList">
                <a-icon icon="file-search-outlined"></a-icon>
                博客列表
                <router-link to="/back/blogList" />
              </a-menu-item>
            </a-sub-menu>
          </a-menu>
        </a-layout-sider>
        <a-layout-content theme="light" :style="{ padding: '24px', minHeight: '280px' }">
          <router-view />
        </a-layout-content>
      </a-layout>
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      个人博客系统 ©2023 Created by 林志杰
    </a-layout-footer>
  </a-layout>
</template>
<script lang="ts" setup>
import { onMounted} from "vue";
import AAvater from "../components/avatar.vue"
import { useUserInfo } from "../store/userInfo";
import routebreadcrumb from "../components/routebreadcrumb.vue";
import AIcon from "../utils/icon";

const userInfo = useUserInfo();
onMounted(() => {
  userInfo.get()
})
</script>
<style scoped>
.row .col{
  left: 40px;
}
</style>
