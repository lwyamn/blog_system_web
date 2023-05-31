<template>
  <div style="font-size: 20px;font-weight: 700; text-align: left;">账号设置</div>
  <a-divider />
  <a-list :data-source="settings">
    <template #renderItem="{ item }">
      <a-list-item class="list">
        <span>{{ item.name }}</span>
        <a :href='item.href'>{{ item.settingName }}</a>
      </a-list-item>
    </template>
  </a-list>
</template>
<script setup lang="ts">
interface setting {
  name: string;
  settingName: string;
  href:string;
}
const settings: setting[] = [
  {
    name: '密码',
    settingName: '设置密码',
    href:'/main/userCenter/accountSettings/password'
  },
  {
    name: '手机',
    settingName: '设置手机',
    href:''
  },
  {
    name: '邮箱',
    settingName: '设置邮箱',
    href:''
  },
  {
    name: '第三方平台',
    settingName: '设置第三方平台',
    href:''
  },
  {
    name: '登录记录',
    settingName: '查看记录',
    href:''
  },
  {
    name: '账号注销',
    settingName: '立刻注销',
    href:''
  }
];
</script>
<style scoped>
.list span{
  text-align: left;
}
.list a{
  text-align: right;
}
</style>