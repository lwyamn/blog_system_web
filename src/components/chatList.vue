<template>
    <a-menu theme="light" v-model:selectedKeys="chatUser">
        <template v-for="user in userList" :key="user.id">
            <template style="display: unset;">
                <a-menu-item :key="user.id">
                    <template #icon>
                        <a-avatar :src="user.avatar" />
                    </template>
                    <router-link :to="`/main/message/${user.id}`" />
                    <span style="margin-left: 10px;">{{ user.username }}</span>
                </a-menu-item>
            </template>
        </template>
    </a-menu>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import router from '../router/router';
import { useRequest } from 'vue-request';
import { useResult } from '../model/frontModel';
import { QueryUserResp } from '../model/userModel';
import { addChatList, getChatList } from '../api/chatApi';
const chatUserId = computed(() => {
  return router.currentRoute.value.params.userId as string || ''
})
const chatUser = ref([chatUserId.value])
const {data,run:getList} = useRequest<useResult<Array<QueryUserResp>>>(() => getChatList().then(resp=>{
  const data = resp.data.data;
  if(!data.find((user:QueryUserResp)=>user.id===chatUserId.value)&&chatUserId.value){
    addList()
  }
  return resp
}
))
const {run:addList} = useRequest(()=>addChatList(chatUserId.value).finally(getList),{manual:true});
const userList = computed(() => {
    return data.value?.data.data || []
})
</script>
<style scoped>
</style>