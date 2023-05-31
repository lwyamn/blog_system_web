<template>
  <a-config-provider>
    <template #renderEmpty>
    </template>
    <a-list item-layout="horizontal" :data-source="follows" style="text-align: left;">
      <template #renderItem="{ item }">
        <a-list-item>
          <template #actions>
            <a v-if="!followVisable.has(item.id)" @click="cancel(item.id)">已关注</a>
            <a v-else @click="add(item.id)">关注</a>
          </template>
          <a-list-item-meta :description="item.personalProfile">
            <template #title>
              <router-link :to="`/main/userHome/${item.id}`">
                <span>{{ item.username }}</span>
              </router-link>
            </template>
            <template #avatar>
              <router-link :to="`/main/userHome/${item.id}`">
                <a-avatar :src="item.avatar" />
              </router-link>
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>
  </a-config-provider>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRequest } from 'vue-request';
import { useResult } from '../model/frontModel';
import { QueryUserResp } from '../model/userModel';
import { addFollow, cancelFollow, followList } from '../api/followAPI';
const followVisable = ref<Set<String>>(new Set)
const { data: follow } = useRequest<useResult<Array<QueryUserResp>>>(() => followList())
const follows = computed(() => {
  return follow.value?.data.data || []
})
const { run: add } = useRequest((followUserId: string) => addFollow({ followUserId: followUserId }).then(resp => {
  followVisable.value.delete(followUserId)
  return resp;
}), { manual: true })
const { run: cancel } = useRequest((followUserId: string) => cancelFollow({ followUserId: followUserId }).then(resp => {
  followVisable.value.add(followUserId)
  return resp;
}), { manual: true })
</script>
