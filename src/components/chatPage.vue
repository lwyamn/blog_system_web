<template>
  <template v-if="chatUserId">

    <a-space :size="10" style="display: flex;" direction="vertical" class="space">
      <div>
        <div class="header">
          <router-link :to="`/main/userHome/${userInfo?.id}`">
            <a-typography-title style="margin: 10px;" :level="4">{{
              userInfo?.username }}</a-typography-title>
          </router-link>
        </div>

        <div class="content" id="chatContent">
          <a-list :dataSource="chatMessage" :split="false" style="overflow: scroll;" v-if="chatMessage.length">
            <template #renderItem="{ item }">
              <a-list-item class="item item-left" v-if="item.userId == userInfo?.id && item.chatUserId != userInfo?.id">
                <div>
                  <a-avatar :src="userInfo?.avatar" />
                </div>
                <div class="bubble bubble-left">{{ item.content }}</div>
              </a-list-item>
              <a-list-item class="item item-right" v-else>
                <div class="bubble bubble-right">{{ item.content }}</div>
                <div>
                  <a-avatar :src="useUserInfo().avatar" />
                </div>
              </a-list-item>
            </template>
          </a-list>
        </div>
        <div class="footer">
          <div class="textarea-container">
            <a-textarea v-model:value="message.content" style="min-height: 100px;" :rows="4" :bordered="false"
              :autoSize="{ minRows: 4, maxRows: 4 }" @keydown.enter.prevent="sendSingleMessage" />
            <a-button type="primary" @click="sendSingleMessage" class="send-button">发送</a-button>
          </div>
        </div>
      </div>
    </a-space>
  </template>
  <template v-else>
    <a-typography-title style="margin-top: 200px;" class="input" :level="3">您还未选中或者发起聊天，快去跟好友聊一聊吧</a-typography-title>
  </template>
</template>
<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted } from 'vue';
import router, { userId } from '../router/router';
import { useRequest } from 'vue-request';
import { useResult } from '../model/frontModel';
import { QueryUserResp } from '../model/userModel';
import { getUserById } from '../api/userAPi';
import { get, send } from '../api/chatApi';
import { MessageReq, QueryChatMessageResp } from '../model/chatModel';
import { useUserInfo } from '../store/userInfo';
import { useWebSocket } from '@vueuse/core';
import { isEmpty } from 'lodash';
const chatUserId = computed(() => {
  return router.currentRoute.value.params.userId as string || ''
})
const { data: yourMessage } = useWebSocket(`ws://localhost:8080/websocket/${userId.value}`)
const chatMessage = ref<Array<QueryChatMessageResp>>([])
watch(yourMessage, (msg: string) => {
  const m: QueryChatMessageResp = JSON.parse(msg);
  console.log(m);
  
  if (m.userId === chatUserId.value) {
    chatMessage.value.push(m)
    nextTick(() => {
      skip()
    })
  }
})

const message = ref<MessageReq>({
  chatUserId: chatUserId.value,
  content: ''
})
const { data: chatUser, run: getUser } = useRequest<useResult<QueryUserResp>>(() => getUserById(chatUserId.value), { manual: true })
const { data: chatList, run: getChatList } = useRequest<useResult<Array<QueryChatMessageResp>>>(() => get({
  chatUserId: chatUserId.value
}))
const { run: chat } = useRequest<useResult<QueryChatMessageResp>>(() => send(message.value).then(resp => {
  chatMessage.value.push(resp.data.data)
  nextTick(() => {
    skip()
  })
  return resp;
}), { manual: true })

const sendSingleMessage = (event: any) => {
  event.preventDefault();
  if (!isEmpty(message.value.chatUserId)) {
    chat()
    message.value.content = '';
  }
}
watch(chatUserId, () => {
  if (!isEmpty(chatUserId.value)) {
    message.value.content = '';
    getUser();
    getChatList()
  }
})
watch(chatList, (msg) => {
  chatMessage.value = msg?.data.data || []
})
const userInfo = computed(() => {
  if (chatUserId.value && !chatUser.value) {
    getUser()
  }
  return chatUser.value?.data.data
})
const skip = () => {
  const obj = document.getElementById('chatContent');
  if (obj) {
    obj.scrollTop = obj.scrollHeight
  }
}
watch(chatMessage, () => {
  nextTick(() => {
    skip()
  })
})
</script>
<style scoped>
.header {
  border-bottom: 0.5px solid #e0e0e0;
  text-align: left;
}

.footer {
  max-height: 100px;
  border-top: 0.5px solid #e0e0e0;
}

.content {
  height: 800px;
  overflow-y: scroll;
  background-color: #f5f5f5;
}

.content:hover::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
}

.bubble {
  max-width: 400px;
  padding: 10px;
  border-radius: 5px;
  position: relative;
  color: #000;
  word-wrap: break-word;
  word-break: normal;
}

.item-left .bubble {
  margin-left: 15px;
  background-color: #fff;
}

.item-left .bubble:before {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-top: 10px solid transparent;
  border-right: 11px solid #fff;
  border-bottom: 10px solid transparent;
  left: -20px;
}

.item-right .bubble {
  margin-right: 15px;
  background-color: #9eea6a;
}

.item-right .bubble:before {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  border-left: 11px solid #9eea6a;
  border-top: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid transparent;
  right: -20px;
}

.item {
  width: 100%;
}

.item.item-left {
  margin-left: 5px;
  justify-content: flex-start;
}

.item.item-right {
  margin-right: 5px;
  justify-content: flex-end;
}

.item.item-center {
  justify-content: center;
}

.item.item-center span {
  font-size: 12px;
  padding: 2px 4px;
  color: #fff;
  background-color: #dadada;
  border-radius: 3px;
  -moz-user-select: none;
  /*火狐*/
  -webkit-user-select: none;
  /*webkit浏览器*/
  -ms-user-select: none;
  /*IE10*/
  -khtml-user-select: none;
  /*早期浏览器*/
  user-select: none;
}


/* 设置滚动条的样式 */
::-webkit-scrollbar {
  width: 10px;
}

/* 滚动槽 */
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.3);
  border-radius: 8px;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(0, 0, 0, 0);
  -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5);
}

/* 设置滚动条右下角的样式 */
::-webkit-scrollbar-corner {
  background: #f5f5f5;
}

.textarea-container {
  position: relative;
}

.send-button {
  position: absolute;
  bottom: 10px;
  right: 10px;
}
</style>