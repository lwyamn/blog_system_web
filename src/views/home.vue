<template>
  <div style="padding: 24px;">
    <a-tabs v-model:activeKey="activeKey" :tabClick="changeTab(activeKey)">
    <a-tab-pane :key="tag.key" :tab="tag.tab" v-for="tag of tags" ></a-tab-pane>
  </a-tabs>
  <router-view/>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import router from "../router/router";

interface tag{
  key:string,
  tab:string,
}
const activeKey = ref("/main/home/recommend")
const changeTab = (path:string)=>{
  router.push(path)
}
const tags:tag[] =[
  {
    key:"/main/home/recommend",
    tab:"推荐",
  },
  {
    key:"/main/home/attention",
    tab:"关注",
  }
]

</script>