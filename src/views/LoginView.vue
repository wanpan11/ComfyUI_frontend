<template>
  <BaseViewTemplate dark>
    <main
      class="relative min-w-84 rounded-lg bg-(--comfy-menu-bg) p-5 px-10 shadow-lg"
    >
      <h1 class="my-2.5 mb-7 font-normal">账户登录</h1>
      <div class="flex w-full flex-col items-center">
        <div class="flex w-full flex-col gap-2">
          <label for="username-input">用户名:</label>
          <InputText
            v-model="username"
            placeholder="请输入用户名"
            @keyup.enter="login"
          />
        </div>

        <div class="flex w-full flex-col gap-2 mt-3">
          <label for="password-input">密码:</label>
          <InputText
            v-model="password"
            type="password"
            placeholder="请输入密码"
            @keyup.enter="login"
          />
        </div>

        <Message v-if="error" severity="error" class="mt-3">
          {{ error }}
        </Message>

        <footer class="mt-5">
          <Button label="登录" @click="login" />
        </footer>
      </div>
    </main>
  </BaseViewTemplate>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import { computed, onMounted, ref } from 'vue'

import router from '@/router'
import { useUserStore } from '@/stores/userStore'
import BaseViewTemplate from '@/views/templates/BaseViewTemplate.vue'

const userStore = useUserStore()

const username = ref('')
const password = ref('')
const loginError = ref('')
const error = computed(() => loginError.value)

const login = async () => {
  loginError.value = ''

  try {
    if (!username.value || !password.value) {
      loginError.value = '请输入用户名和密码'
      return
    }

    await userStore.login({
      username: username.value,
      password: password.value
    })

    await router.push('/')
  } catch (err) {
    loginError.value = err instanceof Error ? err.message : JSON.stringify(err)
  }
}

onMounted(async () => {
  if (!userStore.initialized) {
    await userStore.initialize()
  }
})
</script>
