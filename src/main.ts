import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Antdv from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import router from './router/router'
import { createPinia } from 'pinia'
import '@wangeditor/editor/dist/css/style.css'
import { Boot } from '@wangeditor/editor'
import markdownModule from '@wangeditor/plugin-md'

Boot.registerModule(markdownModule)
createApp(App).use(Antdv).use (router).use(createPinia()).mount('#app')
