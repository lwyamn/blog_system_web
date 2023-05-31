<template>
  <a-form :wrapperCol="{ span: 6 }" :labelCol="{ span: 2 }">
    <a-form-item label="输入新密码">
      <a-input-password placeholder="输入新密码" v-model:value="password.newPassword">
      </a-input-password>
    </a-form-item>
    <a-form-item label="确认新密码">
      <a-input-password placeholder="确认新密码" v-model:value="password.confirmPassword">
      </a-input-password>
    </a-form-item>
    <a-form-item>
      <a-button type="primary" ghost @click="changePassword()">确认</a-button>
    </a-form-item>
  </a-form>
</template>
<script lang="ts" setup>
import { message } from 'ant-design-vue';
import { ref } from 'vue';
import { useRequest } from 'vue-request';
import { useResult } from '../model/frontModel';
import router from '../router/router';
import { useUserInfo } from '../store/userInfo';
import request from '../utils/request';
const userInfo = useUserInfo()
const password = ref({
  newPassword:null,
  confirmPassword:null,
})
const changePassword = async ()=>{
  if(password.value.newPassword===password.value.confirmPassword){
      updatePassword();
      message.success("修改密码成功,请重新登录");
      localStorage.removeItem("token")
      router.push('/login')

  }else{
    message.error("两次密码不相等")
  }
}
const {run:updatePassword} = useRequest<useResult<string>>(()=>
  request.post('/BLOG/user/update',{
    password:password.value.confirmPassword,
    id:userInfo.id
  }),
  {
    manual:true
  }
)
</script>