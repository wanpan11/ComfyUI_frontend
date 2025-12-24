import { defineStore } from 'pinia'
import { computed, ref, watchEffect } from 'vue'

import { api } from '@/scripts/api'
import { md5 } from '@/utils/md5'
// import type { User as UserConfig } from '@/schemas/apiSchema'

// export interface User {
interface User {
  userId: string
  username: string
}

interface UserLogin {
  username: string
  password: string
}

export const useUserStore = defineStore('user', () => {
  /**
   * The user config. null if not loaded.
   */
  // const userConfig = ref<UserConfig | null>(null)
  /**
   * The current user id. null if not logged in or in single user mode.
   */
  // const currentUserId = ref<string | null>(null)
  // const isMultiUserServer = computed(
  //   () => userConfig.value && 'users' in userConfig.value
  // )
  // const needsLogin = computed(
  //   () => !currentUserId.value && isMultiUserServer.value
  // )
  // const users = computed<User[]>(() =>
  //   Object.entries(userConfig.value?.users ?? {}).map(([userId, username]) => ({
  //     userId,
  //     username
  //   }))
  // )
  // const currentUser = computed<User | null>(
  //   () =>
  //     users.value.find((user) => user.userId === currentUserId.value) ?? null
  // )
  // const initialized = computed(() => userConfig.value !== null)

  // /**
  //  * Initialize the user store.
  //  */
  // async function initialize() {
  //   userConfig.value = await api.getUserConfig()
  //   currentUserId.value = localStorage['Comfy.userId']
  // }

  // /**
  //  * Create a new user.
  //  *
  //  * @param username - The username.
  //  * @returns The new user.
  //  */
  // async function createUser(username: string): Promise<User> {
  //   const resp = await api.createUser(username)
  //   const data = await resp.json()
  //   if (resp.status >= 300) {
  //     throw new Error(
  //       data.error ??
  //         'Error creating user: ' + resp.status + ' ' + resp.statusText
  //     )
  //   }
  //   return {
  //     userId: data,
  //     username
  //   }
  // }

  // /**
  //  * Login the current user.
  //  *
  //  * @param user - The user.
  //  */
  // async function login({
  //   userId,
  //   username
  // }: {
  //   userId: string
  //   username: string
  // }) {
  //   currentUserId.value = userId
  //   localStorage['Comfy.userId'] = userId
  //   localStorage['Comfy.userName'] = username
  // }

  // watchEffect(() => {
  //   if (isMultiUserServer.value && currentUserId.value) {
  //     api.user = currentUserId.value
  //   }
  // })

  // /**
  //  * Logout the current user.
  //  */
  // async function logout() {
  //   delete localStorage['Comfy.userId']
  //   delete localStorage['Comfy.userName']
  // }

  // 多用户服务
  const isMultiUserServer = true
  // 初始化
  const initialized = ref(false)
  /**
   * Whether to load the user's workflow upon next app initialization.
   * Set to true after a successful login.
   */
  const shouldLoadUserWorkflow = ref(false)

  const currentUserId = ref<string | null>(null)
  const currentUserName = ref<string | null>(null)

  const currentUser = computed<User | null>(
    () =>
      ({
        userId: currentUserId.value!,
        username: currentUserName.value!
      }) as User
  )
  const needsLogin = computed(() => !currentUserId.value && isMultiUserServer)

  async function initialize() {
    initialized.value = true
    currentUserId.value = localStorage['Comfy.userId']
  }

  async function createUser(user: UserLogin): Promise<User> {
    const addUser = { ...user, password: md5(user.password) }
    const resp = await api.createUser(addUser)
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
    const addUser = { ...user, password: md5(user.password) }
    const resp = await api.userLogin(addUser)
    const data = await resp.json()

    if (resp.status >= 300) {
      throw new Error(data.error)
    }

    currentUserId.value = data.userId
    currentUserName.value = user.username
    localStorage['Comfy.userId'] = data.userId
    localStorage['Comfy.userName'] = user.username
    api.user = data.userId
    shouldLoadUserWorkflow.value = true

    return {
      userId: data,
      username: user.username
    }
  }

  async function logout() {
    delete localStorage['Comfy.userId']
    delete localStorage['Comfy.userName']
    delete localStorage['workflow']

    // Clear in-memory user state
    currentUserId.value = null
    currentUserName.value = null
    api.user = ''
  }

  watchEffect(() => {
    if (isMultiUserServer && currentUserId.value) {
      api.user = currentUserId.value
      currentUserId.value = localStorage['Comfy.userId']
      currentUserName.value = localStorage['Comfy.userName']
      shouldLoadUserWorkflow.value = true
    }
  })

  return {
    // users,
    currentUser,
    isMultiUserServer,
    needsLogin,
    initialized,
    shouldLoadUserWorkflow,
    initialize,
    createUser,
    login,
    logout
  }
})
