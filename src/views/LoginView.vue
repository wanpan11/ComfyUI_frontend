<template>
  <BaseViewTemplate dark>
    <main
      class="relative min-w-96 rounded-lg bg-(--comfy-menu-bg) p-5 pb-10 px-10 shadow-lg mt-[-140px]"
    >
      <h2 class="my-2.5 mb-10 font-normal">登录您的账户</h2>

      <div class="flex w-full flex-col items-center gap-6">
        <div class="flex w-full flex-col gap-2">
          <label for="username-input">用户名:</label>
          <InputText
            v-model="username"
            placeholder="请输入用户名"
            @keyup.enter="login"
          />
        </div>

        <div class="flex w-full flex-col gap-2">
          <label for="password-input">密码:</label>
          <InputText
            v-model="password"
            type="password"
            placeholder="请输入密码"
            @keyup.enter="login"
          />
        </div>

        <footer class="mt-2 flex flex-col w-full">
          <Button class="h-10 text-white" type="button" @click="login">
            登录
          </Button>
        </footer>

        <GlobalToast />
      </div>
    </main>
  </BaseViewTemplate>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { useToast } from 'primevue/usetoast'
import { onMounted, ref } from 'vue'

import GlobalToast from '@/components/toast/GlobalToast.vue'
import router from '@/router'
import { useUserStore } from '@/stores/userStore'
import BaseViewTemplate from '@/views/templates/BaseViewTemplate.vue'

const userStore = useUserStore()
const toast = useToast()

const username = ref('')
const password = ref('')

const login = async () => {
  try {
    if (!username.value || !password.value) {
      toast.add({
        severity: 'error',
        summary: '登录失败',
        detail: '请输入用户名和密码',
        life: 3000
      })
      return
    }

    await userStore.login({
      username: username.value,
      password: password.value
    })

    await router.push('/')
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: '登录失败',
      detail: err instanceof Error ? err.message : JSON.stringify(err),
      life: 3000
    })
  }
}

onMounted(async () => {
  if (!userStore.initialized) {
    await userStore.initialize()
  }
})
</script>
