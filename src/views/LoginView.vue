<template>
  <BaseViewTemplate dark>
    <main
      id="comfy-user-selection"
      class="relative min-w-84 rounded-lg bg-(--comfy-menu-bg) p-5 px-10 shadow-lg"
    >
      <h1 class="my-2.5 mb-7 font-normal">{{ t('auth.login.title') }}</h1>
      <div class="flex w-full flex-col items-center">
        <div class="flex w-full flex-col gap-2">
          <label for="username-input">{{ t('auth.login.emailLabel') }}:</label>
          <InputText
            id="username-input"
            v-model="username"
            :placeholder="t('auth.login.emailPlaceholder')"
            @keyup.enter="login"
          />
        </div>

        <div class="flex w-full flex-col gap-2 mt-3">
          <label for="password-input"
            >{{ t('auth.login.passwordLabel') }}:</label
          >
          <InputText
            id="password-input"
            v-model="password"
            type="password"
            :placeholder="t('auth.login.passwordPlaceholder')"
            @keyup.enter="login"
          />
        </div>

        <Message v-if="error" severity="error" class="mt-3">
          {{ error }}
        </Message>

        <footer class="mt-5">
          <Button :label="t('auth.login.loginButton')" @click="login" />
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
import { useI18n } from 'vue-i18n'

import { useUserStore } from '@/stores/userStore'
import BaseViewTemplate from '@/views/templates/BaseViewTemplate.vue'

const { t } = useI18n()
const userStore = useUserStore()

const username = ref('')
const password = ref('')
const loginError = ref('')
const error = computed(() => loginError.value)

// 指定的测试账号（可按需修改）
const ALLOWED_CREDENTIALS: Record<string, string> = {
  testuser: 'testpass'
}

const login = async () => {
  loginError.value = ''

  try {
    if (!username.value || !password.value) {
      loginError.value = '请输入用户名和密码'
      return
    }

    const expected = ALLOWED_CREDENTIALS[username.value]
    if (!expected || expected !== password.value) {
      loginError.value = '用户名或密码错误'
      return
    }

    // await userStore.login();
    // await router.push("/");
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
