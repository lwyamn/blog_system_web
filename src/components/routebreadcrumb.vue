<template>
    <div style="margin: 0.5%;">
        <a-breadcrumb>
            <a-breadcrumb-item v-for="route in routes">{{ route.name }}</a-breadcrumb-item>
        </a-breadcrumb>
    </div>
</template>
<script setup lang="ts">
import { computed} from 'vue';
import router from '../router/router';
const routes = computed(()=>{
    return router.currentRoute.value.matched
})
</script>