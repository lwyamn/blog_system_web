<template>
    <a-select v-model:value="searchValue" show-search placeholder="搜索" class="selectBlog"
        :default-active-first-option="false" :show-arrow="false" :filter-option="false"
        :not-found-content="searching ? undefined : null" :options="searchs" @search="search" @select="select">
        <template v-if="searching" #notFoundContent>
            <a-spin size="small" />
        </template>
    </a-select>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useRequest } from 'vue-request';
import { searchAll } from '../api/commonAPi';
import { debounce, isEmpty } from 'lodash-es';
import { OptionProps } from 'ant-design-vue/lib/select';
import router from '../router/router';

const searchValue = ref('')
const searching = ref(false)
let queryId: number = 0;
const searchs = ref<Array<OptionProps>>([])
const { run: searchUser, } = useRequest<Array<OptionProps>>((id: number, value) => searchAll(value).then(resp => {
    if (id !== queryId) {
        return
    }
    const searchList = resp.data.data || [];
    console.log(searchList);
    let returnSearchs = searchList.map((searchInfo:any) => {
        return { value: searchInfo.id, label: searchInfo.name,type:searchInfo.type}
    }) || [];
    searchs.value = returnSearchs
    console.log(searchs.value);
    return returnSearchs
}).finally(() => {
    searching.value = false;
}), { manual: true })
const search = debounce((value) => {
    searchs.value = []
    if (isEmpty(value)) {
        return;
    }
    searching.value = true;
    queryId++;
    let id = queryId;
    searchUser(id, value);
}, 300)

const select = (value:string,option:any) => {
   switch(option.type){
    case 0:
        router.push({name:'个人首页',params:{userId:value}});
        break;
    case 1:
        router.push({name:'博客',params:{blogId:value}})
        break;
    default:
        break;
   }
   searchValue.value = '';
   searchs.value = []
}

const w = (s:any)=>{
    console.log(s);
    
}
</script>
<style scoped>
.selectBlog {
    width: 400px;
    text-align: left;
}
</style>
  
  