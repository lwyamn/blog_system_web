import axios from 'axios'
import {token} from '../router/router'
import { message } from 'ant-design-vue'

const request = axios.create({
    //baseURL:import.meta.env.VITE_BACKEND_API_BASE_URL
    //baseURL:'http://121.36.104.226:8080'
    baseURL:'http://localhost:8080'
    //baseURL:'http://30.40.35.176:8080'
})
request.interceptors.request.use(
  (config)=>{ // 统一添加请求头
    if(token.value) {
      config.headers.setAuthorization(token.value)
    }    
    return config
  },
  (error)=>{ 
    return Promise.reject(error)
  }
)
request.interceptors.response.use(
  function (response:any) {
    if(response.status==200){
      if(response.data.msg){
        if(response.data.code==1){
          message.success(response.data.msg)
        }
        else message.error(response.data.msg)
      }
    }else{
      message.error(response.data.msg)
    }
    return response;
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
)


export default request