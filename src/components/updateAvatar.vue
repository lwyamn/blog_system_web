<template>
  <a-modal width="300px" :visible="picVisible" title="修改头像" @ok="updateAvatar()" @cancel="close()" cancelText="取消修改"
    okText="确认修改">
    <div style="display: flex;margin: 5px;">
      <uploadPic ref="avatar" text="上传头像" />
      <span>预览</span>
      <a-avatar :size="80" :src="avatar.getImage()" v-if="avatar?.getImage()"></a-avatar>
    </div>
  </a-modal>
</template>
<script setup lang="ts">
import { useRequest } from 'vue-request';
import uploadPic from './uploadPic.vue';
import { updateUser } from '../api/userAPi';
import { ref } from 'vue';
import { message } from 'ant-design-vue';
const props = defineProps<{ picVisible: boolean, userId: string }>()
const emit = defineEmits(['update:picVisible'])
const avatar = ref()
const { run: update } = useRequest(() => updateUser({
  id: props.userId,
  avatar: avatar.value.getImage()
}))
const updateAvatar = () => {
  if (avatar.value.getImage()) {
    update()
    emit('update:picVisible', false)
  } else {
    message.error("头像还未上传")
  }
}
const close = () => {
  emit('update:picVisible', false)
}
</script>