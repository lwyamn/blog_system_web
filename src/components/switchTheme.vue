<template>
    <div>
    <a-switch class="switch" size="middle" :checked="state.theme === 'dark'" checked-children="黑夜"
      un-checked-children="白天" @change="changeTheme"></a-switch>
  </div>
</template>
<script setup lang="ts">
import { MenuTheme } from 'ant-design-vue';
import { ref } from 'vue';
const state = ref({
  theme: "dark" as MenuTheme,
});
const changeTheme = (checked: boolean) => {
  state.value.theme = checked ? "dark" : "light";
};
</script>