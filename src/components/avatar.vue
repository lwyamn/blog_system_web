<template>
  <div class="avater">
    <a-dropdown placement="bottom">
      <a-avatar size="large" :src="userInfo.avatar">
        {{ userInfo.avatar ? undefined : userInfo.username }}
      </a-avatar>
      <template #overlay>
        <a-menu>
          <div style="text-align: center;margin-bottom: 10px;">
            <b>{{ userInfo.username }}</b>
          </div>
          <a-menu-item key="userInfo">
            <a-button @click="changeVisible()">
              <a>
                <a-icon icon="contacts-outlined"></a-icon>
                个人信息
              </a>
              <a-userInfo :userInfo="userInfo" v-model:visible="userInfoVisible"></a-userInfo>
            </a-button>
          </a-menu-item>
          <a-menu-item key="logout">
            <a-button @click="getOut()">
              <a>
                <a-icon icon="poweroff-outlined"></a-icon>
                退出登录
              </a>
            </a-button>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import router, { token } from "../router/router";
import { useUserInfo } from "../store/userInfo";
import AUserInfo from "../components/userInfo.vue"
import AIcon from "../utils/icon";
const userInfo = useUserInfo()
const userInfoVisible = ref<boolean>(false);
const getOut = () => {
  token.value = null;
  router.push("/login");
};
const changeVisible = () => {
  userInfoVisible.value = userInfoVisible.value ? false : true;
};
</script>
<style scoped>
.avater {
  font-family: "宋体";
  font-size: 15px;
  color: white;
}
</style>