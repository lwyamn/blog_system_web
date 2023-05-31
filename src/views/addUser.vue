<template>
  <a-form class="addForm" :model="adduserResp" :labelCol="{ style: { width: '150px' } }" :wrapperCol="{ span: 14 }">
    <a-form-item style="text-align:center;">
      添加用户
    </a-form-item>
    <a-form-item name="username" label="用户名" :wrapperCol="{ span: 9 }" :labelCol="{ span: 2 }">
      <a-input v-model:value="adduserResp.username" />
    </a-form-item>
    <a-form-item name="password" label="密码" :wrapperCol="{ span: 9 }" :labelCol="{ span: 2 }">
      <a-input-password v-model:value="adduserResp.password" />
    </a-form-item>
    <a-form-item name="email" label="邮箱" :wrapperCol="{ span: 9 }" :labelCol="{ span: 2 }">
      <a-input v-model:value="adduserResp.email" />
    </a-form-item>
    <a-form-item name="phone" label="手机号" :wrapperCol="{ span: 9 }" :labelCol="{ span: 2 }">
      <a-input v-model:value="adduserResp.phone" />
    </a-form-item>
    <a-form-item name="userType" label="用户类型" :wrapperCol="{ span: 6 }" :labelCol="{ span: 2 }">
      <a-radio-group v-model:value="adduserResp.userType">
        <a-radio value="2">普通用户</a-radio>
        <a-radio value="1">管理员</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 12 }">
      <a-space size="middle">
        <a-button type="primary" @click="adduser()">创建用户</a-button>
        <a-button type="primary" @click="randomUser()">随机生成</a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>
<script setup lang="ts">
import { message } from 'ant-design-vue';
import { ref } from 'vue'
import { AddUserResp } from '../model/userModel'
import { Result } from '../model/frontModel';
import request from '../utils/request';
import { getRandomEmail, getRandomName, getRandomPassWord,getRandomPhone } from '@/utils/random';
const adduserResp = ref<AddUserResp>({
  username: '',
  userType: 1,
  password: '',
  email: '',
  phone: '',
});
const adduser = async () => {
  const resp = await request.post<Result<string>>('/BLOG/user/add', adduserResp.value)
}
const randomUser = () => {
  adduserResp.value.username = getRandomName();
  adduserResp.value.email = getRandomEmail();
  adduserResp.value.password = getRandomPassWord();
  adduserResp.value.phone = getRandomPhone();
}
</script>
<style>
.addForm {
  margin-left: 70px;
}
</style>