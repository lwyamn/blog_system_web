<template>
  <div class="loginContainer">
    <div class="loginHeader"><span>个人博客系统</span></div>
    <div class="loginMainWrapper">
      <div class="loginWrapper">
        <div class="loginTipsWrapper" style="color: #ffffff;">
          <span class="siteSummaryTitle">个人博客</span>
        </div>
        <div class="loginBoxWrapper">
          <a-form class="form" @finish="login" :model="loginReq" size="small" :rules="loginRules">
            <a-form-item style="text-align: center;">
              <h2>欢迎登录</h2>
            </a-form-item>
            <a-form-item name="username" label="用户名" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
              <a-input v-model:value="loginReq.username" placeholder="请输入用户名">
              </a-input>
            </a-form-item>
            <a-form-item name="password" label="密码" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
              <a-input-password v-model:value="loginReq.password" placeholder="请输入密码"></a-input-password>
            </a-form-item>
            <a-form-item>
              <div class="rememberMeWrapper">
                <a-checkbox-group>
                  <a-checkbox v-model:checked="isAdmin" name="type" style="margin-left: 20px;" @change = "changeBox">管理员</a-checkbox>
                </a-checkbox-group>
                <a href="">忘记密码</a>
              </div>
            </a-form-item>
            <a-form-item>
              <a-space size="middle">
                <a-button type="primary" html-type="submit" danger ghost>登录</a-button>
                <a-button type="primary" ghost @click="open">注册</a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </div>
      </div>
    </div>
  </div>
  <a-modal v-model:visible="visible" title="注册用户">
    <template #footer>
      <a-button key="back" @click="close">关闭</a-button>
      <a-button key="submit" type="primary" @click="signUp">注册</a-button>
    </template>
    <div class="loginBoxWrapper">
      <a-form @finish="signUp" :model="signUpReq" :rules="signRules" :form="signForm">
        <a-form-item name="username" label="用户名" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
          <a-input v-model:value="signUpReq.username" placeholder="请输入用户名"></a-input>
        </a-form-item>
        <a-form-item name="password" label="密码" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
          <a-input-password v-model:value="signUpReq.password" placeholder="请输入密码"></a-input-password>
        </a-form-item>
        <a-form-item name="email" label="邮箱" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
          <a-input v-model:value="signUpReq.email" placeholder="请输入邮箱"></a-input>
        </a-form-item>
        <a-form-item name="phone" label="手机" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
          <a-input v-model:value="signUpReq.phone" placeholder="请输入手机号"></a-input>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>
<script lang="ts" setup>
import { reactive, ref } from "vue";
import { Form, message } from "ant-design-vue";
import { LoginReq, LoginResp, Result, SignUpReq } from "../model/frontModel";
import request from "../utils/request";
import {verifyUsername } from "../utils/verify";
import router, { token  } from "../router/router";
import { Rule, useForm } from "ant-design-vue/lib/form";
import { useUserInfo } from "@/store/userInfo";
const userInfo = useUserInfo();
const loginReq = reactive<LoginReq>({
  username: "林志杰",
  password: "lzj439949",
  type: "",
});
let signUpReq = reactive<SignUpReq>({
  username: "",
  password: "",
  email: "",
  phone: "",
});
const isAdmin = ref<boolean>(false);
const visible = ref<boolean>(false);
const open = () => {
  visible.value = true;
};
const close = () => {
  visible.value = false;
};
//校验
const signForm = Form.useForm;
const loginRules: Record<string, Rule[]> = {
  username: [{
    required: true,
    message: "用户名未填写"
  }],
  password: [{
    required: true,
    message: "密码未填写"
  }]
}
const signRules: Record<string, Rule[]> = {
  username: [{
    min:4,
    max:20,
    required: true,
    message: "用户名长度4-20个字符",
    trigger: 'blur'
  }],
  password: [{
    min:8,
    max:20,
    required: true,
    message: "密码长度8-20个字符",
    trigger: 'blur'
  }],
  email: [{
    required: true,
    message: "邮箱格式不符合规范",
    trigger: 'blur',
    pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
  }],
  phone: [{
    required: true,
    message: "手机号格式不符合规范",
    trigger: 'blur',
    pattern: /^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/
  }],
}
const { validate} = useForm(signUpReq, signRules);
const signUp = async () => {
  validate()
    .then(() =>
      request.post<Result<string>>(
        "/BLOG/open/signUp",
        signUpReq
      ).then(resp => {
        signUpReq.email = '';
        signUpReq.password = '';
        signUpReq.phone = '';
        signUpReq.username = '';
        close()
        return resp.data;
      })
    )
    .catch(error=>{
      message.error(error.errorFields[0].errors[0]);
    })
};
const login = async () => {
  loginReq.type = verifyUsername(loginReq.username);
  const resp = await request.post<Result<LoginResp>>(
    "/BLOG/open/login",
    loginReq
  );
  if (resp.data.code === 1) {
    token.value = resp.data.data.token;
    console.log(isAdmin.value);
    
    if (isAdmin.value) {
      await userInfo.get()
      console.log(userInfo.userType);
      
      if(userInfo.userType===1){
        console.log(777);
        
        router.push('/back')
        message.success("登录成功");
      }else{
        message.error("没有管理员权限")
      }
    } else {
      router.push('/main');
      message.success("登录成功");
    }
    
  } else {
    message.error(`${resp.data.msg}`);
  }
};
const changeBox = ()=>{
  isAdmin.value = isAdmin.value?false:true
  
}
</script>
<style>
.loginContainer {
  width: 100%;
  position: relative;
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(/src/assets/dark1.png);
  background-size: cover;
  padding-top: 105px;
  height: 100vh;
}
.loginHeader {
  width: 100%;
  height: 64px;
  background-color: #ffffff;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  padding: 10px;
}

.loginHeader span {
  font-size: 25px;
  font-weight: 700;
}

.loginMainWrapper {
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
}

.loginWrapper {
  width: 90%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: row;
  height: 100%;
}

.loginFooter {
  width: 100%;
  min-height: 64px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: row;
  text-align: center;
  color: #ffffff;
  margin-top: 40px;
}

.siteSummary ul {
  list-style: none;
  padding: 0;
}

.siteSummary ul li {
  margin-top: 10px;
  list-style: none;
}

@media screen and (min-width: 1200px) {
  .loginTipsWrapper {
    padding: 20px 30px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-direction: column;
    min-height: 100%;
  }

  .loginBoxWrapper {
    background-color: #ffffff;
    padding: 20px;
    width: 400px;
    height: 100%;
    border-radius: 5px;
  }
}

@media screen and (min-width: 769px) and (max-width: 1200px) {
  .loginTipsWrapper {
    padding: 20px 30px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-direction: column;
    height: 100%;
  }

  .loginBoxWrapper {
    background-color: #ffffff;
    padding: 20px;
    width: 400px;
    height: 100%;
    border-radius: 5px;
  }
}

@media screen and (max-width: 768px) {
  .loginTipsWrapper {
    display: none;
  }

  .loginBoxWrapper {
    background-color: #ffffff;
    padding: 20px;
    width: 100%;
    border-radius: 5px;
  }
}

.rememberMeWrapper {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
}

.siteSummaryTitle {
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 700;
}
</style>
  