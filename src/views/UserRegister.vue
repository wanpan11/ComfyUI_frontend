<template>
  <BaseViewTemplate dark>
    <main
      id="comfy-user-selection"
      class="relative min-w-84 rounded-lg bg-(--comfy-menu-bg) p-5 px-10 shadow-lg"
    >
      <h1 class="my-2.5 mb-7 font-normal">注册用户</h1>

      <div class="flex w-full flex-col items-center">
        <div class="flex w-full flex-col gap-2">
          <label for="username-input">用户名:</label>
          <InputText v-model="username" />
        </div>

        <div class="flex w-full flex-col gap-2 mt-3">
          <label for="password-input"
            >{{ t('auth.login.passwordLabel') }}:</label
          >
          <InputText v-model="password" />
        </div>

        <footer class="mt-5">
          <Button :label="t('auth.login.loginButton')" @click="register" />
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
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import GlobalToast from '@/components/toast/GlobalToast.vue'
import { useUserStore } from '@/stores/userStore'
import BaseViewTemplate from '@/views/templates/BaseViewTemplate.vue'

const { t } = useI18n()
const userStore = useUserStore()
const toast = useToast()

const username = ref('')
const password = ref('')

const register = async () => {
  try {
    const user = await userStore.createUser({
      username: username.value,
      password: password.value
    })

    username.value = ''
    password.value = ''
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

onMounted(async () => {
  if (!userStore.initialized) {
    await userStore.initialize()
  }
})
</script>
