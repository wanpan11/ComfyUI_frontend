<template>
  <BaseViewTemplate dark>
    <main
      class="relative min-w-96 rounded-lg bg-(--comfy-menu-bg) p-5 pb-10 px-10 shadow-lg mt-[-140px]"
    >
      <h2 class="my-2.5 mb-10 font-normal">录入账号</h2>

      <div class="flex w-full flex-col items-center gap-6">
        <div class="flex w-full flex-col gap-2">
          <label for="username-input">用户名:</label>
          <InputText v-model="username" placeholder="请输入用户名" />
        </div>

        <div class="flex w-full flex-col gap-2">
          <label for="password-input">密码:</label>
          <InputText v-model="password" placeholder="请输入密码" />
        </div>

        <div class="flex w-full flex-col gap-2">
          <label for="confirm-password-input">确认密码:</label>
          <InputText v-model="confirmPassword" placeholder="请再次输入密码" />
        </div>

        <footer class="mt-2 flex flex-col w-full gap-4">
          <Button class="h-10 text-white" type="button" @click="register">
            录入
          </Button>

          <Button severity="secondary" variant="text" @click="goToLogin">
            前往登录
          </Button>
        </footer>
      </div>

      <GlobalToast />
    </main>
  </BaseViewTemplate>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { useToast } from 'primevue/usetoast'
import { ref } from 'vue'

import GlobalToast from '@/components/toast/GlobalToast.vue'
import router from '@/router'
import { useUserStore } from '@/stores/userStore'
import BaseViewTemplate from '@/views/templates/BaseViewTemplate.vue'

const userStore = useUserStore()
const toast = useToast()

const username = ref('')
const password = ref('')
const confirmPassword = ref('')

const register = async () => {
  if (password.value !== confirmPassword.value) {
    toast.add({
      severity: 'error',
      summary: '注册失败',
      detail: '两次输入的密码不一致',
      life: 3000
    })
    return
  }

  try {
    const user = await userStore.createUser({
      username: username.value,
      password: password.value
    })

    username.value = ''
    password.value = ''
    confirmPassword.value = ''
    toast.add({
      severity: 'success',
      summary: '注册成功',
      detail: `${user.username} 已创建`,
      life: 3000
    })
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: '注册失败',
      detail: (err as Error).message,
      life: 3000
    })
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>
