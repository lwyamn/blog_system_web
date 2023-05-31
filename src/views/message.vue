<template>
    <a-layout>
        <a-layout-sider class="sider" theme="light">
            <div class="header">
                
            </div>
            <a-divider style="margin: 0px;"></a-divider>
            <chatList/>
        </a-layout-sider>
        <a-layout-content class="content">
            <chatPage />
        </a-layout-content>
    </a-layout>
</template>
<script setup lang="ts">
import chatList from '../components/chatList.vue';
import chatPage from '../components/chatPage.vue';
</script>
<style scoped>
.sider {
    min-height: 800px;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
}

.content {
    margin-left: 5px;
    background-color: #fff;
    border-radius: 0px 20px 20px 0px;
}

.header {
    height: 48px;
}
</style>
