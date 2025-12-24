import { defineStore } from 'pinia'
import { computed, ref, watchEffect } from 'vue'

import { api } from '@/scripts/api'

interface User {
  userId: string
  username: string
}

interface UserLogin {
  username: string
  password: string
}

export const useUserStore = defineStore('user', () => {
  // 多用户服务
  const isMultiUserServer = true
  // 初始化
  const initialized = ref(false)

  const currentUserId = ref<string | null>(null)
  const currentUserName = ref<string | null>(null)
  const needsLogin = computed(() => !currentUserId.value && isMultiUserServer)

  async function initialize() {
    initialized.value = true
    currentUserId.value = localStorage['Comfy.userId']
  }

  async function createUser(user: UserLogin): Promise<User> {
    const resp = await api.createUser(user)
    const data = await resp.json()

    if (resp.status >= 300) {
      throw new Error(
        data.error ??
          'Error creating user: ' + resp.status + ' ' + resp.statusText
      )
    }

    return {
      userId: data,
      username: user.username
    }
  }

  async function login(user: UserLogin): Promise<User> {
    const resp = await api.userLogin(user)
    const data = await resp.json()

    if (resp.status >= 300) {
      throw new Error(data.error)
    }

    currentUserId.value = data.userId
    currentUserName.value = user.username
    localStorage['Comfy.userId'] = data.userId
    localStorage['Comfy.userName'] = user.username
    api.user = data.userId

    return {
      userId: data,
      username: user.username
    }
  }

  async function logout() {
    delete localStorage['Comfy.userId']
    delete localStorage['Comfy.userName']
  }

  watchEffect(() => {
    if (isMultiUserServer && currentUserId.value) {
      api.user = currentUserId.value
    }
  })

  return {
    isMultiUserServer,
    needsLogin,
    initialized,
    currentUserId,
    currentUserName,
    initialize,
    createUser,
    login,
    logout
  }
})
