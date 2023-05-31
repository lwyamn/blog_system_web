<template>
  <a-card hoverable style="border-radius: 20px;">
    <template #actions>
      <a-tooltip placement="top" title="私信">
        <router-link :to="`/main/message/${userInfo?.id}`"><a-icon icon="message-outlined" /></router-link>
      </a-tooltip>
      <a-tooltip placement="top" :title="isfollowStatus?'取关':'关注'">
        <a-icon icon="heart-filled" v-if="isfollowStatus" @Click ="cancel"/>
        <a-icon icon="heart-outlined" @Click="add" v-else/>
      </a-tooltip>
    </template>
    <a-card-meta :title="userInfo?.username" :description="'创作' + dayjs().diff(userInfo?.createTime, 'day') + '天'">
      <template #avatar>
        <router-link :to="`/main/userHome/${userInfo?.id}`">
          <a-avatar :src="userInfo?.avatar" />
        </router-link>
      </template>
    </a-card-meta>
  </a-card>
</template>
<script setup lang="ts">
import { useRequest } from 'vue-request';
import AIcon from '../utils/icon';
import { useResult } from '../model/frontModel';
import { QueryUserResp } from '../model/userModel';
import { getUserById } from '../api/userAPi';
import { computed } from '@vue/reactivity';
import { watch, ref } from 'vue';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { addFollow, isFollow ,cancelFollow} from '../api/followAPI';
dayjs.extend(relativeTime)
const props = defineProps<{ userId: string | undefined }>()
const isfollowStatus = ref()
const { data, run: getUserInfo } = useRequest<useResult<QueryUserResp>>(() => getUserById(props.userId), { manual: true })

const {run:getIsFollow} = useRequest<useResult<boolean>>(()=>isFollow({followUserId:props.userId}).then(resp=>{
  isfollowStatus.value = resp.data.data || false
  return resp;
}),{ manual: true })

const { run: add } = useRequest(() => addFollow({followUserId:props.userId}).then(resp => {
  isfollowStatus.value = true
  return resp;
}),{manual:true})
const { run: cancel } = useRequest(() => cancelFollow({followUserId:props.userId}).then(resp => {
  isfollowStatus.value = false
  return resp;
}),{manual:true})

watch(props, () => {
  if (props.userId) {
    getUserInfo()   
    getIsFollow()
  }
})
const userInfo = computed(() => {
  return data.value?.data.data
})
</script>