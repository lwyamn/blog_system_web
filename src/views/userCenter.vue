<template>
  <a-layout style="padding: 24px 0; background: #fff">
    <a-layout-sider width="200" style="background: #fff">
      <a-menu mode="inline" style="height: 100%">
        <a-menu-item key="userInfo">
          个人资料
          <router-link to="/main/userCenter/userInfo" />
        </a-menu-item>
        <a-menu-item key="setting">
          账号设置
          <router-link to="/main/userCenter/accountSettings"/>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout-content :style="{ padding: '0 24px', minHeight: '280px' }">
      <router-view />
    </a-layout-content>
  </a-layout>
</template>