<template>
  <a-card title="个人成就" >
    <p>
      <a-space>
        <span>获得</span>
        <a-tag color="pink">{{ achievementMsg?.likeNumber }}</a-tag>
        <span>次点赞</span>
      </a-space>
    </p>
    <p>
      <a-space>
        <span>获得</span>
        <a-tag color="blue">{{ achievementMsg?.collectNumber }}</a-tag>
        <span>次收藏</span>
      </a-space>
    </p>
  </a-card>
  <br />
</template>
<script setup lang="ts">
import { useRequest } from 'vue-request';
import { useResult } from '../model/frontModel';
import { AchievementResp } from '../model/commonModel';
import { getAchievement } from '../api/commonAPi';
import { computed } from 'vue';
import router from '../router/router';
const userId = computed(() => router.currentRoute.value.params.userId as string);
const { data: achievement } = useRequest<useResult<AchievementResp>>(() => getAchievement(userId.value))
const achievementMsg = computed(() => {
  return achievement.value?.data.data
})
</script>