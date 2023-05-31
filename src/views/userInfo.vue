<template>
  <div style="font-size: 20px;font-weight: 700; text-align: left;">基本信息</div>
  <a-divider />
  <div style="text-align:left">
    <a-form class="addForm" :model="user" :labelCol="{ style: { width: '150px' } }" :wrapperCol="{ span: 14 }">
      <a-form-item name="avatar" label="头像" :wrapperCol="{ span: 9 }" :labelCol="{ span: 2 }">
        <div style="display: inline;">
          <a-avatar :size="80" :src="userInfo.avatar">
          </a-avatar>
        </div>
        <updateAvatar v-model:picVisible="picVisible" :userId="userInfo.id" />
      </a-form-item>
      <a-form-item name="id" label="ID" :wrapperCol="{ span: 6 }" :labelCol="{ span: 2 }">
        {{ userInfo.id }}
      </a-form-item>
      <a-form-item name="username" label="用户名" :wrapperCol="{ span: 9 }" :labelCol="{ span: 2 }">
        <div v-if="item.get('username')">
          <a-input style="width: 150px;" v-model:value="user.username" @pressEnter="save('username')" />
          <a-icon icon="check-outlined" @click="save('username')"></a-icon>
          <a-icon icon="close-outlined" @click="close('username')"></a-icon>
        </div>
        <div v-else>
          {{ userInfo.username }}
          <a-icon icon="edit-outlined" @click="edit('username')"></a-icon>
        </div>
      </a-form-item>
      <a-form-item name="email" label="邮箱" :wrapperCol="{ span: 9 }" :labelCol="{ span: 2 }">
        <div v-if="item.get('email')">
          <a-input style="width: 150px;" v-model:value="user.email" @pressEnter="save('email')" />
          <a-icon icon="check-outlined" @click="save('email')"></a-icon>
          <a-icon icon="close-outlined" @click="close('email')"></a-icon>
        </div>
        <div v-else>
          {{ userInfo.email }}
          <a-icon icon="edit-outlined" @click="edit('email')"></a-icon>
        </div>
      </a-form-item>
      <a-form-item name="phone" label="手机号" :wrapperCol="{ span: 9 }" :labelCol="{ span: 2 }">
        <div v-if="item.get('phone')">
          <a-input style="width: 150px;" v-model:value="user.phone" @pressEnter="save('phone')" />
          <a-icon icon="check-outlined" @click="save('phone')"></a-icon>
          <a-icon icon="close-outlined" @click="close('phone')"></a-icon>
        </div>
        <div v-else>
          {{ userInfo.phone }}
          <a-icon icon="edit-outlined" @click="edit('phone')"></a-icon>
        </div>
      </a-form-item>
      <a-form-item name="personalProfile" label="个人简介" :wrapperCol="{ span: 9 }" :labelCol="{ span: 2 }">
        <div v-if="item.get('personalProfile')">
          <a-textarea :autosize="true" :maxlength="50" show-count allow-clear v-model:value="user.personalProfile"
            @pressEnter="save('personalProfile')" />
          <a-icon icon="check-outlined" @click="save('personalProfile')"></a-icon>
          <a-icon icon="close-outlined" @click="close('personalProfile')"></a-icon>
        </div>
        <div v-else>
          {{ userInfo.personalProfile }}
          <a-icon icon="edit-outlined" @click="edit('personalProfile')"></a-icon>
        </div>
      </a-form-item>
      <a-form-item name="userType" label="用户类型" :wrapperCol="{ span: 6 }" :labelCol="{ span: 2 }">
        <a-tag :color="verifyUserType(userInfo.userType).color">{{
          verifyUserType(userInfo.userType).userType
        }}</a-tag>
      </a-form-item>
      <a-form-item name="createTime" label="创建时间" :wrapperCol="{ span: 6 }" :labelCol="{ span: 2 }">
        {{ userInfo.createTime }}
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 6, offset: 2 }">
      <a-button type="primary" @click="changeUpPic">修改头像</a-button>
    </a-form-item>
    </a-form>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import AIcon from "../utils/icon"
import { useUserInfo } from "../store/userInfo";
import { verifyUserType } from "../utils/verify";
import updateAvatar from "../components/updateAvatar.vue";
const picVisible = ref(false)
const userInfo = useUserInfo()
const item = ref<Map<string, boolean>>(new Map)

const user = ref({
  username: userInfo.username,
  userType: userInfo.userType,
  email: userInfo.email,
  phone: userInfo.phone,
  personalProfile: userInfo.personalProfile,
  id: userInfo.id,
  avatar: userInfo.avatar,
})
const update = () => {
  userInfo.update(user.value)
}
const save = async (name: string) => {
  update()
  item.value.set(name, false)
}
const close = (name: string) => {
  item.value.set(name, false)
}
const rest = () => {
  user.value.email = userInfo.email
  user.value.userType = userInfo.userType
  user.value.id = userInfo.id
  user.value.username = userInfo.username
  user.value.avatar = userInfo.avatar
  user.value.personalProfile = userInfo.personalProfile
  user.value.phone = userInfo.phone
}
const edit = (name: string) => {
  rest()
  item.value.set(name, true)
}
const changeUpPic = () => {
  console.log(666);

  picVisible.value = picVisible.value ? false : true
}

</script>
<style scoped ></style>